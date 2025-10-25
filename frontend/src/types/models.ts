export type Role = 'ADMIN' | 'SUPPLIER' | 'USER'
export type User = { id: string; name: string; email: string; role: Role; status: 'ACTIVE' | 'INACTIVE'; createdAt: string }
export type Supplier = { id: string; companyName: string; email: string; description: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'; createdAt: string }
export type Product = { id: string; name: string; description: string; price: number; category: string; image: string; supplierId: string; supplierName: string; status: 'PENDING' | 'APPROVED' | 'REJECTED'; rating: number; ratingCount: number }
export type OrderItem = { productId: string; name: string; price: number; qty: number; supplierId: string }
export type Order = { id: string; userId: string; items: OrderItem[]; total: number; status: 'PENDING_APPROVAL' | 'APPROVED' | 'CANCELLED' | 'FULFILLED'; createdAt: string }
export type Comment = { id: string; productId: string; userId: string; userName: string; rating: number; text: string; createdAt: string }
