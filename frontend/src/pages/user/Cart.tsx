import { useCart } from "@/contexts/CartContext";
import { formatMoney } from "@/utils/format";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";

export default function Cart() {
    const { items, removeItem, updateQty, total } = useCart();
    const navigate = useNavigate();

    const shipping = items.length === 0 ? 0 : 4.99;    // exemple
    const vat = total * 0.2;                           // 20% TVA (exemple)
    const grandTotal = total + shipping + vat;

    if (items.length === 0) {
        return (
            <div className="max-w-3xl mx-auto card p-8 text-center">
                <div className="text-lg font-semibold mb-2">Your cart is empty.</div>
                <Link to="/" className="btn btn-primary mt-2">Browse products</Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Liste des articles */}
            <div className="lg:col-span-2 card p-4 space-y-4">
                {items.map((i) => (
                    <div key={i.productId} className="flex items-center gap-4 border-t first:border-0 py-4">
                        <img src={i.image} className="h-20 w-20 rounded object-cover" alt={i.name} />
                        <div className="grow min-w-0">
                            <div className="font-medium truncate">{i.name}</div>
                            <div className="text-sm text-gray-600">{formatMoney(i.price)}</div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button className="btn" onClick={() => updateQty(i.productId, Math.max(1, i.qty - 1))}>
                                <Minus className="w-4 h-4" />
                            </button>
                            <input
                                type="number"
                                className="input w-20 text-center"
                                value={i.qty}
                                min={1}
                                onChange={(e) => updateQty(i.productId, Math.max(1, Number(e.target.value)))}
                            />
                            <button className="btn" onClick={() => updateQty(i.productId, i.qty + 1)}>
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="w-24 text-right font-semibold">{formatMoney(i.price * i.qty)}</div>

                        <button
                            className="btn btn-secondary"
                            title="Remove"
                            onClick={() => removeItem(i.productId)}
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Résumé */}
            <aside className="card p-6 h-fit sticky top-24">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                    <Row label="Subtotal" value={formatMoney(total)} />
                    <Row label="Estimated shipping" value={shipping === 0 ? "—" : formatMoney(shipping)} />
                    <Row label="VAT (20%)" value={formatMoney(vat)} />
                    <div className="border-t my-3" />
                    <Row label={<span className="font-semibold">Total</span>} value={<span className="font-semibold">{formatMoney(grandTotal)}</span>} />
                </div>
                <button
                    className="btn btn-primary w-full mt-4"
                    onClick={() => navigate("/user/checkout")}
                >
                    Go to Checkout
                </button>
                <Link to="/" className="block text-center text-sm text-gray-600 mt-2 hover:underline">
                    Continue shopping
                </Link>
            </aside>
        </div>
    );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-gray-600">{label}</span>
            <span>{value}</span>
        </div>
    );
}
