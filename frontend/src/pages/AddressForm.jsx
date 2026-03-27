import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { addAddress, setSelectedAddress, setCart, deleteAddress } from "@/redux/productSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { MapPin, Plus, Trash2 } from "lucide-react";

const AddressForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, addresses, selectedAddress } = useSelector((store) => store.product);

  const [showForm, setShowForm] = useState(addresses?.length === 0);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    country: "India",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = () => {
    if (!formData.fullName || !formData.address || !formData.city) {
      toast.error("Please fill all required fields");
      return;
    }
    dispatch(addAddress(formData));
    setShowForm(false);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      country: "India",
    });
  };

  const handleDeleteAddress = (index, e) => {
    e.stopPropagation();
    dispatch(deleteAddress(index));
    toast.success("Address deleted");
  };

  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : 40;
  const tax = parseFloat((subtotal * 0.05).toFixed(2));
  const total = subtotal + shipping + tax;

  const handlePayment = async () => {
    const accessToken = localStorage.getItem("accesstoken");

    if (!accessToken) { toast.error("Please login first"); return; }
    if (!cart?.items || cart.items.length === 0) { toast.error("Cart is empty"); return; }
    if (selectedAddress === null) { toast.error("Please select an address"); return; }

    try {
      const products = cart.items.map((item) => ({
        productId: item.productId?._id || item.productId,
        quantity: item.quantity,
      }));

      // Create order and mark as paid directly (no Razorpay)
      const { data } = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/order/create-order`,
        { products, amount: total, tax, shipping, currency: "INR" },
        { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
      );

      if (!data.success) { toast.error(data.message || "Something went wrong"); return; }

      // Mark order as paid directly without Razorpay
      await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/order/verify-payment`,
        { razorpay_order_id: data.dbOrder.razorpayOrderId, bypass: true },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      toast.success("Order Placed Successfully!");
      dispatch(setCart({ items: [], totalPrice: 0 }));
      navigate("/order-success");

    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Order Failed");
    }
  };

  return (
    <div className="pt-28 pb-20 bg-[#f1f3f6] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {showForm ? (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  Add Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  <Input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <Input
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                />
                <Input
                  name="address"
                  placeholder="Flat No, Street, Area, Landmark"
                  value={formData.address}
                  onChange={handleChange}
                />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Input
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                  <Input
                    name="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                  />
                  <Input
                    name="zip"
                    placeholder="Zip Code"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                  <Input
                    name="country"
                    value={formData.country}
                    readOnly
                    className="bg-gray-100 text-gray-400"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSave}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold w-full"
                  >
                    Save Address
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <h2 className="text-lg font-bold">Select Delivery Address</h2>
              {addresses.map((addr, index) => (
                <div
                  key={index}
                  onClick={() => dispatch(setSelectedAddress(index))}
                  className={`p-4 rounded-md border cursor-pointer transition relative ${
                    selectedAddress === index
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      checked={selectedAddress === index}
                      readOnly
                      className="mt-1 accent-orange-600"
                    />
                    <div className="flex-1">
                      <p className="font-bold">{addr.fullName}</p>
                      <p className="text-sm text-gray-600">
                        {addr.address}, {addr.city}, {addr.state} - {addr.zip}
                      </p>
                      <p className="text-sm text-gray-600">{addr.phone}</p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteAddress(index, e)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() => setShowForm(true)}
                className="w-full border-dashed"
              >
                <Plus className="w-4 h-4 mr-2" /> Add New Address
              </Button>
              <Button
                disabled={selectedAddress === null}
                onClick={handlePayment}
                className="w-full bg-[#fb641b] hover:bg-[#e65a18] text-white font-bold h-12 uppercase mt-4"
              >
                Proceed To Checkout
              </Button>
            </div>
          )}
        </div>

        {/* RIGHT SIDE - ORDER SUMMARY */}
        <div>
          <Card className="shadow-sm sticky top-28">
            <CardHeader className="border-b">
              <CardTitle className="text-sm uppercase text-gray-500">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({cart?.items?.length} items)</span>
                <span className="font-bold">
                  ₹{subtotal.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span
                  className={
                    shipping === 0 ? "text-green-600 font-bold" : "font-bold"
                  }
                >
                  {shipping === 0 ? "FREE" : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>GST (5%)</span>
                <span className="font-bold">
                  ₹{tax.toLocaleString("en-IN")}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div className="pt-4 text-[11px] text-gray-400 text-center uppercase font-medium">
                • Safe & Secure Payments <br />
                • Authentic Products Only
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;