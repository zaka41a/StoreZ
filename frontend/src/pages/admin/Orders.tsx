import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ClipboardList, Clock, PackageCheck, Truck, XCircle } from "lucide-react";

import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        try {
            const res = await api.get("/admin/orders", { withCredentials: true });
            setOrders(res.data);
            setError(null);
        } catch {
            setOrders([]);
            setError("Failed to load orders. Please retry.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const updateStatus = async (id: number, status: string) => {
        await api.put(`/admin/orders/${id}/status?status=${status}`, {}, { withCredentials: true });
        load();
    };

    if (loading) return <div className="card p-6">Loading orders...</div>;

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-brand-700">Orders Management</h1>
                    <p className="text-gray-600 mt-1">Monitor customer orders and update their status in real time.</p>
                </div>
                <ClipboardList className="w-9 h-9 text-brand-700" />
            </div>

            {error && (
                <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="card p-6 overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead className="bg-gray-50">
                    <tr className="text-left text-gray-600">
                        <th className="p-3 font-semibold">Order #</th>
                        <th className="p-3 font-semibold">Date</th>
                        <th className="p-3 font-semibold">Customer</th>
                        <th className="p-3 font-semibold">Items</th>
                        <th className="p-3 font-semibold text-right">Total</th>
                        <th className="p-3 font-semibold text-center">Status</th>
                        <th className="p-3 font-semibold text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((o) => (
                        <tr key={o.id} className="border-t hover:bg-gray-50 transition">
                            <td className="p-3 font-semibold text-gray-900">#{o.id}</td>
                            <td className="p-3 text-gray-700">{new Date(o.createdAt).toLocaleString()}</td>
                            <td className="p-3">
                                <div className="font-medium text-gray-900">{o.user?.name || "—"}</div>
                                <div className="text-xs text-gray-500">{o.user?.email}</div>
                            </td>
                            <td className="p-3">
                                <OrderItemsPreview items={o.items || []} />
                            </td>
                            <td className="p-3 font-semibold text-right text-gray-900">{formatMoney(o.total)}</td>
                            <td className="p-3 text-center">
                                <StatusBadge status={o.status} />
                            </td>
                            <td className="p-3">
                                {o.status === "PENDING" && (
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => updateStatus(o.id, "SHIPPED")}
                                            className="btn btn-primary inline-flex items-center gap-1 text-xs"
                                        >
                                            <Truck className="w-4 h-4" /> Ship
                                        </button>
                                        <button
                                            onClick={() => updateStatus(o.id, "CANCELLED")}
                                            className="btn btn-secondary inline-flex items-center gap-1 text-xs text-red-600 hover:bg-red-50"
                                        >
                                            <XCircle className="w-4 h-4" /> Cancel
                                        </button>
                                    </div>
                                )}
                                {o.status === "SHIPPED" && (
                                    <div className="flex items-center justify-center">
                                        <button
                                            onClick={() => updateStatus(o.id, "DELIVERED")}
                                            className="btn btn-success inline-flex items-center gap-1 text-xs"
                                        >
                                            <PackageCheck className="w-4 h-4" /> Deliver
                                        </button>
                                    </div>
                                )}
                                {o.status === "DELIVERED" && (
                                    <div className="text-center text-xs text-gray-500">Order completed</div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}

/* ✅ Badge de statut élégant */
function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; icon: JSX.Element; color: string }> = {
        PENDING: { label: "Pending", icon: <Clock className="w-4 h-4" />, color: "bg-yellow-50 text-yellow-700" },
        SHIPPED: { label: "Shipped", icon: <Truck className="w-4 h-4" />, color: "bg-blue-50 text-blue-700" },
        DELIVERED: { label: "Delivered", icon: <PackageCheck className="w-4 h-4" />, color: "bg-green-50 text-green-700" },
        CANCELLED: { label: "Cancelled", icon: <XCircle className="w-4 h-4" />, color: "bg-red-50 text-red-700" },
    };

    const s = map[status] || map.PENDING;
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${s.color}`}>
      {s.icon}
            {s.label}
    </span>
    );
}

function OrderItemsPreview({ items }: { items: any[] }) {
    if (!items.length) {
        return <span className="text-xs text-gray-400">No items</span>;
    }

    return (
        <div className="space-y-1">
            {items.slice(0, 2).map((item) => (
                <div key={item.id} className="text-xs text-gray-600">
                    {item.quantity} × {item.product?.name ?? "Product"}
                </div>
            ))}
            {items.length > 2 && (
                <div className="text-[11px] text-gray-400">
                    + {items.length - 2} more item{items.length - 2 > 1 ? "s" : ""}
                </div>
            )}
        </div>
    );
}
