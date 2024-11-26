// components/PaymentOptions.jsx
"use client";

import React from "react";
import { RadioGroup, RadioButton } from "react-radio-buttons";

const PaymentOptions = ({ paymentMethod, handlePaymentChange }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
      <RadioGroup
        onChange={handlePaymentChange}
        horizontal
        value={paymentMethod}
        className="space-x-4"
      >
        <RadioButton value="online" rootColor="#6B21A8" pointColor="#6B21A8" >
          Online
        </RadioButton>
        <RadioButton value="cod" rootColor="#6B21A8" pointColor="#6B21A8">
          Cash On Delivery
        </RadioButton>
      </RadioGroup>
    </div>
  );
};

export default PaymentOptions;
