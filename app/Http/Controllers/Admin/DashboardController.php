<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Project;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'total' => Project::count(),
            'published' => Project::where('status', 'published')->count(),
            'draft' => Project::where('status', 'draft')->count(),
            'messages' => Message::where('is_read', false)->count(),
        ];

        $recentProjects = Project::latest()->take(5)->get();

        return view('index', [
            'page' => 'Admin/Dashboard',
            'props' => [
                'stats' => $stats,
                'recentProjects' => $recentProjects,
            ],
        ]);
    }
}
