<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SkillsRoomPlayer extends Model
{
    /** @use HasFactory<\Database\Factories\SkillsRoomPlayerFactory> */
    use HasFactory;

    protected $fillable = [
        'skills_room_id',
        'player_uuid',
        'display_name',
        'role',
        'state',
        'last_seen_at',
    ];

    protected function casts(): array
    {
        return [
            'state' => 'array',
            'last_seen_at' => 'datetime',
        ];
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(SkillsRoom::class, 'skills_room_id');
    }
}
