import React from "react";
import { useNavigate } from "react-router-dom";

const OrderCard = ({ userOrders }) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-4">
      {userOrders.length === 0 ? (
        <div className="text-center py-10">
          <h2 className="text-xl font-semibold text-gray-700">
            No Orders Found
          </h2>
          <p className="text-gray-500 mt-2">
            Your orders will appear here after purchase.
          </p>
        </div>
      ) : (
        userOrders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg mb-6 p-4 bg-white"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
              <div>
                <p className="text-sm text-gray-500">
                  Date:{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
                <p className="text-sm font-semibold text-gray-700">
                  Total: ₹{order.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Order ID: {order._id.slice(-6)}
                </p>
              </div>

              <div>
                <span
                  className={`px-3 py-1 text-xs rounded ${
                    order.status === "Paid"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
            </div>

            {/* Products */}
            {order.products.map((item, index) => {
              const product = item.productId;

              const productImage =
                product?.productImg?.[0]?.url ||
                product?.productImg?.[0] ||
                "https://via.placeholder.com/150";

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 border-t pt-4 mt-4"
                >
                  <img
                    src={productImage}
                    alt="product"
                    className="w-24 h-24 object-cover rounded border"
                  />

                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">
                      {product?.productName || "Product Unavailable"}
                    </h4>

                    <p className="text-sm text-gray-500 mt-1">
                      Price: ₹
                      {(product?.productPrice || 0).toLocaleString()}
                    </p>

                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity || 1}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      const productId =
                        typeof item.productId === "object"
                          ? item.productId._id
                          : item.productId;

                      if (productId) {
                        navigate(`/products/${productId}`);
                      }
                    }}
                    className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                  >
                    View Product
                  </button>
                </div>
              );
            })}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderCard;