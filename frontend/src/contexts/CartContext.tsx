import { createContext, useContext, useMemo, useState, useEffect } from 'react'
import type { Product } from '@/types/models'

type CartItem = { productId: string; name: string; price: number; qty: number; image: string; supplierId: string }
type CartState = {
  items: CartItem[]
  addItem: (p: Product) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, qty: number) => void
  clear: () => void
  total: number
}

const CartCtx = createContext<CartState | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const raw = localStorage.getItem('storez_cart')
    return raw ? JSON.parse(raw) : []
  })

  useEffect(() => {
    localStorage.setItem('storez_cart', JSON.stringify(items))
  }, [items])

  const addItem = (p: Product) => {
    setItems(prev => {
      const found = prev.find(i => i.productId === p.id)
      if (found) return prev.map(i => i.productId === p.id ? { ...i, qty: i.qty + 1 } : i)
      return [...prev, { productId: p.id, name: p.name, price: p.price, qty: 1, image: p.image, supplierId: p.supplierId }]
    })
  }
  const removeItem = (productId: string) => setItems(prev => prev.filter(i => i.productId !== productId))
  const updateQty = (productId: string, qty: number) => setItems(prev => prev.map(i => i.productId === productId ? { ...i, qty } : i))
  const clear = () => setItems([])
  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items])

  return <CartCtx.Provider value={{ items, addItem, removeItem, updateQty, clear, total }}>{children}</CartCtx.Provider>
}

export const useCart = () => {
  const ctx = useContext(CartCtx)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
