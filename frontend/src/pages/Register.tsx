import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { UserPlus, Building2 } from "lucide-react"

export default function Register() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-50 to-white px-4">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-10 md:p-14 space-y-8"
            >
                {/* Header */}
                <div className="text-center space-y-3">
                    <h1 className="text-4xl font-extrabold text-brand-700">Create Your StoreZ Account</h1>
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
                        className="group border border-gray-200 rounded-2xl p-8 cursor-pointer hover:shadow-xl transition bg-gradient-to-b from-white to-brand-50"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="bg-brand-100 text-brand-700 p-4 rounded-full">
                                <UserPlus className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-brand-700">Register as a User</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Create a personal account to browse products, make orders, manage your cart,
                                and track your purchases easily.
                            </p>
                            <Link
                                to="/register-user"
                                className="btn btn-primary w-full mt-3 font-semibold py-3 text-white shadow-md"
                            >
                                Continue as User
                            </Link>
                        </div>
                    </motion.div>

                    {/* Supplier Card */}
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="group border border-gray-200 rounded-2xl p-8 cursor-pointer hover:shadow-xl transition bg-gradient-to-b from-white to-brand-50"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="bg-brand-100 text-brand-700 p-4 rounded-full">
                                <Building2 className="w-8 h-8" />
                            </div>
                            <h2 className="text-2xl font-bold text-brand-700">Register as a Supplier</h2>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Become a trusted supplier on StoreZ — manage your products, receive orders,
                                and grow your business in a vibrant marketplace.
                            </p>
                            <Link
                                to="/register-supplier"
                                className="btn btn-secondary w-full mt-3 font-semibold py-3"
                            >
                                Continue as Supplier
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Footer */}
                <div className="text-center text-gray-600 text-sm pt-6 border-t">
                    Already have an account?{" "}
                    <Link to="/login" className="text-brand-600 font-semibold hover:underline">
                        Login here
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
