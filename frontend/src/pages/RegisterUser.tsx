import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, CreditCard, ShieldCheck } from "lucide-react";

import { api } from "@/services/api";
import logo from "@/assets/StoreZ.png";

export default function RegisterUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
    address: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await api.post("/auth/register-user", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 1800);
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-950 text-slate-100 flex flex-col lg:flex-row">
      {/* Left column */}
      <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.15),_transparent_60%)]" />
        <div className="absolute -bottom-24 -left-10 h-96 w-96 rounded-full bg-amber-500 blur-3xl opacity-20" />
        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-fuchsia-500 blur-3xl opacity-15" />

        <div className="relative z-10 flex flex-col px-14 py-14 space-y-8">
          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Shop smarter with a tailored experience built around you.
            </h2>
            <p className="mt-3 max-w-md text-slate-200/80">
              Create wishlists, get curated recommendations, track deliveries, and
              unlock exclusive offers in one secure StoreZ account.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 text-sm">
            {USER_FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <feature.icon className="h-5 w-5 text-gold-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-100">{feature.title}</div>
                  <p className="text-slate-200/70">{feature.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-3xl rounded-3xl bg-white p-10 shadow-2xl ring-1 ring-slate-100"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Create your StoreZ account
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Join a global community of savvy shoppers.
            </p>
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-emerald-600">
              Registration successful! Redirecting to login...
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Full Name</label>
              <input
                name="name"
                className="input w-full py-3 text-slate-900"
                placeholder="John Doe"
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                name="email"
                type="email"
                className="input w-full py-3 text-slate-900"
                placeholder="you@example.com"
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Phone</label>
              <input
                name="phone"
                className="input w-full py-3 text-slate-900"
                placeholder="+212 6 12 34 56 78"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Address</label>
              <input
                name="address"
                className="input w-full py-3 text-slate-900"
                placeholder="City, Country"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input
                name="password"
                type="password"
                className="input w-full py-3 text-slate-900"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
              <input
                name="confirm"
                type="password"
                className="input w-full py-3 text-slate-900"
                placeholder="••••••••"
                onChange={handleChange}
                required
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button
                type="submit"
                className="btn w-full py-3 text-base font-semibold bg-gradient-to-r from-gold-400 to-gold-500 text-white hover:from-gold-500 hover:to-gold-600 transition-all shadow-lg hover:shadow-xl"
              >
                Create Account
              </button>
            </div>
          </form>

          <div className="mt-10 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-brand-600 hover:text-gold-600 transition-colors">
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const USER_FEATURES = [
  {
    title: "Personalised discovery",
    subtitle: "Exclusive launches and curated picks based on your preferences.",
    icon: ShoppingBag,
  },
  {
    title: "Secure payments",
    subtitle: "Trusted gateways with multi-layer encryption on every purchase.",
    icon: CreditCard,
  },
  {
    title: "Buyer protection",
    subtitle: "Transparent tracking and support from checkout to delivery.",
    icon: ShieldCheck,
  },
] as const;
