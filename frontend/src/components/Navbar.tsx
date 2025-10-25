import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { ROLES } from "@/utils/constants";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { items } = useCart();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return null;

  const goDash = () => {
    if (user?.role === ROLES.ADMIN) navigate("/admin/dashboard");
    else if (user?.role === ROLES.SUPPLIER) navigate("/supplier/dashboard");
    else if (user?.role === ROLES.USER) navigate("/user/home");
    else navigate("/");
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-md border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link
              to="/"
              className="text-3xl font-extrabold text-brand-700 tracking-tight hover:opacity-80 transition"
          >
            Store<span className="text-brand-600">Z</span>
          </Link>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {["/", "/about", "/contact", "/help", "/terms-privacy"].map((path, i) => {
              const labels = [
                "Home",
                "About",
                "Contact",
                "Help",
                "Terms & Privacy",
              ];
              return (
                  <NavLink
                      key={path}
                      to={path}
                      className={({ isActive }) =>
                          `transition ${
                              isActive
                                  ? "text-brand-700 font-semibold border-b-2 border-brand-700 pb-1"
                                  : "text-gray-700 hover:text-brand-700"
                          }`
                      }
                  >
                    {labels[i]}
                  </NavLink>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <NavLink
                to="/user/cart"
                className="relative hover:text-brand-700 transition hidden sm:inline-flex"
            >
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
                  <button
                      onClick={goDash}
                      className="text-sm font-semibold text-gray-700 hover:text-brand-700 transition"
                  >
                    Hi, {user?.name || user?.email || "Dashboard"}
                  </button>
                  <button
                      onClick={handleLogout}
                      className="text-sm font-semibold text-gray-700 hover:text-red-600 transition"
                  >
                     Logout
                  </button>
                </>
            )}

            {/* Mobile menu button */}
            <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                  <X className="w-6 h-6 text-brand-700" />
              ) : (
                  <Menu className="w-6 h-6 text-brand-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
            <div className="md:hidden bg-white border-t shadow-lg animate-slide-down">
              <nav className="flex flex-col items-center py-4 space-y-3 text-sm font-medium">
                {["/", "/about", "/contact", "/help", "/terms-privacy"].map(
                    (path, i) => {
                      const labels = [
                        "Home",
                        "About",
                        "Contact",
                        "Help",
                        "Terms & Privacy",
                      ];
                      return (
                          <NavLink
                              key={path}
                              to={path}
                              onClick={() => setMenuOpen(false)}
                              className="hover:text-brand-700"
                          >
                            {labels[i]}
                          </NavLink>
                      );
                    }
                )}

                {!isAuthenticated ? (
                    <>
                      <NavLink
                          to="/login"
                          onClick={() => setMenuOpen(false)}
                          className="hover:text-brand-700"
                      >
                        Login
                      </NavLink>
                      <NavLink
                          to="/register"
                          onClick={() => setMenuOpen(false)}
                          className="hover:text-brand-700"
                      >
                        Register
                      </NavLink>
                    </>
                ) : (
                    <>
                      <button
                          onClick={() => {
                            goDash();
                            setMenuOpen(false);
                          }}
                          className="hover:text-brand-700"
                      >
                        Dashboard
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
