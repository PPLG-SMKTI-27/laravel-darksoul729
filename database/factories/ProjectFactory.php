<?php

namespace Database\Factories;

use Faker\Factory as FakerFactory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $faker = FakerFactory::create();

        return [
            'title' => $faker->sentence(3),
            'description' => $faker->paragraph(),
            'image' => $faker->imageUrl(640, 480, 'business', true),
            'link' => $faker->url(),
            'status' => $faker->randomElement(['draft', 'published']),
        ];
    }
}
