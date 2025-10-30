import { Routes, Route, Navigate } from "react-router-dom";

// 🧭 Layouts
import PublicLayout from "@/layouts/PublicLayout";
import AdminLayout from "@/layouts/AdminLayout";
import SupplierLayout from "@/layouts/SupplierLayout";
import UserLayout from "@/layouts/UserLayout";

// 🌐 Pages publiques
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import RegisterUser from "@/pages/RegisterUser";
import RegisterSupplier from "@/pages/RegisterSupplier";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Help from "@/pages/Help";
import ProductDetails from "@/pages/ProductDetails";
import TermsPrivacy from "@/pages/TermsPrivacy";

// 🛠️ Admin Pages
import Dashboard from "@/pages/admin/Dashboard";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminUsers from "@/pages/admin/Users";
import AdminSuppliers from "@/pages/admin/Suppliers";
import AdminProducts from "@/pages/admin/Products";
import AdminOrders from "@/pages/admin/Orders";

// 🧾 Supplier Pages
import SupplierDashboard from "@/pages/supplier/SupplierDashboard";
import MyProducts from "@/pages/supplier/MyProducts";
import Orders from "@/pages/supplier/Orders";
import Earnings from "@/pages/supplier/Earnings";
import AddProduct from "@/pages/supplier/AddProduct";

// 👤 User Pages
import UserHome from "@/pages/user/Home";
import Cart from "@/pages/user/Cart";
import Checkout from "@/pages/user/Checkout";
import UserOrders from "@/pages/user/Orders";

// 🔐 Protected routes + constants
import ProtectedRoute from "@/components/ProtectedRoute";
import { ROLES } from "@/utils/constants";
import PublicOnly from "@/components/PublicOnly";

export function AppRouter() {
    return (
        <Routes>
            {/* 🌐 Routes publiques */}
            <Route
                element={
                    <PublicOnly>
                        <PublicLayout />
                    </PublicOnly>
                }
            >
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register-user" element={<RegisterUser />} />
                <Route path="/register-supplier" element={<RegisterSupplier />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
                <Route path="/terms-privacy" element={<TermsPrivacy />} />
                <Route path="/product/:id" element={<ProductDetails />} />
            </Route>

            {/* 🛠️ Admin routes */}
            <Route
                element={
                    <ProtectedRoute roles={[ROLES.ADMIN]}>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/suppliers" element={<AdminSuppliers />} />
                <Route path="/admin/products" element={<AdminProducts />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
            </Route>

            {/* 🧾 Supplier routes */}
            <Route
                element={
                    <ProtectedRoute roles={[ROLES.SUPPLIER]}>
                        <SupplierLayout />
                    </ProtectedRoute>
                }
            >
                {/* ✅ chemins propres et stables en minuscules */}
                <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
                <Route path="/supplier/my-products" element={<MyProducts />} />
                <Route path="/supplier/orders" element={<Orders />} />
                <Route path="/supplier/earnings" element={<Earnings />} />
                <Route path="/supplier/add-product" element={<AddProduct />} />
            </Route>

            {/* 👤 User routes (inchangées) */}

            {/* 👤 User routes */}
            <Route
                element={
                    <ProtectedRoute roles={[ROLES.USER]}>
                        <UserLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/user/home" element={<UserHome />} />
                <Route path="/user/cart" element={<Cart />} />
                <Route path="/user/checkout" element={<Checkout />} />
                <Route path="/user/orders" element={<UserOrders />} />
            </Route>

            {/* 🚧 Fallback 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
