<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Support\PageResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class HomeController extends Controller
{
    public function index(Request $request): View|JsonResponse
    {
        $repos = Project::query()
            ->select(['id', 'title', 'description', 'image', 'link'])
            ->where('status', 'published')
            ->latest()
            ->take(3)
            ->get()
            ->map(fn (Project $project): array => $this->serializeProject($project))
            ->all();

        return PageResponse::render($request, 'LandingPage', [
            'repos' => $repos,
        ]);
    }

    /**
     * @return array{id:int,title:string,description:?string,image_url:?string,link:?string}
     */
    protected function serializeProject(Project $project): array
    {
        return [
            'id' => $project->id,
            'title' => $project->title,
            'description' => $project->description,
            'image_url' => $project->image_url,
            'link' => $project->link,
        ];
    }
}
