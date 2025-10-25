import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '@/services/api'
import { formatMoney } from '@/utils/format'
import { useCart } from '@/contexts/CartContext'

export default function ProductDetails() {
  const { id } = useParams()
  const [p, setP] = useState<any>()
  const { addItem } = useCart()

  useEffect(() => { api.get('/products/' + id).then(r => setP(r.data)) }, [id])
  if (!p) return <div className="card p-8">Loading...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <img src={p.image} alt={p.name} className="w-full rounded-xl object-cover" />
      <div className="card p-6 space-y-3">
        <h1 className="text-2xl font-semibold">{p.name}</h1>
        <div className="text-gray-600">by {p.supplierName}</div>
        <div className="text-2xl font-bold">{formatMoney(p.price)}</div>
        <p>{p.description}</p>
        <div className="flex gap-2 pt-2">
          <button className="btn btn-primary" onClick={()=>addItem(p)}>Add to Cart</button>
        </div>
      </div>
    </div>
  )
}
