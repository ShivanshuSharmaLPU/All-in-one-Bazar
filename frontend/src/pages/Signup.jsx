import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "sonner"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import GoogleButton from "@/components/ui/GoogleButton"

const Signup = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGoogle = () => {
    window.location.href = `${import.meta.env.VITE_URL}/api/v1/user/auth/google`
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/register`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      )
      if (res.data.success) {
        toast.success(res.data.message)
        navigate("/login")
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">
      <Card className="w-full max-w-sm">

        <CardHeader>
          <CardTitle className="flex justify-center items-center text-center">
            Create your account in AllinOneBazar
          </CardTitle>
          <CardDescription className="flex justify-center items-center">
            Enter your details below
          </CardDescription>
        </CardHeader>

        <CardContent>


          <form onSubmit={submitHandler} className="flex flex-col gap-4">

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {showPassword ? (
                  <EyeOff
                    onClick={() => setShowPassword(false)}
                    className="w-5 h-5 text-gray-600 absolute right-3 top-2.5 cursor-pointer"
                  />
                ) : (
                  <Eye
                    onClick={() => setShowPassword(true)}
                    className="w-5 h-5 text-gray-600 absolute right-3 top-2.5 cursor-pointer"
                  />
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" />Please wait</>
              ) : (
                "Signup"
              )}
            </Button>

            <GoogleButton onClick={handleGoogle} loading={loading} />

          </form>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-gray-700 text-sm">
            Already have an account?{" "}
            <Link to="/login" className="hover:underline cursor-pointer text-orange-600 hover:text-orange-700 font-medium">
              Login
            </Link>
          </p>
        </CardFooter>

      </Card>
    </div>
  )
}

export default Signup




// import React, { useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import axios from "axios"
// import { toast } from "sonner"
// import { Eye, EyeOff, Loader2 } from "lucide-react"

// import { Button } from "@/components/ui/button"
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import GoogleButton from "components/ui/GoogleButton"

// const Signup = () => {

//   const navigate = useNavigate()

//   const [showPassword, setShowPassword] = useState(false)
//   const [loading, setLoading] = useState(false)

//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     password: ""
//   })

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }))
//   }

//   const submitHandler = async (e) => {
//     e.preventDefault()

//     try {
//       setLoading(true)

//       const res = await axios.post(
//         `${import.meta.env.VITE_URL}/api/v1/user/register`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "application/json"
//           }
//         }
//       )

//       if (res.data.success) {
//         toast.success(res.data.message)
//         navigate("/login")
//       }

//     } catch (error) {

//       const message =
//         error?.response?.data?.message || "Signup failed"

//       toast.error(message)

//     } finally {
//       setLoading(false)
//     }
//   }

//   return (

//     <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50">

//       <Card className="w-full max-w-sm">

//         <CardHeader>

//           <CardTitle className="flex justify-center items-center">Create your account in AllinOneBazar</CardTitle>

//           <CardDescription className="flex justify-center items-center">
//             Enter your details below
//           </CardDescription>

//         </CardHeader>

//         <CardContent>

//           <form onSubmit={submitHandler} className="flex flex-col gap-4">

//             <div className="grid grid-cols-2 gap-4">

//               <div className="grid gap-2">

//                 <Label htmlFor="firstName">
//                   First Name
//                 </Label>

//                 <Input
//                   id="firstName"
//                   name="firstName"
//                   placeholder="John"
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   required
//                 />

//               </div>

//               <div className="grid gap-2">

//                 <Label htmlFor="lastName">
//                   Last Name
//                 </Label>

//                 <Input
//                   id="lastName"
//                   name="lastName"
//                   placeholder="Doe"
//                   value={formData.lastName}
//                   onChange={handleChange}
//                   required
//                 />

//               </div>

//             </div>

//             <div className="grid gap-2">

//               <Label htmlFor="email">
//                 Email
//               </Label>

//               <Input
//                 id="email"
//                 name="email"
//                 placeholder="m@example.com"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//               />

//             </div>

//             <div className="grid gap-2">

//               <Label htmlFor="password">
//                 Password
//               </Label>

//               <div className="relative">

//                 <Input
//                   id="password"
//                   name="password"
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Create password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />

//                 {showPassword ? (

//                   <EyeOff
//                     onClick={() => setShowPassword(false)}
//                     className="w-5 h-5 text-gray-600 absolute right-3 top-2.5 cursor-pointer"
//                   />

//                 ) : (

//                   <Eye
//                     onClick={() => setShowPassword(true)}
//                     className="w-5 h-5 text-gray-600 absolute right-3 top-2.5 cursor-pointer"
//                   />

//                 )}

//               </div>

//             </div>

//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center"
//             >

//               {loading ? (
//                 <>
//                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
//                   Please wait
//                 </>
//               ) : (
//                 "Signup"
//               )}

//             </Button>
//             <GoogleButton onClick={handleGoogle} loading={loading} />

//           </form>

//         </CardContent>

//         <CardFooter className="flex justify-center">

//           <p className="text-gray-700 text-sm">

//             Already have an account?{" "}

//             <Link
//               to="/login"
//               className="hover:underline cursor-pointer text-orange-600 hover:text-orange-700 font-medium"
//             >
//               Login
//             </Link>


//           </p>

//         </CardFooter>

//       </Card>

//     </div>

//   )
// }

// export default Signup