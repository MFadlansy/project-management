<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia; // Tambahkan ini

class TaskController extends Controller
{
    public function index(Project $project)
    {
        $tasks = $project->tasks()->with('assignee')->latest()->paginate(10);
        return response()->json($tasks);
    }

    public function store(Request $request, Project $project)
    {
        $validatedData = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'status'      => ['nullable', 'string', Rule::in(['To Do', 'In Progress', 'Done'])],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ]);

        $task = $project->tasks()->create([
            'title'       => $validatedData['title'],
            'description' => $validatedData['description'],
            'status'      => $validatedData['status'] ?? 'To Do',
            'assigned_to' => $validatedData['assigned_to'],
        ]);

        return response()->json(['message' => 'Task created successfully', 'task' => $task->load('assignee')], 201);
    }

    public function show(Project $project, Task $task)
    {
        if ($task->project_id !== $project->id) {
            abort(404);
        }
        return response()->json($task->load('assignee'));
    }

    public function update(Request $request, Project $project, Task $task)
    {
        if ($task->project_id !== $project->id) {
            abort(404);
        }

        $validatedData = $request->validate([
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status'      => ['sometimes', 'required', 'string', Rule::in(['To Do', 'In Progress', 'Done'])],
            'assigned_to' => ['nullable', 'exists:users,id'],
        ]);

        $task->update($validatedData);

        return response()->json(['message' => 'Task updated successfully', 'task' => $task->load('assignee')]);
    }

    public function destroy(Project $project, Task $task)
    {
        if ($task->project_id !== $project->id) {
            abort(404);
        }
        $task->delete();
        return redirect()->back()->with('success', 'Tugas berhasil dihapus!');
    }

    public function assignableUsers()
    {
        $users = User::select('id', 'name', 'username')->get();
        return response()->json($users);
    }
}