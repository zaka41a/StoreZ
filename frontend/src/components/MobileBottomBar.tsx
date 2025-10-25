import { NavLink, useNavigate } from "react-router-dom"
import { Home, Search, ShoppingCart, User } from "lucide-react"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { ROLES } from "@/utils/constants"

export default function MobileBottomBar() {
    const { items } = useCart()
    const { isAuthenticated, role } = useAuth()
    const navigate = useNavigate()

    const goProfile = () => {
        if (!isAuthenticated) return navigate("/login")
        if (role === ROLES.ADMIN) navigate("/admin/dashboard")
        else if (role === ROLES.SUPPLIER) navigate("/supplier/dashboard")
        else navigate("/user/profile")
    }

    return (
        <nav className="fixed bottom-0 left-0 w-full bg-white border-t shadow-md z-50 md:hidden">
            <div className="flex justify-around items-center py-2 text-gray-700">
                <NavLink to="/" className="flex flex-col items-center text-xs hover:text-brand-700">
                    <Home className="w-6 h-6" />
                    <span>Home</span>
                </NavLink>

                <NavLink to="/help" className="flex flex-col items-center text-xs hover:text-brand-700">
                    <Search className="w-6 h-6" />
                    <span>Help</span>
                </NavLink>

                <NavLink to="/user/cart" className="relative flex flex-col items-center text-xs hover:text-brand-700">
                    <ShoppingCart className="w-6 h-6" />
                    {items.length > 0 && (
                        <span className="absolute -top-1 right-2 bg-brand-600 text-white rounded-full text-[10px] px-1">
              {items.length}
            </span>
                    )}
                    <span>Cart</span>
                </NavLink>

                <button
                    onClick={goProfile}
                    className="flex flex-col items-center text-xs hover:text-brand-700"
                >
                    <User className="w-6 h-6" />
                    <span>{isAuthenticated ? "Profile" : "Login"}</span>
                </button>
            </div>
        </nav>
    )
}
