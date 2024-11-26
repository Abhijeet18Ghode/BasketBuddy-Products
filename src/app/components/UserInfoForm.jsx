// components/UserInfoForm.jsx
"use client";

import React from "react";

const UserInfoForm = ({ formData, handleChange, handleSubmit }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md phone:p-3">
      <h2 className="text-2xl font-semibold mb-4">Shipping Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>
        {/* Email Address */}
        <div>
          <label className="block text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>
        {/* Phone Number */}
        <div>
          <label className="block text-gray-700">Phone Number</label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>
        {/* Shipping Address */}
        <div>
          <label className="block text-gray-700">Shipping Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            required
          />
        </div>
        {/* City, State, ZIP */}
        <div className="flex space-x-4">
          <div className="flex-1">
            <label className="block text-gray-700">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700">ZIP Code</label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>
        </div>
        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Save Information
        </button>
      </form>
    </div>
  );
};

export default UserInfoForm;
