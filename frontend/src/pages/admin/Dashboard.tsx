import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";
import { Users, Store, DollarSign, Clock } from "lucide-react";

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);

    useEffect(() => {
        api.get("/admin/stats", { withCredentials: true })
            .then(r => setStats(r.data))
            .catch(() => setStats({ totalUsers: 0, totalSuppliers: 0, totalSales: 0, pendingApprovals: 0 }));
    }, []);

    if (!stats) return <div className="card p-6">Loading...</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card icon={<Users className="text-blue-500" />} label="Users" value={stats.totalUsers} />
                <Card icon={<Store className="text-green-500" />} label="Suppliers" value={stats.totalSuppliers} />
                <Card icon={<DollarSign className="text-yellow-500" />} label="Total Sales" value={formatMoney(stats.totalSales)} />
                <Card icon={<Clock className="text-orange-500" />} label="Pending Approvals" value={stats.pendingApprovals} />
            </div>
        </div>
    );
}

function Card({ icon, label, value }: { icon: any; label: string; value: any }) {
    return (
        <div className="card p-6 flex items-center gap-3">
            {icon}
            <div>
                <div className="text-sm text-gray-600">{label}</div>
                <div className="text-2xl font-bold">{value}</div>
            </div>
        </div>
    );
}
