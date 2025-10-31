import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";
import { Clock, PackageCheck, Truck, XCircle } from "lucide-react";

export default function SupplierOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/supplier/orders", { withCredentials: true })
            .then(res => setOrders(res.data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="card p-6">Loading orders...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-brand-700">Orders Received</h1>
            {orders.length === 0 ? (
                <div className="card p-8 text-center text-gray-600">No orders yet.</div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((o) => (
                        <div key={o.id} className="card p-4 flex justify-between items-center">
                            <div className="space-y-1">
                                <div className="font-semibold">Order #{o.id}</div>
                                <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
                                <div className="text-sm text-gray-700">{o.product?.name}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold">{formatMoney(o.price * o.quantity)}</div>
                                <StatusBadge status={o.status} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

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
