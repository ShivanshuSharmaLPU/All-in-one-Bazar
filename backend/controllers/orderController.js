import razorpayInstance from "../config/razorpay.js";
import { Order } from "../models/orderModel.js";
import { Cart } from "../models/cartModel.js";
import User from "../models/userModel.js";
import { Product } from "../models/productModel.js";
import crypto from "crypto";

export const createOrder = async (req, res) => {
  try {
    const { products, amount, tax, shipping, currency } = req.body;

    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    if (!products?.length) {
      return res.status(400).json({ success: false, message: "No products provided" });
    }

    if (!amount || isNaN(amount)) {
      return res.status(400).json({ success: false, message: "Invalid amount" });
    }

    // Use a dummy Razorpay order ID if keys are not real
    let razorpayOrderId = "bypass_" + Date.now();
    let razorpayOrder = { id: razorpayOrderId, amount: Math.round(Number(amount) * 100), currency: currency || "INR" };

    try {
      const realOrder = await razorpayInstance.orders.create({
        amount: Math.round(Number(amount) * 100),
        currency: currency || "INR",
        receipt: `receipt_${Date.now()}`,
      });
      razorpayOrder = realOrder;
      razorpayOrderId = realOrder.id;
    } catch (rzpError) {
      // Razorpay not configured, using bypass mode
      console.log("Razorpay not configured, using bypass mode");
    }

    const newOrder = await Order.create({
      user: req.user._id,
      products,
      amount: Number(amount),
      tax: Number(tax) || 0,
      shipping: Number(shipping) || 0,
      currency: currency || "INR",
      status: "Pending",
      razorpayOrderId: razorpayOrderId,
    });

    res.status(201).json({
      success: true,
      order: razorpayOrder,
      dbOrder: newOrder,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentFailed, bypass } = req.body;

    // Bypass mode - mark as paid directly without Razorpay
    if (bypass) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Paid", razorpayPaymentId: "bypass_" + Date.now() },
        { new: true }
      );
      return res.status(200).json({ success: true, message: "Order placed successfully", order });
    }

    if (paymentFailed) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" },
        { new: true }
      );
      return res.status(400).json({ success: false, message: "Payment failed", order });
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const order = await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        {
          status: "Paid",
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature
        },
        { new: true }
      );

      await Cart.findOneAndUpdate(
        { userId: req.user._id },
        { $set: { items: [], totalPrice: 0 } }
      );

      return res.status(200).json({ success: true, message: "Payment verified successfully", order });
    } else {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { status: "Failed" }
      );
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




export const getMyOrder = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


//Admin only

export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ user: userId })
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log("Error fetching user orders:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//getallorder

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email")
      .populate({
        path: "products.productId",
        select: "productName productPrice productImg",
      });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.log("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch all orders",
      error: error.message,
    });
  }
};


export const getSalesData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalProducts = await Product.countDocuments({});
    const totalOrders = await Order.countDocuments({ status: "Paid" });

    const totalSaleAgg = await Order.aggregate([
      { $match: { status: "Paid" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const totalSales = totalSaleAgg[0]?.total || 0;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const salesByDate = await Order.aggregate([
      { 
        $match: { 
          status: "Paid", 
          createdAt: { $gte: thirtyDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const formattedSales = salesByDate.map((item) => ({
      date: item._id,
      amount: item.amount
    }));

    res.status(200).json({
      success: true,
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales,
      sales: formattedSales
    });

  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};