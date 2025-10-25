import { useEffect, useState } from 'react'
import { api } from '@/services/api'

export default function MyProducts() {
  const [rows, setRows] = useState<any[]>([])
  useEffect(()=>{ api.get('/supplier/products').then(r=>setRows(r.data)) },[])
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rows.map(p => (
        <div className="card p-4" key={p.id}>
          <img src={p.image} className="h-32 w-full object-cover rounded-xl" />
          <div className="font-semibold pt-2">{p.name}</div>
          <div className="text-sm text-gray-600">{p.status}</div>
        </div>
      ))}
    </div>
  )
}
