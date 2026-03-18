<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactSubmissionTest extends TestCase
{
    use RefreshDatabase;

    public function test_contact_message_can_be_submitted(): void
    {
        $response = $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.11'])->postJson('/contact', [
            'name' => 'Kevin',
            'email' => 'kevin@example.com',
            'message' => 'Halo, saya ingin diskusi project landing page interaktif.',
            'company' => '',
            'form_started_at' => now()->subSeconds(5)->timestamp,
        ]);

        $response
            ->assertCreated()
            ->assertJson([
                'status' => 'success',
            ]);

        $this->assertDatabaseHas('messages', [
            'name' => 'Kevin',
            'email' => 'kevin@example.com',
        ]);
    }

    public function test_contact_message_requires_valid_input(): void
    {
        $response = $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.12'])->postJson('/contact', [
            'name' => '',
            'email' => 'bukan-email',
            'message' => 'pendek',
            'company' => '',
            'form_started_at' => now()->subSeconds(5)->timestamp,
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'name',
                'email',
                'message',
            ]);
    }

    public function test_contact_message_rejects_fast_bot_submission(): void
    {
        $response = $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.13'])->postJson('/contact', [
            'name' => 'Kevin',
            'email' => 'kevin@example.com',
            'message' => 'Halo, ini payload bot yang terlalu cepat terkirim.',
            'company' => '',
            'form_started_at' => now()->timestamp,
        ]);

        $response
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                'form',
            ]);
    }

    public function test_contact_message_is_rate_limited_after_three_attempts(): void
    {
        $payload = [
            'name' => 'Kevin',
            'email' => 'kevin@example.com',
            'message' => 'Halo, saya ingin mengirim inquiry yang valid untuk dites.',
            'company' => '',
            'form_started_at' => now()->subSeconds(6)->timestamp,
        ];

        foreach (range(1, 3) as $attempt) {
            $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.14'])
                ->postJson('/contact', $payload)
                ->assertCreated();
        }

        $response = $this->withServerVariables(['REMOTE_ADDR' => '10.0.0.14'])
            ->postJson('/contact', $payload);

        $response
            ->assertStatus(429)
            ->assertJson([
                'status' => 'error',
            ]);
    }
}
