import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { api } from "@/services/api"

export default function RegisterSupplier() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        companyName: "",
        email: "",
        password: "",
        confirm: "",
        phone: "",
        address: "",
        description: "",
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (form.password !== form.confirm) {
            setError("Passwords do not match.")
            return
        }
        try {
            await api.post("/auth/register-supplier", form)
            setSuccess(true)
            setTimeout(() => navigate("/login"), 1500)
        } catch {
            setError("Registration failed. Try again.")
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-50 to-white">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-10 space-y-6"
            >
                <h1 className="text-3xl font-bold text-center text-brand-700">Become a StoreZ Supplier 🏢</h1>
                <p className="text-center text-gray-500">Join our trusted network and grow your business with us.</p>

                {error && (
                    <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-md text-sm">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-md text-sm">
                        Registration successful! Await admin approval.
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700">Company Name</label>
                        <input name="companyName" className="input mt-1 w-full" placeholder="My Awesome Brand" onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input name="email" type="email" className="input mt-1 w-full" placeholder="contact@brand.com" onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <input name="phone" className="input mt-1 w-full" placeholder="+212 6 12 34 56 78" onChange={handleChange} />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Address</label>
                        <input name="address" className="input mt-1 w-full" placeholder="City, Country" onChange={handleChange} />
                    </div>
                    <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Company Description</label>
                        <textarea
                            name="description"
                            className="input mt-1 w-full"
                            placeholder="Tell us about your company, products, and mission..."
                            rows={4}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input name="password" type="password" className="input mt-1 w-full" placeholder="••••••••" onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                        <input name="confirm" type="password" className="input mt-1 w-full" placeholder="••••••••" onChange={handleChange} required />
                    </div>
                    <div className="md:col-span-2 pt-4">
                        <button type="submit" className="btn btn-primary w-full py-3 text-white font-semibold">
                            Register Supplier
                        </button>
                    </div>
                </form>

                <div className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-brand-600 font-semibold hover:underline">
                        Login here
                    </a>
                </div>
            </motion.div>
        </div>
    )
}
