<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        User::updateOrCreate(
            ['email' => 'admin@panzekk.com'],
            [
                'name' => 'Admin',
                'email_verified_at' => now(),
                'role' => 'admin',
                'age' => 25,
                'password' => Hash::make('password'),
                'remember_token' => \Illuminate\Support\Str::random(10),
            ]
        );

        // Create Teacher User
        User::updateOrCreate(
            ['email' => 'guru@sekolah.id'],
            [
                'name' => 'Guru Teladan',
                'email_verified_at' => now(),
                'role' => 'teacher',
                'age' => 30,
                'password' => Hash::make('password'),
                'remember_token' => \Illuminate\Support\Str::random(10),
            ]
        );

        // Create additional users
        User::factory()->count(5)->create();

        // Create teacher users
        User::factory()->count(2)->teacher()->create();

        // Create Projects
        Project::factory()->count(10)->create();

        // Create Messages
        Message::factory()->count(10)->create();
    }
}
