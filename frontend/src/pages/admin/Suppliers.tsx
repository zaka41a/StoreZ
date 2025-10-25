import { useEffect, useState } from 'react'
import { api } from '@/services/api'

export default function AdminSuppliers() {
  const [rows, setRows] = useState<any[]>([])
  useEffect(()=>{ api.get('/admin/suppliers').then(r=>setRows(r.data)) },[])
  return (
    <div className="card p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="text-left"><th className="py-2">Company</th><th>Email</th><th>Status</th></tr></thead>
        <tbody>
          {rows.map(s => (
            <tr key={s.id} className="border-t">
              <td className="py-2">{s.companyName}</td>
              <td>{s.email}</td>
              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
