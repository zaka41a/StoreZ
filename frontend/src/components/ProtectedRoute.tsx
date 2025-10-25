import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import type { Role } from '@/types/models'

export default function ProtectedRoute({ roles, children }: { roles: Role[]; children: React.ReactElement }) {
  const { isAuthenticated, role } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (role && roles.includes(role)) return children
  return <div className="container mx-auto p-8"><div className="card p-8">403 — You do not have access.</div></div>
}
