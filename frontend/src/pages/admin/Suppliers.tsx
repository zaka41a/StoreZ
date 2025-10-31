import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Store, Check, XCircle, Mail, Phone, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

type Supplier = {
    id: number;
    companyName: string;
    email: string;
    phone: string;
    address: string;
    status: string;
    approved: boolean;
};

export default function AdminSuppliers() {
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadSuppliers = () => {
        console.log("🔵 Fetching admin suppliers...");
        api.get("/admin/suppliers", { withCredentials: true })
            .then(res => {
                console.log("✅ Suppliers data:", res.data);
                setSuppliers(res.data);
                setError(null);
            })
            .catch(err => {
                console.error("❌ Error loading suppliers:", err);
                console.error("Response:", err.response);
                console.error("Status:", err.response?.status);
                console.error("Data:", err.response?.data);
                setError("Failed to load suppliers. Please retry.");
            })
            .finally(() => setLoading(false));
    };

    const approve = async (id: number) => {
        try {
            await api.put(`/admin/suppliers/${id}/approve`, {}, { withCredentials: true });
            loadSuppliers();
        } catch (err) {
            console.error("Error approving supplier:", err);
            setError("Failed to approve supplier. Please try again.");
        }
    };

    const reject = async (id: number) => {
        try {
            await api.put(`/admin/suppliers/${id}/reject`, {}, { withCredentials: true });
            loadSuppliers();
        } catch (err) {
            console.error("Error rejecting supplier:", err);
            setError("Failed to reject supplier.");
        }
    };

    const deleteSupplier = async (id: number) => {
        if (!confirm("Are you sure you want to delete this supplier?")) return;

        try {
            await api.delete(`/admin/suppliers/${id}`, { withCredentials: true });
            loadSuppliers();
        } catch (err) {
            console.error("Error deleting supplier:", err);
            setError("Failed to delete supplier. Remove related products first.");
        }
    };

    useEffect(() => {
        loadSuppliers();
    }, []);

    if (loading) return <div className="card p-6">Loading suppliers...</div>;

    const pendingSuppliers = suppliers.filter(s => !s.approved);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-brand-700">Suppliers Management</h1>
                    <p className="text-gray-600 mt-1">
                        {suppliers.length} total suppliers • {pendingSuppliers.length} pending approval
                    </p>
                </div>
                <Store className="w-8 h-8 text-brand-700" />
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
                            <tr className="text-left">
                                <th className="p-4 font-semibold">Company</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Phone</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {suppliers.map(supplier => (
                                <tr key={supplier.id} className="border-t hover:bg-gray-50 transition">
                                    <td className="p-4">
                                        <div className="font-medium">{supplier.companyName}</div>
                                        <div className="text-xs text-gray-500">{supplier.address}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            {supplier.email}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            {supplier.phone}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <StatusBadge status={supplier.status} />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap items-center justify-center gap-2">
                                            <button
                                                onClick={() => approve(supplier.id)}
                                                className="btn btn-primary inline-flex items-center gap-1 text-xs disabled:opacity-50 disabled:pointer-events-none"
                                                title="Approve supplier"
                                                disabled={supplier.status === "APPROVED"}
                                            >
                                                <Check className="w-4 h-4" /> Approve
                                            </button>
                                            <button
                                                onClick={() => reject(supplier.id)}
                                                className="btn btn-secondary text-orange-600 inline-flex items-center gap-1 text-xs hover:bg-orange-50 disabled:opacity-50 disabled:pointer-events-none"
                                                title="Reject supplier"
                                                disabled={supplier.status === "REJECTED"}
                                            >
                                                <XCircle className="w-4 h-4" /> Reject
                                            </button>
                                            <button
                                                onClick={() => deleteSupplier(supplier.id)}
                                                className="btn btn-secondary text-red-600 inline-flex items-center gap-1 hover:bg-red-50 text-xs"
                                                title="Delete supplier"
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
