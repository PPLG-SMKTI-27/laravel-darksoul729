<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChatContact extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_chat_user_id',
        'contact_chat_user_id',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(ChatUser::class, 'owner_chat_user_id');
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(ChatUser::class, 'contact_chat_user_id');
    }
}
