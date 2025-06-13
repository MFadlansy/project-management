<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Ambil semua proyek, atau hanya proyek yang dibuat oleh user jika Anda ingin membatasi
        // Untuk saat ini, kita tampilkan semua, karena izin akan mengatur siapa yang bisa melihatnya
        $projects = Project::with('creator')->latest()->paginate(10); // Ambil creator dan paginasi
        return response()->json($projects);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'nullable|string|in:to-do,in-progress,completed,canceled',
            'due_date'    => 'nullable|date',
        ]);

        $project = Project::create([
            'name'        => $validatedData['name'],
            'description' => $validatedData['description'],
            'status'      => $validatedData['status'] ?? 'to-do', // Default status jika tidak ada
            'due_date'    => $validatedData['due_date'],
            'created_by'  => Auth::id(), // Set creator ke user yang sedang login
        ]);

        return response()->json(['message' => 'Project created successfully', 'project' => $project->load('creator')], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Project $project)
    {
        return response()->json($project->load('creator'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Project $project)
    {
        // Pastikan hanya creator atau admin/PM yang bisa update
        // Ini bisa diatur via middleware 'can' atau di dalam controller
        // if ($request->user()->cannot('update', $project)) {
        //     abort(403);
        // }

        $validatedData = $request->validate([
            'name'        => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status'      => 'sometimes|required|string|in:to-do,in-progress,completed,canceled',
            'due_date'    => 'nullable|date',
        ]);

        $project->update($validatedData);

        return response()->json(['message' => 'Project updated successfully', 'project' => $project->load('creator')]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Project $project)
    {
        // if ($request->user()->cannot('delete', $project)) {
        //     abort(403);
        // }
        $project->delete();

        // Untuk Inertia, kita kembalikan redirect
        return redirect()->route('projects.index')->with('success', 'Proyek berhasil dihapus!');
    }
}