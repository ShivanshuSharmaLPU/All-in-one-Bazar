import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, Menu, X } from "lucide-react"
import axios from "axios"
import { useSelector, useDispatch } from "react-redux"
import { setCart } from "../../redux/productSlice"
import { setUser } from "../../redux/userSlice"
import { Button } from "../ui/button"
import userLogo from "../../assets/userlogo.png"

const Navbar = () => {

  const { user } = useSelector((state) => state.user)
  const { cart } = useSelector((state) => state.product)

  const [loading, setLoading] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const accessToken = localStorage.getItem("accesstoken")
  const itemCount = cart?.items?.length || 0
  const admin = user?.role === "admin"

  // LOAD USER + CART AFTER REFRESH
  useEffect(() => {

    const loadInitialData = async () => {

      const userId = localStorage.getItem("userId")

      if (!accessToken || !userId) {
        setLoading(false)
        return
      }

      try {
        const [userRes, cartRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_URL}/api/v1/user/get-user/${userId}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` }
            }
          ),
          axios.get(
            `${import.meta.env.VITE_URL}/api/v1/cart`,
            {
              headers: { Authorization: `Bearer ${accessToken}` }
            }
          )
        ])
        if (userRes.data.success) {
          dispatch(setUser(userRes.data.user))
        }

        if (cartRes.data.success) {
          dispatch(setCart(cartRes.data.cart))
        }

      } catch (error) {

        localStorage.clear()
        dispatch(setUser(null))

      } finally {

        setLoading(false)

      }

    }

    loadInitialData()

  }, [dispatch, accessToken])

  // LOGOUT
  const logoutHandler = () => {
    localStorage.clear()
    dispatch(setUser(null))
    dispatch(setCart({ items: [] }))
    navigate("/login")

  }

  if (loading) {
    return <header className="h-[70px] bg-[#fff7ed]" />
  }

  return (
    <header className="bg-[#fff7ed] border-b border-orange-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center h-[70px] px-6">

        {/* LOGO */}
        <Link to="/">
          <img src="/allinonebazar.png" className="w-[120px]" />
        </Link>


        {/* DESKTOP MENU */}
        <nav className="hidden md:flex items-center gap-8 text-[16px] font-semibold text-gray-700">

          <Link to="/" className="hover:text-orange-600">
            Home
          </Link>

          <Link to="/products" className="hover:text-orange-600">
            Products
          </Link>

          {admin && (
            <Link to="/dashboard/sales" className="hover:text-orange-600">
              Dashboard
            </Link>
          )}

          {user && (
            <Link
              to={`/profile/${user._id}`}
              className="flex items-center gap-2 text-orange-600 font-bold"
            >

              <img
                src={user?.profilePic || userLogo}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = userLogo
                }}
              />

              {user.firstName}

            </Link>
          )}

          {/* CART */}
          <Link to="/cart" className="relative">

            <ShoppingCart className="w-6 h-6" />

            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}

          </Link>

          {/* LOGIN / LOGOUT */}
          {user ? (

            <Button
              onClick={logoutHandler}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6"
            >
              Logout
            </Button>

          ) : (

            <Link to="/login">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white px-6">
                Login
              </Button>
            </Link>

          )}

        </nav>

        {/* MOBILE RIGHT SIDE */}
        <div className="md:hidden flex items-center gap-3">

          {/* USER INFO */}
          {user && (
            <Link
              to={`/profile/${user._id}`}
              className="flex items-center gap-2"
            >
              <img
                src={user?.profilePic || userLogo}
                className="w-7 h-7 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = userLogo
                }}
              />

              <span className="text-sm font-semibold text-orange-600">
                {user.firstName}
              </span>
            </Link>
          )}

          {/* MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

        </div>
      </div>

      {/* MOBILE MENU BUTTON */}
      {/* <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

      </div> */}



      {/* MOBILE MENU */}
      {menuOpen && (

        <div className="md:hidden bg-[#fff7ed] border-t border-orange-200 flex flex-col px-6 py-4 gap-4 font-semibold">

          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>

          <Link to="/products" onClick={() => setMenuOpen(false)}>
            Products
          </Link>

          {admin && (
            <Link to="/dashboard/sales" onClick={() => setMenuOpen(false)}>
              Dashboard
            </Link>
          )}

          {user && (
            <Link to={`/profile/${user._id}`} onClick={() => setMenuOpen(false)}>
              My Profile
            </Link>
          )}

          <Link to="/cart" className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Cart ({itemCount})
          </Link>

          {user ? (

            <Button
              onClick={logoutHandler}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              Logout
            </Button>

          ) : (

            <Link to="/login">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white w-full">
                Login
              </Button>
            </Link>

          )}

        </div>

      )}

    </header>
  )
}

export default Navbar
























// import React, { useEffect, useState } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { ShoppingCart } from "lucide-react"
// import axios from "axios"
// import { toast } from "sonner"
// import { useSelector, useDispatch } from "react-redux"
// import { setCart } from "../../redux/productSlice"
// import { setUser } from "../../redux/userSlice"
// import { Button } from "../ui/button"

// const Navbar = () => {

//   const { user } = useSelector((state) => state.user)
//   const { cart } = useSelector((state) => state.product)
//   const [loading, setLoading] = useState(true)

//   const dispatch = useDispatch()
//   const navigate = useNavigate()

//   const accessToken = localStorage.getItem("accesstoken")
//   const admin = user?.role === "admin"

//   useEffect(() => {

//     const loadInitialData = async () => {

//       const userId = localStorage.getItem("userId")

//       if (!accessToken || !userId) {
//         setLoading(false)
//         return
//       }

//       try {

//         const [userRes, cartRes] = await Promise.all([

//           axios.get(`${import.meta.env.VITE_URL}/api/v1/user/get-user/${userId}`, {
//             headers: { Authorization: `Bearer ${accessToken}` }
//           }),

//           axios.get(`${import.meta.env.VITE_URL}/api/v1/cart`, {
//             headers: { Authorization: `Bearer ${accessToken}` }
//           })

//         ])

//         if (userRes.data.success) {
//           dispatch(setUser(userRes.data.user))
//         }

//         if (cartRes.data.success) {
//           dispatch(setCart(cartRes.data.cart))
//         }

//       } catch (e) {

//         localStorage.clear()
//         dispatch(setUser(null))

//       } finally {

//         setLoading(false)

//       }

//     }

//     loadInitialData()

//   }, [dispatch, accessToken])

//   const logoutHandler = async () => {

//     try {

//       if (accessToken) {

//         await axios.post(
//           `${import.meta.env.VITE_URL}/api/v1/user/logout`,
//           {},
//           { headers: { Authorization: `Bearer ${accessToken}` } }
//         )

//       }

//     } catch (e) { }

//     finally {

//       localStorage.clear()
//       dispatch(setUser(null))
//       dispatch(setCart({ items: [] }))
//       toast.success("Logged out successfully")
//       navigate("/login")

//     }

//   }

//   const itemCount = cart?.items?.length || 0

//   if (loading) {
//     return <header className="h-[72px] w-full bg-[#fff7ed]" />
//   }

//   return (

//     <header className="bg-[#fff7ed] fixed w-full z-50 border-b border-orange-100 shadow-sm">

//       <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6">

//         <Link to="/">
//           <img src="/allinonebazar.png" className="w-[120px]" />
//         </Link>

//         <nav className="flex items-center gap-10">

//           <ul className="flex gap-8 text-[16px] font-semibold text-gray-700">

//             <li>
//               <Link to="/" className="hover:text-orange-600">Home</Link>
//             </li>

//             <li>
//               <Link to="/products" className="hover:text-orange-600">Products</Link>
//             </li>

//             {user && (

//               <li className="text-orange-700 font-bold">

//                 <Link to={`/profile/${user._id}`}>
//                   Hello {user.firstName}
//                 </Link>

//               </li>

//             )}

//             {admin && (

//               <li>

//                 <Link to="/dashboard/sales" className="hover:text-orange-600">
//                   Dashboard
//                 </Link>

//               </li>

//             )}

//           </ul>

//           <Link to="/cart" className="relative p-2">

//             <ShoppingCart className="w-6 h-6" />

//             {itemCount > 0 && (

//               <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
//                 {itemCount}
//               </span>

//             )}

//           </Link>

//           {user ? (

//             <Button
//               onClick={logoutHandler}
//               className="bg-orange-600 hover:bg-orange-700 text-white font-bold h-10 px-6 rounded-md"
//             >

//               Logout

//             </Button>

//           ) : (

//             <Link to="/login">

//               <Button className="bg-orange-600 hover:bg-orange-700 text-white font-bold h-10 px-8 rounded-md">

//                 Login

//               </Button>

//             </Link>

//           )}

//         </nav>
//       </div>

//     </header>

//   )

// }

// export default Navbar




