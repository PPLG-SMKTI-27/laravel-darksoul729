<?php

namespace Database\Factories;

use App\Models\SkillsRoom;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SkillsRoomPlayer>
 */
class SkillsRoomPlayerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'skills_room_id' => SkillsRoom::factory(),
            'player_uuid' => (string) Str::uuid(),
            'display_name' => 'Crew '.$this->faker->lexify('???'),
            'role' => 'guest',
            'state' => [
                'x' => 0,
                'y' => 0.15,
                'z' => 0,
                'heading' => 0,
            ],
            'last_seen_at' => now(),
        ];
    }
}
