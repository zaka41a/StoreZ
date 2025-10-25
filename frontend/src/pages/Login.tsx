import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(email, password)
      navigate("/")
    } catch {
      setError("Invalid email or password. Please try again.")
    }
  }

  return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-50 to-white">
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg w-full max-w-md p-10 space-y-6"
        >
          <h1 className="text-3xl font-bold text-center text-brand-700">Welcome back 👋</h1>
          <p className="text-center text-gray-500">Sign in to your StoreZ account</p>

          {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-md text-sm">
                {error}
              </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                  type="email"
                  className="input mt-1 w-full"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input
                  type="password"
                  className="input mt-1 w-full"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
              />
            </div>

            <button
                type="submit"
                className="btn btn-primary w-full py-3 text-white font-semibold"
            >
              Sign In
            </button>
          </form>

          <div className="text-center text-sm text-gray-600">
            Don’t have an account?{" "}
            <a href="/register-user" className="text-brand-600 font-semibold hover:underline">
              Register now
            </a>
          </div>

          <p className="text-center text-xs text-gray-400 pt-2">
            © {new Date().getFullYear()} StoreZ — Fast. Simple. Secure.
          </p>
        </motion.div>
      </div>
  )
}
