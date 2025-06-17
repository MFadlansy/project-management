import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/Components/ui/alert-dialog';
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';

interface Props {
    projectId: number;
    taskId: number;
    children: React.ReactNode;
    onDeleted: () => void;
}

export function DialogDeleteTask({ projectId, taskId, children, onDeleted }: Props) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleDelete = () => {
        router.delete(route('tasks.destroy', { project: projectId, task: taskId }), {
            onSuccess: () => {
                setOpen(false);
                toast({ title: 'Berhasil', description: 'Tugas berhasil dihapus.', variant: 'default' });
                onDeleted();
            },
            onError: (errors) => {
                console.error('Error deleting task:', errors);
                toast({ title: 'Error', description: 'Gagal menghapus tugas.', variant: 'destructive' });
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Tugas?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Aksi ini tidak bisa dibatalkan. Tugas ini akan dihapus permanen.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Hapus</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}