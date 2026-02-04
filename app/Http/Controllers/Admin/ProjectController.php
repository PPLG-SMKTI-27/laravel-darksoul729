<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $projects = Project::latest()->get();
        return view('admin.projects.index', compact('projects'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.projects.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
            'link' => 'nullable|url',
            'status' => 'required|in:draft,published',
        ]);

        $data = $validated;

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('projects', 'public');
            $data['image'] = $path;
        }

        $project = Project::create($data);

        // Return JSON for AJAX requests
        if ($request->expectsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Project created successfully.',
                'project' => $project
            ], 201);
        }

        return redirect()->route('admin.projects.index')->with('success', 'Project created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Project $project)
    {
        return view('admin.projects.edit', compact('project'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:10240',
                'link' => 'nullable|url',
                'status' => 'required|in:draft,published',
            ]);

            $data = $validated;

            if ($request->hasFile('image')) {
                \Log::info('Image upload attempt', [
                    'original_name' => $request->file('image')->getClientOriginalName(),
                    'size' => $request->file('image')->getSize(),
                    'mime' => $request->file('image')->getMimeType(),
                ]);

                // Delete old image if exists
                if ($project->image) {
                    Storage::disk('public')->delete($project->image);
                }
                
                $path = $request->file('image')->store('projects', 'public');
                $data['image'] = $path;
                
                \Log::info('Image stored successfully', ['path' => $path]);
            } else {
                // Keep existing image if no new upload
                unset($data['image']);
            }

            $project->update($data);

            // Return JSON for AJAX requests
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Project updated successfully.',
                    'project' => $project
                ]);
            }

            return redirect()->route('admin.projects.index')->with('success', 'Project updated successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation failed', ['errors' => $e->errors()]);
            
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'message' => $e->getMessage(),
                    'errors' => $e->errors()
                ], 422);
            }
            throw $e;
        } catch (\Exception $e) {
            \Log::error('Update failed', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            if ($request->expectsJson() || $request->ajax()) {
                return response()->json([
                    'message' => 'Failed to update project: ' . $e->getMessage(),
                    'errors' => ['general' => [$e->getMessage()]]
                ], 500);
            }
            throw $e;
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        if ($project->image) {
            Storage::disk('public')->delete($project->image);
        }
        
        $project->delete();

        return redirect()->route('admin.projects.index')->with('success', 'Project deleted successfully.');
    }
}
