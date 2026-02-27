<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = [
        'hero_title_1',
        'hero_title_2',
        'hero_subtitle',
        'contact_email',
        'github_url',
        'linkedin_url',
        'instagram_url',
        'about_text',
    ];
}
