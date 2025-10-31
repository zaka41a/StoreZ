import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, BarChart3 } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/StoreZ.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/");
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col lg:flex-row">
      {/* Left column – brand story */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900 overflow-hidden">
        <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.25),_transparent_55%)]" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-indigo-500 blur-3xl opacity-30" />

        <div className="relative z-10 flex flex-col justify-between px-14 py-14">
          <div>
            <img
              src={logo}
              alt="StoreZ"
              className="h-20 drop-shadow-[0_0_20px_rgba(15,23,42,0.25)]"
            />
            <h2 className="mt-10 text-4xl font-bold leading-tight">
              Delivering a premium commerce experience for modern retailers.
            </h2>
            <p className="mt-4 max-w-md text-slate-200/80">
              Manage your catalogue, track performance, and turn insights into action —
              all from one secure dashboard.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-4 text-sm">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur"
              >
                <feature.icon className="h-5 w-5 text-yellow-300 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-100">{feature.title}</div>
                  <p className="text-slate-200/70">{feature.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column – form */}
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-2xl ring-1 ring-slate-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
              <p className="mt-1 text-sm text-slate-500">Sign in to continue to StoreZ.</p>
            </div>
            <img src={logo} alt="StoreZ" className="h-12 w-auto hidden sm:block" />
          </div>

          {error && (
            <div className="mt-6 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Email</label>
              <input
                type="email"
                autoComplete="email"
                className="input w-full py-3 text-slate-900"
                placeholder="you@storez.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                className="input w-full py-3 text-slate-900"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <div className="flex justify-end">
                <Link
                  to="/help"
                  className="text-sm font-medium text-brand-600 hover:text-brand-700"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full py-3 text-base font-semibold"
            >
              Sign In
            </button>
          </form>

          <div className="mt-10 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
            New to StoreZ?{" "}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-brand-700">
              Create an account
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const FEATURES = [
  {
    title: "Enterprise-grade security",
    subtitle: "Every session is encrypted and monitored in real time.",
    icon: ShieldCheck,
  },
  {
    title: "Smart analytics",
    subtitle: "Translate product performance into actionable insights instantly.",
    icon: BarChart3,
  },
  {
    title: "Customer delight",
    subtitle: "Create exceptional experiences with curated storefronts.",
    icon: Sparkles,
  },
] as const;
