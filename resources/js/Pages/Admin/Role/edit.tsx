import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select'; // Asumsi Anda punya komponen select dari shadcn/ui

interface UserData {
    id: number;
    name: string;
    username: string;
    email: string;
    roles: { id: number; name: string }[];
}

interface EditUserProps {
    id: number; // ID pengguna yang akan diedit dari props Inertia
}

export default function EditUser({ id }: EditUserProps) {
    const { toast } = useToast();
    const { auth } = usePage().props; // Ini mungkin akan diakses oleh komponen lain, tapi tidak langsung di sini
    const initialUser: UserData | null = usePage().props.user as UserData | null; // Jika user dikirim sebagai props (jarang untuk edit)

    const [form, setForm] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'team_member',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch user data from API
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Jika user tidak dikirim sebagai props dari Inertia, lakukan fetch data user berdasarkan ID
                // Ini penting untuk memastikan data terisi saat pertama kali halaman edit dibuka
                const tokenFromLocalStorage = localStorage.getItem('access_token');
                console.log('Token read from localStorage in EditUser:', tokenFromLocalStorage); // Untuk debugging

                const response = await fetch(`/api/users/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${tokenFromLocalStorage}` // <--- PASTIKAN INI MENGGUNAKAN 'access_token'
                    }
                });
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ message: 'Gagal memparsing error response.' }));
                    throw new Error(errorData.message || `Gagal mengambil data pengguna. Status: ${response.status}`);
                }
                const userData = await response.json();
                setForm({
                    name: userData.name,
                    username: userData.username,
                    email: userData.email,
                    password: '', // Password tidak diisi otomatis untuk keamanan
                    password_confirmation: '',
                    role: userData.roles && userData.roles.length > 0 ? userData.roles[0].name : 'team_member',
                });
            } catch (err: any) {
                console.error('Error fetching user data:', err);
                setError(err.message || 'Terjadi kesalahan saat memuat data pengguna.');
                toast({
                    title: 'Error',
                    description: err.message || 'Gagal memuat data pengguna.',
                    variant: 'destructive',
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUserData();
        }
    }, [id, toast]); // initialUser dihapus dari dependensi jika tidak dipakai untuk inisialisasi form

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true); // Mulai loading saat submit

        const dataToSend: any = { ...form };
        // Hapus password jika kosong agar tidak diupdate di backend
        if (!dataToSend.password) {
            delete dataToSend.password;
            delete dataToSend.password_confirmation;
        }

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'PUT', // Menggunakan metode PUT untuk update
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`, // <--- PASTIKAN INI MENGGUNAKAN 'access_token'
                },
                body: JSON.stringify(dataToSend),
            });

            const data = await res.json();

            if (!res.ok) {
                // Jika ada errors validasi dari Laravel (status 422), tampilkan
                if (res.status === 422 && data.errors) {
                    const validationErrors = Object.values(data.errors).flat().join('\n');
                    throw new Error(validationErrors);
                }
                throw new Error(data.message || 'Gagal memperbarui user');
            }

            toast({
                title: 'Berhasil',
                description: 'User berhasil diperbarui!',
            });

            router.visit(route('user.index')); // Kembali ke daftar user
        } catch (err: any) {
            toast({
                title: 'Error',
                description: err.message || 'Terjadi kesalahan.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false); // Selesai loading
        }
    };

    if (loading) {
        return (
            <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Pengguna</h2>}>
                <div className="py-12 text-center text-gray-600">Memuat data pengguna...</div>
            </AuthenticatedLayout>
        );
    }

    if (error) {
        return (
            <AuthenticatedLayout header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Pengguna</h2>}>
                <div className="py-12 text-center text-red-600">{error}</div>
            </AuthenticatedLayout>
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Pengguna
                </h2>
            }
        >
            <Head title="Edit Pengguna" />

            <div className="py-12">
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Pengguna</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input
                                id="name"
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                type="text"
                                value={form.username}
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>

                        <div>
                            <Label htmlFor="password">Password (Biarkan kosong jika tidak ingin mengubah)</Label>
                            <Input
                                id="password"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="******"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password_confirmation">Konfirmasi Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={form.password_confirmation}
                                onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                                placeholder="******"
                            />
                        </div>

                        <div>
                            <Label htmlFor="role">Peran</Label>
                            {/* Jika Anda menggunakan Shadcn Select, pastikan komponennya sudah ada */}
                            <Select
                                value={form.role}
                                onValueChange={(value: string) => setForm({ ...form, role: value })}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Pilih Peran" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="project_manager">Project Manager</SelectItem>
                                    <SelectItem value="team_member">Team Member</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <Button type="button" variant="outline" onClick={() => router.visit(route('user.index'))}>
                                Batal
                            </Button>
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Memperbarui...' : 'Perbarui Pengguna'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}