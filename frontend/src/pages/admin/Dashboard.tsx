import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
    Activity,
    AlertCircle,
    ArrowRight,
    CheckSquare,
    Clock,
    Package,
    ShieldCheck,
    ShoppingCart,
    TrendingUp,
    Users,
} from "lucide-react";

import { api } from "@/services/api";
import { formatMoney } from "@/utils/format";

type DashboardStats = {
    totalUsers: number;
    totalSuppliers: number;
    totalProducts: number;
    totalOrders: number;
    pendingProducts: number;
    pendingSuppliers: number;
    totalRevenue: number;
    monthRevenue: number;
};

const FALLBACK_STATS: DashboardStats = {
    totalUsers: 0,
    totalSuppliers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingProducts: 0,
    pendingSuppliers: 0,
    totalRevenue: 0,
    monthRevenue: 0,
};

const numberFormatter = new Intl.NumberFormat("en-US");

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        api
            .get("/admin/dashboard", { withCredentials: true })
            .then((res) => {
                if (cancelled) return;
                setStats(res.data);
                setErrorMessage(null);
            })
            .catch((err) => {
                if (cancelled) return;
                console.error("❌ Error loading dashboard:", err);
                const status = err.response?.status;
                if (status === 401 || status === 403) {
                    setErrorMessage(
                        "Your admin session has expired. Please log in again to access the analytics console."
                    );
                } else {
                    setErrorMessage(
                        err.response?.data?.message || "We couldn't load the dashboard metrics. Please retry later."
                    );
                }
                setStats(null);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const resolvedStats = useMemo(() => stats ?? FALLBACK_STATS, [stats]);
    const hasOperationalData = useMemo(
        () => Object.values(resolvedStats).some((value) => value > 0),
        [resolvedStats]
    );

    const summaryTiles = useMemo(
        () => [
            {
                label: "Total revenue",
                value: formatMoney(resolvedStats.totalRevenue),
                hint: "All time",
                icon: <TrendingUp className="h-5 w-5" />,
            },
            {
                label: "Orders processed",
                value: numberFormatter.format(resolvedStats.totalOrders),
                hint: "Across the marketplace",
                icon: <ShoppingCart className="h-5 w-5" />,
            },
            {
                label: "Pending approvals",
                value: numberFormatter.format(
                    resolvedStats.pendingProducts + resolvedStats.pendingSuppliers
                ),
                hint: "Products & suppliers",
                icon: <Clock className="h-5 w-5" />,
            },
            {
                label: "Monthly revenue",
                value: formatMoney(resolvedStats.monthRevenue),
                hint: "Current month",
                icon: <Activity className="h-5 w-5" />,
            },
        ],
        [resolvedStats]
    );

    const kpiCards = useMemo(
        () => [
            {
                label: "Total users",
                value: numberFormatter.format(resolvedStats.totalUsers),
                icon: <Users className="h-6 w-6" />,
                accent: "bg-blue-50 text-blue-700",
            },
            {
                label: "Total suppliers",
                value: numberFormatter.format(resolvedStats.totalSuppliers),
                icon: <Package className="h-6 w-6" />,
                accent: "bg-purple-50 text-purple-700",
            },
            {
                label: "Total products",
                value: numberFormatter.format(resolvedStats.totalProducts),
                icon: <ShoppingCart className="h-6 w-6" />,
                accent: "bg-emerald-50 text-emerald-700",
            },
            {
                label: "Total orders",
                value: numberFormatter.format(resolvedStats.totalOrders),
                icon: <TrendingUp className="h-6 w-6" />,
                accent: "bg-orange-50 text-orange-700",
            },
        ],
        [resolvedStats]
    );

    const quickActions = useMemo(
        () => [
            {
                label: "Review products",
                description: `${resolvedStats.pendingProducts} awaiting moderation`,
                href: "/admin/products",
                icon: <CheckSquare className="h-5 w-5" />,
                variant: "primary" as const,
            },
            {
                label: "Review suppliers",
                description: `${resolvedStats.pendingSuppliers} pending onboarding`,
                href: "/admin/suppliers",
                icon: <ShieldCheck className="h-5 w-5" />,
                variant: "primary" as const,
            },
            {
                label: "Manage orders",
                description: "Track fulfilment status",
                href: "/admin/orders",
                icon: <Activity className="h-5 w-5" />,
                variant: "secondary" as const,
            },
        ],
        [resolvedStats.pendingProducts, resolvedStats.pendingSuppliers]
    );

    if (loading) {
        return <div className="card p-6">Loading dashboard...</div>;
    }

    if (errorMessage) {
        return (
            <div className="card bg-red-50 border-red-200 p-6">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                    <div className="space-y-2">
                        <h3 className="font-semibold text-red-800">Dashboard unavailable</h3>
                        <p className="text-sm text-red-700">{errorMessage}</p>
                        <div className="flex gap-2">
                            <a href="/login" className="btn btn-primary inline-flex items-center gap-2">
                                Go to Login <ArrowRight className="h-4 w-4" />
                            </a>
                            <button onClick={() => window.location.reload()} className="btn btn-secondary inline-flex items-center gap-2">
                                Retry <ArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-10"
        >
            <Hero summaryTiles={summaryTiles} />

            {!hasOperationalData && <EmptyStateNotice />}

            <section className="grid gap-4 lg:grid-cols-4">
                {kpiCards.map((card) => (
                    <MetricCard key={card.label} {...card} />
                ))}
            </section>

            {(resolvedStats.pendingProducts > 0 || resolvedStats.pendingSuppliers > 0) && (
                <PendingApprovals
                    products={resolvedStats.pendingProducts}
                    suppliers={resolvedStats.pendingSuppliers}
                />
            )}

            <section className="grid gap-4 lg:grid-cols-[2fr,1fr]">
                <HealthPanel stats={resolvedStats} />
                <QuickActionsPanel actions={quickActions} />
            </section>
        </motion.div>
    );
}

type HeroProps = {
    summaryTiles: Array<{ label: string; value: string; hint: string; icon: JSX.Element }>;
};

function Hero({ summaryTiles }: HeroProps) {
    return (
        <section className="relative overflow-hidden rounded-3xl border border-brand-100 bg-gradient-to-br from-brand-700 via-brand-800 to-indigo-900 text-white shadow-lg">
            <div className="absolute inset-y-0 right-0 h-full w-1/2 bg-gradient-to-br from-brand-400/40 via-indigo-400/30 to-transparent blur-3xl" />
            <div className="relative z-10 flex flex-col gap-10 px-8 py-10 sm:px-12 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-5 max-w-2xl">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/90">
                        <ShieldCheck className="h-4 w-4" />
                        Admin command center
                    </span>
                    <h1 className="text-4xl font-bold leading-tight lg:text-5xl">
                        Oversee marketplace performance and unblock approvals instantly.
                    </h1>
                    <p className="text-sm text-white/75 lg:text-base">
                        Monitor growth indicators, resolve bottlenecks, and keep your catalogue curated in real time.
                    </p>
                </div>
                <div className="grid w-full max-w-xl grid-cols-2 gap-4">
                    {summaryTiles.map((tile) => (
                        <div
                            key={tile.label}
                            className="rounded-2xl border border-white/25 bg-white/15 p-4 backdrop-blur shadow-lg shadow-black/10"
                        >
                            <div className="flex items-center justify-between text-sm text-white/80">
                                <span>{tile.label}</span>
                                {tile.icon}
                            </div>
                            <div className="mt-3 text-2xl font-semibold">{tile.value}</div>
                            <p className="mt-1 text-xs text-white/70">{tile.hint}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function EmptyStateNotice() {
    return (
        <div className="rounded-3xl border border-dashed border-brand-200 bg-brand-50/60 px-6 py-8 text-sm text-brand-700">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-brand-500" />
                    <div>
                        <h2 className="text-base font-semibold text-brand-700">No marketplace activity yet</h2>
                        <p className="text-sm text-brand-600">
                            Once orders start flowing and catalogues go live, your KPIs will surface here.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <a href="/admin/products" className="btn btn-secondary">
                        Moderate products
                    </a>
                    <a href="/admin/suppliers" className="btn btn-primary">
                        Onboard suppliers
                    </a>
                </div>
            </div>
        </div>
    );
}

type MetricCardProps = {
    label: string;
    value: string;
    icon: JSX.Element;
    accent: string;
};

function MetricCard({ label, value, icon, accent }: MetricCardProps) {
    return (
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-slate-500">{label}</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
                </div>
                <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${accent}`}>
                    {icon}
                </span>
            </div>
        </div>
    );
}

type PendingApprovalsProps = {
    products: number;
    suppliers: number;
};

function PendingApprovals({ products, suppliers }: PendingApprovalsProps) {
    return (
        <div className="rounded-3xl border border-yellow-200 bg-yellow-50/80 p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <AlertCircle className="h-6 w-6 text-yellow-600" />
                    <div>
                        <h3 className="font-semibold text-yellow-800">Pending approvals</h3>
                        <p className="text-sm text-yellow-700">
                            {products > 0 && `${products} products`} {products > 0 && suppliers > 0 && "and"} {suppliers > 0 && `${suppliers} suppliers`} awaiting validation.
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <a href="/admin/products" className="btn btn-primary">
                        Review products
                    </a>
                    <a href="/admin/suppliers" className="btn btn-secondary">
                        Review suppliers
                    </a>
                </div>
            </div>
        </div>
    );
}

function HealthPanel({ stats }: { stats: DashboardStats }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold text-slate-800">Operational health</h3>
            <p className="text-sm text-slate-500">
                Use this quick snapshot to identify the next actions that will unlock sales momentum.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
                <HealthTile
                    title="Catalogue freshness"
                    value={`${stats.pendingProducts} items pending`}
                    description="Ensure newly submitted products are reviewed promptly so they can go live."
                />
                <HealthTile
                    title="Supplier onboarding"
                    value={`${stats.pendingSuppliers} suppliers waiting`}
                    description="Approve or decline supplier applications to keep your marketplace curated."
                />
                <HealthTile
                    title="Revenue run rate"
                    value={formatMoney(stats.monthRevenue)}
                    description="Compare month-to-date revenue against your targets to stay on track."
                />
                <HealthTile
                    title="Order fulfilment"
                    value={`${stats.totalOrders} orders processed`}
                    description="Monitor fulfilment timeliness and escalate exceptions to operations."
                />
            </div>
        </div>
    );
}

function QuickActionsPanel({ actions }: { actions: QuickActionProps[] }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-md">
            <h3 className="text-lg font-semibold text-slate-800">Quick actions</h3>
            <p className="text-sm text-slate-500 mb-4">Resolve the most impactful tasks to keep the marketplace healthy.</p>
            <div className="space-y-3">
                {actions.map((action) => (
                    <QuickAction key={action.label} {...action} />
                ))}
            </div>
        </div>
    );
}

type HealthTileProps = {
    title: string;
    value: string;
    description: string;
};

function HealthTile({ title, value, description }: HealthTileProps) {
    return (
        <div className="rounded-2xl border border-brand-100 bg-brand-50/70 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">{title}</div>
            <div className="mt-2 text-lg font-semibold text-slate-800">{value}</div>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    );
}

type QuickActionProps = {
    label: string;
    description: string;
    href: string;
    icon: JSX.Element;
    variant: "primary" | "secondary";
};

function QuickAction({ label, description, href, icon, variant }: QuickActionProps) {
    const baseClasses =
        "flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm transition hover:-translate-y-0.5 hover:shadow-md";
    const variantClasses =
        variant === "primary"
            ? "border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100"
            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50";

    return (
        <a href={href} className={`${baseClasses} ${variantClasses}`}>
            <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-brand-600">
                    {icon}
                </span>
                <div>
                    <div className="font-semibold">{label}</div>
                    <p className="text-xs text-slate-500">{description}</p>
                </div>
            </div>
            <ArrowRight className="h-4 w-4" />
        </a>
    );
}
