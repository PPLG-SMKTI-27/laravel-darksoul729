<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeController extends Controller
{

    public function index()
    {

        // $repos = require app_path('Data/projects.php'); // Legacy
        $repos = \App\Models\Project::where('status', 'published')->latest()->get();
        
        return view('index', compact('repos'));
    }
}
