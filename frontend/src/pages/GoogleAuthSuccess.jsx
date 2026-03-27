import { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "@/redux/userSlice"
import axios from "axios"
import { toast } from "sonner"

const GoogleAuthSuccess = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    const accesstoken = params.get("accesstoken")
    const refreshtoken = params.get("refreshtoken")
    const userId = params.get("userId")
    const error = params.get("error")

    if (error) {
      toast.error("Google sign-in failed. Please try again.")
      navigate("/login")
      return
    }

    if (accesstoken && refreshtoken && userId) {
      localStorage.setItem("accesstoken", accesstoken)
      localStorage.setItem("refreshtoken", refreshtoken)
      localStorage.setItem("userId", userId)

      axios
        .get(`${import.meta.env.VITE_URL}/api/v1/user/get-user/${userId}`)
        .then((res) => {
          if (res.data.success) {
            dispatch(setUser(res.data.user))
            toast.success("Signed in with Google!")
          }
        })
        .catch(() => toast.error("Could not load user data"))
        .finally(() => navigate("/"))
    } else {
      navigate("/login")
    }
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4" />
        <p className="text-gray-600">Signing you in with Google...</p>
      </div>
    </div>
  )
}

export default GoogleAuthSuccess