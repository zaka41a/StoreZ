// src/components/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { Role } from '@/types/models'

export default function ProtectedRoute({
                                         roles,
                                         children,
                                       }: { roles: Role[]; children: React.ReactElement }) {
  const { isAuthenticated, role } = useAuth()

  if (!isAuthenticated) return <Navigate to="/login" replace />

  // bon rôle → OK
  if (role && roles.includes(role)) return children

  // connecté mais mauvais rôle → renvoyer vers *son* dashboard
  if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />
  if (role === 'SUPPLIER') return <Navigate to="/supplier/dashboard" replace />
  return <Navigate to="/user/home" replace />
}
