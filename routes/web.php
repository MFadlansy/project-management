<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController; // Pastikan ini ada
use App\Http\Controllers\TaskController;    // Pastikan ini ada
use App\Models\Project;                    // Pastikan ini ada
use App\Models\Task;                      // Pastikan ini ada


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

// Rute autentikasi bawaan Laravel Breeze
Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');
Route::post('/login', [AuthController::class, 'login']);

Route::get('/register', fn () => Inertia::render('Auth/Register'))->name('register');
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth')->group(function () {
    // Rute Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Rute Profil
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Rute Manajemen Pengguna (Admin)
    Route::middleware(['permission:manage users'])->group(function () {
        Route::get('/admin/role', function () {
            return Inertia::render('Admin/Role/index');
        })->name('user.index');

        Route::get('/admin/role/create', function () {
            return Inertia::render('Admin/Role/create');
        })->name('user.create');

        Route::get('/admin/role/edit/{id}', function ($id) {
            return Inertia::render('Admin/Role/edit', ['id' => $id]);
        })->name('user.edit');

    });

    // Rute Proyek
    Route::middleware(['permission:view project|create project|update project|delete project'])->group(function () {
        Route::get('/projects', function () {
            return Inertia::render('Projects/index');
        })->name('projects.index');

        Route::get('/projects/create', function () {
            return Inertia::render('Projects/create');
        })->name('projects.create');

        Route::get('/projects/{project}/edit', function (Project $project) {
            return Inertia::render('Projects/edit', ['project' => $project]);
        })->name('projects.edit');

        // Rute Detail Proyek (Projects/Show.tsx) <--- UBAH INI KE CONTROLLER
        Route::get('/projects/{project}', [ProjectController::class, 'show'])->name('projects.show');

        // Rute Tugas (Tasks) - Bersarang di bawah Proyek
        Route::prefix('projects/{project}')->group(function () {
            Route::get('/tasks/create', function (Project $project) {
                return Inertia::render('Tasks/Create', ['project' => $project]);
            })->name('tasks.create');

            Route::get('/tasks/{task}/edit', function (Project $project, Task $task) {
                // Pastikan tugas ini milik proyek yang benar
                if ($task->project_id !== $project->id) {
                    abort(404);
                }
                $task->load('assignee'); // Load relasi assignee untuk form edit
                return Inertia::render('Tasks/Edit', ['project' => $project, 'task' => $task]);
            })->name('tasks.edit');
        });
    });
});