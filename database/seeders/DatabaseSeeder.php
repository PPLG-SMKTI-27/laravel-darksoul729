<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use App\Models\Message;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Admin user
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@panzekk.com',
            'password' => Hash::make('password'), // ✅ harus hash
        ]);

        // Sample data
        Project::factory(10)->create();
        Message::factory(10)->create();
    }
}
