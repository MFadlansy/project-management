<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                // PASTIKAN STRUKTUR 'user' INI SAMA PERSIS.
                // Ini akan membagikan data user, roles, dan permissions ke frontend.
                // Penting: Menggunakan operator ternary untuk menangani kasus $request->user() adalah null.
                'user' => $request->user() ? [ // <--- PASTIKAN BARIS INI BENAR
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'username' => $request->user()->username, // Dari model User
                    'roles' => $request->user()->getRoleNames(), // Mengambil nama peran dari Spatie
                    'permissions' => $request->user()->getAllPermissions()->pluck('name'), // Mengambil semua izin dari Spatie
                ] : null, // Penting: Jika user tidak login, pastikan ini 'null'
            ],
            // Flash messages untuk notifikasi toast setelah redirect
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'message' => fn () => $request->session()->get('message'),
            ],
        ];
    }
}