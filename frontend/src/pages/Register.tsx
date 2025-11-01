import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { UserPlus, Building2 } from "lucide-react"

export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 via-white to-gold-50 px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 md:p-14 space-y-8 border border-gold-200"
            >
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-extrabold bg-gradient-to-r from-brand-700 to-gold-600 bg-clip-text text-transparent">Create Your StoreZ Account</h1>
                    <p className="text-gray-600 text-lg">
                        Join our global community of shoppers and suppliers — choose your path below.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid md:grid-cols-2 gap-10 mt-8">
                    {/* User Card */}
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="group border-2 border-brand-200 hover:border-gold-400 rounded-2xl p-8 cursor-pointer hover:shadow-2xl transition-all bg-gradient-to-b from-white via-brand-50/50 to-gold-50/30"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="bg-gradient-to-br from-brand-100 to-gold-100 text-brand-700 p-4 rounded-full shadow-lg">
                                <UserPlus className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-700 to-gold-600 bg-clip-text text-transparent">Register as a User</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Create a personal account to browse products, make orders, manage your cart,
                                and track your purchases easily.
                            </p>
                            <Link
                                to="/register-user"
                                className="btn w-full mt-3 font-semibold py-3 text-white shadow-lg bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 transition-all hover:shadow-xl"
                            >
                                Continue as User
                            </Link>
                        </div>
                    </motion.div>

                    {/* Supplier Card */}
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="group border-2 border-brand-200 hover:border-gold-400 rounded-2xl p-8 cursor-pointer hover:shadow-2xl transition-all bg-gradient-to-b from-white via-brand-50/50 to-gold-50/30"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="bg-gradient-to-br from-brand-100 to-gold-100 text-brand-700 p-4 rounded-full shadow-lg">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-brand-700 to-gold-600 bg-clip-text text-transparent">Register as a Supplier</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Become a trusted supplier on StoreZ — manage your products, receive orders,
                                and grow your business in a vibrant marketplace.
                            </p>
                            <Link
                                to="/register-supplier"
                                className="btn w-full mt-3 font-semibold py-3 bg-gradient-to-r from-brand-600 to-brand-700 text-white hover:from-brand-700 hover:to-brand-800 transition-all shadow-lg hover:shadow-xl"
                            >
                                Continue as Supplier
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-600 text-sm pt-6 border-t border-gold-200">
                    Already have an account?{" "}
                    <Link to="/login" className="text-brand-600 hover:text-gold-600 font-semibold transition-colors">
                        Login here
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
