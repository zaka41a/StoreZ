import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart, User as UserIcon, LogOut } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ROLES } from "@/utils/constants";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items } = useCart();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;
  // Masquer la navbar publique pour Admin / Supplier
  if (user?.role === ROLES.ADMIN || user?.role === ROLES.SUPPLIER) return null;

  const handleLogout = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  const displayName = user?.name || user?.companyName || user?.email?.split("@")[0] || "Account";

  return (
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-md border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-3xl font-extrabold text-brand-700 tracking-tight hover:opacity-80 transition">
            Store<span className="text-brand-600">Z</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {[
              { to: "/", label: "Home" },
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              { to: "/help", label: "Help" },
              { to: "/terms-privacy", label: "Terms & Privacy" },
            ].map((it) => (
                <NavLink
                    key={it.to}
                    to={it.to}
                    className={({ isActive }) =>
                        "transition " +
                        (isActive
                            ? "text-brand-700 font-semibold border-b-2 border-brand-700 pb-1"
                            : "text-gray-700 hover:text-brand-700")
                    }
                >
                  {it.label}
                </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <NavLink to="/user/cart" className="relative hover:text-brand-700 transition hidden sm:inline-flex">
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 rounded-full bg-brand-600 text-white text-xs px-1">
                {items.length}
              </span>
              )}
            </NavLink>

            {!isAuthenticated ? (
                <>
                  <NavLink
                      to="/login"
                      className="hidden sm:inline-flex text-sm font-semibold text-gray-700 hover:text-brand-700 transition"
                  >
                    Login
                  </NavLink>
                  <NavLink
                      to="/register"
                      className="text-sm font-semibold border border-brand-600 text-brand-700 rounded-md px-3 py-1 hover:bg-brand-600 hover:text-white transition"
                  >
                    Register
                  </NavLink>
                </>
            ) : (
                <>
                  {/* Bouton profil : icône + nom -> /user/profile */}
                  <button
                      onClick={() => navigate("/user/profile")}
                      className="group flex items-center gap-2 rounded-md px-3 py-2 hover:bg-gray-100 transition"
                      title="Profile"
                  >
                    <UserIcon className="w-5 h-5 text-brand-700 group-hover:scale-105 transition" />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-brand-700">{displayName}</span>
                  </button>

                  {/* Bouton logout stylé */}
                  <button
                      onClick={handleLogout}
                      className="inline-flex items-center gap-2 text-sm font-semibold border border-red-500 text-red-600 rounded-md px-3 py-1.5 hover:bg-red-50 active:scale-[.98] transition"
                      title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
            )}

            <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-6 h-6 text-brand-700" /> : <Menu className="w-6 h-6 text-brand-700" />}
            </button>
          </div>
        </div>

        {menuOpen && (
            <div className="md:hidden bg-white border-t shadow-lg animate-slide-down">
              <nav className="flex flex-col items-center py-4 space-y-3 text-sm font-medium">
                {[
                  { to: "/", label: "Home" },
                  { to: "/about", label: "About" },
                  { to: "/contact", label: "Contact" },
                  { to: "/help", label: "Help" },
                  { to: "/terms-privacy", label: "Terms & Privacy" },
                ].map((it) => (
                    <NavLink key={it.to} to={it.to} onClick={() => setMenuOpen(false)} className="hover:text-brand-700">
                      {it.label}
                    </NavLink>
                ))}
                {!isAuthenticated ? (
                    <>
                      <NavLink to="/login" onClick={() => setMenuOpen(false)} className="hover:text-brand-700">
                        Login
                      </NavLink>
                      <NavLink to="/register" onClick={() => setMenuOpen(false)} className="hover:text-brand-700">
                        Register
                      </NavLink>
                    </>
                ) : (
                    <>
                      <button
                          onClick={() => {
                            setMenuOpen(false);
                            navigate("/user/profile");
                          }}
                          className="hover:text-brand-700"
                      >
                        Profile
                      </button>
                      <button
                          onClick={async () => {
                            await handleLogout();
                            setMenuOpen(false);
                          }}
                          className="hover:text-red-600"
                      >
                        Logout
                      </button>
                    </>
                )}
              </nav>
            </div>
        )}
      </header>
  );
}
