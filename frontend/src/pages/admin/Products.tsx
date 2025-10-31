import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, PackageSearch, Trash2, XCircle } from "lucide-react";

import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";

type AdminProduct = {
    id: number;
    name: string;
    description: string;
    price: number;
    image?: string;
    category: string;
    stock: number;
    status: string;
    supplier?: {
        id: number;
        companyName: string;
        email: string;
    };
};

type AdminProductResponse = {
    products: AdminProduct[];
    currentPage: number;
    totalPages: number;
    totalItems: number;
};

const PAGE_SIZE = 10;

export default function AdminProducts() {
    const [products, setProducts] = useState<AdminProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const load = async (pageToLoad = 1) => {
        setLoading(true);
        try {
            const res = await api.get<AdminProductResponse>("/admin/products", {
                params: { page: pageToLoad, size: PAGE_SIZE },
                withCredentials: true,
            });

            setProducts(res.data.products || []);
            setCurrentPage(res.data.currentPage || pageToLoad);
            setTotalPages(Math.max(res.data.totalPages ?? 1, 1));
            setTotalItems(res.data.totalItems || 0);
            setError(null);
        } catch (err) {
            console.error("Error loading admin products:", err);
            setProducts([]);
            setError("Failed to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const approve = async (id: number) => {
        try {
            await api.put(`/admin/products/${id}/approve`, {}, { withCredentials: true });
            load(currentPage);
        } catch (err) {
            console.error("Error approving product:", err);
            setError("Failed to approve product.");
        }
    };

    const reject = async (id: number) => {
        try {
            await api.put(`/admin/products/${id}/reject`, {}, { withCredentials: true });
            load(currentPage);
        } catch (err) {
            console.error("Error rejecting product:", err);
            setError("Failed to reject product.");
        }
    };

    const deleteProduct = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;

        try {
            await api.delete(`/admin/products/${id}`, { withCredentials: true });

            const nextPage =
                products.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
            load(nextPage);
        } catch (err) {
            console.error("Error deleting product:", err);
            setError("Failed to delete product. Remove related orders first.");
        }
    };

    const goToPage = (pageNumber: number) => {
        const safePage = Math.min(Math.max(pageNumber, 1), totalPages || 1);
        if (safePage === currentPage) return;
        load(safePage);
    };

    useEffect(() => {
        load(1);
    }, []);

    const isPrevDisabled = currentPage <= 1;
    const isNextDisabled = currentPage >= totalPages;
    const showingFrom = totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    const showingTo = totalItems === 0 ? 0 : Math.min(currentPage * PAGE_SIZE, totalItems);

    if (loading) return <div className="card p-6">Loading products...</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-brand-700">Product Moderation</h1>
                    <p className="text-gray-600 mt-1">
                        Review and moderate products submitted by suppliers.
                    </p>
                </div>
                <PackageSearch className="w-9 h-9 text-brand-700" />
            </div>

            {error && (
                <div className="rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-left text-gray-600">
                                <th className="p-4 font-semibold">Product</th>
                                <th className="p-4 font-semibold">Supplier</th>
                                <th className="p-4 font-semibold">Category</th>
                                <th className="p-4 font-semibold text-right">Price</th>
                                <th className="p-4 font-semibold text-center">Status</th>
                                <th className="p-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="border-t hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={product.image || "https://via.placeholder.com/80x80.png?text=Product"}
                                                alt={product.name}
                                                className="h-14 w-14 rounded object-cover ring-1 ring-gray-200"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-900">{product.name}</div>
                                                <p className="text-xs text-gray-500 line-clamp-2">{product.description}</p>
                                                <p className="text-xs text-gray-400 mt-1">Stock • {product.stock}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4 align-top">
                                        {product.supplier ? (
                                            <div>
                                                <div className="font-medium text-gray-900">{product.supplier.companyName}</div>
                                                <div className="text-xs text-gray-500">{product.supplier.email}</div>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400">No supplier</span>
                                        )}
                                    </td>
                                    <td className="p-4 align-top">
                                        <span className="inline-flex items-center rounded bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600">
                                            {product.category || "—"}
                                        </span>
                                    </td>
                                    <td className="p-4 align-top text-right font-semibold text-gray-900">
                                        {formatMoney(product.price)}
                                    </td>
                                    <td className="p-4 align-top text-center">
                                        <StatusBadge status={product.status} />
                                    </td>
                                    <td className="p-4 align-top">
                                        <div className="flex items-center justify-center gap-2">
                                            {product.status === "PENDING" && (
                                                <>
                                                    <button
                                                        onClick={() => approve(product.id)}
                                                        className="btn btn-primary inline-flex items-center gap-1 text-xs"
                                                    >
                                                        <Check className="w-4 h-4" /> Approve
                                                    </button>
                                                    <button
                                                        onClick={() => reject(product.id)}
                                                        className="btn btn-secondary inline-flex items-center gap-1 text-xs text-orange-600 hover:bg-orange-50"
                                                    >
                                                        <XCircle className="w-4 h-4" /> Reject
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => deleteProduct(product.id)}
                                                className="btn btn-secondary inline-flex items-center gap-1 text-xs text-red-600 hover:bg-red-50"
                                            >
                                                <Trash2 className="w-4 h-4" /> Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                        {totalItems === 0
                            ? "No products submitted yet."
                            : `Showing ${showingFrom}-${showingTo} of ${totalItems} products`}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            className="btn btn-secondary text-xs disabled:opacity-50 disabled:pointer-events-none"
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={isPrevDisabled}
                        >
                            Previous
                        </button>
                        <span className="text-xs font-medium text-gray-500">
                            Page {Math.min(currentPage, totalPages || 1)} of {Math.max(totalPages, 1)}
                        </span>
                        <button
                            className="btn btn-secondary text-xs disabled:opacity-50 disabled:pointer-events-none"
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={isNextDisabled || totalItems === 0}
                        >
                            Next
                        </button>
                    </div>
                </div>
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
