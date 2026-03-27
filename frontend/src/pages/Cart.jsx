import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCart } from "../redux/productSlice";
import axios from "axios";
import { Trash2, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import userLogo from "../assets/userlogo.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Cart = () => {
  const { cart } = useSelector((store) => store.product);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("accesstoken");

  const updateQuantity = async (productId, type) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_URL}/api/v1/cart/update`,
        { productId, type },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      dispatch(setCart(res.data.cart));
    } catch (error) {
      console.log(error);
    }
  };

  const removeItem = async (productId) => {
    try {
      const res = await axios.delete(`${import.meta.env.VITE_URL}/api/v1/cart/remove`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { productId },
        withCredentials: true,
      });
      dispatch(setCart(res.data.cart));
    } catch (error) {
      console.log(error);
    }
  };

  const subtotal = cart?.totalPrice || 0;
  const shipping = subtotal > 299 ? 0 : 40;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  return (
    <div className="pt-32 pb-20 bg-[#f1f3f6] min-h-screen font-sans antialiased">
      {cart?.items?.length > 0 ? (
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* LEFT: Items List */}
            <div className="flex-[2] flex flex-col gap-4 w-full">
              {cart?.items?.map((product, index) => (
                <Card key={index} className="border-none shadow-sm rounded-sm bg-white overflow-hidden">
                  <div className="flex flex-col sm:flex-row justify-between items-center p-6 gap-6">
                    <div className="flex items-center gap-6 flex-1">
                      <div className="w-24 h-24 border border-gray-100 p-2 rounded bg-white flex items-center justify-center shrink-0">
                        <img 
                          src={product?.productId?.productImg?.[0]?.url || userLogo} 
                          alt="" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="min-w-0">
                        <h2 className="text-lg font-medium text-gray-900 truncate max-w-[250px] sm:max-w-[350px]">
                          {product?.productId?.productName}
                        </h2>
                        <p className="text-sm text-gray-500 mt-1 font-semibold">
                          ₹{product?.productId?.productPrice?.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-10">
                      <div className="flex items-center gap-3 border rounded-full px-2 py-1">
                        <button onClick={() => updateQuantity(product?.productId?._id, "decrease")} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full font-bold">-</button>
                        <span className="font-bold text-sm">{product?.quantity}</span>
                        <button onClick={() => updateQuantity(product?.productId?._id, "increase")} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full font-bold">+</button>
                      </div>
                      
                      <p className="font-bold text-lg text-gray-900 min-w-[100px] text-right">
                        ₹{(product?.productId?.productPrice * product?.quantity).toLocaleString('en-IN')}
                      </p>

                      {/* Remove Button with Trash Icon */}
                      <button 
                        onClick={() => removeItem(product?.productId?._id)} 
                        className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors font-semibold text-sm"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* RIGHT: Price Details (Compact Size) */}
            <div className="lg:w-[380px] w-full sticky top-32">
              <Card className="border-none shadow-sm rounded-sm bg-white overflow-hidden">
                <CardHeader className="border-b border-gray-100 py-3 px-4">
                  <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Price Details
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm text-gray-700 ">
                      <span>Subtotal ({cart?.items?.length} items)</span>
                      <span className="font-bold">₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>Delivery Charges</span>
                      <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                        {shipping === 0 ? "FREE" : `₹${shipping}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-700">
                      <span>GST (5%)</span>
                      <span className="font-bold">₹{tax.toLocaleString('en-IN')}</span>
                    </div>

                    {/* Simple Separator before Total */}
                    <Separator className="my-2 border-t border-dashed border-gray-300" />

                    <div className="flex justify-between font-bold text-lg text-gray-900 py-1">
                      <span>Total Amount</span>
                      <span>₹{total.toLocaleString('en-IN')}</span>
                    </div>

                    <div className="pt-3 space-y-2">
                      <div className="flex gap-2">
                        <Input placeholder="Promo Code" className="h-9 text-sm bg-gray-50 border-gray-200" />
                        <button className="h-9 px-4 text-xs font-bold border border-gray-300 rounded hover:bg-gray-50 transition-colors">Apply</button>
                      </div>
                      
                      <Button onClick={() => navigate('/address')}
                      className="w-full bg-[#fb641b] hover:bg-[#e65a18] text-white font-bold h-11 uppercase text-xs tracking-wide rounded-sm shadow-sm">
                        PLACE ORDER
                      </Button>
                      
                      <Button variant="outline" className="w-full h-10 text-xs font-bold text-gray-500 border-gray-300" asChild>
                        <Link to="/products">Continue Shopping</Link>
                      </Button>
                    </div>

                    <div className="pt-4 space-y-1 text-[10px] text-gray-400 font-medium uppercase leading-tight">
                      <p>• Free shipping on orders over ₹299</p>
                      <p>• 30-days return policy</p>
                      <p>• Secure checkout with SSL encryption</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <p className="text-green-600 font-bold text-xs mt-3 px-2 text-center">
                You will save ₹40 on this order!
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center pt-20">
          <div className="bg-white p-12 rounded-sm shadow-sm border border-gray-200 text-center">
            <ShoppingCart className="w-20 h-20 text-gray-100 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800">Your cart is empty!</h2>
            <p className="text-gray-500 text-sm mt-2 mb-8">Add items to it now to shop.</p>
            <Button onClick={() => navigate('/products')} className="bg-[#2874f0] text-white px-16 h-12 font-bold rounded-sm">
              Shop Now
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;




