import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "@/api/axios";

interface User {
    id: number;
    email: string;
    role: string;
    name?: string;
}

interface AuthContextType {
    user: User | null;
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

    // ✅ Vérifie la session active au démarrage
    useEffect(() => {
        api
            .get("/auth/me")
            .then((res) => {
                if (res.data && res.data.id) {
                    console.log("Session active:", res.data);
                    setUser(res.data);
                } else {
                    setUser(null);
                }
            })
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        await api.post("/auth/login", { email, password });
        const res = await api.get("/auth/me");
        console.log("User connecté:", res.data);
        setUser(res.data);
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
            console.log("✅ Déconnexion réussie");
        } catch (err) {
            console.error("❌ Erreur logout:", err);
        }
        setUser(null);
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
