import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Package, ShoppingCart, IndianRupee, TrendingUp } from "lucide-react";
// import { ResponsiveContainer } from 'recharts';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

const AdminSales = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalSales: 0,
    sales: []
  });

  const fetchStats = async () => {
    try {
      const accessToken = localStorage.getItem("accesstoken");
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/order/sales`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      if (res.data.success) {
        setStats({
          totalUsers: res.data.totalUsers || 0,
          totalProducts: res.data.totalProducts || 0,
          totalOrders: res.data.totalOrders || 0,
          totalSales: res.data.totalSales || 0,
          sales: res.data.sales || []
        });
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="pl-[30px] bg-gray-50 min-h-screen py-12 pr-12">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">Sales Dashboard</h1>
          <p className="text-gray-500 text-sm">Last 30 days overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-pink-600 text-white shadow-lg border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-pink-100 uppercase">Total Users</CardTitle>
              <Users size={18} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white shadow-lg border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-100 uppercase">Products</CardTitle>
              <Package size={18} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalProducts}</p>
            </CardContent>
          </Card>

          <Card className="bg-green-600 text-white shadow-lg border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-100 uppercase">Orders</CardTitle>
              <ShoppingCart size={18} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalOrders}</p>
            </CardContent>
          </Card>

          <Card className="bg-orange-600 text-white shadow-lg border-none">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-orange-100 uppercase">Revenue</CardTitle>
              <IndianRupee size={18} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">₹{stats.totalSales?.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sales Data List */}
        <Card className="shadow-sm border-none">
          <CardHeader>
            <CardTitle>Sales (Last 30 Days)</CardTitle>
          </CardHeader>

          <CardContent>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={stats.sales}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis />

                  <Tooltip />

                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#F97316"
                    fill="#FDBA74"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AdminSales;