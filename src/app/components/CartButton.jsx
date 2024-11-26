"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useCart } from "../provider/CartContext";
import axios from "axios";
import { useRouter } from "next/router";
import {IoMdCart} from "react-icons/md"

const Button = ({ amount, productId }) => {
  const customToastOptions = {
    style: {
      boxShadow:
        "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)", // Standard shadow
    },
  };

  const { data: session } = useSession();
  const { fetchCartData } = useCart();
  // const router = useRouter();

  const addToCart = async (id) => {
    if (!session) {
      toast.error("Please sign in first");
      return;
    }
    const loadingToast = toast.loading("Adding to cart...", customToastOptions);
    try {
      const res = await axios.post("/api/cart", {
        userId: session.user.id,
        productId: id,
        quantity: "1",
      });
      console.log(res);
      toast.success(res.data.message, {
        ...customToastOptions,
        id: loadingToast,
      });
      fetchCartData(); // Refresh the cart data after successfully adding
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // If product is already in the cart, show a specific message
        toast.error("Product already in the cart", {
          ...customToastOptions,
          id: loadingToast,
        });
      } else {
        // Handle other types of errors
        toast.error("Error adding product to cart", {
          ...customToastOptions,
          id: loadingToast,
        });
      }
    }
  };

  return (
    <button
      className="relative overflow-hidden group w-full bg-[#9d6b53] text-white uppercase font-medium cursor-pointer border-none"
      onClick={() => addToCart(productId)}
    >
      {/* Default Button Content */}
      <div className="flex items-center justify-center p-4 bg-[#9d6b53] transition-transform duration-300 transform group-hover:-translate-y-full phone:p-2 gap-2">
       <svg
             viewBox="0 0 24 24"
             width="20"
             height="20"
             stroke="#ffffff"
             strokeWidth={2}
             fill="none"
             strokeLinecap="round"
             strokeLinejoin="round"
             className="cart-icon"
           >
             <circle cx="9" cy="21" r="1" />
             <circle cx="20" cy="21" r="1" />
             <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
           </svg>
        <span className="text-base phone:text-xs">Add to Cart</span>
      </div>

      {/* Hover Button Content */}
      <div className="absolute top-0 left-0 flex items-center justify-center p-4 bg-[#8a5a44] transition-transform duration-300 transform translate-y-full group-hover:translate-y-0 w-full">
        <span className="text-base phone:text-xs">Rs.{amount}</span>
      </div>
    </button>
  );
};

export default Button;
