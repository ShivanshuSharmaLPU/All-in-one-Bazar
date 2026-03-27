import React from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'sonner';
import axios from 'axios';
import { setCart } from '../redux/productSlice';
import { Button } from './ui/button';

const ProductDesc = ({ product }) => {
  const dispatch = useDispatch();

  const addToCart = async (productId) => {
    const token = localStorage.getItem('accesstoken');
    if (!token) return toast.error('Please login first');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/cart/add`,
        { productId, quantity: 1 }, 
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success('Product added to cart');
        dispatch(setCart(res.data.cart));
      } else {
        toast.error(res.data.message || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to add product to cart');
    }
  };

  return (
    <div className="flex flex-col gap-4 max-w-md">
      <h1 className="font-bold text-4xl text-gray-800">{product.productName}</h1>
      <p className="text-gray-800 text-sm">{product.category} | {product.brand}</p>
      <h2 className="text-pink-500 font-bold text-2xl">₹{product.productPrice}</h2>
      <p className="text-gray-600 line-clamp-8">{product.productDesc}</p>

      <Button
        onClick={() => addToCart(product._id)}
        className="bg-orange-600 hover:bg-orange-500 text-white w-max px-6 py-2 rounded-md font-medium transition-colors"
      >
        Add to Cart
      </Button>
    </div>
  );
};

export default ProductDesc;





