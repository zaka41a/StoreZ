import { useEffect, useState } from "react";
import { api } from "@/services/api";
import ProductCard from "@/components/ProductCard";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Charger les catégories
  useEffect(() => {
    api
        .get("/categories")
        .then((res) => {
          setCategories(res.data || []);
        })
        .catch((err) => {
          console.error("Erreur chargement catégories:", err);
          setCategories([]);
        });
  }, []);

  // Charger les produits
  useEffect(() => {
    setLoading(true);
    api
        .get("/products", {
          params: { query: q, category, page, limit: 12 },
        })
        .then((res) => {
          // Ton backend retourne un tableau direct → pas besoin de .data
          const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
          setProducts(data);
        })
        .catch((err) => {
          console.error("Erreur chargement produits:", err);
          setProducts([]);
        })
        .finally(() => setLoading(false));
  }, [q, category, page]);

  return (
      <div className="space-y-10">
        {/* Bannière d'accueil pour les invités */}
        {!isAuthenticated && (
            <section className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 text-white p-10 md:p-16 text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold">Welcome to StoreZ 🛍️</h1>
              <p className="text-lg text-brand-100 max-w-2xl mx-auto">
                Discover trending products, trusted suppliers, and effortless shopping.
              </p>
              <a
                  href="/register-user"
                  className="btn btn-secondary bg-white text-brand-700 mt-4 font-semibold shadow-lg"
              >
                Start Shopping Now
              </a>
            </section>
        )}

        {/* Barre de recherche et filtre */}
        <section className="card p-6 space-y-4">
          <h2 className="text-2xl font-bold text-brand-700">🛒 Explore Products</h2>
          <div className="flex flex-col md:flex-row gap-3">
            <input
                className="input flex-1"
                placeholder="Search for products..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
            />
            <select
                className="input md:w-60"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
              ))}
            </select>
          </div>
        </section>

        {/* Contenu produits */}
        {loading ? (
            <div className="card p-8 text-center">Loading products...</div>
        ) : products.length === 0 ? (
            <div className="card p-8 text-center text-gray-500">No products found.</div>
        ) : (
            <>
              <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
              >
                {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                ))}
              </motion.div>

              {/* Pagination — optionnelle */}
              <div className="flex items-center justify-center gap-3 pt-6">
                <button
                    className="btn btn-secondary"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </button>
                <div className="text-gray-700 font-medium">Page {page}</div>
                <button
                    className="btn btn-primary"
                    onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </button>
              </div>
            </>
        )}
      </div>
  );
}
