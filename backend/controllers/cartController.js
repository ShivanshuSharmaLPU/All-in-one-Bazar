import { Cart } from "../models/cartModel.js";
import { Product } from "../models/productModel.js";

const calculateTotal = (items) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ userId }).populate("items.productId");

        if (!cart) {
            return res.status(200).json({ success: true, cart: { items: [], totalPrice: 0 } });
        }
        res.status(200).json({ success: true, cart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { productId } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: [{ productId, quantity: 1, price: product.productPrice }],
                totalPrice: product.productPrice
            });
        } else {
            const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += 1;
            } else {
                cart.items.push({ productId, quantity: 1, price: product.productPrice });
            }
            cart.totalPrice = calculateTotal(cart.items);
        }

        await cart.save();
        const populatedCart = await cart.populate("items.productId");
        res.status(200).json({ success: true, message: "Product added to cart", cart: populatedCart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const updateQuantity = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { productId, type } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        const item = cart.items.find(item => item.productId.toString() === productId);
        if (!item) return res.status(404).json({ success: false, message: "Item not found" });

        if (type === "increase") item.quantity += 1;
        else if (type === "decrease" && item.quantity > 1) item.quantity -= 1;

        cart.totalPrice = calculateTotal(cart.items);
        await cart.save();
        await cart.populate("items.productId");

        res.status(200).json({ success: true, cart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id; 
        const { productId } = req.body;

        let cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        cart.totalPrice = calculateTotal(cart.items);

        await cart.save();
        await cart.populate("items.productId");

        res.status(200).json({ success: true, message: "Item removed", cart });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};