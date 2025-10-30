import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export default function AdminSuppliers() {
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const load = async () => {
        try {
            const res = await api.get("/admin/suppliers", { withCredentials: true });
            setSuppliers(res.data);
        } catch {
            setSuppliers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const approveSupplier = async (id: number) => {
        await api.put(`/admin/suppliers/${id}/approve`, {}, { withCredentials: true });
        load();
    };

    const rejectSupplier = async (id: number) => {
        await api.put(`/admin/suppliers/${id}/reject`, {}, { withCredentials: true });
        load();
    };

    if (loading) return <div className="card p-6">Loading suppliers...</div>;

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
        >
            <h1 className="text-2xl font-semibold">Suppliers Management</h1>

            <div className="card p-6 overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="text-left text-gray-600">
                        <th className="p-2">Company</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Phone</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Approved</th>
                        <th className="p-2 text-center">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {suppliers.map((s) => (
                        <tr key={s.id} className="border-t hover:bg-gray-50 transition">
                            <td className="p-2 font-medium">{s.companyName}</td>
                            <td className="p-2">{s.email}</td>
                            <td className="p-2">{s.phone || "—"}</td>
                            <td className="p-2">{s.status}</td>
                            <td className="p-2">{s.approved ? "✅ Yes" : "⏳ No"}</td>
                            <td className="p-2 text-center space-x-2">
                                {!s.approved && (
                                    <>
                                        <button
                                            onClick={() => approveSupplier(s.id)}
                                            className="btn btn-primary inline-flex items-center gap-1"
                                        >
                                            <CheckCircle2 className="w-4 h-4" /> Approve
                                        </button>
                                        <button
                                            onClick={() => rejectSupplier(s.id)}
                                            className="btn btn-secondary text-red-600 inline-flex items-center gap-1"
                                        >
                                            <XCircle className="w-4 h-4" /> Reject
                                        </button>
                                    </>
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
