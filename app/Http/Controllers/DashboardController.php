<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log; // Untuk debugging

class DashboardController extends Controller
{
    public function index()
    {
        try {
            $user = Auth::user();

            if (!$user) {
                Log::warning('DashboardController: User not authenticated, but accessed protected route.');
                return response()->json(['message' => 'User not authenticated.'], 401);
            }

            // Anda perlu membuat tabel 'projects' dan 'tasks' melalui migration
            // dan mengisi datanya agar count tidak error
            $projectCount = DB::table('projects')->count();
            $taskCount = DB::table('tasks')->count();
            $tasksToDo = DB::table('tasks')->where('status', 'To Do')->count();
            $tasksInProgress = DB::table('tasks')->where('status', 'In Progress')->count();
            $tasksDone = DB::table('tasks')->where('status', 'Done')->count();

            // Mengambil roles dan permissions dari user
            $userRoles = $user->getRoleNames();
            $userPermissions = $user->getAllPermissions()->pluck('name');

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'username' => $user->username,
                    'roles' => $userRoles,
                    'permissions' => $userPermissions,
                ],
                'stats' => [
                    'total_projects' => $projectCount,
                    'total_tasks' => $taskCount,
                    'to_do' => $tasksToDo,
                    'in_progress' => $tasksInProgress,
                    'done' => $tasksDone,
                ]
            ]);

        } catch (\Exception $e) {
            // Log error lengkap jika terjadi masalah
            Log::error("Error in DashboardController@index: " . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            // Mengembalikan respons 500 yang lebih informatif (hanya untuk debugging)
            return response()->json([
                'message' => 'Server error in DashboardController: ' . $e->getMessage(),
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ], 500);
        }
    }
}