import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import OrderCard from "@/components/OrderCard";

const ShowUserOrders = () => {
  const { userId } = useParams();
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserOrders = async () => {
    try {
      const accessToken = localStorage.getItem("accesstoken");

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/order/user-order/${userId}`,
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
      console.log("Fetch User Orders Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserOrders();
    }
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div>
      <OrderCard userOrders={userOrders} />
    </div>
  );
};

export default ShowUserOrders;