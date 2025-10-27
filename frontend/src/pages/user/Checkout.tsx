import { useCart } from "@/contexts/CartContext";
import { api } from "@/services/api";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { formatMoney } from "@/utils/format";
import { CreditCard, MapPin } from "lucide-react";
import { useMemo, useState } from "react";

export default function Checkout() {
  const { items, clear } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: "",
    address: "",
    city: "",
    country: "",
    zip: "",
    note: "",
  });

  const total = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items]);
  const shipping = items.length === 0 ? 0 : 4.99;
  const vat = total * 0.2;
  const grandTotal = total + shipping + vat;

  if (!isAuthenticated) {
    return (
        <div className="max-w-3xl mx-auto card p-8">
          <h2 className="text-xl font-semibold mb-2">Sign in to checkout</h2>
          <p className="text-gray-600 mb-4">
            You can add products to cart without an account, but you must log in (or create an account) to place the order.
          </p>
          <div className="flex gap-3">
            <Link to="/login?next=/user/checkout" className="btn btn-primary">Login</Link>
            <Link to="/register" className="btn">Create account</Link>
          </div>
        </div>
    );
  }

  const place = async () => {
    if (items.length === 0) return;
    // Envoie les infos de livraison + items
    await api.post(
        "/orders",
        { items, shipping: form, note: form.note },
        { withCredentials: true }
    ).catch(() => {}); // si tu veux, gère les erreurs joliment
    clear();
    navigate("/user/orders");
  };

  return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adresse de livraison */}
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-brand-700" />
            <h2 className="text-xl font-semibold">Shipping address</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} />
            <Input label="Email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} />
            <Input label="Phone" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
            <Input label="Address" value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})} />
            <Input label="City" value={form.city} onChange={(e)=>setForm({...form, city:e.target.value})} />
            <Input label="Country" value={form.country} onChange={(e)=>setForm({...form, country:e.target.value})} />
            <Input label="ZIP / Postal code" value={form.zip} onChange={(e)=>setForm({...form, zip:e.target.value})} />
            <div className="md:col-span-2">
              <label className="text-sm text-gray-600">Order note (optional)</label>
              <textarea className="input w-full min-h-[90px]" value={form.note} onChange={(e)=>setForm({...form, note:e.target.value})} />
            </div>
          </div>
        </div>

        {/* Résumé commande */}
        <aside className="card p-6 h-fit sticky top-24">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-brand-700" />
            <h3 className="text-lg font-semibold">Order Summary</h3>
          </div>

          <div className="space-y-2 text-sm mb-4">
            <Row label="Items" value={`${items.length}`} />
            <Row label="Subtotal" value={formatMoney(total)} />
            <Row label="Shipping" value={shipping === 0 ? "—" : formatMoney(shipping)} />
            <Row label="VAT (20%)" value={formatMoney(vat)} />
            <div className="border-t my-3" />
            <Row label={<span className="font-semibold">Total</span>} value={<span className="font-semibold">{formatMoney(grandTotal)}</span>} />
          </div>

          <button
              disabled={items.length === 0}
              className="btn btn-primary w-full disabled:opacity-50"
              onClick={place}
          >
            Place Order
          </button>
          <Link to="/user/cart" className="block text-center text-sm text-gray-600 mt-2 hover:underline">
            Back to cart
          </Link>
        </aside>
      </div>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
      <div className="space-y-1">
        <label className="text-sm text-gray-600">{label}</label>
        <input {...rest} className="input w-full" />
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
