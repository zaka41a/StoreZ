import { useEffect, useState, useMemo } from "react";
import { api } from "@/services/api";
import { motion } from "framer-motion";
import { Search, Filter, PackageOpen, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom"; // ✅ import React Router

export default function MyProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // ✅ hook navigation interne

  // 🔹 Charger les produits
  const loadProducts = async () => {
    try {
      const res = await api.get("/products/mine", { withCredentials: true });
      setProducts(res.data || []);
    } catch (err) {
      console.error("Erreur chargement produits :", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // 🔹 Filtrage dynamique
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase());
      const matchStatus =
          status === "ALL" ? true : p.status?.toUpperCase() === status;
      return matchSearch && matchStatus;
    });
  }, [products, search, status]);

  if (loading) return <div className="card p-6">Loading your products...</div>;

  return (
      <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">My Products</h1>
          <button
              onClick={() => navigate("/supplier/add-product")} // ✅ navigation interne
              className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>

        {/* Barre de recherche et filtre */}
        <div className="card p-4 flex flex-col md:flex-row md:items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
            <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input pl-10 w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input w-40"
            >
              <option value="ALL">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Liste des produits */}
        {filtered.length === 0 ? (
            <div className="card p-10 text-center text-gray-500 flex flex-col items-center">
              <PackageOpen className="w-10 h-10 text-gray-400 mb-2" />
              <p>No products match your search or filter.</p>
            </div>
        ) : (
            <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((p) => (
                  <motion.article
                      key={p.id}
                      layout
                      className="card p-4 space-y-2 border hover:shadow-md transition"
                      whileHover={{ scale: 1.02 }}
                  >
                    <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-40 object-cover rounded-md"
                    />
                    <div className="font-semibold text-lg truncate">{p.name}</div>
                    <div className="text-sm text-gray-600">{p.category}</div>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-brand-700">${p.price}</div>
                      <StatusBadge status={p.status} />
                    </div>
                  </motion.article>
              ))}
            </motion.div>
        )}
      </motion.div>
  );
}

/* ✅ Badge de statut */
function StatusBadge({ status }: { status: string }) {
  const map: Record<
      string,
      { label: string; color: string; bg: string }
  > = {
    PENDING: {
      label: "Pending",
      color: "text-yellow-700",
      bg: "bg-yellow-100",
    },
    APPROVED: {
      label: "Approved",
      color: "text-green-700",
      bg: "bg-green-100",
    },
    REJECTED: {
      label: "Rejected",
      color: "text-red-700",
      bg: "bg-red-100",
    },
  };

  const s = map[status?.toUpperCase()] || map.PENDING;

  return (
      <span
          className={`px-2 py-1 rounded-md text-xs font-medium ${s.bg} ${s.color}`}
      >
      {s.label}
    </span>
  );
}
