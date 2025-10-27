import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";
import { Package, ShoppingCart, DollarSign, Clock } from "lucide-react";

export default function SupplierDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        api.get("/supplier/stats", { withCredentials: true })
            .then(r => setStats(r.data))
            .catch(() => setStats({ totalProducts: 0, totalOrders: 0, totalEarnings: 0, pendingProducts: 0, recentOrders: [] }));
    }, []);

    if (!stats) return <div className="card p-6">Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Supplier Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card icon={<Package className="text-blue-500" />} label="My Products" value={stats.totalProducts} />
                <Card icon={<ShoppingCart className="text-green-500" />} label="Orders Received" value={stats.totalOrders} />
                <Card icon={<DollarSign className="text-yellow-500" />} label="Earnings" value={formatMoney(stats.totalEarnings)} />
                <Card icon={<Clock className="text-orange-500" />} label="Pending Products" value={stats.pendingProducts} />
            </div>

            <div className="card p-6">
                <h2 className="text-lg font-semibold mb-3">Recent Orders</h2>
                {stats.recentOrders?.length === 0 ? (
                    <div className="text-gray-600">No recent orders yet.</div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                        <tr><th>ID</th><th>Date</th><th>Total</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                        {stats.recentOrders.map((o:any) => (
                            <tr key={o.id} className="border-t">
                                <td>{o.id}</td>
                                <td>{new Date(o.date).toLocaleString()}</td>
                                <td>{formatMoney(o.total)}</td>
                                <td>{o.status}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

function Card({ icon, label, value }: { icon: any; label: string; value: any }) {
    return (
        <div className="card p-6 flex items-center gap-3">
            {icon}
            <div>
                <div className="text-sm text-gray-600">{label}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
        </div>
    );
}
