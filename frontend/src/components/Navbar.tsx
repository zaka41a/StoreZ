import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User as UserIcon, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ROLES } from "@/utils/constants";
import logo from "@/assets/StoreZ.png";

const NAV_ITEMS = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
    { to: "/help", label: "Help" },
    { to: "/terms-privacy", label: "Terms & Privacy" },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { items } = useCart();
    const { user, isAuthenticated, logout, loading } = useAuth();
    const navigate = useNavigate();

    if (loading) return null;
    if (user?.role === ROLES.ADMIN || user?.role === ROLES.SUPPLIER) return null;

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    const displayName =
        user?.name || user?.companyName || user?.email?.split("@")[0] || "Account";

    return (
        <header className="sticky top-0 z-50">
            {/* Upper info bar */}
            <div className="hidden md:flex items-center justify-between px-6 py-2 text-xs font-medium text-slate-200 bg-slate-900">
                    <span className="flex items-center gap-2">
                    <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    Premium commerce for retailers & suppliers
                </span>
                <div className="flex items-center gap-6">
                    <a href="mailto:zaksab98@gmail.com" className="hover:text-white transition">
                        zaksab98@gmail.com
                    </a>
                    <span className="text-slate-300">+49 176 20827199</span>
                </div>
            </div>

            {/* Main navigation */}
            <div className="relative border-b border-slate-200 bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-white pointer-events-none" />
                <div className="container relative mx-auto flex items-center justify-between px-4 py-3 lg:px-6">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="group flex items-center gap-3"
                        aria-label="StoreZ home"
                    >
                        <div className="relative">
                            <img
                                src={logo}
                                alt="StoreZ Logo"
                                className="h-20 w-auto transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_16px_24px_rgba(37,99,235,0.35)]"
                            />
                        </div>
                        <span className="hidden sm:flex flex-col leading-tight">
                            <span className="text-xs uppercase tracking-[0.28em] text-slate-400">
                                StoreZ Platform
                            </span>
                            <span className="text-base font-semibold text-slate-700">
                                Retail Intelligence Suite
                            </span>
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    "transition-colors duration-200 " +
                                    (isActive
                                        ? "text-brand-700 font-semibold"
                                        : "text-slate-600 hover:text-slate-900")
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <NavLink
                            to="/user/cart"
                            className="relative hidden sm:inline-flex items-center justify-center text-slate-500 hover:text-brand-700 transition"
                            aria-label={`Open cart, ${items.length} items`}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {items.length > 0 && (
                                <span className="absolute -top-2 -right-2 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-brand-600 px-1 text-xs font-semibold text-white">
                                    {items.length}
                                </span>
                            )}
                        </NavLink>

                        {!isAuthenticated ? (
                            <>
                                <NavLink
                                    to="/login"
                                    className="hidden sm:inline-flex rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-600 hover:text-brand-700"
                                >
                                    Sign in
                                </NavLink>
                                <NavLink
                                    to="/register"
                                    className="inline-flex items-center rounded-full bg-gradient-to-r from-brand-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-xl hover:shadow-indigo-500/30"
                                >
                                    Create account
                                </NavLink>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => navigate("/user/home")}
                                    className="group hidden sm:flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-brand-600 hover:text-brand-700"
                                >
                                    <UserIcon className="h-4 w-4 text-brand-600 transition group-hover:scale-105" />
                                    {displayName}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:from-red-600 hover:to-red-700 transition-all hover:shadow-xl"
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </button>
                            </div>
                        )}

                        <button
                            className="inline-flex items-center justify-center rounded-full border border-slate-200 p-2 text-slate-500 transition hover:border-brand-600 hover:text-brand-700 lg:hidden"
                            onClick={() => setMenuOpen((prev) => !prev)}
                            aria-label="Toggle navigation menu"
                        >
                            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile drawer */}
            {menuOpen && (
                <div className="lg:hidden border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-lg">
                    <nav className="flex flex-col gap-1 px-4 py-5 text-sm font-semibold text-slate-600">
                        {NAV_ITEMS.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setMenuOpen(false)}
                                className={({ isActive }) =>
                                    "rounded-lg px-3 py-2 transition " +
                                    (isActive
                                        ? "bg-brand-50 text-brand-700"
                                        : "hover:bg-slate-100")
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}

                        <div className="mt-3 border-t border-slate-200 pt-4">
                            {!isAuthenticated ? (
                                <div className="flex flex-col gap-2">
                                    <NavLink
                                        to="/login"
                                        onClick={() => setMenuOpen(false)}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-center transition hover:border-brand-600 hover:text-brand-700"
                                    >
                                        Sign in
                                    </NavLink>
                                    <NavLink
                                        to="/register"
                                        onClick={() => setMenuOpen(false)}
                                        className="rounded-lg bg-brand-600 px-3 py-2 text-center text-white transition hover:bg-brand-700"
                                    >
                                        Create account
                                    </NavLink>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => {
                                            setMenuOpen(false);
                                            navigate("/user/home");
                                        }}
                                        className="rounded-lg border border-slate-200 px-3 py-2 text-left transition hover:border-brand-600 hover:text-brand-700"
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={async () => {
                                            await handleLogout();
                                            setMenuOpen(false);
                                        }}
                                        className="rounded-lg bg-gradient-to-r from-red-500 to-red-600 px-3 py-2 text-center font-semibold text-white transition hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}
