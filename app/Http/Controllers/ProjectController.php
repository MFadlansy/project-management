<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task; // Tambahkan ini jika akan langsung membuat task di sini
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia; // Tambahkan ini
use Illuminate\Validation\Rule; // Tambahkan ini

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::with('creator')->latest()->paginate(10);
        return response()->json($projects);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => ['nullable', 'string', Rule::in(['to-do', 'in-progress', 'completed', 'canceled'])],
            'due_date'    => 'nullable|date',
        ]);

        $project = Project::create([
            'name'        => $validatedData['name'],
            'description' => $validatedData['description'],
            'status'      => $validatedData['status'] ?? 'to-do',
            'due_date'    => $validatedData['due_date'],
            'created_by'  => Auth::id(),
        ]);

        return response()->json(['message' => 'Project created successfully', 'project' => $project->load('creator')], 201);
    }

    // Metode show yang diperbaiki untuk Inertia
    public function show(Project $project)
    {
        $project->load('creator'); // Memuat relasi creator
        return Inertia::render('Projects/Show', [ // Render komponen Inertia Projects/Show
            'project' => $project, // Teruskan objek project sebagai props
        ]);
    }

    public function update(Request $request, Project $project)
    {
        $validatedData = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status'      => ['sometimes', 'required', 'string', Rule::in(['to-do', 'in-progress', 'completed', 'canceled'])],
            'due_date'    => 'nullable|date',
        ]);

        $project->update($validatedData);

        return response()->json(['message' => 'Project updated successfully', 'project' => $project->load('creator')]);
    }

    public function destroy(Project $project)
    {
        $project->delete();
        return redirect()->route('projects.index')->with('success', 'Proyek berhasil dihapus!');
    }
}