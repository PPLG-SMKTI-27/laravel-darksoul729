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

        return response()->json($this->buildStatePayload($chatUser), 201);
    }

    public function state(string $deviceId): JsonResponse
    {
        $chatUser = ChatUser::query()->where('device_id', $deviceId)->first();

        if (! $chatUser) {
            return response()->json([
                'message' => 'Chat user not found.',
            ], 404);
        }

        return response()->json($this->buildStatePayload($chatUser));
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

        return response()->json($this->buildStatePayload($owner));
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

        ChatMessage::query()->create([
            'sender_chat_user_id' => $sender->id,
            'recipient_chat_user_id' => $recipient->id,
            'body' => $request->string('body')->toString(),
        ]);

        return response()->json($this->buildStatePayload($sender));
    }

    protected function buildStatePayload(ChatUser $chatUser): array
    {
        $chatUser->load([
            'contacts.contact',
        ]);

        $contactIds = $chatUser->contacts
            ->pluck('contact_chat_user_id')
            ->all();

        $messages = ChatMessage::query()
            ->where(function ($query) use ($chatUser, $contactIds) {
                $query->where('sender_chat_user_id', $chatUser->id)
                    ->whereIn('recipient_chat_user_id', $contactIds);
            })
            ->orWhere(function ($query) use ($chatUser, $contactIds) {
                $query->where('recipient_chat_user_id', $chatUser->id)
                    ->whereIn('sender_chat_user_id', $contactIds);
            })
            ->orderBy('created_at')
            ->get();

        $threads = [];

        foreach ($messages as $message) {
            $contactId = $message->sender_chat_user_id === $chatUser->id
                ? $message->recipient_chat_user_id
                : $message->sender_chat_user_id;

            $threads[$contactId][] = [
                'id' => $message->id,
                'from' => $message->sender_chat_user_id === $chatUser->id ? 'me' : 'them',
                'text' => $message->body,
                'time' => $message->created_at->format('H:i'),
            ];
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
                ])
                ->values()
                ->all(),
            'threads' => $threads,
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
