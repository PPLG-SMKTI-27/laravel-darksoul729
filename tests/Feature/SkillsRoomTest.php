<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SkillsRoomTest extends TestCase
{
    use RefreshDatabase;

    public function test_room_can_be_created(): void
    {
        $response = $this->postJson('/skills/rooms');

        $response
            ->assertCreated()
            ->assertJsonStructure(['code', 'message']);
    }

    public function test_players_can_join_same_room_and_sync_positions(): void
    {
        $createResponse = $this->postJson('/skills/rooms');
        $roomCode = $createResponse->json('code');

        $hostResponse = $this->postJson('/skills/rooms/join', [
            'code' => $roomCode,
            'role' => 'host',
        ]);

        $guestResponse = $this->postJson('/skills/rooms/join', [
            'code' => $roomCode,
            'role' => 'guest',
        ]);

        $hostPlayerUuid = $hostResponse->json('player_uuid');
        $guestPlayerUuid = $guestResponse->json('player_uuid');

        $this->postJson('/skills/rooms/sync', [
            'code' => $roomCode,
            'player_uuid' => $hostPlayerUuid,
            'state' => [
                'x' => 12.5,
                'y' => 1.4,
                'z' => -8.3,
                'heading' => 1.2,
            ],
        ])->assertOk();

        $syncResponse = $this->postJson('/skills/rooms/sync', [
            'code' => $roomCode,
            'player_uuid' => $guestPlayerUuid,
            'state' => [
                'x' => -2.2,
                'y' => 1.1,
                'z' => 5.9,
                'heading' => 0.8,
            ],
        ]);

        $syncResponse
            ->assertOk()
            ->assertJsonPath('player_count', 2)
            ->assertJsonPath('players.0.player_uuid', $hostPlayerUuid)
            ->assertJsonPath('players.0.state.x', 12.5);
    }
}
