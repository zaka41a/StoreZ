import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Store, Check, XCircle, Mail, Phone } from "lucide-react";
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

    const loadSuppliers = () => {
        console.log("🔵 Fetching admin suppliers...");
        api.get("/admin/suppliers", { withCredentials: true })
            .then(res => {
                console.log("✅ Suppliers data:", res.data);
                setSuppliers(res.data);
            })
            .catch(err => {
                console.error("❌ Error loading suppliers:", err);
                console.error("Response:", err.response);
                console.error("Status:", err.response?.status);
                console.error("Data:", err.response?.data);
            })
            .finally(() => setLoading(false));
    };

    const approve = async (id: number) => {
        try {
            await api.put(`/admin/suppliers/${id}/approve`, {}, { withCredentials: true });
            loadSuppliers();
        } catch (err) {
            console.error("Error approving supplier:", err);
        }
    };

    const reject = async (id: number) => {
        try {
            await api.put(`/admin/suppliers/${id}/reject`, {}, { withCredentials: true });
            loadSuppliers();
        } catch (err) {
            console.error("Error rejecting supplier:", err);
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
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            supplier.approved
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {supplier.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {!supplier.approved && (
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => approve(supplier.id)}
                                                    className="btn btn-primary inline-flex items-center gap-1"
                                                >
                                                    <Check className="w-4 h-4" /> Approve
                                                </button>
                                                <button
                                                    onClick={() => reject(supplier.id)}
                                                    className="btn btn-secondary text-red-600 inline-flex items-center gap-1"
                                                >
                                                    <XCircle className="w-4 h-4" /> Reject
                                                </button>
                                            </div>
                                        )}
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
