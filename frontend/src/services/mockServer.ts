import MockAdapter from 'axios-mock-adapter'
import { api } from './api'
import type { Product, User, Supplier, Order, Comment } from '@/types/models'

const mock = new MockAdapter(api, { delayResponse: 350 })

// Seed
const users: User[] = [
  { id: 'u1', name: 'Admin', email: 'admin@shop.com', role: 'ADMIN', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { id: 'u2', name: 'Supplier', email: 'supplier@shop.com', role: 'SUPPLIER', status: 'ACTIVE', createdAt: new Date().toISOString() },
  { id: 'u3', name: 'Alice', email: 'user@shop.com', role: 'USER', status: 'ACTIVE', createdAt: new Date().toISOString() }
]

const suppliers: Supplier[] = [
  { id: 's1', companyName: 'TechWorld Inc.', email: 'supplier@shop.com', description: 'Electronics and gadgets', status: 'APPROVED', createdAt: new Date().toISOString() },
  { id: 's2', companyName: 'BookVerse', email: 'books@sellers.com', description: 'Books & Stationery', status: 'PENDING', createdAt: new Date().toISOString() },
  { id: 's3', companyName: 'Homey', email: 'home@suppliers.com', description: 'Home & Kitchen', status: 'REJECTED', createdAt: new Date().toISOString() }
]

const products: Product[] = Array.from({ length: 28 }).map((_, i) => ({
  id: 'p' + (i + 1),
  name: ['Wireless Headphones', 'Smart Watch', 'Fiction Book', 'T-shirt', 'Coffee Maker'][i % 5] + ' ' + (i + 1),
  description: 'High-quality item with great reviews.',
  price: Math.round(Math.random() * 200) + 20,
  category: ['Electronics', 'Books', 'Fashion', 'Home'][i % 4],
  image: 'https://picsum.photos/seed/storez' + (i + 5) + '/960/640',
  supplierId: suppliers[0].id,
  supplierName: suppliers[0].companyName,
  status: (i % 4 === 0 ? 'PENDING' : 'APPROVED'),
  rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
  ratingCount: Math.floor(Math.random() * 200) + 1
}))

const orders: Order[] = [
  { id: 'o1', userId: 'u3', items: [{ productId: 'p2', name: products[1].name, price: products[1].price, qty: 1, supplierId: products[1].supplierId }], total: products[1].price, status: 'PENDING_APPROVAL', createdAt: new Date().toISOString() }
]

const comments: Comment[] = []

function paginate(arr: any[], page = 1, limit = 12) {
  const start = (page - 1) * limit
  const end = start + limit
  return { data: arr.slice(start, end), page, total: arr.length, pages: Math.ceil(arr.length / limit) }
}

// Auth
mock.onPost('/auth/login').reply(config => {
  const { email, password } = JSON.parse(config.data)
  const map: Record<string, string> = {
    'admin@shop.com': 'admin123',
    'supplier@shop.com': 'sup123',
    'user@shop.com': 'user123'
  }
  if (!map[email] || map[email] !== password) return [401, { message: 'Invalid credentials' }]
  const user = users.find(u => u.email === email)!
  return [200, { user, role: user.role }]
})

// Public
mock.onGet(/\/products$/).reply(config => {
  const url = new URL((config as any).url!, 'http://x')
  const q = url.searchParams.get('query')?.toLowerCase() || ''
  const category = url.searchParams.get('category')
  const min = parseFloat(url.searchParams.get('min') || '0')
  const max = parseFloat(url.searchParams.get('max') || '1000000')
  const page = parseInt(url.searchParams.get('page') || '1')
  const limit = parseInt(url.searchParams.get('limit') || '12')

  let list = products.filter(p => p.status === 'APPROVED')
  if (q) list = list.filter(p => p.name.toLowerCase().includes(q))
  if (category) list = list.filter(p => p.category === category)
  list = list.filter(p => p.price >= min && p.price <= max)

  return [200, paginate(list, page, limit)]
})

mock.onGet(/\/products\/\w+$/).reply(config => {
  const id = config.url!.split('/').pop()!
  const p = products.find(p => p.id === id)
  if (!p) return [404]
  return [200, p]
})

mock.onGet('/categories').reply(200, ['Electronics', 'Books', 'Fashion', 'Home'])

// User
mock.onPost('/register-user').reply(config => {
  const body = JSON.parse(config.data)
  const newUser: User = { id: 'u' + (users.length + 1), name: body.name, email: body.email, role: 'USER', status: 'ACTIVE', createdAt: new Date().toISOString() }
  users.push(newUser)
  return [201, newUser]
})

mock.onGet('/orders').reply(200, orders)
mock.onPost('/orders').reply(config => {
  const { items } = JSON.parse(config.data)
  const total = items.reduce((s: number, it: any) => s + it.price * it.qty, 0)
  const order: Order = { id: 'o' + (orders.length + 1), userId: 'u3', items, total, status: 'PENDING_APPROVAL', createdAt: new Date().toISOString() }
  orders.push(order)
  return [201, order]
})

mock.onPost(/\/products\/\w+\/comments$/).reply(config => {
  const id = config.url!.split('/')[2]
  const body = JSON.parse(config.data)
  const c: Comment = { id: 'c' + (comments.length + 1), productId: id, userId: 'u3', userName: 'Alice', rating: Math.max(1, Math.min(5, body.rating)), text: body.text, createdAt: new Date().toISOString() }
  comments.push(c)
  return [201, c]
})

// Supplier
mock.onGet('/supplier/products').reply(200, products.filter(p => p.supplierId === suppliers[0].id))
mock.onPost('/supplier/products').reply(config => {
  const body = JSON.parse(config.data)
  const p: Product = { id: 'p' + (products.length + 1), name: body.name, description: body.description, price: body.price, category: body.category, image: body.image || 'https://picsum.photos/seed/new/960/640', supplierId: suppliers[0].id, supplierName: suppliers[0].companyName, status: 'PENDING', rating: 0, ratingCount: 0 }
  products.push(p)
  return [201, p]
})

// Admin
mock.onGet('/admin/users').reply(200, users)
mock.onPatch(/\/admin\/users\/\w+\/toggle$/).reply(config => {
  const id = config.url!.split('/')[3]
  const u = users.find(u => u.id === id)!
  u.status = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
  return [200, u]
})
mock.onGet(/\/admin\/suppliers.*/).reply(200, suppliers)
mock.onGet(/\/admin\/products.*/).reply(200, products)
mock.onGet('/admin/orders').reply(200, orders)
mock.onGet('/admin/stats').reply(200, {
  totalUsers: users.length,
  totalSuppliers: suppliers.filter(s => s.status === 'APPROVED').length,
  totalSales: orders.reduce((s, o) => s + (o.status !== 'CANCELLED' ? o.total : 0), 0),
  pendingApprovals: products.filter(p => p.status === 'PENDING').length
})

export default mock
