import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { motion } from "framer-motion";

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const load = () => api.get("/admin/users").then((r) => setUsers(r.data));

  useEffect(load, []);

  const toggleStatus = async (id: number) => {
    await api.patch(`/admin/users/${id}/toggle`);
    load();
  };

  return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>

        <div className="card p-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-center">Action</th>
            </tr>
            </thead>
            <tbody>
            {users.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-2 font-medium">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.role}</td>
                  <td className="p-2">{u.status}</td>
                  <td className="p-2 text-center">
                    <button onClick={() => toggleStatus(u.id)} className="btn btn-secondary text-sm">
                      Toggle
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </motion.div>
  );
}
