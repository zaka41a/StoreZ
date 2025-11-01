import { formatMoney } from '@/utils/format'
import { getImageUrl } from '@/utils/image'
import type { Product } from '@/types/models'
import { Link } from 'react-router-dom'
import { useCart } from '@/contexts/CartContext'
import { motion } from 'framer-motion'

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  return (
    <motion.div layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="card overflow-hidden">
      <img src={getImageUrl(product.image)} alt={product.name} className="h-40 w-full object-cover" />
      <div className="p-4 space-y-2">
        <Link to={'/product/' + product.id} className="font-medium line-clamp-1">{product.name}</Link>
        <p className="text-sm text-gray-500">{product.supplierName}</p>
        <div className="font-semibold">{formatMoney(product.price)}</div>
        <div className="flex gap-2 pt-2">
          <button className="btn btn-primary" onClick={() => addItem(product)}>Add to Cart</button>
          <Link to={'/product/' + product.id} className="btn btn-secondary">View</Link>
        </div>
      </div>
    </motion.div>
  )
}
