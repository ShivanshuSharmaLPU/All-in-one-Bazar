import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import OrderCard from "@/components/OrderCard";

const MyOrder = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accesstoken");

const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/order/myorder`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (res.data.success) {
        setUserOrders(res.data.orders);
      }
    } catch (error) {
      console.log("Order Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin text-orange-500" size={35} />
      </div>
    );
  }

  return (
    <OrderCard userOrders={userOrders}/>
  );
};

export default MyOrder;