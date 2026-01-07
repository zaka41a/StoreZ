import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { api, tokenStorage } from "@/services/api";
import type { Role, UserSummary } from "@/types/models";

interface AuthContextType {
    user: UserSummary | null;
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
    const [user, setUser] = useState<UserSummary | null>(null);
    const [token, setToken] = useState<string | null>(() => tokenStorage.get());
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }
            try {
                const res = await api.get<UserSummary>("/auth/me");
                if (res.data?.id) {
                    setUser(res.data);
                }
            } catch {
                tokenStorage.set(null);
                setToken(null);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [token]);

    const handleAuthSuccess = useCallback((payload: { token: string; user: UserSummary }) => {
        tokenStorage.set(payload.token);
        setToken(payload.token);
        setUser(payload.user);
    }, []);

    const login = async (email: string, password: string) => {
        const { data } = await api.post<{ token: string; user: UserSummary }>("/auth/login", { email, password });
        handleAuthSuccess(data);

        if (data.user.role === "ADMIN") navigate("/admin/dashboard", { replace: true });
        else if (data.user.role === "SUPPLIER") navigate("/supplier/dashboard", { replace: true });
        else navigate("/user/home", { replace: true });
    };

    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } catch {
            // ignore
        }
        tokenStorage.set(null);
        setToken(null);
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
