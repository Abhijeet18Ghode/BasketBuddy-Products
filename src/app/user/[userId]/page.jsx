"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session, status } = useSession(); // Include status to check session loading state
  const userId = session?.user?.id; // Fetching userId directly from session

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [cancelingOrder, setCancelingOrder] = useState(null); // Track which order is being canceled

  useEffect(() => {
    console.log("Session status:", status); // Log the session status
    console.log("Session data:", session); // Log the session data

    if (status === "loading") {
      return; // Session is still loading, so do nothing yet
    }

    if (session && userId) {
      const fetchOrders = async () => {
        try {
          const res = await fetch(`/api/orders/users/${userId}`, { method: "GET" });

          if (!res.ok) {
            throw new Error(`Failed to fetch orders. Status: ${res.status}`);
          }

          const data = await res.json();
          setOrders(data);

          // Fetch product details for each product in the orders
          const productDetailsMap = {};
          for (const order of data) {
            for (const product of order.products) {
              const productId = product.productId._id;
              if (!productDetailsMap[productId]) {
                const productRes = await fetch(`/api/products/getSingleProduct/${productId}`);
                if (!productRes.ok) {
                  throw new Error(
                    `Failed to fetch product details for ${productId}. Status: ${productRes.status}`
                  );
                }
                const productData = await productRes.json();
                productDetailsMap[productId] = productData;
              }
            }
          }
          setProductDetails(productDetailsMap);
        } catch (error) {
          console.error("Error fetching orders or product details:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [session, userId, status]);

  // Function to cancel an order
  // Function to cancel an order
const handleCancelOrder = async (orderId) => {
  setCancelingOrder(orderId); // Set the current order to be canceled
  try {
    const res = await fetch(`/api/orders/cancel/${orderId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }), // Send only the orderId
    });

    if (!res.ok) {
      throw new Error(`Failed to cancel order. Status: ${res.status}`);
    }

    // Optionally refetch the orders or update the UI
    const updatedOrders = orders.filter((order) => order._id !== orderId);
    setOrders(updatedOrders); // Update the orders list
  } catch (error) {
    console.error('Error canceling order:', error);
    setError('Failed to cancel the order. Please try again.');
  } finally {
    setCancelingOrder(null); // Reset the canceling state
  }
};


  if (loading) {
    return (
      <div role="status" className="w-full h-screen flex items-center justify-center">
        <svg
          aria-hidden="true"
          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-700"
          viewBox="0 0 100 101"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex flex-col gap-10">
      <h1>Your Orders</h1>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id} className="shadow-md p-5">
              <p>Order ID: {order._id}</p>
              <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Total Products: {order.products.length}</p>
              <ul>
                {order.products.map((product) => {
                  const productDetailsData =
                    productDetails[product.productId._id];
                  return (
                    <li key={product.productId._id}>
                      {productDetailsData ? (
                        <>
                          <p>{productDetailsData.name}</p>
                          <p>Price: {productDetailsData.price}</p>
                          <p>Description: {productDetailsData.description}</p>
                        </>
                      ) : (
                        <p>Loading product details...</p>
                      )}
                      <p>Quantity: {product.quantity}</p>
                    </li>
                  );
                })}
              </ul>
              {/* Cancel Order button */}
              <button
                className="mt-5 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => handleCancelOrder(order._id)}
                disabled={cancelingOrder === order._id} // Disable the button while canceling
              >
                {cancelingOrder === order._id ? "Canceling..." : "Cancel Order"}
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default Page;
