<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatMessage extends Model
{
    use HasFactory;

    protected $fillable = [
        'sender_chat_user_id',
        'recipient_chat_user_id',
        'body',
        'read_at',
    ];

    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }

    public function sender(): BelongsTo
    {
        return $this->belongsTo(ChatUser::class, 'sender_chat_user_id');
    }

    public function recipient(): BelongsTo
    {
        return $this->belongsTo(ChatUser::class, 'recipient_chat_user_id');
    }
}
