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
import { DialogDeleteProject } from '@/Pages/Projects/delete-project'; // <--- PASTIKAN IMPOR INI BENAR
import { DialogDeleteTask } from '@/Pages/Tasks/delete-task';     // <--- PASTIKAN IMPOR INI BENAR
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

interface Task {
    id: number;
    project_id: number;
    title: string;
    description: string | null;
    status: 'To Do' | 'In Progress' | 'Done';
    assigned_to: number | null;
    assignee: {
        id: number;
        name: string;
        username: string;
    } | null;
    created_at: string;
    updated_at: string;
}

interface ProjectShowProps {
    project: Project;
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function ProjectShow({ project: initialProject }: ProjectShowProps) {
    const { can, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const { flash } = usePage().props as ProjectShowProps;

    const [project, setProject] = useState<Project>(initialProject);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [tasksError, setTasksError] = useState<string | null>(null);

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

    const fetchTasks = async () => {
        setLoadingTasks(true);
        setTasksError(null);
        try {
            const response = await axios.get(route('tasks.index', { project: project.id }));
            setTasks(response.data.data);
            console.log("Tasks fetched:", response.data.data);
        } catch (err: any) {
            console.error('Error fetching tasks:', err);
            setTasksError(err.response?.data?.message || 'Gagal mengambil daftar tugas.');
            toast({
                title: 'Error',
                description: err.response?.data?.message || 'Gagal mengambil daftar tugas.',
                variant: 'destructive',
            });
        } finally {
            setLoadingTasks(false);
        }
    };

    useEffect(() => {
        if (!authLoading && can('view task')) {
            fetchTasks();
        }
    }, [authLoading, can, project.id]);

    if (!authLoading && !can('view task')) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Detail Proyek: {project.name}
                    </h2>
                }
            >
                <div className="py-12 text-center text-red-600">
                    Anda tidak memiliki izin untuk melihat tugas di proyek ini.
                </div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Detail Proyek: {project.name}
                </h2>
            }
        >
            <Head title={`Proyek: ${project.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Bagian Detail Proyek */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">Detail Proyek</h3>
                        <p className="mb-2"><span className="font-semibold">Nama:</span> {project.name}</p>
                        <p className="mb-2"><span className="font-semibold">Deskripsi:</span> {project.description || '-'}</p>
                        <p className="mb-2">
                            <span className="font-semibold">Status:</span>
                            <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                project.status === 'to-do' ? 'bg-yellow-100 text-yellow-800' :
                                project.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                project.status === 'completed' ? 'bg-green-100 text-green-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                                {project.status.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                            </span>
                        </p>
                        <p className="mb-2"><span className="font-semibold">Jatuh Tempo:</span> {project.due_date ? new Date(project.due_date).toLocaleDateString() : '-'}</p>
                        <p className="mb-2"><span className="font-semibold">Dibuat Oleh:</span> {project.creator?.name || 'N/A'}</p>
                        <div className="mt-4 flex space-x-2">
                            {can('update project') && (
                                <Link href={route('projects.edit', { project: project.id })}>
                                    <Button variant="outline" size="sm">Edit Proyek</Button>
                                </Link>
                            )}
                            {can('delete project') && (
                                <DialogDeleteProject projectId={project.id} onDeleted={() => router.visit(route('projects.index'))}>
                                    <Button variant="destructive" size="sm">Hapus Proyek</Button>
                                </DialogDeleteProject>
                            )}
                        </div>
                    </div>

                    {/* Bagian Daftar Tugas */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800">Tugas Proyek</h3>
                            {can('create task') && (
                                <Link href={route('tasks.create', { project: project.id })}>
                                    <Button>+ Tambah Tugas</Button>
                                </Link>
                            )}
                        </div>

                        {loadingTasks && <p className="text-center text-gray-600">Memuat tugas...</p>}
                        {tasksError && <p className="text-center text-red-600">{tasksError}</p>}
                        {!loadingTasks && !tasksError && tasks.length === 0 && (
                            <p className="text-center text-gray-500">Tidak ada tugas untuk proyek ini.</p>
                        )}

                        {!loadingTasks && !tasksError && tasks.length > 0 && (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Judul Tugas</TableHead>
                                            <TableHead>Deskripsi</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Ditugaskan Ke</TableHead>
                                            <TableHead>Aksi</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {tasks.map((task) => (
                                            <TableRow key={task.id}>
                                                <TableCell className="font-medium">{task.title}</TableCell>
                                                <TableCell>{task.description || '-'}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        task.status === 'To Do' ? 'bg-yellow-100 text-yellow-800' :
                                                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                        {task.status}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{task.assignee?.name || 'Belum Ditugaskan'}</TableCell>
                                                <TableCell>
                                                    <div className="flex space-x-2">
                                                        {can('update task') && (
                                                            <Link href={route('tasks.edit', { project: project.id, task: task.id })}>
                                                                <Button variant="secondary" size="sm">Edit</Button>
                                                            </Link>
                                                        )}
                                                        {can('delete task') && (
                                                            <DialogDeleteTask projectId={project.id} taskId={task.id} onDeleted={fetchTasks}>
                                                                <Button variant="destructive" size="sm">Hapus</Button>
                                                            </DialogDeleteTask>
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