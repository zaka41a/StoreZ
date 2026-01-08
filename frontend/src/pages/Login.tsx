import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, BarChart3, Eye, EyeOff } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/StoreZ.png";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
    } catch {
      setError("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-950 text-slate-100 flex flex-col lg:flex-row">
      {/* Left column – brand story */}
      <div className="relative hidden lg:flex lg:w-1/2 overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.15),_transparent_60%)]" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-amber-500 blur-3xl opacity-20" />
        <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-purple-500 blur-3xl opacity-15" />

        <div className="relative z-10 flex flex-col px-14 py-14 space-y-8">
          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Delivering a premium commerce experience for modern retailers.
            </h2>
            <p className="mt-3 max-w-md text-slate-200/80">
              Manage your catalogue, track performance, and turn insights into action —
              all from one secure dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 text-sm">
            {FEATURES.map((feature) => (
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

      {/* Right column – form */}
      <div className="flex flex-1 items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-lg rounded-3xl bg-white p-10 shadow-2xl ring-1 ring-slate-100"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Welcome back</h1>
            <p className="mt-1 text-sm text-slate-500">Sign in to continue to StoreZ.</p>
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="input w-full py-3 pr-12 text-slate-900"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              <div className="flex justify-end">
                <Link
                  to="/help"
                  className="text-sm font-medium text-brand-600 hover:text-gold-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="btn w-full py-3 text-base font-semibold bg-gradient-to-r from-gold-400 to-gold-500 text-white hover:from-gold-500 hover:to-gold-600 transition-all shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </form>

          <div className="mt-10 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">
            New to StoreZ?{" "}
            <Link to="/register" className="font-semibold text-brand-600 hover:text-gold-600 transition-colors">
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
