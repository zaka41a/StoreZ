import { useEffect, useState } from "react";
import { api } from "@/services/api";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid, PieChart, Pie, Cell, Legend
} from "recharts";
import { motion } from "framer-motion";
import { TrendingUp, Users, Store, Package } from "lucide-react";
import { formatMoney } from "@/utils/format";

export default function AdminAnalytics() {
    const [sales, setSales] = useState<any[]>([]);
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch analytics data and monthly sales in parallel
        Promise.all([
            api.get("/admin/analytics", { withCredentials: true }),
            api.get("/admin/analytics/sales-monthly", { withCredentials: true })
        ])
            .then(([analyticsRes, salesRes]) => {
                // Set monthly sales data
                setSales(salesRes.data || []);

                // Transform topSuppliers to array format for chart
                const topSuppliersData = Object.entries(analyticsRes.data.topSuppliers || {})
                    .map(([supplier, count]) => ({
                        supplier,
                        sales: count,
                        count: count
                    }));
                setSuppliers(topSuppliersData);

                // Transform productsByCategory to array format for pie chart
                const categoriesData = Object.entries(analyticsRes.data.productsByCategory || {})
                    .map(([category, count]) => ({
                        category,
                        count
                    }));
                setCategories(categoriesData);
            })
            .catch((err) => {
                console.error("Error loading analytics:", err);
                setSales([]);
                setSuppliers([]);
                setCategories([]);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="card p-6">Loading analytics...</div>;

    return (
        <motion.div
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-brand-700">Business Analytics</h1>
                <div className="flex items-center gap-2 text-brand-700 font-medium">
                    <TrendingUp className="w-5 h-5" />
                    <span>Live Insights</span>
                </div>
            </div>

            {/* 1️⃣ Ventes mensuelles */}
            <section className="card p-6">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Package className="w-5 h-5 text-brand-700" /> Monthly Sales Overview
                </h2>
                {sales.length === 0 ? (
                    <div className="text-gray-600">No sales data yet.</div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={sales}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => formatMoney(value)} />
                            <Line type="monotone" dataKey="total" stroke="#2563eb" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </section>

            {/* 2️⃣ Top suppliers */}
            <section className="card p-6">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Store className="w-5 h-5 text-green-600" /> Top Performing Suppliers
                </h2>
                {suppliers.length === 0 ? (
                    <div className="text-gray-600">No supplier data.</div>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={suppliers}>
                            <XAxis dataKey="supplier" />
                            <YAxis />
                            <Tooltip formatter={(value: number) => formatMoney(value)} />
                            <Bar dataKey="sales" fill="#22c55e" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </section>

            {/* 3️⃣ Produits par catégorie */}
            <section className="card p-6">
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-yellow-500" /> Product Categories Distribution
                </h2>
                {categories.length === 0 ? (
                    <div className="text-gray-600">No category data available.</div>
                ) : (
                    <div className="flex justify-center">
                        <ResponsiveContainer width="100%" height={320}>
                            <PieChart>
                                <Pie
                                    data={categories}
                                    dataKey="count"
                                    nameKey="category"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    label
                                >
                                    {categories.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </section>
        </motion.div>
    );
}

const COLORS = ["#2563eb", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];
