import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { motion } from "framer-motion";
import { Check, XCircle } from "lucide-react";

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);

  const load = async () => {
    const res = await api.get("/products", { withCredentials: true });
    setProducts(res.data.products || []);
  };

  const approve = async (id: number) => {
    await api.put(`/products/${id}/approve`, {}, { withCredentials: true });
    load();
  };

  const reject = async (id: number) => {
    await api.put(`/products/${id}/reject`, {}, { withCredentials: true });
    load();
  };

  useEffect(() => { load(); }, []);

  return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="space-y-6">
        <h1 className="text-2xl font-semibold">Product Moderation</h1>

        <div className="overflow-x-auto card p-6">
          <table className="min-w-full text-sm">
            <thead>
            <tr className="text-left text-gray-600">
              <th className="p-2">Image</th>
              <th className="p-2">Name</th>
              <th className="p-2">Supplier</th>
              <th className="p-2">Price</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
            </thead>
            <tbody>
            {products.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50 transition">
                  <td className="p-2">
                    <img src={p.image} alt={p.name} className="h-12 w-12 rounded object-cover" />
                  </td>
                  <td className="p-2 font-semibold">{p.name}</td>
                  <td className="p-2 text-gray-700">{p.supplier?.companyName || "—"}</td>
                  <td className="p-2">${p.price}</td>
                  <td className="p-2">{p.status}</td>
                  <td className="p-2 text-center space-x-2">
                    {p.status === "PENDING" && (
                        <>
                          <button onClick={() => approve(p.id)} className="btn btn-primary inline-flex items-center gap-1">
                            <Check className="w-4 h-4" /> Approve
                          </button>
                          <button onClick={() => reject(p.id)} className="btn btn-secondary text-red-600 inline-flex items-center gap-1">
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
