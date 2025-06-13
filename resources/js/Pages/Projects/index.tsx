import React, { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/Components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { DialogDeleteProject } from './delete-project';
import axios from 'axios';

interface Project {
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

interface ProjectsIndexProps {
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function ProjectIndex() {
    const { can, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { flash } = usePage().props as ProjectsIndexProps;

    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.success) {
            toast({
                title: 'Berhasil',
                description: flash.success,
                variant: 'default',
            });
        }
        if (flash?.error) {
            toast({
                title: 'Error',
                description: flash.error,
                variant: 'destructive',
            });
        }
    }, [flash, toast]);

    const fetchProjects = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/api/projects');
            setProjects(response.data.data);
            console.log("Projects fetched:", response.data.data);
        } catch (err: any) {
            console.error('Error fetching projects:', err);
            setError(err.response?.data?.message || 'Gagal mengambil daftar proyek.');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal mengambil daftar proyek.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && can('view project')) {
            fetchProjects();
        }
    }, [authLoading, can]);

    if (!authLoading && !can('view project')) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Daftar Proyek
                    </h2>
                }
            >
                <div className="py-12 text-center text-red-600">
                    Anda tidak memiliki izin untuk melihat halaman ini.
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Daftar Proyek
                </h2>
            }
        >
            <Head title="Proyek" />

            {/* Kontainer Utama Halaman, mirip dengan UserIndex */}
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    {/* Judul Halaman */}
                    <h1 className="text-3xl font-extrabold text-gray-800">Daftar Proyek</h1>
                    {can('create project') && (
                        <Link href={route('projects.create')}>
                            {/* Tombol Tambah Proyek dengan styling konsisten */}
                            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                                + Tambah Proyek
                            </Button>
                        </Link>
                    )}
                </div>

                {loading && <p className="text-center text-gray-600">Memuat proyek...</p>}
                {error && <p className="text-center text-red-600">{error}</p>}
                {!loading && !error && projects.length === 0 && (
                    <p className="text-center text-gray-500">Tidak ada proyek yang tersedia.</p>
                )}

                {/* Tabel Proyek, mirip dengan UserIndex */}
                {!loading && !error && projects.length > 0 && (
                    <div className="overflow-x-auto bg-white rounded-lg shadow-lg border border-gray-200">
                        <Table>
                            {/* Header Tabel dengan background dan warna */}
                            <TableHeader className="bg-blue-50">
                                <TableRow>
                                    <TableHead className="px-8 py-4 text-center text-blue-700 font-bold">Nama Proyek</TableHead>
                                    <TableHead className="px-8 py-4 text-center text-blue-700 font-bold">Deskripsi</TableHead>
                                    <TableHead className="px-8 py-4 text-center text-blue-700 font-bold">Status</TableHead>
                                    <TableHead className="px-8 py-4 text-center text-blue-700 font-bold">Jatuh Tempo</TableHead>
                                    <TableHead className="px-8 py-4 text-center text-blue-700 font-bold">Dibuat Oleh</TableHead>
                                    <TableHead className="px-8 py-4 text-center text-blue-700 font-bold">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {projects.map((project) => (
                                    <TableRow key={project.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <TableCell className="px-8 py-4 text-center font-medium">{project.name}</TableCell>
                                        <TableCell className="px-8 py-4 text-center">{project.description || '-'}</TableCell>
                                        <TableCell className="px-8 py-4 text-center">
                                            {/* Status Badge dengan warna berbeda */}
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                project.status === 'to-do' ? 'bg-yellow-100 text-yellow-800' :
                                                project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {project.status.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-8 py-4 text-center">{project.due_date ? new Date(project.due_date).toLocaleDateString() : '-'}</TableCell>
                                        <TableCell className="px-8 py-4 text-center">{project.creator?.name || 'N/A'}</TableCell>
                                        <TableCell className="px-8 py-4 text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                {can('update project') && (
                                                    <Link href={route('projects.edit', { project: project.id })}>
                                                        <Button variant="secondary" size="sm">Edit</Button>
                                                    </Link>
                                                )}
                                                {can('delete project') && (
                                                    <DialogDeleteProject projectId={project.id} onDeleted={fetchProjects}>
                                                        <Button variant="destructive" size="sm">Hapus</Button>
                                                    </DialogDeleteProject>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}