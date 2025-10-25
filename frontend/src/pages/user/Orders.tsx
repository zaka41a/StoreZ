import { useEffect, useState } from 'react'
import { api } from '@/services/api'
import { formatMoney } from '@/utils/format'

export default function UserOrders() {
  const [rows, setRows] = useState<any[]>([])
  useEffect(()=>{ api.get('/orders').then(r=>setRows(r.data)) },[])
  return (
    <div className="card p-4 overflow-x-auto">
      <table className="w-full text-sm">
        <thead><tr className="text-left"><th className="py-2">#</th><th>Date</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          {rows.map(o => (
            <tr key={o.id} className="border-t">
              <td className="py-2">{o.id}</td>
              <td>{new Date(o.createdAt).toLocaleString()}</td>
              <td>{formatMoney(o.total)}</td>
              <td>{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
