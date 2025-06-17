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
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permissions = [
            'manage users',
            'create project',
            'update project',
            'delete project',
            'view project',   // <--- PASTIKAN INI ADA
            'create task',    // <--- PASTIKAN INI ADA
            'view task',      // <--- PASTIKAN INI ADA
            'update task',    // <--- PASTIKAN INI ADA
            'delete task',    // <--- PASTIKAN INI ADA
            'assign tasks',   // <--- PASTIKAN INI ADA
            'comment tasks',
            'view dashboard',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminRole->givePermissionTo([
            'manage users',
            'create project',
            'update project',
            'delete project',
            'view project',   // <--- PASTIKAN INI ADA untuk admin
            'create task',
            'view task',
            'update task',
            'delete task',
            'assign tasks',
            'comment tasks',
            'view dashboard',
        ]);

        $pmRole = Role::firstOrCreate(['name' => 'project_manager']);
        $pmRole->givePermissionTo([
            'create project',
            'update project',
            'view project',   // <--- PASTIKAN INI ADA untuk PM
            'create task',
            'view task',
            'update task',
            'delete task',
            'assign tasks',
            'comment tasks',
            'view dashboard',
        ]);

        $teamRole = Role::firstOrCreate(['name' => 'team_member']);
        $teamRole->givePermissionTo([
            'view project',
            'view task',      // <--- PASTIKAN INI ADA untuk anggota tim
            'update task',    // <--- PASTIKAN INI ADA untuk anggota tim
            'comment tasks',
            'view dashboard',
        ]);

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