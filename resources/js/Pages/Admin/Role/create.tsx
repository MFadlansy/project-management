import React, { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/Components/ui/button';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';

export default function CreateUser() {
    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: '',
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (value: string) => {
        setForm({ ...form, role: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch('http://localhost:8000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('access_token')}`,
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors) {
                    const firstError = Object.values(data.errors)[0] as string[];
                    throw new Error(firstError[0] || data.message || 'Gagal membuat user');
                }
                throw new Error(data.message || 'Gagal membuat user');
            }

            toast({
                title: 'Berhasil!',
                description: 'Pengguna berhasil ditambahkan.',
                className: 'bg-green-500 text-white',
            });

            router.visit(route('user.index'));

        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || 'Terjadi kesalahan.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-2xl font-bold leading-tight text-gray-800">
                    Tambah User Baru
                </h2>
            }
        >
            <div className="py-8 px-4 sm:px-6 lg:px-8">
                <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto bg-white p-8 md:p-10 rounded-xl shadow-lg border border-gray-200">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Tambah User Baru</h2>
                        <p className="text-gray-600 text-lg md:text-xl">Lengkapi informasi pengguna dengan cermat.</p>
                    </div>

                    {/* Hapus grid untuk membuat semua input kebawah */}
                    {/* Mengatur margin-bottom untuk setiap div input secara individual */}
                    <div className="mb-6">
                        <Label htmlFor="name" className="mb-2">Nama Lengkap</Label>
                        <Input
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Masukkan nama lengkap"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="username" className="mb-2">Username</Label>
                        <Input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Pilih username unik"
                            value={form.username}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="email" className="mb-2">Email</Label>
                        <Input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Masukkan alamat email valid"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <Label htmlFor="password" className="mb-2">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Buat password yang kuat"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-8">
                        <Label htmlFor="role" className="mb-2">Peran</Label>
                        <Select onValueChange={handleRoleChange} value={form.role} required>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Pilih Peran User" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="project_manager">Project Manager</SelectItem>
                                <SelectItem value="team_member">Team Member</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Simpan User'
                        )}
                    </Button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}