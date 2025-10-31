import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";
import { Package, ShoppingCart, DollarSign, Clock } from "lucide-react";
import { Link } from "react-router-dom";

export default function SupplierDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        api
            .get("/supplier/stats", { withCredentials: true })
            .then((r) => setStats(r.data))
            .catch(() =>
                setStats({
                    totalProducts: 0,
                    totalOrders: 0,
                    totalEarnings: 0,
                    pendingProducts: 0,
                    recentOrders: [],
                })
            );
    }, []);

    if (!stats) return <div className="card p-6">Loading...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-brand-700">Supplier Dashboard</h1>
                <Link to="/supplier/add-product" className="btn btn-primary">
                    ➕ Add New Product
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={<Package />} label="My Products" value={stats.totalProducts} />
                <StatCard icon={<ShoppingCart />} label="Orders Received" value={stats.totalOrders} />
                <StatCard icon={<DollarSign />} label="Earnings" value={formatMoney(stats.totalEarnings)} />
                <StatCard icon={<Clock />} label="Pending Products" value={stats.pendingProducts} />
            </div>

            <div className="card p-6">
                <h2 className="text-lg font-semibold mb-3 text-brand-700">Recent Orders</h2>
                {stats.recentOrders?.length === 0 ? (
                    <div className="text-gray-600">No recent orders yet.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                        <tr>
                            <th className="text-left p-2">ID</th>
                            <th className="text-left p-2">Date</th>
                            <th className="text-left p-2">Total</th>
                            <th className="text-left p-2">Status</th>
                        </tr>
                        </thead>
                        <tbody>
                        {stats.recentOrders.map((o: any) => (
                            <tr key={o.id} className="border-t hover:bg-gray-50 transition">
                                <td className="p-2">{o.id}</td>
                                <td className="p-2">{new Date(o.date).toLocaleString()}</td>
                                <td className="p-2">{formatMoney(o.total)}</td>
                                <td className="p-2 uppercase text-xs">{o.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: JSX.Element; label: string; value: any }) {
    return (
        <div className="card p-6 flex items-center justify-between">
            <div className="p-2 rounded-lg bg-gray-50 text-brand-700">{icon}</div>
            <div className="text-right">
                <div className="text-sm text-gray-600">{label}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
        </div>
    );
}
