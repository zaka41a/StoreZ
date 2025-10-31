import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { BarChart3, PieChart } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminAnalytics() {
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/admin/analytics", { withCredentials: true })
            .then(res => setAnalytics(res.data))
            .catch(err => console.error("Error loading analytics:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="card p-6">Loading analytics...</div>;
    if (!analytics) return <div className="card p-6">No data available</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            <div>
                <h1 className="text-3xl font-bold text-brand-700">Analytics</h1>
                <p className="text-gray-600 mt-1">Platform performance insights</p>
            </div>

            {/* Orders by Status */}
            <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="w-5 h-5 text-brand-700" />
                    <h2 className="text-xl font-semibold">Orders by Status</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(analytics.ordersByStatus || {}).map(([status, count]) => (
                        <div key={status} className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600 uppercase">{status}</p>
                            <p className="text-2xl font-bold">{count as number}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Products by Category */}
            <div className="card p-6">
                <div className="flex items-center gap-2 mb-4">
                    <PieChart className="w-5 h-5 text-brand-700" />
                    <h2 className="text-xl font-semibold">Products by Category</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(analytics.productsByCategory || {}).map(([category, count]) => (
                        <div key={category} className="p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">{category}</p>
                            <p className="text-2xl font-bold">{count as number}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Suppliers */}
            <div className="card p-6">
                <h2 className="text-xl font-semibold mb-4">Top Suppliers by Products</h2>
                <div className="space-y-3">
                    {Object.entries(analytics.topSuppliers || {})
                        .sort((a, b) => (b[1] as number) - (a[1] as number))
                        .slice(0, 10)
                        .map(([supplier, count]) => (
                            <div key={supplier} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <span className="font-medium">{supplier}</span>
                                <span className="text-brand-700 font-bold">{count as number} products</span>
                            </div>
                        ))}
                </div>
            </div>
        </motion.div>
    );
}
