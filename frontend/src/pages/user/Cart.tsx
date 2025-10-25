import { useCart } from '@/contexts/CartContext'
import { formatMoney } from '@/utils/format'
import { Link } from 'react-router-dom'

export default function Cart() {
  const { items, removeItem, updateQty, total } = useCart()
  return (
    <div className="space-y-4">
      <div className="card p-4">
        {items.length === 0 ? <div>Your cart is empty.</div> : items.map(i => (
          <div key={i.productId} className="flex items-center gap-3 border-t first:border-0 py-3">
            <img src={i.image} className="h-14 w-14 rounded object-cover" />
            <div className="grow">
              <div className="font-medium">{i.name}</div>
              <div className="text-sm text-gray-600">{formatMoney(i.price)}</div>
            </div>
            <input type="number" className="input w-20" value={i.qty} min={1} onChange={e=>updateQty(i.productId, Number(e.target.value))} />
            <button className="btn" onClick={()=>removeItem(i.productId)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="card p-4 flex items-center justify-between">
        <div className="font-semibold">Total: {formatMoney(total)}</div>
        <Link to="/user/checkout" className="btn btn-primary">Checkout</Link>
      </div>
    </div>
  )
}
