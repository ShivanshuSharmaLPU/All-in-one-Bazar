import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2, User, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDispatch } from "react-redux"
import { setUser } from "@/redux/userSlice"

const Login = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [role, setRole] = useState("user")       // "user" | "admin"
  const [mode, setMode] = useState("login")       // "login" | "signup"
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" })

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleRoleSwitch = (r) => {
    setRole(r)
    setMode("login")
    setFormData({ firstName: "", lastName: "", email: "", password: "" })
  }

  const handleModeSwitch = (m) => {
    setMode(m)
    setFormData({ firstName: "", lastName: "", email: "", password: "" })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === "signup") {
        const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/user/register`, formData, {
          headers: { "Content-Type": "application/json" }
        })
        if (res.data.success) {
          toast.success("Account created! Please login.")
          setMode("login")
          setFormData({ firstName: "", lastName: "", email: "", password: "" })
        }
      } else {
        const res = await axios.post(`${import.meta.env.VITE_URL}/api/v1/user/login`, formData, {
          headers: { "Content-Type": "application/json" }
        })
        if (res.data.success) {
          const user = res.data.user
          if (role === "admin" && user.role !== "admin") {
            toast.error("You are not an admin.")
            setLoading(false)
            return
          }
          if (role === "user" && user.role === "admin") {
            toast.error("Please use the Admin tab to login as admin.")
            setLoading(false)
            return
          }
          localStorage.setItem("accesstoken", res.data.accesstoken)
          localStorage.setItem("refreshtoken", res.data.refreshtoken)
          localStorage.setItem("userId", res.data.userId)
          dispatch(setUser(user))
          toast.success(res.data.message)
          navigate(user.role === "admin" ? "/dashboard" : "/")
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-orange-50 px-4">
      <div className="w-full max-w-md">

        {/* Role Switcher */}
        <div className="flex rounded-xl overflow-hidden border border-gray-200 mb-6 shadow-sm">
          <button
            onClick={() => handleRoleSwitch("user")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all
              ${role === "user" ? "bg-orange-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
          >
            <User size={16} /> User
          </button>
          <button
            onClick={() => handleRoleSwitch("admin")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all
              ${role === "admin" ? "bg-orange-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
          >
            <ShieldCheck size={16} /> Admin
          </button>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">

          {/* Mode Tabs — only for user */}
          {role === "user" && (
            <div className="flex border-b border-gray-100">
              <button
                onClick={() => handleModeSwitch("login")}
                className={`flex-1 py-3 text-sm font-semibold transition-all
                  ${mode === "login" ? "text-orange-600 border-b-2 border-orange-500" : "text-gray-400 hover:text-gray-600"}`}
              >
                Login
              </button>
              <button
                onClick={() => handleModeSwitch("signup")}
                className={`flex-1 py-3 text-sm font-semibold transition-all
                  ${mode === "signup" ? "text-orange-600 border-b-2 border-orange-500" : "text-gray-400 hover:text-gray-600"}`}
              >
                Sign Up
              </button>
            </div>
          )}

          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {role === "admin" ? "Admin Login 🛡️" : mode === "login" ? "Welcome back!" : "Create account"}
            </h2>
            <p className="text-xs text-gray-400 mb-5">
              {role === "admin" ? "Access the admin dashboard" :
               mode === "login" ? "Login to your account" : "Fill in your details to get started"}
            </p>

            <form onSubmit={submitHandler} className="flex flex-col gap-4">

              {/* Name fields — signup only */}
              {mode === "signup" && role === "user" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs font-semibold text-gray-600">First Name</Label>
                    <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" required className="h-9 text-sm" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs font-semibold text-gray-600">Last Name</Label>
                    <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required className="h-9 text-sm" />
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold text-gray-600">Email</Label>
                <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className="h-9 text-sm" />
              </div>

              <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold text-gray-600">Password</Label>
                <div className="relative">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    required
                    className="h-9 text-sm pr-10"
                  />
                  <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-2 text-gray-400 hover:text-gray-600">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {mode === "login" && role === "user" && (
                <div className="text-right -mt-2">
                  <Link to="/forgot-password" className="text-xs text-orange-500 hover:underline">Forgot password?</Link>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-10 font-bold text-white mt-1 bg-orange-500 hover:bg-orange-600"
              >
                {loading
                  ? <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin" /> Please wait</span>
                  : role === "admin" ? "Login as Admin"
                  : mode === "login" ? "Login" : "Create Account"}
              </Button>

            </form>

            {role === "user" && mode === "login" && (
              <p className="text-center text-xs text-gray-400 mt-4">
                Don't have an account?{" "}
                <button onClick={() => handleModeSwitch("signup")} className="text-orange-500 font-semibold hover:underline">Sign up</button>
              </p>
            )}
            {role === "user" && mode === "signup" && (
              <p className="text-center text-xs text-gray-400 mt-4">
                Already have an account?{" "}
                <button onClick={() => handleModeSwitch("login")} className="text-orange-500 font-semibold hover:underline">Login</button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Login