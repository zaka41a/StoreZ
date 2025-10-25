import { useEffect, useState } from 'react'
import { api } from '@/services/api'

export default function AdminUsers() {
  const [rows, setRows] = useState<any[]>([])
  const load = () => api.get('/admin/users').then(r => setRows(r.data))
  useEffect(load, [])
  return (
    <div className="card p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="text-left"><th className="py-2">Name</th><th>Email</th><th>Role</th><th>Status</th><th></th></tr></thead>
        <tbody>
          {rows.map(u => (
            <tr key={u.id} className="border-t">
              <td className="py-2">{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.status}</td>
              <td><button className="btn btn-secondary" onClick={async ()=>{ await api.patch(`/admin/users/${u.id}/toggle`); load() }}>Toggle</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
