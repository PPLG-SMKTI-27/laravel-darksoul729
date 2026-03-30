<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SkillsRoom extends Model
{
    /** @use HasFactory<\Database\Factories\SkillsRoomFactory> */
    use HasFactory;

    protected $fillable = [
        'code',
        'last_activity_at',
    ];

    protected function casts(): array
    {
        return [
            'last_activity_at' => 'datetime',
        ];
    }

    public function players(): HasMany
    {
        return $this->hasMany(SkillsRoomPlayer::class);
    }
}
