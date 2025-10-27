// src/AppRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom'

import PublicLayout from '@/layouts/PublicLayout'
import AdminLayout from '@/layouts/AdminLayout'
import SupplierLayout from '@/layouts/SupplierLayout'
import UserLayout from '@/layouts/UserLayout'

import Home from '@/pages/Home'
import Login from '@/pages/Login'
import RegisterUser from '@/pages/RegisterUser'
import RegisterSupplier from '@/pages/RegisterSupplier'
import Register from '@/pages/Register'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Help from '@/pages/Help'
import ProductDetails from '@/pages/ProductDetails'
import TermsPrivacy from '@/pages/TermsPrivacy'

import AdminDashboard from '@/pages/admin/Dashboard'
import AdminUsers from '@/pages/admin/Users'
import AdminSuppliers from '@/pages/admin/Suppliers'
import AdminProducts from '@/pages/admin/Products'
import AdminOrders from '@/pages/admin/Orders'

import SupplierDashboard from '@/pages/supplier/Dashboard'
import SupplierMyProducts from '@/pages/supplier/SupplierMyProducts'
import SupplierOrders from '@/pages/supplier/Orders'
import SupplierEarnings from '@/pages/supplier/Earnings'

import UserHome from '@/pages/user/Home'
import Profile from '@/pages/user/Profile'
import Cart from '@/pages/user/Cart'          // ← public
import Checkout from '@/pages/user/Checkout'  // ← protégé
import UserOrders from '@/pages/user/Orders'

import ProtectedRoute from '@/components/ProtectedRoute'
import PublicOnly from '@/components/PublicOnly'
import { ROLES } from '@/utils/constants'
import { useAuth } from '@/contexts/AuthContext'

function RedirectIfLogged() {
    const { isAuthenticated, role } = useAuth()
    if (!isAuthenticated) return <Login />
    if (role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />
    if (role === 'SUPPLIER') return <Navigate to="/supplier/dashboard" replace />
    return <Navigate to="/user/home" replace />
}

export function AppRouter() {
    return (
        <Routes>
            {/* 🌐 Public — totalement interdit à ADMIN/SUPPLIER connectés */}
            <Route element={<PublicOnly><PublicLayout /></PublicOnly>}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
                <Route path="/terms-privacy" element={<TermsPrivacy />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                {/* Cart = public (localStorage) */}
                <Route path="/user/cart" element={<Cart />} />
                {/* login & register : si déjà connecté → redirection dashboard */}
                <Route path="/login" element={<RedirectIfLogged />} />
                <Route path="/register" element={<RedirectIfLogged />} />
                <Route path="/register-user" element={<RedirectIfLogged />} />
                <Route path="/register-supplier" element={<RedirectIfLogged />} />
            </Route>

            {/* 🛠️ Admin */}
            <Route
                element={
                    <ProtectedRoute roles={[ROLES.ADMIN]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/suppliers" element={<AdminSuppliers />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
            </Route>

            {/* 🧾 Supplier */}
            <Route
                element={
                    <ProtectedRoute roles={[ROLES.SUPPLIER]}>
                        <SupplierLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
                <Route path="/supplier/my-products" element={<SupplierMyProducts />} />
                <Route path="/supplier/orders" element={<SupplierOrders />} />
                <Route path="/supplier/earnings" element={<SupplierEarnings />} />
            </Route>

            {/* 👤 User privé */}
            <Route
                element={
                    <ProtectedRoute roles={[ROLES.USER]}>
                        <UserLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/user/home" element={<UserHome />} />
                <Route path="/user/profile" element={<Profile />} />
                <Route path="/user/checkout" element={<Checkout />} />
                <Route path="/user/orders" element={<UserOrders />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}
