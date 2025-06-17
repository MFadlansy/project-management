<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\TaskController; // Tambahkan ini
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refresh']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:api');
});

Route::middleware(['auth:api'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->middleware('permission:view dashboard');

    // User Management
    Route::get('/users', [UserController::class, 'index'])->middleware('permission:manage users');
    Route::post('/users', [UserController::class, 'store'])->middleware('permission:manage users');
    Route::get('/users/{id}', [UserController::class, 'show'])->middleware('permission:manage users');
    Route::put('/users/{id}', [UserController::class, 'update'])->middleware('permission:manage users');
    Route::delete('/users/{id}', [UserController::class, 'destroy'])->middleware('permission:manage users');

    // Project Management
    Route::get('/projects', [ProjectController::class, 'index'])->middleware('permission:view project')->name('projects.index');
    Route::post('/projects', [ProjectController::class, 'store'])->middleware('permission:create project')->name('projects.store');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->middleware('permission:view project')->name('projects.show'); // Ini sudah diberi nama
    Route::put('/projects/{project}', [ProjectController::class, 'update'])->middleware('permission:update project')->name('projects.update');
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->middleware('permission:delete project')->name('projects.destroy');

    // Task Management (Bersarang di bawah Project)
    Route::prefix('projects/{project}')->group(function () {
        Route::get('/tasks', [TaskController::class, 'index'])->middleware('permission:view task')->name('tasks.index');
        Route::post('/tasks', [TaskController::class, 'store'])->middleware('permission:create task')->name('tasks.store');
        Route::get('/tasks/{task}', [TaskController::class, 'show'])->middleware('permission:view task')->name('tasks.show');
        Route::put('/tasks/{task}', [TaskController::class, 'update'])->middleware('permission:update task')->name('tasks.update');
        Route::delete('/tasks/{task}', [TaskController::class, 'destroy'])->middleware('permission:delete task')->name('tasks.destroy');
    });

    // Rute terpisah untuk mengambil daftar user yang bisa ditugaskan
    Route::get('/assignable-users', [TaskController::class, 'assignableUsers'])->middleware('permission:assign tasks')->name('assignable.users');
});