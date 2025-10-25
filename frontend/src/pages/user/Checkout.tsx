import { useCart } from '@/contexts/CartContext'
import { api } from '@/services/api'
import { useNavigate } from 'react-router-dom'

export default function Checkout() {
  const { items, clear } = useCart()
  const navigate = useNavigate()
  const place = async () => {
    await api.post('/orders', { items })
    clear()
    navigate('/user/orders')
  }
  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Checkout</h2>
      <button className="btn btn-primary" onClick={place}>Place Order</button>
    </div>
  )
}
