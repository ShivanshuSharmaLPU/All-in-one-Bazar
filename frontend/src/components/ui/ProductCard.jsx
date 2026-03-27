import React from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCart } from "../../redux/productSlice";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product, loading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="shadow-sm rounded-xl overflow-hidden border border-gray-100 bg-white flex flex-col h-full">
        <div className="h-52 bg-gray-50 p-6">
          <Skeleton className="w-full h-full rounded-md" />
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="mt-auto pt-2">
             <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    );
  }


  const { _id, productImg, productPrice, productName } = product;

  const addToCart = async (productId) => {
    const token = localStorage.getItem("accesstoken");
    if (!token) return toast.error("Please login first");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/cart/add`,
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setCart(res.data.cart));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="shadow-sm hover:shadow-md rounded-xl overflow-hidden border border-gray-100 bg-white group flex flex-col h-full transition-shadow duration-300">
      
      {/* Image Section - Clickable */}
      <div 
        onClick={() => navigate(`/products/${_id}`)}
        className="relative overflow-hidden bg-[#f9f9f9] flex items-center justify-center h-52 p-6 cursor-pointer"
      >
        <img
          src={productImg?.[0]?.url || "https://via.placeholder.com/150"}
          alt={productName}
          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-in-out"
        />
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <h1 
          onClick={() => navigate(`/products/${_id}`)}
          className="text-sm font-medium text-gray-700 line-clamp-2 h-10 leading-tight mb-2 cursor-pointer hover:text-pink-600 transition-colors"
        >
          {productName}
        </h1>

        <div className="mt-auto">
          <p className="text-lg font-semibold text-gray-900">
            ₹{productPrice?.toLocaleString('en-IN')}
          </p>

          <Button
            onClick={() => addToCart(_id)}
            className="bg-gray-900  hover:bg-orange-600 text-white w-full mt-3 h-10 text-sm font-medium transition-colors duration-300 rounded-md flex items-center justify-center"
          >
            <ShoppingCart size={16} className="mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;