import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, LineChart, Handshake } from "lucide-react";

import { api } from "@/services/api";
import logo from "@/assets/StoreZ.png";

export default function RegisterSupplier() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    companyName: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
    address: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      await api.post("/auth/register-supplier", form);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* Left column */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-brand-900 overflow-hidden">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_55%)]" />
        <div className="absolute -top-16 -right-10 h-96 w-96 rounded-full bg-gold-500 blur-3xl opacity-30" />

        <div className="relative z-10 flex flex-col justify-between px-14 py-14">
          <div>
            <img
              src={logo}
              alt="StoreZ"
              className="h-20 drop-shadow-[0_0_20px_rgba(15,23,42,0.25)]"
            />
            <h2 className="mt-10 text-4xl font-bold leading-tight">
              Scale your brand with a partner built for ambitious suppliers.
            </h2>
            <p className="mt-4 max-w-md text-slate-200/80">
              Showcase your catalogue to millions of engaged buyers, manage
              operations seamlessly, and access insights designed to accelerate growth.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 text-sm">
            {SUPPLIER_FEATURES.map((feature) => (
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
          className="w-full max-w-4xl rounded-3xl bg-white p-10 shadow-2xl ring-1 ring-slate-100"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Become a StoreZ Supplier
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Tell us about your company to access the supplier console.
              </p>
            </div>
            <img src={logo} alt="StoreZ" className="h-12 w-auto hidden sm:block" />
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-6 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-medium text-emerald-600">
              Registration successful! Await admin approval.
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Company Name</label>
              <input
                name="companyName"
                className="input w-full py-3 text-slate-900"
                placeholder="My Awesome Brand"
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
                placeholder="contact@brand.com"
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
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700">Company Description</label>
              <textarea
                name="description"
                className="input min-h-[140px] w-full text-slate-900"
                placeholder="Tell us about your product lines, logistics, and mission statement..."
                rows={5}
                onChange={handleChange}
                required
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
                Register Supplier
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

const SUPPLIER_FEATURES = [
  {
    title: "Global distribution",
    subtitle: "Access a qualified buyer network across multiple regions instantly.",
    icon: Building2,
  },
  {
    title: "Performance insights",
    subtitle: "Real-time dashboards to track conversions, inventory, and demand spikes.",
    icon: LineChart,
  },
  {
    title: "Partnership support",
    subtitle: "Dedicated onboarding specialists and 24/7 merchant assistance.",
    icon: Handshake,
  },
] as const;
