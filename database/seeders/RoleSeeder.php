<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles if they don't exist
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $userRole = Role::firstOrCreate(['name' => 'user', 'guard_name' => 'web']);

        // Define permissions
        $permissions = [
            // Dashboard
            'view dashboard',

            // Projects
            'create project',
            'edit project',
            'delete project',
            'view project',

            // Tasks
            'create task',
            'edit task',
            'delete task',
            'view task',

            // Users
            'create user',
            'edit user',
            'delete user',
            'view user',

            // Roles
            'create role',
            'edit role',
            'delete role',
            'view role',
        ];

        // Create permissions and assign to roles
        foreach ($permissions as $permissionName) {
            $permission = Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'web']);

            // Assign all permissions to 'admin' role
            $adminRole->givePermissionTo($permission);

            // Assign specific permissions to 'user' role
            if (in_array($permissionName, ['view dashboard', 'view project', 'view task'])) {
                $userRole->givePermissionTo($permission);
            }
        }
    }
}