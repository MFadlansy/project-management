<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Buat Permissions
        $permissions = [
            'manage users',
            'create project',
            'update project',
            'delete project',
            'view project', // <--- Tambahkan izin ini
            'assign tasks',
            'update tasks',
            'comment tasks',
            'view dashboard',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // 2. Buat Roles dan tetapkan Permissions
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo([
            'manage users',
            'create project',
            'update project',
            'delete project',
            'view project', // <--- Tambahkan izin ini untuk admin
            'comment tasks',
            'view dashboard',
        ]);

        $pmRole = Role::firstOrCreate(['name' => 'project_manager']);
        $pmRole->givePermissionTo([
            'create project',
            'update project',
            'view project', // <--- Tambahkan izin ini untuk project manager
            'assign tasks',
            'update tasks',
            'comment tasks',
            'view dashboard',
        ]);

        $teamRole = Role::firstOrCreate(['name' => 'team_member']);
        $teamRole->givePermissionTo([
            'view project', // <--- Tambahkan izin ini untuk team member (jika bisa melihat proyek orang lain)
            'update tasks',
            'comment tasks',
            'view dashboard',
        ]);

        // 3. Buat dummy users dan tetapkan Roles
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            ['name' => 'Admin', 'username' => 'admin', 'password' => Hash::make('admin123')]
        )->assignRole('admin');

        User::firstOrCreate(
            ['email' => 'pm@example.com'],
            ['name' => 'Project Manager', 'username' => 'pm', 'password' => Hash::make('pm123')]
        )->assignRole('project_manager');

        User::firstOrCreate(
            ['email' => 'team@example.com'],
            ['name' => 'Team Member', 'username' => 'team', 'password' => Hash::make('team123')]
        )->assignRole('team_member');
    }
}