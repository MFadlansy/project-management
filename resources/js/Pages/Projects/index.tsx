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
import { DialogDeleteProject } from '@/Pages/Projects/delete-project'; // Pastikan path ini benar
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
    // Jika Anda ingin mengirimkan data proyek dari controller Laravel secara langsung
    // projects: {
    //     data: Project[];
    //     links: any[]; // Untuk paginasi
    //     meta: any;   // Untuk paginasi
    // };
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

    // Effect to show flash messages
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

    // Jika user tidak memiliki izin
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

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Daftar Proyek</h3>
                            {can('create project') && (
                                <Link href={route('projects.create')}>
                                    <Button>+ Tambah Proyek</Button>
                                </Link>
                            )}
                        </div>

                        {loading && <p className="text-center text-gray-600">Memuat proyek...</p>}
                        {error && <p className="text-center text-red-600">{error}</p>}
                        {!loading && !error && projects.length === 0 && (
                            <p className="text-center text-gray-500">Tidak ada proyek yang tersedia.</p>
                        )}

                        {!loading && !error && projects.length > 0 && (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nama Proyek</TableHead>
                                            <TableHead>Deskripsi</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Jatuh Tempo</TableHead>
                                            <TableHead>Dibuat Oleh</TableHead>
                                            <TableHead>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {projects.map((project) => (
                                            <TableRow key={project.id}>
                                                <TableCell className="font-medium">{project.name}</TableCell>
                                                <TableCell>{project.description || '-'}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        project.status === 'to-do' ? 'bg-yellow-100 text-yellow-800' :
                                                        project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                                        project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {project.status.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{project.due_date ? new Date(project.due_date).toLocaleDateString() : '-'}</TableCell>
                                                <TableCell>{project.creator?.name || 'N/A'}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        {can('view task') && ( // <--- Tambahkan tombol ini
                                                            <Link href={route('projects.show', { project: project.id })}>
                                                                <Button variant="outline" size="sm">Detail</Button>
                                                            </Link>
                                                        )}
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
                </div>
            </div>
        </AuthenticatedLayout>
    );
}