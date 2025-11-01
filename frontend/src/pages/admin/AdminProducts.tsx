import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { motion } from "framer-motion";
import { Package, Check, XCircle, Trash2, Store, AlertCircle } from "lucide-react";
import { formatMoney } from "@/utils/format";
import { getImageUrl } from "@/utils/image";

type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    stock: number;
    status: string;
    supplier?: {
        id: number;
        companyName: string;
        email: string;
    };
};

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = async () => {
        try {
            const res = await api.get("/admin/products", { withCredentials: true });
            setProducts(res.data.products || []);
            setError(null);
        } catch (err) {
            console.error("Error loading products:", err);
            setError("Failed to load products. Please retry.");
        } finally {
            setLoading(false);
        }
    };

    const approve = async (id: number) => {
        try {
            await api.put(`/admin/products/${id}/approve`, {}, { withCredentials: true });
            load();
        } catch (err) {
            console.error("Error approving product:", err);
            setError("Failed to approve product.");
        }
    };

    const reject = async (id: number) => {
        try {
            await api.put(`/admin/products/${id}/reject`, {}, { withCredentials: true });
            load();
        } catch (err) {
            console.error("Error rejecting product:", err);
            setError("Failed to reject product.");
        }
    };

    const deleteProduct = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await api.delete(`/admin/products/${id}`, { withCredentials: true });
            load();
        } catch (err) {
            console.error("Error deleting product:", err);
            setError("Failed to delete product.");
        }
    };

    useEffect(() => { load(); }, []);

    if (loading) return <div className="card p-6">Loading products...</div>;

    const pendingProducts = products.filter(p => p.status === "PENDING");

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-brand-700">Product Moderation</h1>
                    <p className="text-gray-600 mt-1">
                        {products.length} total products • {pendingProducts.length} pending approval
                    </p>
                </div>
                <Package className="w-8 h-8 text-brand-700" />
            </div>

            {error && (
                <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                </div>
            )}

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-left">
                                <th className="p-4 font-semibold">Product</th>
                                <th className="p-4 font-semibold">Supplier</th>
                                <th className="p-4 font-semibold">Category</th>
                                <th className="p-4 font-semibold text-right">Price</th>
                                <th className="p-4 font-semibold text-center">Stock</th>
                                <th className="p-4 font-semibold text-center">Status</th>
                                <th className="p-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="border-t hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {product.image && (
                                                <img
                                                    src={getImageUrl(product.image)}
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded"
                                                />
                                            )}
                                            <div>
                                                <div className="font-medium text-gray-900">{product.name}</div>
                                                <div className="text-xs text-gray-500 line-clamp-1">
                                                    {product.description}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Store className="w-4 h-4 text-gray-400" />
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {product.supplier?.companyName || "—"}
                                                </div>
                                                {product.supplier?.email && (
                                                    <div className="text-xs text-gray-500">
                                                        {product.supplier.email}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right font-semibold text-gray-900">
                                        {formatMoney(product.price)}
                                    </td>
                                    <td className="p-4 text-center text-gray-700">
                                        {product.stock}
                                    </td>
                                    <td className="p-4 text-center">
                                        <StatusBadge status={product.status} />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap items-center justify-center gap-2">
                                            <button
                                                onClick={() => approve(product.id)}
                                                className="btn btn-primary inline-flex items-center gap-1 text-xs disabled:opacity-50 disabled:pointer-events-none"
                                                title="Approve product"
                                                disabled={product.status === "APPROVED"}
                                            >
                                                <Check className="w-4 h-4" /> Approve
                                            </button>
                                            <button
                                                onClick={() => reject(product.id)}
                                                className="btn btn-secondary text-orange-600 inline-flex items-center gap-1 text-xs hover:bg-orange-50 disabled:opacity-50 disabled:pointer-events-none"
                                                title="Reject product"
                                                disabled={product.status === "REJECTED"}
                                            >
                                                <XCircle className="w-4 h-4" /> Reject
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="btn btn-secondary text-red-600 inline-flex items-center gap-1 hover:bg-red-50 text-xs"
                                                title="Delete product"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {products.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No products found</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const map: Record<string, { label: string; classes: string }> = {
        APPROVED: { label: "Approved", classes: "bg-green-50 text-green-700" },
        PENDING: { label: "Pending", classes: "bg-yellow-50 text-yellow-700" },
        REJECTED: { label: "Rejected", classes: "bg-red-50 text-red-700" },
    };

    const value = map[status] || map.PENDING;
    return (
        <span className={`inline-flex items-center justify-center rounded px-2 py-1 text-xs font-medium ${value.classes}`}>
            {value.label}
        </span>
    );
}
