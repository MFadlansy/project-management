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

interface Props {
  userId: number;
  children: React.ReactNode;
}

export function DialogDeleteUser({ userId, children }: Props) {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    router.delete(`/api/users/${userId}`, {
      onSuccess: () => setOpen(false),
      onError: () => alert('Gagal menghapus user'),
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
          <AlertDialogDescription>
            Aksi ini tidak bisa dibatalkan. Data pengguna akan dihapus permanen.
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
