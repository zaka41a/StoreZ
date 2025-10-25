import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { formatMoney } from '@/utils/format'

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>()
  useEffect(()=>{ api.get('/admin/stats').then(r=>setStats(r.data)) },[])
  if (!stats) return <div className="card p-6">Loading...</div>
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="card p-6"><div className="text-sm text-gray-600">Users</div><div className="text-2xl font-semibold">{stats.totalUsers}</div></div>
      <div className="card p-6"><div className="text-sm text-gray-600">Suppliers</div><div className="text-2xl font-semibold">{stats.totalSuppliers}</div></div>
      <div className="card p-6"><div className="text-sm text-gray-600">Total Sales</div><div className="text-2xl font-semibold">{formatMoney(stats.totalSales)}</div></div>
      <div className="card p-6"><div className="text-sm text-gray-600">Pending Approvals</div><div className="text-2xl font-semibold">{stats.pendingApprovals}</div></div>
    </div>
  )
}
