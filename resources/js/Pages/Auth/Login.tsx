import { Head, router, Link } from '@inertiajs/react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
    const [form, setForm] = useState({
        username: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true); // Set loading to true on submission

        try {
            const res = await axios.post('http://localhost:8000/api/auth/login', form);
            const { access_token, user } = res.data;

            login(access_token, user);

            router.visit('/dashboard');

        } catch (err: any) {
            console.error("Login error:", err.response?.data || err.message);
            setError(err.response?.data?.error || err.message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false); // Always reset loading state
        }
    };

    return (
        <>
            <Head title="Login - Sistem Manajemen Proyek" />
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-sky-100 p-4 sm:p-6 lg:p-8">
                <div className="w-full max-w-md bg-white bg-opacity-90 backdrop-filter backdrop-blur-md p-8 rounded-xl shadow-2xl border border-blue-200 transform transition-all duration-300 scale-95 hover:scale-100">
                    <div className="text-center mb-8">
                        {/* Enhanced Icon */}
                        <svg className="mx-auto w-16 h-16 text-blue-500 mb-4 animate-bounce-slow" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-9a1 1 0 012 0v4a1 1 0 01-2 0V11zm-3-1a1 1 0 012 0v5a1 1 0 01-2 0V10zm6 0a1 1 0 012 0v5a1 1 0 01-2 0V10zM8 8a1 1 0 011-1h6a1 1 0 011 1v1a1 1 0 01-2 0V9h-4v1a1 1 0 01-2 0V8z" />
                        </svg>
                        <h2 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">Login</h2>
                        <p className="text-gray-600 text-lg">Masuk ke akun Anda</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-100 text-red-700 border border-red-200 p-3 rounded-lg mb-6 text-center text-sm shadow-sm" role="alert">
                                {error}
                            </div>
                        )}

                        <div className="mb-5">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Masukkan username Anda"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                                required
                            />
                        </div>

                        <div className="mb-7">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Masukkan password Anda"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                className="w-full px-4 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 transition duration-200 ease-in-out"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-teal-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out flex items-center justify-center"
                            disabled={isLoading} // Disable button while loading
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                'Login'
                            )}
                        </button>
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Belum punya akun?{' '}
                            <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500 transition duration-150 ease-in-out">
                                Daftar sekarang
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
}