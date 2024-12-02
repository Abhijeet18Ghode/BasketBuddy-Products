// components/CartItems.jsx
"use client";

import React from "react";
import Image from "next/image";
import { AiFillDelete } from "react-icons/ai";
import { FaMinus, FaPlus } from "react-icons/fa";

const CartItems = ({
  products,
  handleIncrement,
  handleDecrement,
  deleteProduct,
}) => {
  if (products.length === 0) {
    return <div className="text-center text-gray-500">Your cart is empty.</div>;
  }

  return (
    <div className="space-y-6 phone:space-y-4">
      {products.map((item) => (
        <CartItem
          key={item.product._id}
          item={item}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
          deleteProduct={deleteProduct}
        />
      ))}
    </div>
  );
};

const CartItem = ({
  item,
  handleIncrement,
  handleDecrement,
  deleteProduct,
}) => {
  const { _id, title, thumbnail, discountPrice } = item.product;
  const { quantity } = item;

  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out gap-5 phone:gap-3 phone:p-4 phone:flex-col phone:items-start">
      <ProductDetails
        title={title}
        thumbnail={thumbnail}
        discountPrice={discountPrice}
      />
      <div className="flex justify-between w-full items-center phone:mt-3">
        <QuantityControls
          productId={_id}
          quantity={quantity}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
        />
        <PriceAndDelete
          productId={_id}
          title={title}
          total={discountPrice * quantity}
          deleteProduct={deleteProduct}
        />
      </div>
    </div>
  );
};

const ProductDetails = ({ title, thumbnail, discountPrice }) => (
  <div className="flex items-center phone:w-full phone:flex-col phone:items-start">
    <Image
      src={thumbnail[0]}
      alt={title}
      width={80}
      height={80}
      className="rounded-lg object-cover shadow-md phone:w-20 phone:h-20"
    />
    <div className="ml-6 phone:ml-0 phone:mt-2">
      <h3 className="text-xl font-semibold text-gray-800 phone:text-lg">
        {title}
      </h3>
      <p className="text-gray-500 mt-1 phone:text-sm">
        Price:{" "}
        <span className="font-medium text-gray-700">Rs. {discountPrice}</span>
      </p>
    </div>
  </div>
);

const QuantityControls = ({
  productId,
  quantity,
  handleIncrement,
  handleDecrement,
}) => (
  <div className="flex items-center space-x-4 phone:space-x-2">
    <button
      onClick={() => handleDecrement(productId)}
      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200 ease-in-out"
    >
      <FaMinus className="text-gray-600 phone:text-sm" />
    </button>
    <span className="text-lg font-medium text-gray-800 phone:text-base">
      {quantity}
    </span>
    <button
      onClick={() => handleIncrement(productId)}
      className="p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors duration-200 ease-in-out"
    >
      <FaPlus className="text-gray-600 phone:text-sm" />
    </button>
  </div>
);

const PriceAndDelete = ({ productId, total, deleteProduct, title }) => (
  <div className="flex items-center space-x-6 phone:space-x-3">
    <span className="text-lg font-semibold text-gray-800 phone:text-base">
      Rs. {total}
    </span>
    <button
      onClick={() => deleteProduct(productId)}
      className="p-2 text-red-500 hover:text-red-600 transition-colors duration-200 ease-in-out"
      aria-label={`Delete ${title}`}
    >
      <AiFillDelete size={24} className="phone:text-sm" />
    </button>
  </div>
);

export default CartItems;
