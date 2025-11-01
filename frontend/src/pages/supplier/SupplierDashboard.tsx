import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";
import {
    Package,
    ShoppingCart,
    DollarSign,
    Clock,
    TrendingUp,
    ArrowRight,
    Plus,
    Eye,
    BarChart3,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function SupplierDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [supplierStatus, setSupplierStatus] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api
            .get("/supplier/profile", { withCredentials: true })
            .then((profileRes) => {
                setSupplierStatus(profileRes.data.status);

                if (profileRes.data.status === "APPROVED") {
                    return api.get("/supplier/stats", { withCredentials: true });
                } else {
                    setLoading(false);
                    return Promise.reject({ skipStats: true });
                }
            })
            .then((statsRes) => {
                if (statsRes) {
                    setStats(statsRes.data);
                }
            })
            .catch((err) => {
                if (!err.skipStats) {
                    setStats({
                        totalProducts: 0,
                        totalOrders: 0,
                        totalEarnings: 0,
                        pendingProducts: 0,
                        recentOrders: [],
                    });
                }
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-700 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (supplierStatus !== "APPROVED") {
        return <PendingApprovalPage status={supplierStatus} />;
    }

    return (
        <div className="space-y-8">
            {/* Hero Section with Gradient */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900 p-8 text-white shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
                            <p className="text-brand-100 text-lg">
                                Here's what's happening with your store today
                            </p>
                        </div>
                        <Link
                            to="/supplier/add-product"
                            className="bg-white text-brand-700 px-6 py-3 rounded-xl font-semibold hover:bg-brand-50 transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                        >
                            <Plus className="w-5 h-5" />
                            Add Product
                        </Link>
                    </div>

                    {/* Mini Stats in Hero */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <TrendingUp className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-brand-100">Total Revenue</p>
                                    <p className="text-2xl font-bold">{formatMoney(stats.totalEarnings)}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <ShoppingCart className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-brand-100">Orders</p>
                                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <Package className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm text-brand-100">Products</p>
                                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <StatsCard
                        title="My Products"
                        value={stats.totalProducts}
                        icon={<Package className="w-8 h-8" />}
                        color="blue"
                        trend="+12%"
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <StatsCard
                        title="Orders Received"
                        value={stats.totalOrders}
                        icon={<ShoppingCart className="w-8 h-8" />}
                        color="green"
                        trend="+8%"
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <StatsCard
                        title="Total Earnings"
                        value={formatMoney(stats.totalEarnings)}
                        icon={<DollarSign className="w-8 h-8" />}
                        color="purple"
                        trend="+23%"
                    />
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <StatsCard
                        title="Pending Approval"
                        value={stats.pendingProducts}
                        icon={<Clock className="w-8 h-8" />}
                        color="orange"
                        trend=""
                    />
                </motion.div>
            </div>

            {/* Quick Actions & Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="lg:col-span-1"
                >
                    <div className="card p-6 h-full">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-brand-700" />
                            Quick Actions
                        </h2>
                        <div className="space-y-3">
                            <QuickActionButton
                                to="/supplier/add-product"
                                icon={<Plus className="w-5 h-5" />}
                                label="Add New Product"
                                description="List a new product"
                                color="brand"
                            />
                            <QuickActionButton
                                to="/supplier/my-products"
                                icon={<Eye className="w-5 h-5" />}
                                label="View Products"
                                description={`${stats.totalProducts} products`}
                                color="blue"
                            />
                            <QuickActionButton
                                to="/supplier/orders"
                                icon={<ShoppingCart className="w-5 h-5" />}
                                label="Manage Orders"
                                description={`${stats.totalOrders} orders`}
                                color="green"
                            />
                            <QuickActionButton
                                to="/supplier/earnings"
                                icon={<DollarSign className="w-5 h-5" />}
                                label="View Earnings"
                                description="Revenue breakdown"
                                color="purple"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Recent Orders */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="lg:col-span-2"
                >
                    <div className="card p-6 h-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-brand-700" />
                                Recent Orders
                            </h2>
                            <Link
                                to="/supplier/orders"
                                className="text-brand-700 hover:text-brand-800 text-sm font-medium flex items-center gap-1"
                            >
                                View All
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {stats.recentOrders?.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 mb-2">No orders yet</p>
                                <p className="text-sm text-gray-400">Orders will appear here once customers purchase your products</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {stats.recentOrders.map((order: any) => (
                                    <OrderCard key={order.id} order={order} />
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Status Alert if pending products */}
            {stats.pendingProducts > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="bg-orange-50 border-l-4 border-orange-500 p-6 rounded-xl"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                            <AlertCircle className="w-8 h-8 text-orange-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-orange-900">
                                {stats.pendingProducts} Product{stats.pendingProducts !== 1 ? 's' : ''} Pending Approval
                            </h3>
                            <p className="text-orange-700 mt-1">
                                Your products are being reviewed by the admin team. You'll be notified once they're approved.
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// Stats Card Component
function StatsCard({ title, value, icon, color, trend }: any) {
    const colors = {
        blue: "from-blue-500 to-blue-600",
        green: "from-green-500 to-green-600",
        purple: "from-purple-500 to-purple-600",
        orange: "from-orange-500 to-orange-600",
    };

    const bgColors = {
        blue: "bg-blue-50",
        green: "bg-green-50",
        purple: "bg-purple-50",
        orange: "bg-orange-50",
    };

    const textColors = {
        blue: "text-blue-600",
        green: "text-green-600",
        purple: "text-purple-600",
        orange: "text-orange-600",
    };

    return (
        <div className="card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-l-4 border-transparent hover:border-brand-600">
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color as keyof typeof colors]} text-white shadow-lg`}>
                    {icon}
                </div>
                {trend && (
                    <span className="text-green-600 text-sm font-semibold bg-green-50 px-2 py-1 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <div>
                <p className="text-sm text-gray-600 font-medium mb-1">{title}</p>
                <p className="text-3xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

// Quick Action Button
function QuickActionButton({ to, icon, label, description, color }: any) {
    const colors = {
        brand: "hover:bg-brand-50 text-brand-700",
        blue: "hover:bg-blue-50 text-blue-700",
        green: "hover:bg-green-50 text-green-700",
        purple: "hover:bg-purple-50 text-purple-700",
    };

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 p-4 rounded-xl border border-gray-200 transition-all hover:shadow-md hover:-translate-x-1 ${colors[color as keyof typeof colors]}`}
        >
            <div className="flex-shrink-0">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900">{label}</p>
                <p className="text-xs text-gray-500 truncate">{description}</p>
            </div>
            <ArrowRight className="w-4 h-4 flex-shrink-0" />
        </Link>
    );
}

// Order Card Component
function OrderCard({ order }: any) {
    const statusColors = {
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
        APPROVED: "bg-blue-100 text-blue-800 border-blue-200",
        SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
        DELIVERED: "bg-green-100 text-green-800 border-green-200",
        CANCELLED: "bg-red-100 text-red-800 border-red-200",
    };

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-brand-700" />
                </div>
                <div>
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <p className="text-sm text-gray-500">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
            </div>
            <div className="text-right flex items-center gap-4">
                <div>
                    <p className="font-bold text-gray-900">{formatMoney(order.total)}</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${statusColors[order.status as keyof typeof statusColors] || statusColors.PENDING}`}>
                        {order.status}
                    </span>
                </div>
            </div>
        </div>
    );
}

// Pending Approval Page
function PendingApprovalPage({ status }: { status: string | null }) {
    const isPending = status === "PENDING" || !status;
    const isRejected = status === "REJECTED";

    return (
        <div className="min-h-[70vh] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="card p-12 max-w-2xl w-full text-center space-y-8 shadow-2xl"
            >
                {isPending && (
                    <>
                        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                            <Clock className="w-12 h-12 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                Awaiting Admin Approval
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Your supplier account is currently under review by our team.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 text-left">
                            <p className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                What happens next?
                            </p>
                            <ul className="space-y-2 text-yellow-800">
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600">•</span>
                                    <span>Admin will review your supplier information</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600">•</span>
                                    <span>You'll receive full access once approved</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-yellow-600">•</span>
                                    <span>You can then add and manage your products</span>
                                </li>
                            </ul>
                        </div>
                    </>
                )}

                {isRejected && (
                    <>
                        <div className="mx-auto w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                            <AlertCircle className="w-12 h-12 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                Account Not Approved
                            </h1>
                            <p className="text-gray-600 text-lg">
                                Unfortunately, your supplier account was not approved.
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6">
                            <p className="text-red-800">
                                If you believe this is an error, please contact our support team for assistance.
                            </p>
                        </div>
                    </>
                )}

                <div className="pt-6 border-t">
                    <a
                        href="/logout"
                        className="text-brand-700 hover:text-brand-800 font-semibold"
                    >
                        Sign Out →
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
