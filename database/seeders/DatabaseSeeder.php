<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

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
                'remember_token' => Str::random(10),
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
                'remember_token' => Str::random(10),
            ]
        );

        // Create additional users without factories so seeding works in no-dev environments.
        foreach (range(1, 5) as $index) {
            User::updateOrCreate(
                ['email' => "user{$index}@example.com"],
                [
                    'name' => "User {$index}",
                    'email_verified_at' => now(),
                    'role' => 'user',
                    'age' => 18 + $index,
                    'password' => Hash::make('password'),
                    'remember_token' => Str::random(10),
                ]
            );
        }

        foreach (range(1, 2) as $index) {
            User::updateOrCreate(
                ['email' => "teacher{$index}@example.com"],
                [
                    'name' => "Teacher {$index}",
                    'email_verified_at' => now(),
                    'role' => 'teacher',
                    'age' => 28 + $index,
                    'password' => Hash::make('password'),
                    'remember_token' => Str::random(10),
                ]
            );
        }

        $projects = [
            [
                'title' => 'Portfolio Website',
                'description' => 'Responsive portfolio website built with Laravel and React.',
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
                'link' => 'https://example.com/portfolio',
                'status' => 'published',
            ],
            [
                'title' => 'School Information System',
                'description' => 'Web application for managing school data, schedules, and announcements.',
                'image' => 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
                'link' => 'https://example.com/school-system',
                'status' => 'published',
            ],
            [
                'title' => 'Inventory Dashboard',
                'description' => 'Dashboard for tracking stock, purchases, and warehouse reports.',
                'image' => 'https://images.unsplash.com/photo-1556740749-887f6717d7e4',
                'link' => 'https://example.com/inventory',
                'status' => 'draft',
            ],
            [
                'title' => 'Contact Management App',
                'description' => 'Simple CRM for managing customer contacts and message history.',
                'image' => 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d',
                'link' => 'https://example.com/crm',
                'status' => 'published',
            ],
            [
                'title' => 'Learning Platform',
                'description' => 'Platform for distributing modules, assignments, and quiz results.',
                'image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085',
                'link' => 'https://example.com/learning',
                'status' => 'draft',
            ],
        ];

        foreach ($projects as $project) {
            Project::updateOrCreate(
                ['title' => $project['title']],
                $project
            );
        }

        $messages = [
            [
                'email' => 'aldi@example.com',
                'name' => 'Aldi Ramadhan',
                'message' => 'Halo, saya tertarik bekerja sama untuk pembuatan website sekolah.',
                'is_read' => false,
            ],
            [
                'email' => 'salsa@example.com',
                'name' => 'Salsa Putri',
                'message' => 'Boleh minta info lebih lanjut soal jasa desain UI/UX?',
                'is_read' => true,
            ],
            [
                'email' => 'bima@example.com',
                'name' => 'Bima Saputra',
                'message' => 'Saya ingin konsultasi project dashboard admin untuk usaha saya.',
                'is_read' => false,
            ],
        ];

        foreach ($messages as $message) {
            Message::updateOrCreate(
                ['email' => $message['email'], 'message' => $message['message']],
                $message
            );
        }
    }
}
