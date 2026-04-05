<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Message;
use App\Models\Project;
use App\Support\PageResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class DashboardController extends Controller
{
    public function index(Request $request): View|JsonResponse
    {
        $stats = [
            'total' => Project::count(),
            'published' => Project::where('status', 'published')->count(),
            'draft' => Project::where('status', 'draft')->count(),
            'messages' => Message::where('is_read', false)->count(),
        ];

        $recentProjects = Project::latest()->take(5)->get();

        return PageResponse::render($request, 'Admin/Dashboard', [
            'stats' => $stats,
            'recentProjects' => $recentProjects,
        ]);
    }
}
