<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    /**
     * Show the form for editing the general settings.
     */
    public function edit()
    {
        // Get the first setting record or create an empty one if none exists
        $setting = Setting::first() ?? new Setting;

        return view('admin.settings.edit', compact('setting'));
    }

    /**
     * Update the general settings in storage.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'hero_title_1' => 'required|string|max:255',
            'hero_title_2' => 'required|string|max:255',
            'hero_subtitle' => 'required|string|max:255',
            'contact_email' => 'nullable|email|max:255',
            'github_url' => 'nullable|url|max:255',
            'linkedin_url' => 'nullable|url|max:255',
            'instagram_url' => 'nullable|url|max:255',
            'about_text' => 'nullable|string',
        ]);

        $setting = Setting::first();

        if ($setting) {
            $setting->update($validated);
        } else {
            Setting::create($validated);
        }

        return redirect()->route('admin.settings.edit')->with('success', 'Settings updated successfully!');
    }
}
