import React, { useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

const ForgotPassword = () => {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // STEP 1 → Send OTP
  const handleSendOTP = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/forgot-password`,
        { email }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        setStep(2)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  // STEP 2 → Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/verify-otp/${email}`,
        { otp }
      )

      if (res.data.success) {
        toast.success(res.data.message)
        setStep(3)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  // STEP 3 → Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match")
    }

    try {
      setLoading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/change-password`,
        { email, newPassword, confirmPassword }
      )

      if (res.data.success) {
        toast.success("Password changed successfully")
        navigate("/login")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to change password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Reset Password"}
          </CardTitle>
        </CardHeader>

        <CardContent>

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleSendOTP} className="flex flex-col gap-4">
              <div>
                <Label>Email</Label>
                <br/>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={loading} 
              className="bg-orange-500 text-white hover:bg-orange-600 transition"
              >
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Send OTP"}
              </Button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleVerifyOTP} className="flex flex-col gap-4">
              <div>
                <Label>Enter OTP</Label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={loading}  className="bg-orange-500 text-white hover:bg-orange-600 transition">
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Verify OTP"}
              </Button>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" disabled={loading}  className="bg-orange-500 text-white hover:bg-orange-600 transition">
                {loading ? <Loader2 className="animate-spin h-4 w-4" /> : "Reset Password"}
              </Button>
            </form>
          )}

        </CardContent>
      </Card>
    </div>
  )
}

export default ForgotPassword