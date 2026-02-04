<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function index(): View
    {
        $repos = Project::query()
            ->where('status', 'published')
            ->latest()
            ->take(3)
            ->get();

        return view('index', [
            'page' => 'LandingPage',
            'props' => [
                'repos' => $repos,
            ],
        ]);
    }
}
