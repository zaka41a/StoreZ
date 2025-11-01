import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";
import { Clock, PackageCheck, Truck, XCircle, ShoppingBag, Package } from "lucide-react";
import BackButton from "@/components/BackButton";
import { getImageUrl } from "@/utils/image";

interface Order {
    id: number;
    createdAt: string;
    status: string;
    total: number;
    items?: any[];
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
            } catch (error) {
                console.error("Failed to load orders:", error);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    if (loading) return <div className="card p-6">Loading orders...</div>;

    return (
        <div className="space-y-6">
            <BackButton label="Back to dashboard" to="/user/home" />

            <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                    <ShoppingBag className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-blue-700">My Orders</h1>
                    <p className="text-gray-600 text-sm">
                        {orders.length} order{orders.length !== 1 && "s"}
                    </p>
                </div>
            </div>

            {orders.length === 0 ? (
                <div className="card p-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="p-6 bg-gray-100 rounded-full">
                            <Package className="w-16 h-16 text-gray-400" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-1">No orders yet</h3>
                            <p className="text-gray-500">Start shopping to see your orders here!</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4">
                    {orders.map((order) => (
                        <div key={order.id} className="card p-6 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="space-y-1">
                                    <div className="text-lg font-semibold text-gray-900">Order #{order.id}</div>
                                    <div className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </div>
                                </div>
                                <StatusBadge status={order.status} />
                            </div>

                            {order.items && order.items.length > 0 && (
                                <div className="space-y-3 mb-4">
                                    {order.items.map((item: any) => (
                                        <div key={item.id} className="flex items-center gap-3 border-t pt-3">
                                            {item.product?.image && (
                                                <img
                                                    src={getImageUrl(item.product.image)}
                                                    alt={item.product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                            )}
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-900">{item.product?.name}</div>
                                                <div className="text-sm text-gray-600">
                                                    Quantity: {item.quantity} × {formatMoney(item.product?.price || 0)}
                                                </div>
                                            </div>
                                            <div className="font-semibold text-gray-900">
                                                {formatMoney((item.product?.price || 0) * item.quantity)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center justify-between border-t pt-4">
                                <span className="font-semibold text-gray-700">Total</span>
                                <span className="text-xl font-bold text-blue-700">{formatMoney(order.total)}</span>
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
