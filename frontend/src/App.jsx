import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

import Home from '@/pages/Home'
import Signup from '@/pages/Signup'
import Login from '@/pages/Login'
import Verify from '@/pages/Verify'
import VerifyEmail from '@/pages/VerifyEmail'
import Profile from '@/pages/Profile'
import Products from '@/pages/Products'
import Cart from '@/pages/Cart'
import GoogleAuthSuccess from '@/pages/GoogleAuthSuccess'

import Dashboard from '@/pages/Dashboard'
import AdminSales from '@/pages/admin/AdminSales'
import Overview from '@/pages/admin/Overview'
import AddProduct from '@/pages/admin/AddProduct'
import AdminProduct from '@/pages/admin/AdminProduct'
import AdminOrders from '@/pages/admin/AdminOrders'
import AdminUsers from '@/pages/admin/AdminUsers'
import UserInfo from '@/pages/admin/UserInfo'
import ProtectedRoute from '@/components/ui/ProtectedRoute'
import SingleProduct from '@/pages/SingleProduct'
import AddressForm from '@/pages/AddressForm'
import OrderSuccess from '@/pages/OrderSuccess'
import ForgotPassword from '@/pages/ForgotPassword'
import ShowUserOrders from '@/pages/admin/ShowUserOrders'

const App = () => {
  return (
    <Router>

      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify/:token" element={<VerifyEmail />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

        <Route path="/profile/:userId" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="/address" element={
          <ProtectedRoute>
            <AddressForm />
          </ProtectedRoute>
        } />
        <Route path="/order-success" element={
          <ProtectedRoute>
            <OrderSuccess />
          </ProtectedRoute>
        } />
        <Route path='products/:id' element={<SingleProduct />} />

        <Route path="/dashboard" element={
          <ProtectedRoute adminOnly>
            <Dashboard />
          </ProtectedRoute>
        }>
          <Route index element={<Overview />} />
          <Route path="sales" element={<AdminSales />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="products" element={<AdminProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="users/orders/:userId" element={<ShowUserOrders />} />
          <Route path="users/:id" element={<UserInfo />} />
        </Route>

      </Routes>

      <Footer />

    </Router>
  )
}

export default App