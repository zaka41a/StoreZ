import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Users, Store, DollarSign, Clock } from "lucide-react";
import { formatMoney } from "@/utils/format";
import { motion } from "framer-motion";

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        api.get("/admin/stats", { withCredentials: true })
            .then(r => setStats(r.data))
            .catch(() => setStats({ totalUsers: 0, totalSuppliers: 0, totalSales: 0, pendingApprovals: 0 }));
    }, []);

    if (!stats) return <div className="card p-6">Loading...</div>;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card icon={<Users />} label="Users" value={stats.totalUsers} color="text-blue-500" />
                <Card icon={<Store />} label="Suppliers" value={stats.totalSuppliers} color="text-green-500" />
                <Card icon={<DollarSign />} label="Total Sales" value={formatMoney(stats.totalSales)} color="text-yellow-500" />
                <Card icon={<Clock />} label="Pending Approvals" value={stats.pendingApprovals} color="text-orange-500" />
            </div>
        </motion.div>
    );
}

function Card({ icon, label, value, color }: { icon: JSX.Element; label: string; value: any; color: string }) {
    return (
        <motion.div whileHover={{ scale: 1.03 }} className="card p-6 flex items-center justify-between shadow-sm border">
            <div className={`p-2 rounded-lg bg-brand-50 ${color}`}>{icon}</div>
            <div className="text-right">
                <div className="text-sm text-gray-600">{label}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
        </motion.div>
    );
}
