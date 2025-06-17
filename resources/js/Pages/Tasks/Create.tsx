import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea'; // Pastikan ini ada
import axios from 'axios';

interface Project {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    username: string;
}

interface CreateTaskProps {
    project: Project; // Proyek dikirim sebagai props dari controller
}

export default function CreateTask({ project }: CreateTaskProps) {
    const { toast } = useToast();
    const [form, setForm] = useState({
        title: '',
        description: '',
        status: 'To Do' as 'To Do' | 'In Progress' | 'Done', // <-- Perbaikan di sini
        assigned_to: '', // ID user yang ditugaskan
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [assignableUsers, setAssignableUsers] = useState<User[]>([]);
    const [fetchingUsers, setFetchingUsers] = useState(true);

    // Fetch assignable users
    useEffect(() => {
        const fetchUsers = async () => {
            setFetchingUsers(true);
            try {
                const response = await axios.get(route('assignable.users'));
                setAssignableUsers(response.data);
            } catch (err) {
                console.error('Error fetching assignable users:', err);
                toast({
                    title: 'Error',
                    description: 'Gagal mengambil daftar pengguna yang bisa ditugaskan.',
                    variant: 'destructive',
                });
            } finally {
                setFetchingUsers(false);
            }
        };
        fetchUsers();
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = await fetch(route('tasks.store', { project: project.id }), { // URL API POST
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // Pastikan pakai access_token
                },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 422 && data.errors) {
                    setErrors(data.errors);
                    toast({
                        title: 'Validasi Gagal',
                        description: 'Periksa kembali input Anda.',
                        variant: 'destructive',
                    });
                } else {
                    throw new Error(data.message || 'Gagal membuat tugas');
                }
            } else {
                toast({
                    title: 'Berhasil',
                    description: 'Tugas berhasil ditambahkan!',
                });
                router.visit(route('projects.show', { project: project.id })); // Kembali ke detail proyek
            }
        } catch (err: any) {
            console.error('Error creating task:', err);
            toast({
                title: 'Error',
                description: err.message || 'Terjadi kesalahan.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Tambah Tugas untuk Proyek: {project.name}
                </h2>
            }
        >
            <Head title={`Tambah Tugas - ${project.name}`} />

            <div className="py-12">
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Buat Tugas Baru</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="title">Judul Tugas</Label>
                            <Input
                                id="title"
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                required
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                        </div>

                        <div>
                            <Label htmlFor="description">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={form.description}
                                onChange={(e) => setForm({ ...form, description: e.target.value })}
                                rows={4}
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                value={form.status}
                                onChange={(e) => setForm({ ...form, status: e.target.value as 'To Do' | 'In Progress' | 'Done' })} // <-- Perbaikan di sini
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="To Do">To Do</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Done">Done</option>
                            </select>
                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                        </div>

                        <div>
                            <Label htmlFor="assigned_to">Ditugaskan Ke</Label>
                            {fetchingUsers ? (
                                <p className="text-gray-500">Memuat pengguna...</p>
                            ) : (
                                <select
                                    id="assigned_to"
                                    value={form.assigned_to}
                                    onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                >
                                    <option value="">-- Pilih Pengguna --</option>
                                    {assignableUsers.map(user => (
                                        <option key={user.id} value={user.id}>{user.name} ({user.username})</option>
                                    ))}
                                </select>
                            )}
                            {errors.assigned_to && <p className="text-red-500 text-sm mt-1">{errors.assigned_to}</p>}
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button type="button" variant="outline" onClick={() => router.visit(route('projects.show', { project: project.id }))}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Menyimpan...' : 'Simpan Tugas'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}