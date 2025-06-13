<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use Spatie\Permission\Models\Role; 
use Illuminate\Support\Facades\Log; 

class AuthController extends Controller
{
    public function register(Request $request)
    {

        try {

            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'username' => 'required|string|max:255|unique:users',
                'email' => 'nullable|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'role' => 'required|in:admin,project_manager,team_member',
            ]);

            $user = User::create([
                'name' => $validatedData['name'],
                'username' => $validatedData['username'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
            ]);


            $user->assignRole($validatedData['role']);


            $credentials = request(['username', 'password']);

            if (!$token = Auth::attempt($credentials)) {
                return response()->json(['error' => 'Unauthorized'], 401);
            }

            return $this->respondWithToken($token);
        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors(),
                'message' => 'Validation error'
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration error: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $request->only(['username', 'password']);

        if (!$token = Auth::attempt($credentials)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid username or password',
            ], 401);
        }

        return $this->respondWithToken($token);
    }

    public function refresh()
    {
        try {
            // Menggunakan auth()->refresh() untuk mendapatkan token baru
            $newToken = auth()->refresh();
            return $this->respondWithToken($newToken);
        } catch (\Exception $e) {
            Log::error('Token refresh failed:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Token refresh failed'], 401);
        }
    }

    public function logout()
    {
        try {
            // Menggunakan auth()->logout() untuk meng-invalidate token aktif
            auth()->logout();
            return response()->json(['message' => 'Successfully logged out']);
        } catch (\Exception $e) {
            Log::error('Logout failed:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Logout failed'], 401);
        }
    }

    public function me()
    {
        $user = Auth::user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }
        // Load roles dan permissions untuk user yang sedang login
        $user->load('roles.permissions');
        return response()->json([
            'id'          => $user->id,
            'name'        => $user->name,
            'email'       => $user->email,
            'username'    => $user->username,
            'roles'       => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }

    protected function respondWithToken($token)
    {
        $user = auth()->user(); // Dapatkan user dari token yang baru dibuat/di-refresh
        if (!$user) {
            Log::error('User associated with token not found in respondWithToken method.');
            return response()->json(['error' => 'User associated with token not found.'], 500);
        }

        // Load roles dan permissions sebelum dikirim ke frontend
        $user->load('roles.permissions');

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'bearer',
            'expires_in'   => auth()->factory()->getTTL() * 60, // Menggunakan auth()->factory()->getTTL()
            'user'         => [ // Struktur ini harus konsisten dengan frontend User interface
                'id'          => $user->id,
                'name'        => $user->name,
                'email'       => $user->email,
                'username'    => $user->username,
                'roles'       => $user->getRoleNames(),
                'permissions' => $user->getAllPermissions()->pluck('name'),
            ],
        ]);
    }
}