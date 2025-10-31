import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { Users as UsersIcon, Mail } from "lucide-react";
import { motion } from "framer-motion";

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
    phone?: string;
    address?: string;
};

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const loadUsers = () => {
        console.log("🔵 Fetching admin users...");
        api.get("/admin/users", { withCredentials: true })
            .then(res => {
                console.log("✅ Users data:", res.data);
                setUsers(res.data);
            })
            .catch(err => {
                console.error("❌ Error loading users:", err);
                console.error("Response:", err.response);
                console.error("Status:", err.response?.status);
                console.error("Data:", err.response?.data);
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    if (loading) return <div className="card p-6">Loading users...</div>;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-brand-700">Users Management</h1>
                    <p className="text-gray-600 mt-1">{users.length} registered users</p>
                </div>
                <UsersIcon className="w-8 h-8 text-brand-700" />
            </div>

            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr className="text-left">
                                <th className="p-4 font-semibold">ID</th>
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Role</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="border-t hover:bg-gray-50 transition">
                                    <td className="p-4">{user.id}</td>
                                    <td className="p-4 font-medium">{user.name}</td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-4 h-4 text-gray-400" />
                                            {user.email}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'SUPPLIER' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {user.status || 'ACTIVE'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-600">
                                        {user.phone || '—'}
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
