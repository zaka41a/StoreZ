import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";
import { Link } from "react-router-dom";
import { ShoppingBag, Package, Clock, Star, PlusCircle } from "lucide-react";
import BackButton from "@/components/BackButton";

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

    if (loading) return <div className="card p-6">Loading...</div>;

    return (
        <div className="space-y-6">
            {/* Header + retour */}
            <div className="flex items-center justify-between">
                <BackButton label="Back to store" to="/" />
                <div />
            </div>

            {/* Bandeau de bienvenue */}
            <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-r from-brand-50 to-white p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-brand-700">Welcome back 👋</h1>
                        <p className="text-gray-600 mt-1">
                            Track your orders, manage your profile and keep shopping smart.
                        </p>
                        <div className="mt-4 flex gap-3">
                            <Link to="/user/orders" className="btn btn-primary">View orders</Link>
                            <Link to="/" className="btn">Explore products</Link>
                        </div>
                    </div>
                    <div className="hidden md:block opacity-20 text-[120px] pr-4">🛍️</div>
                </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard icon={<ShoppingBag className="w-5 h-5" />} label="Total orders" value={stats.totalOrders} />
                <StatCard icon={<Package className="w-5 h-5" />} label="Delivered (est.)" value={stats.deliveredOrders} />
                <StatCard icon={<Clock className="w-5 h-5" />} label="Pending" value={stats.pendingOrders} />
                <StatCard icon={<Star className="w-5 h-5" />} label="Spent (30d)" value={formatMoney(stats.spentLast30Days)} />
            </div>

            {/* Dernières commandes */}
            <div className="card p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recent orders</h2>
                    <Link to="/user/orders" className="text-sm text-brand-700 hover:underline">See all</Link>
                </div>
                {recentOrders.length === 0 ? (
                    <div className="text-gray-600 mt-3">No orders yet. Start with some products below.</div>
                ) : (
                    <div className="overflow-x-auto mt-3">
                        <table className="w-full text-sm">
                            <thead>
                            <tr className="text-left text-gray-600">
                                <th className="py-2">#</th>
                                <th>Date</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {recentOrders.map(o => (
                                <tr key={o.id} className="border-t">
                                    <td className="py-2">{o.id}</td>
                                    <td>{new Date(o.date).toLocaleString()}</td>
                                    <td>{formatMoney(o.total)}</td>
                                    <td className="uppercase text-xs">{o.status}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Suggestions produits */}
            <div className="card p-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recommended for you</h2>
                    <Link to="/" className="text-sm text-brand-700 hover:underline">Browse all</Link>
                </div>
                {suggested.length === 0 ? (
                    <div className="text-gray-600 mt-3">No suggestions for now.</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
                        {suggested.map(p => (
                            <article key={p.id} className="border rounded-xl overflow-hidden">
                                <img src={p.image} alt={p.name} className="h-40 w-full object-cover" />
                                <div className="p-4">
                                    <div className="font-medium line-clamp-1">{p.name}</div>
                                    <div className="text-sm text-gray-600">{p.supplierName || ""}</div>
                                    <div className="font-semibold mt-1">{formatMoney(p.price)}</div>
                                    <div className="flex gap-2 mt-3">
                                        <Link to={`/product/${p.id}`} className="btn btn-secondary">View</Link>
                                        <Link to="/" className="btn">
                                            <PlusCircle className="w-4 h-4 mr-1" /> Add
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
    return (
        <div className="card p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="rounded-lg bg-brand-50 text-brand-700 p-2">{icon}</div>
                <div className="text-sm text-gray-600">{label}</div>
            </div>
            <div className="text-lg font-semibold">{value}</div>
        </div>
    );
}
