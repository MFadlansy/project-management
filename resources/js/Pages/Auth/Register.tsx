import React, { useState } from 'react';
import { Head, router, Link } from '@inertiajs/react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext'; // Pastikan path ini benar

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '', // Default role sekarang kosong
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); // State untuk indikator loading
    const { login } = useAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:8000/api/auth/register', form);
            const { access_token, user } = res.data;

            login(access_token, user);

            router.visit('/dashboard');
        } catch (err: any) {
            console.error("Register error:", err.response?.data || err.message);
            if (err.response && err.response.data && err.response.data.errors) {
                const firstError = Object.values(err.response.data.errors)[0] as string[];
                setError(firstError[0] || 'Registrasi gagal. Silakan coba lagi.');
            } else {
                setError(err.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Head title="Daftar - Sistem Manajemen Proyek" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-sky-100 p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-filter backdrop-blur-md p-8 rounded-xl shadow-2xl border border-blue-200 transform transition-all duration-300 scale-95 hover:scale-100">
                    <div className="text-center mb-6"> {/* DIUBAH: mb-8 menjadi mb-6 */}
                        {/* Logo Ikon Pengguna */}
                        <svg className="mx-auto w-16 h-16 text-blue-500 mb-3 animate-bounce-slow" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> {/* DIUBAH: mb-4 menjadi mb-3 */}
                            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-9a1 1 0 012 0v4a1 1 0 01-2 0V11zm-3-1a1 1 0 012 0v5a1 1 0 01-2 0V10zm6 0a1 1 0 012 0v5a1 1 0 01-2 0V10zM8 8a1 1 0 011-1h6a1 1 0 011 1v1a1 1 0 01-2 0V9h-4v1a1 1 0 01-2 0V8z" />
                        </svg>
                        <h2 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">Daftar Akun</h2>
                        <p className="text-gray-600 text-lg">Buat akun baru Anda</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg mb-4 text-center text-sm shadow-sm" role="alert"> {/* DIUBAH: mb-6 menjadi mb-4 */}
                                {error}
                            </div>
                        )}

                        <div className="mb-4"> {/* DIUBAH: mb-5 menjadi mb-4 */}
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Masukkan nama lengkap Anda"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ease-in-out"
                            />
                        </div>

                        <div className="mb-4"> {/* DIUBAH: mb-5 menjadi mb-4 */}
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                placeholder="Pilih username Anda"
                                value={form.username}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ease-in-out"
                            />
                        </div>

                        <div className="mb-4"> {/* DIUBAH: mb-5 menjadi mb-4 */}
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Masukkan alamat email Anda"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ease-in-out"
                            />
                        </div>

                        <div className="mb-4"> {/* DIUBAH: mb-5 menjadi mb-4 */}
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Buat password"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ease-in-out"
                            />
                        </div>

                        <div className="mb-6"> {/* DIUBAH: mb-7 menjadi mb-6 */}
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password</label>
                            <input
                                type="password"
                                id="password_confirmation"
                                name="password_confirmation"
                                placeholder="Konfirmasi password Anda"
                                value={form.password_confirmation}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-teal-500 focus:border-teal-500 transition duration-200 ease-in-out"
                            />
                        </div>

                        {/* Role Selection */}
                        <div className="mb-6 relative"> {/* DIUBAH: mb-7 menjadi mb-6, dan pt-8 menjadi pt-7 */}
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Peran</label>
                            <select
                                id="role"
                                name="role"
                                value={form.role}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-sm focus:ring-teal-500 focus:border-teal-500 transition duration-200 ease-in-out appearance-none cursor-pointer"
                            >
                                <option value="" disabled>Pilih Peran Anda</option>
                                <option value="admin">Admin</option>
                                <option value="project_manager">Manajer Proyek</option>
                                <option value="team_member">Anggota Tim</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 pt-7 text-gray-700"> {/* DIUBAH: pt-8 menjadi pt-7 */}
                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15 8.293V14a1 1 0 01-2 0V9.414L10.707 13 9.293 11.586a1 1 0 010-1.414l.707-.707L13 9.414V6a1 1 0 012 0v5.586L10.707 6 9.293 7.414a1 1 0 010 1.414l.707.707L6 11.586V14a1 1 0 01-2 0V8.414L9.293 12.95z"/></svg>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Daftar'
                            )}
                        </button>
                        <p className="mt-4 text-center text-sm text-gray-600"> {/* DIUBAH: mt-6 menjadi mt-4 */}
                            Sudah punya akun?{' '}
                            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out">
                                Masuk
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}