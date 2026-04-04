<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ChatMessagingTest extends TestCase
{
    use RefreshDatabase;

    public function test_chat_user_can_register_search_add_contact_and_send_message(): void
    {
        $ownerResponse = $this->postJson('/chat/register', [
            'device_id' => 'device-owner-123456',
            'name' => 'Kevin',
        ]);

        $ownerResponse->assertCreated();
        $ownerCode = $ownerResponse->json('profile.code');

        $friendResponse = $this->postJson('/chat/register', [
            'device_id' => 'device-friend-654321',
            'name' => 'Aira',
        ]);

        $friendResponse->assertCreated();
        $friendCode = $friendResponse->json('profile.code');

        $this->assertNotSame($ownerCode, $friendCode);

        $this->getJson('/chat/users/search?device_id=device-owner-123456&code='.$friendCode)
            ->assertOk()
            ->assertJsonPath('contact.name', 'Aira')
            ->assertJsonPath('contact.already_added', false);

        $this->postJson('/chat/contacts', [
            'device_id' => 'device-owner-123456',
            'contact_code' => $friendCode,
        ])
            ->assertOk()
            ->assertJsonPath('contacts.0.name', 'Aira');

        $this->postJson('/chat/messages', [
            'device_id' => 'device-owner-123456',
            'recipient_code' => $friendCode,
            'body' => 'Halo dari owner.',
        ])
            ->assertOk()
            ->assertJsonFragment([
                'text' => 'Halo dari owner.',
                'from' => 'me',
            ]);

        $friendState = $this->getJson('/chat/state/device-friend-654321');

        $friendState->assertOk()
            ->assertJsonFragment([
                'name' => 'Kevin',
                'code' => $ownerCode,
            ])
            ->assertJsonFragment([
                'text' => 'Halo dari owner.',
                'from' => 'them',
            ]);

        $this->assertDatabaseCount('chat_users', 2);
        $this->assertDatabaseHas('chat_users', [
            'name' => 'Kevin',
            'device_id' => 'device-owner-123456',
        ]);
        $this->assertDatabaseHas('chat_messages', [
            'body' => 'Halo dari owner.',
        ]);
    }
}
