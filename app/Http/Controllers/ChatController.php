<?php

namespace App\Http\Controllers;

use App\Http\Requests\RegisterChatUserRequest;
use App\Http\Requests\SearchChatUserRequest;
use App\Http\Requests\StoreChatContactRequest;
use App\Http\Requests\StoreChatMessageRequest;
use App\Models\ChatContact;
use App\Models\ChatMessage;
use App\Models\ChatUser;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ChatController extends Controller
{
    public function register(RegisterChatUserRequest $request): JsonResponse
    {
        $chatUser = ChatUser::query()->firstOrNew([
            'device_id' => $request->string('device_id')->toString(),
        ]);

        if (! $chatUser->exists) {
            $chatUser->code = $this->generateUniqueCode();
        }

        $chatUser->name = $request->string('name')->toString();
        $chatUser->save();

        return response()->json($this->buildContactsPayload($chatUser), 201);
    }

    public function state(string $deviceId): JsonResponse
    {
        $chatUser = ChatUser::query()->where('device_id', $deviceId)->first();

        if (! $chatUser) {
            return response()->json([
                'message' => 'Chat user not found.',
            ], 404);
        }

        return response()->json($this->buildContactsPayload($chatUser));
    }

    public function thread(Request $request, string $deviceId, int $contactId): JsonResponse
    {
        $chatUser = ChatUser::query()->where('device_id', $deviceId)->first();

        if (! $chatUser) {
            return response()->json([
                'message' => 'Chat user not found.',
            ], 404);
        }

        if (! $chatUser->contacts()->where('contact_chat_user_id', $contactId)->exists()) {
            return response()->json([
                'message' => 'Contact not found.',
            ], 404);
        }

        return response()->json(
            $this->buildThreadPayload($chatUser, $contactId, max(0, $request->integer('after_id')))
        );
    }

    public function search(SearchChatUserRequest $request): JsonResponse
    {
        $owner = $this->resolveChatUser($request->string('device_id')->toString());
        $contact = ChatUser::query()
            ->where('code', $request->string('code')->toString())
            ->first();

        if (! $owner || ! $contact || $owner->is($contact)) {
            return response()->json([
                'message' => 'Chat user not found.',
            ], 404);
        }

        return response()->json([
            'contact' => [
                'name' => $contact->name,
                'code' => $contact->code,
                'already_added' => ChatContact::query()
                    ->where('owner_chat_user_id', $owner->id)
                    ->where('contact_chat_user_id', $contact->id)
                    ->exists(),
            ],
        ]);
    }

    public function storeContact(StoreChatContactRequest $request): JsonResponse
    {
        $owner = $this->resolveChatUser($request->string('device_id')->toString());
        $contact = ChatUser::query()
            ->where('code', $request->string('contact_code')->toString())
            ->first();

        if (! $owner || ! $contact || $owner->is($contact)) {
            return response()->json([
                'message' => 'Code teman tidak ditemukan.',
            ], 404);
        }

        ChatContact::query()->firstOrCreate([
            'owner_chat_user_id' => $owner->id,
            'contact_chat_user_id' => $contact->id,
        ]);

        ChatContact::query()->firstOrCreate([
            'owner_chat_user_id' => $contact->id,
            'contact_chat_user_id' => $owner->id,
        ]);

        return response()->json($this->buildContactsPayload($owner));
    }

    public function storeMessage(StoreChatMessageRequest $request): JsonResponse
    {
        $sender = $this->resolveChatUser($request->string('device_id')->toString());
        $recipient = ChatUser::query()
            ->where('code', $request->string('recipient_code')->toString())
            ->first();

        if (! $sender || ! $recipient || $sender->is($recipient)) {
            return response()->json([
                'message' => 'Penerima tidak ditemukan.',
            ], 404);
        }

        ChatContact::query()->firstOrCreate([
            'owner_chat_user_id' => $sender->id,
            'contact_chat_user_id' => $recipient->id,
        ]);

        ChatContact::query()->firstOrCreate([
            'owner_chat_user_id' => $recipient->id,
            'contact_chat_user_id' => $sender->id,
        ]);

        $message = ChatMessage::query()->create([
            'sender_chat_user_id' => $sender->id,
            'recipient_chat_user_id' => $recipient->id,
            'body' => $request->string('body')->toString(),
        ]);

        $contactsPayload = $this->buildContactsPayload($sender);

        return response()->json([
            'message' => $this->transformMessage($message, $sender->id),
            'contacts' => $contactsPayload['contacts'],
        ]);
    }

    protected function buildContactsPayload(ChatUser $chatUser): array
    {
        $chatUser->load([
            'contacts.contact',
        ]);

        $contactIds = $chatUser->contacts
            ->pluck('contact_chat_user_id')
            ->all();

        $latestMessages = [];

        if ($contactIds !== []) {
            $messages = ChatMessage::query()
                ->where(function ($query) use ($chatUser, $contactIds) {
                    $query->where('sender_chat_user_id', $chatUser->id)
                        ->whereIn('recipient_chat_user_id', $contactIds);
                })
                ->orWhere(function ($query) use ($chatUser, $contactIds) {
                    $query->where('recipient_chat_user_id', $chatUser->id)
                        ->whereIn('sender_chat_user_id', $contactIds);
                })
                ->orderByDesc('id')
                ->get();

            foreach ($messages as $message) {
                $contactId = $message->sender_chat_user_id === $chatUser->id
                    ? $message->recipient_chat_user_id
                    : $message->sender_chat_user_id;

                if (! array_key_exists($contactId, $latestMessages)) {
                    $latestMessages[$contactId] = $message;
                }
            }
        }

        return [
            'profile' => [
                'name' => $chatUser->name,
                'code' => $chatUser->code,
                'device_id' => $chatUser->device_id,
            ],
            'contacts' => $chatUser->contacts
                ->map(fn (ChatContact $contact) => [
                    'id' => $contact->contact->id,
                    'name' => $contact->contact->name,
                    'code' => $contact->contact->code,
                    'last_message' => isset($latestMessages[$contact->contact->id])
                        ? [
                            'text' => $latestMessages[$contact->contact->id]->body,
                            'time' => $latestMessages[$contact->contact->id]->created_at->format('H:i'),
                        ]
                        : null,
                ])
                ->values()
                ->all(),
        ];
    }

    protected function buildThreadPayload(ChatUser $chatUser, int $contactId, int $afterId = 0): array
    {
        $messages = ChatMessage::query()
            ->where(function ($query) use ($chatUser, $contactId) {
                $query->where('sender_chat_user_id', $chatUser->id)
                    ->where('recipient_chat_user_id', $contactId);
            })
            ->orWhere(function ($query) use ($chatUser, $contactId) {
                $query->where('recipient_chat_user_id', $chatUser->id)
                    ->where('sender_chat_user_id', $contactId);
            })
            ->when($afterId > 0, fn ($query) => $query->where('id', '>', $afterId))
            ->orderBy('id')
            ->get();

        return [
            'contact_id' => $contactId,
            'messages' => $messages
                ->map(fn (ChatMessage $message) => $this->transformMessage($message, $chatUser->id))
                ->values()
                ->all(),
        ];
    }

    protected function transformMessage(ChatMessage $message, int $ownerId): array
    {
        return [
            'id' => $message->id,
            'from' => $message->sender_chat_user_id === $ownerId ? 'me' : 'them',
            'text' => $message->body,
            'time' => $message->created_at->format('H:i'),
        ];
    }

    protected function generateUniqueCode(): string
    {
        do {
            $code = 'PZ-'.random_int(100000, 999999);
        } while (ChatUser::query()->where('code', $code)->exists());

        return $code;
    }

    protected function resolveChatUser(string $deviceId): ?ChatUser
    {
        return ChatUser::query()
            ->where('device_id', $deviceId)
            ->first();
    }
}
