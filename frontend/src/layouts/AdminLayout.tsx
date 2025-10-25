import { NavLink, Outlet } from 'react-router-dom'

export default function AdminLayout() {
  const items = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/users', label: 'Users' },
    { to: '/admin/suppliers', label: 'Suppliers' },
    { to: '/admin/products', label: 'Products' },
    { to: '/admin/orders', label: 'Orders' }
  ]
  return (
    <div className="min-h-screen grid grid-cols-12">
      <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r p-4 space-y-2">
        {items.map(it => (
          <NavLink key={it.to} to={it.to} className={({isActive}) => 'block rounded-xl px-3 py-2 ' + (isActive ? 'bg-brand-50 text-brand-700' : 'hover:bg-gray-50')}>{it.label}</NavLink>
        ))}
      </aside>
      <main className="col-span-12 md:col-span-9 lg:col-span-10 p-6">
        <Outlet />
      </main>
    </div>
  )
}
