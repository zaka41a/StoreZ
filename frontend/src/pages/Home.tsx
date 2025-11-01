import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search as SearchIcon,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import ProductCard from "@/components/ProductCard";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";

const HERO_STATS = [
  { label: "Premium products", value: "5k+" },
  { label: "Verified suppliers", value: "430" },
  { label: "Orders fulfilled", value: "320K" },
  { label: "Countries served", value: "48" },
] as const;

const VALUE_POINTS: Array<{ title: string; description: string; icon: LucideIcon }> = [
  {
    title: "Trusted sellers",
    description: "Every supplier is vetted with rigorous quality and compliance checks.",
    icon: ShieldCheck,
  },
  {
    title: "Fast discovery",
    description: "Advanced filtering surfaces relevant inventory in seconds.",
    icon: SearchIcon,
  },
  {
    title: "Growth insights",
    description: "Actionable analytics help you scale merchandising decisions.",
    icon: TrendingUp,
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = isAuthenticated ? 9 : 8;

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(res.data || []))
      .catch((err) => {
        console.error("Erreur chargement catégories:", err);
        setCategories([]);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .get("/products", {
        params: { query: q, category, page, size: pageSize },
      })
      .then((res) => {
        setProducts(res.data.products || []);
        setTotalPages(Math.max(res.data.totalPages || 1, 1));
        setTotalItems(res.data.totalItems ?? res.data.products?.length ?? 0);
      })
      .catch((err) => {
        console.error("Erreur chargement produits:", err);
        setProducts([]);
        setTotalItems(0);
      })
      .finally(() => setLoading(false));
  }, [q, category, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    setPage(1);
  }, [q, category]);

  const categoryFilters = useMemo(
    () => [{ label: "All", value: "" }, ...categories.map((c) => ({ label: c, value: c }))],
    [categories]
  );

  const showingFrom = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const showingTo = totalItems === 0 ? 0 : Math.min(page * pageSize, totalItems || page * pageSize);

  const handleCategoryClick = (value: string) => {
    setCategory((prev) => (prev === value ? "" : value));
    setPage(1);
  };

  return (
    <div className="space-y-16 pb-16">
      {!isAuthenticated && (
        <motion.section
          className="relative overflow-hidden rounded-3xl border border-gold-200 bg-gradient-to-br from-brand-700 via-brand-800 to-brand-900 text-white shadow-2xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute left-1/3 top-0 h-64 w-64 rounded-full bg-gold-400/30 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-96 w-96 rounded-full bg-gold-500/30 blur-3xl" />

          <div className="relative z-10 flex flex-col gap-12 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-12">
            <div className="max-w-2xl space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/50 bg-gradient-to-r from-gold-500/20 to-gold-600/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-gold-200">
                <Sparkles className="h-4 w-4 text-gold-400" />
                Elevated commerce
              </span>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                Curated products, vetted suppliers, seamless fulfillment.
              </h1>
              <p className="text-base text-brand-100 md:text-lg">
                StoreZ brings together premium inventory and data-backed merchandising tools so you
                can build an exceptional retail experience without compromise.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link
                  to={isAuthenticated ? "/user/home" : "/register-user"}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:from-gold-500 hover:to-gold-600 hover:shadow-xl"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Start exploring
                </Link>
                <Link
                  to="/register-supplier"
                  className="inline-flex items-center gap-2 rounded-full border border-gold-400/50 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-gold-400 hover:bg-white/10"
                >
                  Become a supplier
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid w-full grid-cols-2 gap-4 md:w-96">
              {HERO_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-gold-400/30 bg-gradient-to-br from-white/15 to-white/5 p-4 shadow-lg shadow-black/10 backdrop-blur hover:border-gold-400/50 transition-all hover:-translate-y-1"
                >
                  <div className="text-3xl font-semibold text-gold-100">{stat.value}</div>
                  <div className="text-sm text-white/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.section>
      )}

      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur-sm">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full rounded-full border border-slate-200 bg-white px-11 py-3 text-sm text-slate-700 shadow-sm transition focus:border-brand-600 focus:outline-none"
              placeholder="Search products, brands, or categories"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          {categoryFilters.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filter
              </span>
              {categoryFilters.map(({ label, value }) => {
                const active = category === value || (!category && value === "");
                return (
                  <button
                    key={value || "all"}
                    onClick={() => handleCategoryClick(value)}
                    className={[
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                      active
                        ? "border-transparent bg-gradient-to-r from-brand-600 to-gold-600 text-white shadow-lg shadow-gold-500/25"
                        : "border-slate-200 bg-white text-slate-600 hover:border-gold-400 hover:text-gold-700",
                    ].join(" ")}
                  >
                    {active && <Sparkles className="h-3.5 w-3.5" />}
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm backdrop-blur-sm">
          <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            Why StoreZ
          </h3>
          <div className="mt-4 space-y-4">
            {VALUE_POINTS.map(({ title, description, icon: Icon }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-slate-700">{title}</div>
                  <p className="text-sm text-slate-500">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Latest marketplace arrivals</h2>
            <p className="text-sm text-slate-500">
              Hand-picked selections across {Math.max(categories.length, 1)} categories, updated in
              real time.
            </p>
          </div>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand-600 transition hover:text-brand-700"
          >
            Learn about our sourcing standards
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-slate-200 bg-white/85 px-6 py-20 text-center text-slate-500 shadow-sm">
            Refreshing the catalogue...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white/85 px-6 py-16 text-center text-slate-500 shadow-sm">
            No products match your filters yet. Try adjusting your search or explore a different
            category.
          </div>
        ) : (
          <>
            <motion.div
              layout
              className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4"
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>

            <div className="flex flex-col gap-3 rounded-3xl border border-slate-200 bg-white/85 px-4 py-4 text-sm text-slate-600 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing {showingFrom}-{showingTo} of {totalItems || products.length} products
              </span>
              <div className="flex items-center gap-2">
                <button
                  className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-600 transition hover:border-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </button>
                <span className="text-xs font-semibold text-slate-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-600 transition hover:border-brand-600 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {!isAuthenticated && (
        <section className="overflow-hidden rounded-3xl border border-gold-300 bg-gradient-to-r from-brand-600 via-brand-700 to-gold-600 px-8 py-12 text-white shadow-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-white/80">
                <ShieldCheck className="h-4 w-4" />
                Join the ecosystem
              </span>
              <h3 className="text-2xl font-semibold leading-tight">
                Ready to deliver unforgettable shopping experiences?
              </h3>
              <p className="text-sm text-white/80">
                Create your StoreZ account to access personalised collections, exclusive launches,
                and supplier pricing tailored to you.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/register-user"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Create shopper account
              </Link>
              <Link
                to="/register-supplier"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-white"
              >
                Register as supplier
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
