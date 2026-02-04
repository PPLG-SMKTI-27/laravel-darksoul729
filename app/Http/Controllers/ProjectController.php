<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\View\View;

class ProjectController extends Controller
{
    public function index(Request $request): View
    {
        $repos = Project::query()
            ->where('status', 'published')
            ->latest()
            ->get();

        return view('index', [
            'page' => 'Projects',
            'props' => [
                'name' => 'Kevin Hermansyah',
                'repos' => $repos,
                'project' => $this->findProject($request),
            ],
        ]);
    }

    protected function findProject(Request $request): ?Project
    {
        $projectId = $request->integer('id');

        if ($projectId === 0) {
            return null;
        }

        return Project::query()
            ->where('status', 'published')
            ->whereKey($projectId)
            ->first();
    }
}
