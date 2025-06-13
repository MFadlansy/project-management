import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { router } from '@inertiajs/react';

interface User {
    id: number;
    name: string;
    email: string;
    username: string;
    roles: string[];
    permissions: string[];
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (accessToken: string, userData: User) => void;
    logout: () => void;
    hasRole: (roleName: string) => boolean;
    can: (permissionName: string) => boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('access_token');

        if (storedUser && storedToken) {
            try {
                const parsedUser: User = JSON.parse(storedUser);
                setUser(parsedUser);
                setToken(storedToken);
                axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            } catch (e) {
                console.error("AuthContext init error (invalid stored data):", e);
                clearAuthData();
            }
        }
        setLoading(false);
    }, []);

    const clearAuthData = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const login = (accessToken: string, userData: User) => {
        localStorage.setItem('access_token', accessToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(accessToken);
        setUser(userData);
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    };

    const logout = async () => {
        try {
            if (token) {
                 await axios.post('http://localhost:8000/api/auth/logout', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                 });
            }
        } catch (e) {
            console.error("Logout API error (might be token already expired):", e);
        } finally {
            clearAuthData();
            router.visit('/login');
        }
    };

    const hasRole = (roleName: string): boolean => {
        return user?.roles?.includes(roleName) || false;
    };

    const can = (permissionName: string): boolean => {
        return user?.permissions?.includes(permissionName) || false;
    };

    const contextValue: AuthContextType = { user, token, loading, login, logout, hasRole, can };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

// --- 4. Custom Hook `useAuth` ---
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};