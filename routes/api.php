<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProjectController;
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
    Route::get('/projects', [ProjectController::class, 'index'])->middleware('permission:view project');
    Route::post('/projects', [ProjectController::class, 'store'])->middleware('permission:create project');
    Route::get('/projects/{project}', [ProjectController::class, 'show'])->middleware('permission:view project')->name('projects.show'); // Tambahkan .name() juga jika ingin pakai route() helper untuk show
    Route::put('/projects/{project}', [ProjectController::class, 'update'])->middleware('permission:update project')->name('projects.update'); // <--- TAMBAHKAN INI
    Route::delete('/projects/{project}', [ProjectController::class, 'destroy'])->middleware('permission:delete project')->name('projects.destroy'); // <--- TAMBAHKAN INI JUGA
});