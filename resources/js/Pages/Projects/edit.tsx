import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea'; // Pastikan Anda sudah menginstal Textarea dari shadcn/ui
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select'; // Import komponen Select dari shadcn/ui

interface ProjectData {
    id: number;
    name: string;
    description: string | null;
    status: string;
    due_date: string | null;
    created_by: number;
    creator: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface EditProjectProps {
    project: ProjectData;
}

export default function EditProject({ project: initialProject }: EditProjectProps) {
    const { toast } = useToast();
    const [form, setForm] = useState({
        name: initialProject.name,
        description: initialProject.description || '',
        status: initialProject.status,
        due_date: initialProject.due_date ? new Date(initialProject.due_date).toISOString().split('T')[0] : '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Handler untuk input teks dan tanggal
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.id]: e.target.value });
    };

    // Handler khusus untuk Select Shadcn
    const handleStatusChange = (value: string) => {
        setForm({ ...form, status: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const res = await fetch(route('projects.update', { project: initialProject.id }), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
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
                    throw new Error(data.message || 'Gagal memperbarui proyek');
                }
            } else {
                toast({
                    title: 'Berhasil',
                    description: 'Proyek berhasil diperbarui!',
                });
                router.visit(route('projects.index'));
            }
        } catch (err: any) {
            console.error('Error updating project:', err);
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
                    Edit Proyek: {initialProject.name}
                </h2>
            }
        >
            <Head title={`Edit Proyek: ${initialProject.name}`} />

            <div className="py-10">
                {/* Form diperbesar sedikit: max-w-2xl, styling card lebih premium */}
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 md:p-10 rounded-xl shadow-xl border border-gray-100">
                    {/* Judul form lebih besar dan rata tengah */}
                    <h2 className="text-3xl font-extrabold mb-8 text-gray-900 text-center">Edit Proyek</h2>

                    <form onSubmit={handleSubmit} className="space-y-6"> {/* Spasi antar field lebih besar */}
                        <div>
                            <Label htmlFor="name" className="mb-2">Nama Proyek</Label>
                            <Input
                                id="name"
                                type="text"
                                value={form.name}
                                onChange={handleChange}
                                required
                                placeholder="Masukkan nama proyek"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <Label htmlFor="description" className="mb-2">Deskripsi</Label>
                            <Textarea
                                id="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Jelaskan detail proyek..."
                            />
                            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <Label htmlFor="status" className="mb-2">Status</Label>
                            {/* Menggunakan Shadcn Select */}
                            <Select onValueChange={handleStatusChange} value={form.status}>
                                <SelectTrigger id="status" className="w-full">
                                    <SelectValue placeholder="Pilih Status Proyek" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="to-do">To Do</SelectItem>
                                    <SelectItem value="in-progress">In Progress</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                    <SelectItem value="canceled">Canceled</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status}</p>}
                        </div>

                        <div>
                            <Label htmlFor="due_date" className="mb-2">Tanggal Jatuh Tempo</Label>
                            <Input
                                id="due_date"
                                type="date"
                                value={form.due_date}
                                onChange={handleChange}
                                placeholder="Pilih tanggal"
                            />
                            {errors.due_date && <p className="text-red-500 text-sm mt-1">{errors.due_date}</p>}
                        </div>

                        <div className="flex justify-end gap-3 pt-4"> {/* Padding atas lebih besar */}
                            {/* Tombol Batal sekarang berwarna biru */}
                            <Button
                                type="button"
                                className="bg-blue-500 text-white hover:bg-blue-600 shadow-md"
                                onClick={() => router.visit(route('projects.index'))}
                            >
                                Batal
                            </Button>
                            {/* Tombol Perbarui Proyek tetap berwarna biru */}
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Memperbarui...' : 'Perbarui Proyek'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}