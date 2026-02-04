<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Project;
use App\Models\Message;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@panzekk.com',
            'password' => 'password',
        ]);

        Project::factory(10)->create();
        Message::factory(10)->create();
    }
}
