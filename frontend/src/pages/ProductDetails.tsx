import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";
import { getImageUrl } from "@/utils/image";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";

export default function ProductDetails() {
  const { id } = useParams();
  const [p, setP] = useState<any>(null);
  const { addItem } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => setP(r.data));
  }, [id]);

  if (!p) return <div className="card p-8">Loading product...</div>;

  return (
      <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
      >
        {/* Image produit */}
        <div className="rounded-xl overflow-hidden border">
          <img
              src={getImageUrl(p.image)}
              alt={p.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          />
        </div>

        {/* Infos produit */}
        <div className="card p-6 space-y-4">
          <h1 className="text-2xl font-semibold">{p.name}</h1>

          {/* ✅ Nom du supplier */}
          <div className="text-sm text-gray-600">
            by{" "}
            <a
                href="#"
                className="font-medium text-brand-700 hover:underline"
            >
              {p.supplierName || "Unknown supplier"}
            </a>
          </div>


          <div className="text-2xl font-bold text-brand-700">
            {formatMoney(p.price)}
          </div>

          <p className="text-gray-700 leading-relaxed">{p.description}</p>

          <div className="pt-4">
            <button
                className="btn btn-primary w-full md:w-auto"
                onClick={() => addItem(p)}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </motion.div>
  );
}
