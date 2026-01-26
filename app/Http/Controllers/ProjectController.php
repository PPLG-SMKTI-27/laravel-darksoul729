<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index()
    {
        // $repos = require app_path('Data/projects.php');
        $repos = \App\Models\Project::where('status', 'published')->latest()->get();

        return view('pages.project', [
            'name' => 'Kevin Hermansyah',
            'repos' => $repos,
        ]);
    }
}
