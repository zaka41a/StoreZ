import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";
import { getImageUrl } from "@/utils/image";
import { Clock, PackageCheck, Truck, XCircle, ShoppingBag, User } from "lucide-react";

export default function SupplierOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/supplier/orders", { withCredentials: true })
            .then(res => setOrders(res.data || []))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="card p-6">Loading orders...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-brand-700">Orders Received</h1>
                <span className="text-gray-500 text-sm">
                    {orders.length} order{orders.length !== 1 && "s"}
                </span>
            </div>

            {orders.length === 0 ? (
                <div className="card p-8 text-center text-gray-600">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No orders containing your products yet.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="card p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <div className="text-lg font-semibold">Order #{order.id}</div>
                                    <div className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </div>
                                    {order.user && (
                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                            <User className="w-4 h-4" />
                                            <span>{order.user.name} ({order.user.email})</span>
                                        </div>
                                    )}
                                </div>
                                <StatusBadge status={order.status} />
                            </div>

                            <div className="space-y-2 mb-4">
                                {order.items?.map((item: any) => (
                                    <div key={item.id} className="flex items-center justify-between border-t pt-2">
                                        <div className="flex items-center gap-3">
                                            {item.product?.image && (
                                                <img
                                                    src={getImageUrl(item.product.image)}
                                                    alt={item.product.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium">{item.product?.name}</div>
                                                <div className="text-sm text-gray-600">
                                                    Quantity: {item.quantity}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="font-semibold">
                                            {formatMoney(item.product?.price * item.quantity)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between border-t pt-3">
                                <span className="font-semibold">Total for your products:</span>
                                <span className="text-lg font-bold text-brand-700">
                                    {formatMoney(order.total)}
                                </span>
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
