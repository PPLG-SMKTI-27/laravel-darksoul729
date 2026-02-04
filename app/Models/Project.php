<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image',
        'link',
        'status',
    ];

    // Append accessor to JSON
    protected $appends = ['image_url'];

    // Accessor for image_url (React components use image_url)
    public function getImageUrlAttribute()
    {
        return $this->image;
    }
}
