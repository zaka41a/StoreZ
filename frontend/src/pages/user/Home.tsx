import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";
import { getImageUrl } from "@/utils/image";
import { Link } from "react-router-dom";
import { ShoppingBag, Package, Clock, TrendingUp, PlusCircle, ArrowRight, Sparkles, Heart, AlertCircle } from "lucide-react";
import BackButton from "@/components/BackButton";
import { motion } from "framer-motion";

type OrderRow = { id: number; date: string; total: number; status: string };
type Product = { id: string; name: string; image: string; price: number; supplierName?: string };
type Stats = { totalOrders: number; deliveredOrders: number; pendingOrders: number; spentLast30Days: number };

export default function UserHome() {
    const [stats, setStats] = useState<Stats>({ totalOrders: 0, deliveredOrders: 0, pendingOrders: 0, spentLast30Days: 0 });
    const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);
    const [suggested, setSuggested] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const [s, p] = await Promise.all([
                    api.get("/user/stats", { withCredentials: true }).catch(() => ({ data: { totalOrders: 0, deliveredOrders: 0, pendingOrders: 0, spentLast30Days: 0, recentOrders: [] } })),
                    api.get("/products?size=6").catch(() => ({ data: { products: [] } })),
                ]);
                setStats({
                    totalOrders: s.data.totalOrders || 0,
                    deliveredOrders: s.data.deliveredOrders || 0,
                    pendingOrders: s.data.pendingOrders || 0,
                    spentLast30Days: s.data.spentLast30Days || 0
                });
                setRecentOrders(s.data.recentOrders || []);
                setSuggested((p.data.products || []).slice(0, 6));
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading your dashboard...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <BackButton label="Back to store" to="/" />

            {/* Hero Section with Gradient */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 p-8 text-white shadow-2xl border border-gold-300/20"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="relative z-10">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="w-6 h-6 text-gold-400" />
                                <span className="text-gold-200 text-sm font-medium">Welcome back!</span>
                            </div>
                            <h1 className="text-4xl font-bold mb-2">Your Shopping Dashboard</h1>
                            <p className="text-brand-100 text-lg max-w-2xl">
                                Track your orders, discover new products, and manage your shopping experience
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <Link to="/user/orders" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gold-400 to-gold-500 text-white rounded-xl font-semibold hover:from-gold-500 hover:to-gold-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                                    <ShoppingBag className="w-5 h-5" />
                                    View All Orders
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link to="/" className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-xl font-semibold hover:bg-white/20 transition-all border border-gold-400/30 hover:border-gold-400/50">
                                    Explore Products
                                </Link>
                            </div>
                        </div>

                        {/* Mini Stats in Hero */}
                        <div className="hidden lg:flex flex-col gap-3 backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-gold-400/30">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gold-100">{stats.totalOrders}</div>
                                <div className="text-gold-200 text-sm">Total Orders</div>
                            </div>
                            <div className="h-px bg-gold-400/30"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gold-100">{formatMoney(stats.spentLast30Days)}</div>
                                <div className="text-gold-200 text-sm">Spent (30d)</div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                <StatCard
                    icon={<ShoppingBag className="w-6 h-6" />}
                    label="Total Orders"
                    value={stats.totalOrders}
                    color="blue"
                    trend="+12% this month"
                />
                <StatCard
                    icon={<Package className="w-6 h-6" />}
                    label="Shipped"
                    value={stats.deliveredOrders}
                    color="green"
                />
                <StatCard
                    icon={<AlertCircle className="w-6 h-6" />}
                    label="Pending"
                    value={stats.pendingOrders}
                    color="orange"
                />
                <StatCard
                    icon={<TrendingUp className="w-6 h-6" />}
                    label="Spent (30 days)"
                    value={formatMoney(stats.spentLast30Days)}
                    color="purple"
                />
            </motion.div>

            {/* Recent Orders */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="card p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
                        <p className="text-gray-600 text-sm">Track your latest purchases</p>
                    </div>
                    <Link
                        to="/user/orders"
                        className="inline-flex items-center gap-2 text-brand-700 hover:text-gold-600 font-semibold transition-colors group"
                    >
                        See all
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {recentOrders.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="p-6 bg-gradient-to-br from-brand-50 to-gold-50 rounded-full w-fit mx-auto mb-4 shadow-lg">
                            <ShoppingBag className="w-12 h-12 text-gold-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-600 mb-4">Start shopping to see your orders here!</p>
                        <Link to="/" className="inline-flex items-center gap-2 btn btn-primary shadow-lg">
                            <ShoppingBag className="w-4 h-4" />
                            Browse Products
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-gray-600 text-sm border-b">
                                    <th className="py-3 px-4 font-semibold">Order #</th>
                                    <th className="py-3 px-4 font-semibold">Date</th>
                                    <th className="py-3 px-4 font-semibold">Total</th>
                                    <th className="py-3 px-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.map((order, idx) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="border-b hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="py-4 px-4 font-semibold text-gray-900">#{order.id}</td>
                                        <td className="py-4 px-4 text-gray-600">{new Date(order.date).toLocaleString()}</td>
                                        <td className="py-4 px-4 font-semibold text-gold-600">{formatMoney(order.total)}</td>
                                        <td className="py-4 px-4">
                                            <StatusBadge status={order.status} />
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* Recommended Products */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="card p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Recommended for You</h2>
                        <p className="text-gray-600 text-sm">Handpicked products you might love</p>
                    </div>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-brand-700 hover:text-gold-600 font-semibold transition-colors group"
                    >
                        Browse all
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {suggested.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="p-6 bg-gradient-to-br from-brand-50 to-gold-50 rounded-full w-fit mx-auto mb-4 shadow-lg">
                            <Package className="w-12 h-12 text-gold-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No products available</h3>
                        <p className="text-gray-600">Check back soon for new arrivals!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {suggested.map((product, idx) => (
                            <motion.article
                                key={product.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={getImageUrl(product.image)}
                                        alt={product.name}
                                        className="h-48 w-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
                                        <Heart className="w-5 h-5 text-gray-700" />
                                    </button>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-semibold text-lg text-gray-900 line-clamp-1 mb-1">
                                        {product.name}
                                    </h3>
                                    {product.supplierName && (
                                        <p className="text-sm text-gray-600 mb-3">{product.supplierName}</p>
                                    )}
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-bold text-gold-600">
                                            {formatMoney(product.price)}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="flex-1 btn btn-primary text-center"
                                        >
                                            View Details
                                        </Link>
                                        <button className="btn bg-green-600 hover:bg-green-700 text-white px-4">
                                            <PlusCircle className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}

function StatCard({ icon, label, value, color, trend }: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
    color: string;
    trend?: string;
}) {
    const colors: Record<string, string> = {
        blue: "from-brand-500 to-brand-600",
        green: "from-green-500 to-green-600",
        orange: "from-gold-500 to-gold-600",
        purple: "from-brand-600 to-brand-700",
    };

    return (
        <div className="card p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-l-4 border-transparent hover:border-gold-400">
            <div className="flex items-start justify-between mb-3">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}>
                    {icon}
                </div>
                {trend && (
                    <span className="text-green-600 text-xs font-semibold bg-green-50 px-2 py-1 rounded-full">
                        {trend}
                    </span>
                )}
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const statusMap: Record<string, { label: string; color: string }> = {
        PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
        APPROVED: { label: "Approved", color: "bg-blue-100 text-blue-700 border-blue-200" },
        SHIPPED: { label: "Shipped", color: "bg-purple-100 text-purple-700 border-purple-200" },
        DELIVERED: { label: "Delivered", color: "bg-green-100 text-green-700 border-green-200" },
        CANCELLED: { label: "Cancelled", color: "bg-red-100 text-red-700 border-red-200" },
    };

    const s = statusMap[status] || statusMap.PENDING;
    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${s.color}`}>
            {s.label}
        </span>
    );
}
