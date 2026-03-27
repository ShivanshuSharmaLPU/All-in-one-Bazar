import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, ShoppingCart, IndianRupee } from "lucide-react"
import { useNavigate } from 'react-router-dom'

const Overview = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  const accessToken = localStorage.getItem("accesstoken")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, ordersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_URL}/api/v1/order/sales`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          }),
          axios.get(`${import.meta.env.VITE_URL}/api/v1/order/all`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
        ])

        if (statsRes.data.success) {
          setStats({
            totalUsers: statsRes.data.totalUsers || 0,
            totalProducts: statsRes.data.totalProducts || 0,
            totalOrders: statsRes.data.totalOrders || 0,
            totalSales: statsRes.data.totalSales || 0,
          })
        }

        if (ordersRes.data.success) {
          setRecentOrders(ordersRes.data.orders.slice(0, 5))
        }
      } catch (error) {
        console.error("Overview fetch error:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: <Users size={20} />, color: "bg-pink-600", link: "/dashboard/users" },
    { label: "Total Products", value: stats.totalProducts, icon: <Package size={20} />, color: "bg-blue-600", link: "/dashboard/products" },
    { label: "Total Orders", value: stats.totalOrders, icon: <ShoppingCart size={20} />, color: "bg-green-600", link: "/dashboard/orders" },
    { label: "Total Revenue", value: `₹${stats.totalSales.toLocaleString()}`, icon: <IndianRupee size={20} />, color: "bg-orange-600", link: "/dashboard/sales" },
  ]

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome, Admin 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening in your store today.</p>
        </div>

        {/* Stat Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((card, i) => (
            <Card
              key={i}
              onClick={() => navigate(card.link)}
              className={`${card.color} text-white shadow-lg border-none cursor-pointer hover:opacity-90 transition`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium uppercase opacity-80">{card.label}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{loading ? "..." : card.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-bold text-gray-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Add Product", path: "/dashboard/add-product", color: "bg-orange-500" },
              { label: "Manage Products", path: "/dashboard/products", color: "bg-blue-500" },
              { label: "View Orders", path: "/dashboard/orders", color: "bg-green-500" },
              { label: "Manage Users", path: "/dashboard/users", color: "bg-pink-500" },
            ].map((btn, i) => (
              <button
                key={i}
                onClick={() => navigate(btn.path)}
                className={`${btn.color} text-white font-semibold py-3 px-4 rounded-xl hover:opacity-90 transition text-sm`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <h2 className="text-lg font-bold text-gray-700 mb-4">Recent Orders</h2>
          <Card className="border-none shadow-sm">
            <CardContent className="p-0">
              {loading ? (
                <p className="text-center py-8 text-gray-400">Loading...</p>
              ) : recentOrders.length === 0 ? (
                <p className="text-center py-8 text-gray-400 italic">No orders yet</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="text-left px-6 py-3">Customer</th>
                      <th className="text-left px-6 py-3">Amount</th>
                      <th className="text-left px-6 py-3">Status</th>
                      <th className="text-left px-6 py-3">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order, i) => (
                      <tr key={i} className="border-t hover:bg-gray-50">
                        <td className="px-6 py-3 font-medium text-gray-700">
                          {order.user?.firstName} {order.user?.lastName}
                        </td>
                        <td className="px-6 py-3 text-orange-600 font-bold">₹{order.amount?.toLocaleString()}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === "Paid" ? "bg-green-100 text-green-700" :
                            order.status === "Failed" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  )
}

export default Overview