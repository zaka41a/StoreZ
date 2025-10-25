import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { api } from "@/services/api"

export default function RegisterUser() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
    phone: "",
    address: "",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setError("Passwords do not match.")
      return
    }
    try {
      await api.post("/auth/register-user", form)
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
            className="bg-white rounded-2xl shadow-lg w-full max-w-2xl p-10 space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-brand-700">Create your StoreZ Account 🛍️</h1>
          <p className="text-center text-gray-500">Join thousands of smart shoppers worldwide.</p>

          {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
          )}
          {success && (
              <div className="bg-green-50 text-green-700 border border-green-200 px-4 py-2 rounded-md text-sm">
                Registration successful! Redirecting to login...
              </div>
          )}

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input name="name" className="input mt-1 w-full" placeholder="John Doe" onChange={handleChange} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input name="email" type="email" className="input mt-1 w-full" placeholder="you@example.com" onChange={handleChange} required />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Phone</label>
              <input name="phone" className="input mt-1 w-full" placeholder="+212 6 12 34 56 78" onChange={handleChange} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Address</label>
              <input name="address" className="input mt-1 w-full" placeholder="City, Country" onChange={handleChange} />
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
                Create Account
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
