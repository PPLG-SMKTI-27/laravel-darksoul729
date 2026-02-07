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
        if (! class_exists(\Faker\Factory::class)) {
            $user = new User;
            $user->name = 'Admin';
            $user->email = 'admin@panzekk.com';
            $user->password = Hash::make('password');
            $user->email_verified_at = now();
            $user->save();

            return;
        }

        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@panzekk.com',
            'password' => Hash::make('password'),
        ]);

        Project::factory(10)->create();
        Message::factory(10)->create();
    }
}
