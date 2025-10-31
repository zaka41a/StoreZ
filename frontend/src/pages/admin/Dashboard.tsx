import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Users, Package, ShoppingCart, TrendingUp, AlertCircle } from "lucide-react";
import { formatMoney } from "@/utils/format";
import { motion } from "framer-motion";

type DashboardStats = {
    totalUsers: number;
    totalSuppliers: number;
    totalProducts: number;
    totalOrders: number;
    pendingProducts: number;
    pendingSuppliers: number;
    totalRevenue: number;
    monthRevenue: number;
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalSuppliers: 0,
        totalProducts: 0,
        totalOrders: 0,
        pendingProducts: 0,
        pendingSuppliers: 0,
        totalRevenue: 0,
        monthRevenue: 0
    });
    const [loading, setLoading] = useState(true);
    const [authError, setAuthError] = useState(false);

    useEffect(() => {
        console.log("🔵 Fetching admin dashboard...");
        api.get("/admin/dashboard", { withCredentials: true })
            .then(res => {
                console.log("✅ Dashboard data:", res.data);
                setStats(res.data);
                setAuthError(false);
            })
            .catch(err => {
                console.error("❌ Error loading dashboard:", err);
                console.error("Response:", err.response);
                console.error("Status:", err.response?.status);
                console.error("Data:", err.response?.data);
                if (err.response?.status === 401 || err.response?.status === 403) {
                    setAuthError(true);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="card p-6">Loading dashboard...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-brand-700">Admin Dashboard</h1>
                <p className="text-gray-600 mt-1">Overview of your platform</p>
            </div>

            {/* Warning if not authenticated */}
            {authError && (
                <div className="card bg-red-50 border-red-200 p-6">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                        <div>
                            <h3 className="font-semibold text-red-800">Access Denied or Session Expired</h3>
                            <p className="text-sm text-red-700 mt-1">
                                Please log in as an ADMIN user to access this page. If you just restarted the backend,
                                you need to log in again as your session was reset.
                            </p>
                            <div className="mt-3">
                                <a href="/login" className="btn btn-primary inline-block">
                                    Go to Login
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pending Actions Alert */}
            {(stats.pendingProducts > 0 || stats.pendingSuppliers > 0) && (
                <div className="card bg-yellow-50 border-yellow-200 p-4">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <div>
                            <h3 className="font-semibold text-yellow-800">Pending Approvals</h3>
                            <p className="text-sm text-yellow-700">
                                {stats.pendingProducts > 0 && `${stats.pendingProducts} products `}
                                {stats.pendingProducts > 0 && stats.pendingSuppliers > 0 && "and "}
                                {stats.pendingSuppliers > 0 && `${stats.pendingSuppliers} suppliers `}
                                awaiting review
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard icon={<Users className="w-6 h-6" />} label="Total Users" value={stats.totalUsers} color="blue" />
                <StatCard icon={<Package className="w-6 h-6" />} label="Total Suppliers" value={stats.totalSuppliers} color="purple" />
                <StatCard icon={<ShoppingCart className="w-6 h-6" />} label="Total Products" value={stats.totalProducts} color="green" />
                <StatCard icon={<TrendingUp className="w-6 h-6" />} label="Total Orders" value={stats.totalOrders} color="orange" />
            </div>

            {/* Revenue Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
                    <p className="text-3xl font-bold text-brand-700">{formatMoney(stats.totalRevenue)}</p>
                    <p className="text-sm text-gray-600 mt-1">All time</p>
                </div>
                <div className="card p-6">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">This Month</h3>
                    <p className="text-3xl font-bold text-green-600">{formatMoney(stats.monthRevenue)}</p>
                    <p className="text-sm text-gray-600 mt-1">Current month revenue</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <a href="/admin/products" className="btn btn-primary">
                        Review Products ({stats.pendingProducts})
                    </a>
                    <a href="/admin/suppliers" className="btn btn-primary">
                        Review Suppliers ({stats.pendingSuppliers})
                    </a>
                    <a href="/admin/orders" className="btn btn-secondary">
                        Manage Orders
                    </a>
                </div>
            </div>
        </motion.div>
    );
}

function StatCard({ icon, label, value, color }: {
    icon: React.ReactNode;
    label: string;
    value: number;
    color: "blue" | "purple" | "green" | "orange"
}) {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-700",
        purple: "bg-purple-50 text-purple-700",
        green: "bg-green-50 text-green-700",
        orange: "bg-orange-50 text-orange-700"
    };

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">{label}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
                <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}
