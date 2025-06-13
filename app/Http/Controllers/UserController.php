<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('roles')->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email'    => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,project_manager,team_member',
        ]);

        $validatedData = $request->validate([ 
            'name'     => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email'    => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:admin,project_manager,team_member',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'username' => $request->username,
            'email'    => $validatedData['email'],
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->role);

        return response()->json(['message' => 'User created successfully', 'user' => $user->load('roles')], 201);
    }

    // TAMBAHKAN METODE SHOW INI
    public function show($id)
    {
        $user = User::with('roles')->findOrFail($id);
        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name'     => 'sometimes|required|string|max:255',
            'username' => 'sometimes|required|string|max:255|unique:users,username,'.$user->id,
            'email'    => 'sometimes|required|email|max:255|unique:users,email,'.$user->id,
            'password' => 'nullable|string|min:6|confirmed',
            'role'     => 'sometimes|required|in:admin,project_manager,team_member',
        ]);

        $user->name = $request->name ?? $user->name;
        $user->username = $request->username ?? $user->username;
        $user->email = $request->email ?? $user->email;
        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }
        $user->save();

        if ($request->has('role')) {
            $user->syncRoles([$request->role]);
        }

        return response()->json(['message' => 'User updated successfully', 'user' => $user->load('roles')]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}