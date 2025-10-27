import { useEffect, useState } from "react";
import { api } from "@/services/api";

export default function SupplierMyProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [msg, setMsg] = useState("");

  const load = async () => {
    const res = await api.get("/products/mine", { withCredentials: true });
    setProducts(res.data);
  };

  useEffect(() => { load(); }, []);

  return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">My Products</h1>

        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Stock</th>
            <th className="p-2">Status</th>
          </tr>
          </thead>
          <tbody>
          {products.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.name}</td>
                <td className="p-2">${p.price}</td>
                <td className="p-2">{p.stock}</td>
                <td className="p-2">
                  {p.status === 'PENDING' && <span className="text-yellow-600">⏳ Pending</span>}
                  {p.status === 'APPROVED' && <span className="text-green-600">✅ Approved</span>}
                  {p.status === 'REJECTED' && <span className="text-red-600">❌ Rejected</span>}
                </td>
              </tr>
          ))}
          </tbody>
        </table>
      </div>
  );
}
