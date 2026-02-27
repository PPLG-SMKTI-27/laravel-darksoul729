<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Setting::create([
            'hero_title_1' => 'KEVIN',
            'hero_title_2' => 'HERMANSYAH',
            'hero_subtitle' => 'Full-stack developer crafting exceptional digital experiences.',
            'about_text' => "Available for freelance projects and full-time opportunities. Let's create something extraordinary together!",
            'contact_email' => 'hello@example.com',
            'github_url' => 'https://github.com/yourusername',
            'linkedin_url' => 'https://linkedin.com/in/yourusername',
            'instagram_url' => 'https://instagram.com/yourusername',
        ]);
    }
}
