<?php

namespace App\Http\Controllers;

use App\Http\Requests\JoinSkillsRoomRequest;
use App\Http\Requests\StoreSkillsRoomRequest;
use App\Http\Requests\SyncSkillsRoomPlayerRequest;
use App\Models\SkillsRoom;
use App\Models\SkillsRoomPlayer;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class SkillsRoomController extends Controller
{
    public function store(StoreSkillsRoomRequest $request): JsonResponse
    {
        $this->pruneInactivePlayers();

        $room = SkillsRoom::create([
            'code' => $this->generateUniqueRoomCode(),
            'last_activity_at' => now(),
        ]);

        return response()->json([
            'code' => $room->code,
            'message' => 'Room berhasil dibuat.',
        ], 201);
    }

    public function join(JoinSkillsRoomRequest $request): JsonResponse
    {
        $this->pruneInactivePlayers();

        $room = SkillsRoom::query()
            ->where('code', $request->string('code')->value())
            ->first();

        if (! $room) {
            return response()->json([
                'message' => 'Room tidak ditemukan.',
            ], 404);
        }

        $player = $room->players()->create([
            'player_uuid' => (string) Str::uuid(),
            'display_name' => $request->string('role')->lower()->value() === 'host'
                ? 'Host'
                : 'Crew '.Str::upper(Str::random(3)),
            'role' => $request->string('role')->lower()->value(),
            'state' => [
                'x' => 0,
                'y' => 0.15,
                'z' => 0,
                'heading' => 0,
            ],
            'last_seen_at' => now(),
        ]);

        $room->forceFill([
            'last_activity_at' => now(),
        ])->save();

        return response()->json([
            'player_uuid' => $player->player_uuid,
            'room' => [
                'code' => $room->code,
            ],
            'players' => $this->transformPlayers(
                $room->players()
                    ->where('last_seen_at', '>=', now()->subSeconds(8))
                    ->whereKeyNot($player->getKey())
                    ->get()
            ),
            'player_count' => $room->players()
                ->where('last_seen_at', '>=', now()->subSeconds(8))
                ->count(),
        ]);
    }

    public function sync(SyncSkillsRoomPlayerRequest $request): JsonResponse
    {
        $this->pruneInactivePlayers();

        $room = SkillsRoom::query()
            ->where('code', $request->string('code')->value())
            ->first();

        if (! $room) {
            return response()->json([
                'message' => 'Room tidak ditemukan.',
            ], 404);
        }

        $player = $room->players()
            ->where('player_uuid', $request->string('player_uuid')->value())
            ->first();

        if (! $player) {
            return response()->json([
                'message' => 'Player tidak ditemukan di room ini.',
            ], 404);
        }

        $player->forceFill([
            'state' => $request->validated('state'),
            'last_seen_at' => now(),
        ])->save();

        $room->forceFill([
            'last_activity_at' => now(),
        ])->save();

        $activePlayers = $room->players()
            ->where('last_seen_at', '>=', now()->subSeconds(8))
            ->get();

        return response()->json([
            'players' => $this->transformPlayers(
                $activePlayers->reject(fn (SkillsRoomPlayer $activePlayer): bool => $activePlayer->player_uuid === $player->player_uuid)
            ),
            'player_count' => $activePlayers->count(),
        ]);
    }

    protected function pruneInactivePlayers(): void
    {
        SkillsRoomPlayer::query()
            ->where('last_seen_at', '<', now()->subSeconds(12))
            ->delete();

        SkillsRoom::query()
            ->doesntHave('players')
            ->delete();
    }

    protected function transformPlayers(Collection $players): array
    {
        return $players
            ->map(function (SkillsRoomPlayer $player): array {
                return [
                    'player_uuid' => $player->player_uuid,
                    'display_name' => $player->display_name,
                    'role' => $player->role,
                    'state' => $player->state ?? [
                        'x' => 0,
                        'y' => 0.15,
                        'z' => 0,
                        'heading' => 0,
                    ],
                ];
            })
            ->values()
            ->all();
    }

    protected function generateUniqueRoomCode(): string
    {
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

        do {
            $code = '';

            for ($index = 0; $index < 6; $index++) {
                $code .= $chars[random_int(0, strlen($chars) - 1)];
            }
        } while (SkillsRoom::query()->where('code', $code)->exists());

        return $code;
    }
}
