// components/OrderSummary.jsx
"use client";

import React from "react";

const OrderSummary = ({ subtotal, discount, shippingFees, total }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping Fees</span>
          <span>Rs. {shippingFees.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount</span>
          <span>Rs. {discount.toFixed(2)}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>Rs. {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
