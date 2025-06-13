<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    // public function run(): void
    // {
    //     Role::create(['name' => 'Admin']);
    //     Role::create(['name' => 'Project Manager']);
    //     Role::create(['name' => 'Team Member']);

    //     $admin = User::create([
    //         'name' => 'Admin',
    //         'username' => 'admin',
    //         'email' => 'admin@mail.com',
    //         'password' => Hash::make('admin123')
    //     ]);
    //     $admin->assignRole('Admin');
    // }
}
