// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { Role } from "@/types/models";

export default function ProtectedRoute({
                                           children,
                                           roles,
                                       }: {
    children: JSX.Element;
    roles?: Role[];
}) {
    const { user, loading, isAuthenticated } = useAuth();

    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/login" replace />;

    if (roles && user && !roles.includes(user.role)) {
        // pas le bon rôle → redirige vers la “home” du rôle
        if (user.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
        if (user.role === "SUPPLIER") return <Navigate to="/supplier/dashboard" replace />;
        return <Navigate to="/user/home" replace />;
    }

    return children;
}
