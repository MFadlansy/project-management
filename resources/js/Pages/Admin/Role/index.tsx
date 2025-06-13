// resources/js/Pages/Admin/Role/index.tsx

import React, { useEffect, useState } from 'react';
import { Button } from '@/Components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Link, router } from '@inertiajs/react';
import { DialogDeleteUser } from '@/Pages/Admin/Role/delete';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    roles: { id: number; name: string }[];
}

export default function UserIndex() {
    const [users, setUsers] = useState<User[]>([]);
    const { toast } = useToast();
    const { loading, can } = useAuth();

    useEffect(() => {
        if (!loading && !can('manage users')) {
            router.visit('/dashboard');
            toast({
                title: 'Akses Ditolak',
                description: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
                variant: 'destructive',
            });
        }
    }, [loading, can, toast]);

    const fetchUsers = async () => {
        try {
            const response = await axios.get<User[]>('/api/users');
            setUsers(response.data);
        } catch (error: any) {
            console.error('Error fetching users:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Gagal mengambil data user.',
                variant: 'destructive',
            });
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) return;

        try {
            await axios.delete(`/api/users/${id}`);
            toast({ title: 'Berhasil!', description: 'Pengguna berhasil dihapus.' });
            fetchUsers();
        } catch (error: any) {
            console.error('Error deleting user:', error);
            toast({
                title: 'Error',
                description: error.response?.data?.message || 'Terjadi kesalahan saat menghapus pengguna.',
                variant: 'destructive',
            });
        }
    };

    useEffect(() => {
        if (!loading && can('manage users')) {
            fetchUsers();
        }
    }, [loading, can]);

    if (loading || !can('manage users')) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-2xl font-bold leading-tight text-gray-800">
                        Manajemen Pengguna
                    </h2>
                }
            >
                <div className="p-6 text-center text-gray-600">
                    {loading ? "Memuat data pengguna..." : "Anda tidak memiliki izin untuk mengakses halaman ini."}
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-gray-800">
                    Manajemen Pengguna
                </h2>
            }
        >
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-extrabold text-gray-800">Daftar Pengguna</h1>
                    {can('manage users') && (
                        <Link href={route('user.create')}>
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                                + Tambah Pengguna
                            </Button>
                        </Link>
                    )}
                </div>

                <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
                    <Table>
                        {/* --- Tambahkan background pada TableHeader --- */}
                        <TableHeader className="bg-blue-50">
                            <TableRow>
                                <TableHead className="px-8 py-4 text-center text-blue-700 font-bold">#</TableHead>
                                <TableHead className="px-8 py-4 text-center text-blue-700 font-bold">Nama Lengkap</TableHead>
                                <TableHead className="px-8 py-4 text-center text-blue-700 font-bold">Username</TableHead>
                                <TableHead className="px-8 py-4 text-center text-blue-700 font-bold">Email</TableHead>
                                <TableHead className="px-8 py-4 text-center text-blue-700 font-bold">Peran</TableHead>
                                <TableHead className="px-8 py-4 text-center text-blue-700 font-bold">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center text-gray-500 py-6">
                                        Tidak ada data pengguna yang tersedia.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.map((u, i) => (
                                    <TableRow key={u.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <TableCell className="px-8 py-4 text-center font-medium">{i + 1}</TableCell>
                                        <TableCell className="px-8 py-4 text-center">{u.name}</TableCell>
                                        <TableCell className="px-8 py-4 text-center">{u.username}</TableCell>
                                        <TableCell className="px-8 py-4 text-center">{u.email}</TableCell>
                                        <TableCell className="px-8 py-4 text-center">
                                            {u.roles && u.roles.length > 0 ? (
                                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    u.roles[0].name === 'admin' ? 'bg-red-100 text-red-800' :
                                                    u.roles[0].name === 'project_manager' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-green-100 text-green-800'
                                                }`}>
                                                    {u.roles[0].name.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                </span>
                                            ) : (
                                                <span className="text-gray-500">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="px-8 py-4 text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                {can('manage users') && (
                                                    <Link href={route('user.edit', { id: u.id })}>
                                                        <Button variant="secondary" size="sm">Edit</Button>
                                                    </Link>
                                                )}
                                                {can('manage users') && (
                                                    <DialogDeleteUser userId={u.id}>
                                                        <Button variant="destructive" size="sm">Hapus</Button>
                                                    </DialogDeleteUser>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}