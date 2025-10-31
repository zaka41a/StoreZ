import { NavLink, Outlet, useNavigate, Navigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, DollarSign, PlusCircle, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/StoreZ.png";

export default function SupplierLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const items = [
        { to: "/supplier/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
        { to: "/supplier/my-products", label: "My Products", icon: <Package className="w-4 h-4" /> },
        { to: "/supplier/orders", label: "Orders", icon: <ShoppingCart className="w-4 h-4" /> },
        { to: "/supplier/earnings", label: "Earnings", icon: <DollarSign className="w-4 h-4" /> },
        { to: "/supplier/add-product", label: "Add Product", icon: <PlusCircle className="w-4 h-4" /> },
    ];

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    // ✅ Redirige /supplier → /supplier/dashboard
    if (location.pathname === "/supplier") {
        return <Navigate to="/supplier/dashboard" replace />;
    }

    return (
        <div className="min-h-screen grid grid-cols-12 bg-gray-50">
            {/* Sidebar */}
            <aside className="col-span-12 md:col-span-3 lg:col-span-2 border-r bg-white flex flex-col">
                <div className="p-6 border-b">
                    <div className="flex items-center justify-center">
                        <img
                            src={logo}
                            alt="StoreZ"
                            className="object-contain drop-shadow-[0_0_12px_rgba(37,99,235,0.25)]"
                            style={{ height: "110px" }}
                        />
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {items.map((it) => (
                        <NavLink
                            key={it.to}
                            to={it.to}
                            className={({ isActive }) =>
                                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-150 " +
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

                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-600 border border-red-500 rounded-md py-2 hover:bg-red-50 transition active:scale-[.97]"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
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
