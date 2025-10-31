import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";
import { motion } from "framer-motion";
import { Clock, PackageCheck, Truck, XCircle } from "lucide-react";

export default function AdminOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const res = await api.get("/admin/orders", { withCredentials: true });
            setOrders(res.data);
        } catch {
            setOrders([]);
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
            <h1 className="text-2xl font-semibold">Orders Management</h1>

            <div className="card p-6 overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-600">
                        <th className="p-2">Order #</th>
                        <th className="p-2">Date</th>
                        <th className="p-2">Customer</th>
                        <th className="p-2">Total</th>
                        <th className="p-2">Status</th>
                        <th className="p-2 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {orders.map((o) => (
                        <tr key={o.id} className="border-t hover:bg-gray-50 transition">
                            <td className="p-2 font-medium">#{o.id}</td>
                            <td className="p-2">{new Date(o.createdAt).toLocaleString()}</td>
                            <td className="p-2">{o.user?.name || "—"}</td>
                            <td className="p-2 font-semibold">{formatMoney(o.total)}</td>
                            <td className="p-2">
                                <StatusBadge status={o.status} />
                            </td>
                            <td className="p-2 text-center space-x-2">
                                {o.status === "PENDING" && (
                                    <>
                                        <button
                                            onClick={() => updateStatus(o.id, "SHIPPED")}
                                            className="btn btn-primary inline-flex items-center gap-1"
                                        >
                                            <Truck className="w-4 h-4" /> Ship
                                        </button>
                                        <button
                                            onClick={() => updateStatus(o.id, "CANCELLED")}
                                            className="btn btn-secondary text-red-600 inline-flex items-center gap-1"
                                        >
                                            <XCircle className="w-4 h-4" /> Cancel
                                        </button>
                                    </>
                                )}
                                {o.status === "SHIPPED" && (
                                    <button
                                        onClick={() => updateStatus(o.id, "DELIVERED")}
                                        className="btn btn-success inline-flex items-center gap-1"
                                    >
                                        <PackageCheck className="w-4 h-4" /> Deliver
                                    </button>
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
