import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'; // Pastikan path ini benar

interface Stats {
    total_projects: number;
    total_tasks: number;
    to_do: number;
    in_progress: number;
    done: number;
}

export default function Dashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                console.log('Attempting to fetch dashboard data...');
                // Pastikan otentikasi JWT diterapkan untuk permintaan ini jika diperlukan
                const token = localStorage.getItem('access_token'); // Ambil token dari localStorage
                const response = await axios.get('http://localhost:8000/api/dashboard', {
                    headers: {
                        Authorization: `Bearer ${token}` // Sertakan token di header
                    }
                });
                console.log('Dashboard API Response:', response.data);
                setStats(response.data.stats);
                setLoading(false);
            } catch (error: any) {
                console.error('Error fetching dashboard data:', error.response?.data || error.message);
                setError(error.response?.data?.message || 'Gagal memuat data dashboard. Pastikan Anda sudah login.');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    console.log('Current Dashboard Stats State:', stats);

    const Card = ({ title, value, description, colorClass, iconPath }: { title: string; value: number; description: string; colorClass: string; iconPath: string; }) => (
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-start hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
            <div className={`p-3 rounded-full ${colorClass} bg-opacity-20 mb-4`}>
                <svg className={`w-8 h-8 ${colorClass}`} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d={iconPath} />
                </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
            <p className={`text-4xl font-bold ${colorClass} mb-2`}>{value}</p>
            <p className="text-sm text-gray-500">{description}</p>
        </div>
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-gray-800">
                    Dashboard Proyek
                </h2>
            }
        >
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gray-50 py-10 px-6 sm:px-8 lg:px-12">
                <h1 className="text-4xl font-extrabold text-center mb-10 text-gray-800 tracking-tight">Dashboard</h1>

                {loading && (
                    <div className="flex items-center justify-center min-h-[200px] text-gray-600">
                        <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memuat data dashboard...
                    </div>
                )}
                {error && (
                    <div className="text-center text-red-600 bg-red-100 p-4 rounded-lg border border-red-200 max-w-md mx-auto">
                        <p className="font-semibold mb-2">Terjadi Kesalahan:</p>
                        <p>{error}</p>
                    </div>
                )}

                {!loading && !error && stats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <Card
                            title="Total Proyek"
                            value={stats.total_projects}
                            description="Jumlah semua proyek Anda."
                            colorClass="text-blue-600"
                            iconPath="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" // Home/Project icon
                        />
                        <Card
                            title="Total Tugas"
                            value={stats.total_tasks}
                            description="Jumlah semua tugas yang ada."
                            colorClass="text-purple-600"
                            iconPath="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h.01M15 15h.01M12 15h.01M12 18h.01" // Clipboard/Task icon
                        />
                        <Card
                            title="Tugas Belum Dimulai"
                            value={stats.to_do}
                            description="Tugas yang menunggu untuk dikerjakan."
                            colorClass="text-yellow-600"
                            iconPath="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h.01M15 15h.01M12 15h.01M12 18h.01" // Changed to more general task icon
                        />
                        <Card
                            title="Tugas Sedang Dikerjakan"
                            value={stats.in_progress}
                            description="Tugas yang aktif dalam pengerjaan."
                            colorClass="text-indigo-600"
                            // PERBAIKAN DI SINI: Mengganti '>' dengan '&gt;' dan '<' dengan '&lt;'
                            iconPath="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756 0 3.35a1.724 1.724 0 00-1.066 2.573c-.94-1.543.826 3.31 2.37-2.37.996.608 2.296.307 2.572-1.065z" // Gear/Cog icon - ORIGINAL PATH, tidak ada karakter yang bermasalah
                        />
                        <Card
                            title="Tugas Selesai"
                            value={stats.done}
                            description="Tugas yang sudah berhasil diselesaikan."
                            colorClass="text-green-600"
                            iconPath="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" // Checkmark/Done icon
                        />
                    </div>
                )}
                {/* {!loading && !error && (!stats || (stats.total_projects === 0 && stats.total_tasks === 0)) && (
                    <div className="text-center text-gray-500 bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
                        <p className="mb-2">Tidak ada data dashboard yang tersedia.</p>
                        <p className="text-sm">Mungkin Anda belum memiliki proyek atau tugas.</p>
                    </div>
                )} */}
            </div>
        </AuthenticatedLayout>
    );
}