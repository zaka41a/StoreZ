import { NavLink, Outlet, useNavigate, useLocation, Navigate } from "react-router-dom";
import {
    LayoutDashboard,
    TrendingUp,
    Users,
    Store,
    Package,
    ListOrdered,
    LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { to: "/admin/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { to: "/admin/analytics", label: "Analytics", icon: <TrendingUp className="w-4 h-4" /> },
        { to: "/admin/users", label: "Users", icon: <Users className="w-4 h-4" /> },
        { to: "/admin/suppliers", label: "Suppliers", icon: <Store className="w-4 h-4" /> },
        { to: "/admin/products", label: "Products", icon: <Package className="w-4 h-4" /> },
        { to: "/admin/orders", label: "Orders", icon: <ListOrdered className="w-4 h-4" /> },
    ];

    // ✅ Redirection automatique vers dashboard si "/admin" seul
    if (location.pathname === "/admin") return <Navigate to="/admin/dashboard" replace />;

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="min-h-screen grid grid-cols-12 bg-gray-50">
            {/* Sidebar */}
            <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r bg-white flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-2xl font-extrabold text-brand-700 tracking-tight">
                        Admin
                        <span className="text-yellow-400 drop-shadow-[0_0_6px_rgba(255,215,0,0.8)]">
              Z
            </span>
                    </h1>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2">
                    {items.map((it) => (
                        <NavLink
                            key={it.to}
                            to={it.to}
                            className={({ isActive }) =>
                                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all " +
                                (isActive
                                    ? "bg-brand-50 text-brand-700 shadow-sm"
                                    : "text-gray-700 hover:text-brand-700 hover:bg-gray-50")
                            }
                        >
                            {it.icon}
                            {it.label}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-600 border border-red-500 rounded-md py-2 hover:bg-red-50 transition active:scale-[.97]"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="col-span-12 md:col-span-9 lg:col-span-10 p-6">
                <Outlet />
            </main>
        </div>
    );
}
