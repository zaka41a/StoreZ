import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";
import { Clock, PackageCheck, Truck, XCircle } from "lucide-react";
import BackButton from "@/components/BackButton";

interface Order {
    id: number;
    createdAt: string;
    status: string;
    total: number;
}

export default function UserOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await api.get("/user/orders", { withCredentials: true });
                // Calculate total for each order
                const ordersWithTotal = (res.data || []).map((order: any) => ({
                    ...order,
                    total: order.items?.reduce((sum: number, item: any) =>
                        sum + (item.product?.price || 0) * item.quantity, 0) || 0
                }));
                setOrders(ordersWithTotal);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div className="card p-6">Loading...</div>;

    return (
        <div className="space-y-6">
            <BackButton label="Back to dashboard" to="/user/home" />

            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">My Orders</h2>
                <span className="text-gray-500 text-sm">
          {orders.length} order{orders.length !== 1 && "s"}
        </span>
            </div>

            {orders.length === 0 ? (
                <div className="card p-8 text-center text-gray-600">
                    <p>You have no orders yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((o) => (
                        <div key={o.id} className="card p-4 flex justify-between items-center">
                            <div className="space-y-1">
                                <div className="font-semibold">Order #{o.id}</div>
                                <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
                            </div>

                            <div className="flex items-center gap-4">
                                <StatusBadge status={o.status} />
                                <div className="font-semibold">{formatMoney(o.total)}</div>
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
        PENDING: {
            label: "Pending",
            icon: <Clock className="w-4 h-4" />,
            color: "bg-yellow-50 text-yellow-700",
        },
        SHIPPED: {
            label: "Shipped",
            icon: <Truck className="w-4 h-4" />,
            color: "bg-blue-50 text-blue-700",
        },
        DELIVERED: {
            label: "Delivered",
            icon: <PackageCheck className="w-4 h-4" />,
            color: "bg-green-50 text-green-700",
        },
        CANCELLED: {
            label: "Cancelled",
            icon: <XCircle className="w-4 h-4" />,
            color: "bg-red-50 text-red-700",
        },
    };

    const s = map[status] || map.PENDING;
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${s.color}`}
        >
      {s.icon}
            {s.label}
    </span>
    );
}
