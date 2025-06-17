export interface User {
    id: number;
    name: string;
    email: string;
    username: string; // Tambahkan ini
    roles: string[]; // Tambahkan ini
    permissions: string[]; // Tambahkan ini
    email_verified_at: string | null; // Pastikan ini string | null
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User; // User akan selalu ada karena AuthProvider mengalihkan jika tidak ada
    };
    flash?: { // Tambahkan ini untuk flash messages jika belum ada
        success?: string;
        error?: string;
        message?: string;
    };
};