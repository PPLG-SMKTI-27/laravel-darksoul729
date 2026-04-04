<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatUser extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_id',
        'name',
        'code',
    ];

    public function contacts(): HasMany
    {
        return $this->hasMany(ChatContact::class, 'owner_chat_user_id');
    }

    public function sentMessages(): HasMany
    {
        return $this->hasMany(ChatMessage::class, 'sender_chat_user_id');
    }

    public function receivedMessages(): HasMany
    {
        return $this->hasMany(ChatMessage::class, 'recipient_chat_user_id');
    }
}
