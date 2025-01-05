"use client"
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const Orders = () => {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchOrders(session.user.id);
    } else {
      setLoading(false);
      setError('User not logged in or session expired.');
    }
  }, [session]);

  const fetchOrders = async (userId) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/orders/${userId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Your Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <h2>Order ID: {order._id}</h2>
              <p>
                <strong>Amount:</strong> ₹{order.amount}
              </p>
              <p>
                <strong>Status:</strong> {order.orderStatus}
              </p>
              <p>
                <strong>Tracking ID:</strong> {order.trackingId || 'N/A'}
              </p>
              <p>
                <strong>Delivery Date:</strong> {new Date(order.deliveryDate).toLocaleDateString()}
              </p>
              <h3>Products:</h3>
              <ul>
                {order.products.map((productDetail) => (
                  <li key={productDetail.productId._id}>
                    <p>
                      <strong>Product Name:</strong> {productDetail.productId.title}
                    </p>
                    <p>
                      <strong>Quantity:</strong> {productDetail.quantity}
                    </p>
                    <p>
                      <strong>Price:</strong> ₹{productDetail.productId.price}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
