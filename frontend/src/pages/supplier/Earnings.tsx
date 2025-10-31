import { useEffect, useState } from "react";
import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";

export default function Earnings() {
    const [earnings, setEarnings] = useState<any[]>([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        api.get("/supplier/earnings", { withCredentials: true })
            .then(r => {
                setEarnings(r.data.details || []);
                setTotal(r.data.total || 0);
            });
    }, []);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl text-brand-700 font-bold">Earnings Summary</h1>
            <div className="card p-6">
                <div className="text-gray-600 mb-2">Total Earnings</div>
                <div className="text-3xl font-bold text-brand-700">{formatMoney(total)}</div>
            </div>

            <div className="card p-4 overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2">Order</th>
                        <th className="p-2">Product</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Date</th>
                    </tr>
                    </thead>
                    <tbody>
                    {earnings.map((e) => (
                        <tr key={e.id} className="border-t hover:bg-gray-50 transition">
                            <td className="p-2">#{e.orderId}</td>
                            <td className="p-2">{e.productName}</td>
                            <td className="p-2">{formatMoney(e.amount)}</td>
                            <td className="p-2">{new Date(e.date).toLocaleDateString()}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
