<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SkillsRoomTest extends TestCase
{
    use RefreshDatabase;

    public function test_skills_page_can_be_rendered(): void
    {
        $this->get('/skills')
            ->assertOk();
    }

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
            'display_name' => 'Kapten Biru',
            'role' => 'host',
        ]);

        $guestResponse = $this->postJson('/skills/rooms/join', [
            'code' => $roomCode,
            'display_name' => 'Pelaut Emas',
            'role' => 'guest',
        ]);

        $hostPlayerUuid = $hostResponse->json('player_uuid');
        $guestPlayerUuid = $guestResponse->json('player_uuid');

        $this->postJson('/skills/rooms/sync', [
            'code' => $roomCode,
            'player_uuid' => $hostPlayerUuid,
            'state' => [
                'mode' => 'land',
                'x' => 12.5,
                'y' => 1.4,
                'z' => -8.3,
                'heading' => 1.2,
                'boat' => [
                    'x' => 8,
                    'y' => 0.65,
                    'z' => 88,
                    'heading' => 1.2,
                ],
                'land' => [
                    'x' => 12.5,
                    'y' => 1.4,
                    'z' => -8.3,
                    'heading' => 1.2,
                ],
            ],
        ])->assertOk();

        $syncResponse = $this->postJson('/skills/rooms/sync', [
            'code' => $roomCode,
            'player_uuid' => $guestPlayerUuid,
            'state' => [
                'mode' => 'boat',
                'x' => -2.2,
                'y' => 1.1,
                'z' => 5.9,
                'heading' => 0.8,
                'boat' => [
                    'x' => -2.2,
                    'y' => 1.1,
                    'z' => 5.9,
                    'heading' => 0.8,
                ],
                'land' => [
                    'x' => 3.2,
                    'y' => 0.7,
                    'z' => 60.2,
                    'heading' => 0.8,
                ],
            ],
        ]);

        $syncResponse
            ->assertOk()
            ->assertJsonPath('player_count', 2)
            ->assertJsonPath('players.0.player_uuid', $hostPlayerUuid)
            ->assertJsonPath('players.0.display_name', 'Kapten Biru')
            ->assertJsonPath('players.0.state.mode', 'land')
            ->assertJsonPath('players.0.state.land.x', 12.5)
            ->assertJsonPath('players.0.state.boat.z', 88);
    }

    public function test_player_name_is_required_when_joining_a_room(): void
    {
        $roomCode = $this->postJson('/skills/rooms')->json('code');

        $this->postJson('/skills/rooms/join', [
            'code' => $roomCode,
            'display_name' => '',
            'role' => 'host',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['display_name']);
    }
}
