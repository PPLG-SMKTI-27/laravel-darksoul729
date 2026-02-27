<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TeacherSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'guru@sekolah.id'],
            [
                'name' => 'Guru Teladan',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'age' => 30, // Set age to 30
                'remember_token' => Str::random(10),
            ]
        );
    }
}
