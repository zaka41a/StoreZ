// src/components/PublicOnly.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function PublicOnly({ children }: { children: JSX.Element }) {
    const { isAuthenticated, role } = useAuth()

    // non connecté → OK (pages publiques)
    if (!isAuthenticated) return children

    // user connecté → peut voir le public
    if (role === 'USER') return children

    // admin/supplier → jamais les pages publiques
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />
    if (role === 'SUPPLIER') return <Navigate to="/supplier/dashboard" replace />
    return children
}
