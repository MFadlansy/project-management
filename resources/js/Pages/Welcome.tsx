import { Head, Link } from '@inertiajs/react';
import React from 'react';

interface WelcomeProps {
    auth?: {
        user?: any;
    };
}

export default function Welcome({ auth }: WelcomeProps) {
    const isLoggedIn = !!auth?.user;

    return (
        <>
            <Head title="Selamat Datang" />

            <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-blue-950 text-white flex flex-col items-center justify-center p-6 md:p-10 lg:p-16 overflow-hidden">
                {/* Dynamic Background Blobs - Cool Tones, no animation */}
                <div className="absolute top-0 -left-8 w-80 h-80 bg-teal-500 rounded-full mix-blend-screen filter blur-3xl opacity-20"></div>
                <div className="absolute top-0 -right-8 w-80 h-80 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-80 h-80 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animation-delay-4000"></div>

                <div className="relative z-10 text-center max-w-5xl mx-auto p-12 md:p-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl shadow-2xl border border-gray-300 transform transition-all duration-500 scale-95 hover:scale-100">
                    <div className="mb-10 md:mb-12">
                        {/* Icon - Blue/Teal Accent, no animation */}
                        <svg className="mx-auto w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm-1-9a1 1 0 012 0v4a1 1 0 01-2 0V11zm-3-1a1 1 0 012 0v5a1 1 0 01-2 0V10zm6 0a1 1 0 012 0v5a1 1 0 01-2 0V10zM8 8a1 1 0 011-1h6a1 1 0 011 1v1a1 1 0 01-2 0V9h-4v1a1 1 0 01-2 0V8z" />
                        </svg>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tighter text-gray-800">
                        Sistem Manajemen Proyek
                    </h1>
                    <p className="mt-4 text-2xl md:text-3xl lg:text-4xl font-semibold text-blue-700">
                        Kelola Proyek Anda, Lebih Cerdas.
                    </p>
                    <p className="mt-8 text-lg md:text-xl lg:text-2xl text-gray-700 font-light max-w-3xl mx-auto leading-relaxed opacity-90">
                        Sebuah aplikasi manajemen tugas berbasis web yang memungkinkan tim untuk membuat proyek, menetapkan tugas, memantau progres, dan berkolaborasi. Sistem ini dilengkapi dengan autentikasi JWT dan frontend interaktif menggunakan TypeScript.
                    </p>

                    <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-6">
                        {isLoggedIn ? (
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-lg rounded-full shadow-xl transition duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75 tracking-wide"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7m7-7v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                                </svg>
                                Buka Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="inline-flex items-center justify-center px-10 py-4 bg-gray-700 text-white border border-gray-600 font-bold text-lg rounded-full shadow-xl hover:bg-gray-600 transition duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-75 tracking-wide"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                                    </svg>
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white font-bold text-lg rounded-full shadow-xl transition duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-teal-300 focus:ring-opacity-75 tracking-wide"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    Daftar Sekarang
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                <footer className="absolute bottom-6 left-0 right-0 text-center text-sm text-gray-400 opacity-80 z-10">
                    &copy; {new Date().getFullYear()} Sistem Manajemen Proyek. Hak Cipta Dilindungi.
                </footer>
            </div>
        </>
    );
}