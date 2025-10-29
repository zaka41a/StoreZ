import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import type { Role } from "@/types/models";

interface User {
    id: number;
    email: string;
    role: Role; // "ADMIN" | "SUPPLIER" | "USER"
    name?: string;
    companyName?: string;
}

interface AuthContextType {
    user: User | null;
    role?: Role;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    registerUser: (data: any) => Promise<void>;
    registerSupplier: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    api.defaults.withCredentials = true;

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await api.get("/auth/me");
                if (res.data?.id) setUser(res.data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await api.post("/auth/login", { email, password });
        setUser(data);

        if (data.role === "ADMIN") navigate("/admin/dashboard", { replace: true });
        else if (data.role === "SUPPLIER") navigate("/supplier/dashboard", { replace: true });
        else navigate("/user/home", { replace: true });
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch {}
        setUser(null);
        navigate("/", { replace: true });
    };

    const registerUser = async (data: any) => {
        await api.post("/auth/register-user", data);
    };

    const registerSupplier = async (data: any) => {
        await api.post("/auth/register-supplier", data);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                role: user?.role,
                loading,
                isAuthenticated: !!user,
                login,
                logout,
                registerUser,
                registerSupplier,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
    return ctx;
}
