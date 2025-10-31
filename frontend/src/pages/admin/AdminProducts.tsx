import { useEffect, useState } from "react";
import { api } from "@/services/api";

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
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Products Moderation</h1>
            <table className="min-w-full bg-white shadow rounded-lg">
                <thead>
                <tr className="bg-gray-100 text-left">
                    <th className="p-2">Name</th>
                    <th className="p-2">Supplier</th>
                    <th className="p-2">Price</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                </tr>
                </thead>
                <tbody>
                {products.map(p => (
                    <tr key={p.id} className="border-t">
                        <td className="p-2">{p.name}</td>
                        <td className="p-2">{p.supplier?.companyName}</td>
                        <td className="p-2">${p.price}</td>
                        <td className="p-2">{p.status}</td>
                        <td className="p-2 space-x-2">
                            {p.status === "PENDING" && (
                                <>
                                    <button onClick={() => approve(p.id)} className="btn btn-success text-white">Approve</button>
                                    <button onClick={() => reject(p.id)} className="btn btn-danger text-white">Reject</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
