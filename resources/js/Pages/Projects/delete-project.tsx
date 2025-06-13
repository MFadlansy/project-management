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
import { useToast } from '@/hooks/use-toast'; // Impor useToast

interface Props {
    projectId: number;
    children: React.ReactNode;
    onDeleted: () => void; // Callback untuk refresh daftar proyek setelah berhasil dihapus
}

export function DialogDeleteProject({ projectId, children, onDeleted }: Props) {
    const [open, setOpen] = useState(false);
    const { toast } = useToast();

    const handleDelete = () => {
        router.delete(route('projects.destroy', { project: projectId }), { // Menggunakan route() helper
            onSuccess: () => {
                setOpen(false);
                toast({ title: 'Berhasil', description: 'Proyek berhasil dihapus.', variant: 'default' });
                onDeleted(); // Panggil callback untuk refresh daftar
            },
            onError: (errors) => {
                console.error('Error deleting project:', errors);
                toast({ title: 'Error', description: 'Gagal menghapus proyek.', variant: 'destructive' });
            },
        });
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Proyek?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Aksi ini tidak bisa dibatalkan. Proyek ini akan dihapus permanen, termasuk semua tugas dan komentar di dalamnya.
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