// components/CheckoutButton.jsx
"use client";

import React from "react";

const CheckoutButton = ({ paymentMethod, processPayment, handleCODOrder }) => {
  const handleClick = () => {
    if (paymentMethod === "online") {
      processPayment();
    } else {
      handleCODOrder();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors"
    >
      {paymentMethod === "online" ? "Pay Now" : "Place Order"}
    </button>
  );
};

export default CheckoutButton;
