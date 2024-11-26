// pages/checkout.jsx
"use client";

import { useSession } from "next-auth/react";
import React, { useEffect, useState, useContext, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import Script from "next/script";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import { GrPrevious, GrNext } from "react-icons/gr";

import { CartContext } from "../../../lib/CartContext";
import { useCart } from "../provider/CartContext";
import { ProductContext } from "../provider/ProductContext";

import UserInfoForm from "../components/UserInfoForm";
import CartItems from "../components/CartItems";
import OrderSummary from "../components/OrderSummary";
import PaymentOptions from "../components/PaymentOption";
import CheckoutButton from "../components/CheckoutButton";
import { IoBagCheckOutline } from "react-icons/io5";

const CheckoutPage = () => {
  const { cartData, fetchCartData } = useCart();
  const { products, loading: productsLoading, error: productsError } = useContext(ProductContext);
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [userInfo, setUserInfo] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("online"); // Default to 'online'
  const [combinedCartItems, setCombinedCartItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const sliderRef = useRef(null);

  // Handle slider navigation
  const handlePrev = () => {
    sliderRef.current.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  const sliderSettings = {
    dots: false,
    infinite: combinedCartItems.length > 1,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // We are handling arrows manually
  };

  // Fetch user information
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch(`/api/user/getUserInfo/${userId}`);
        if (res.ok) {
          const data = await res.json();
          setUserInfo(data.user);
          setFormData({
            name: data.user.name || "",
            email: data.user.email || "",
            contact: data.user.contact || "",
            address: data.user.address || "",
            city: data.user.city || "",
            state: data.user.state || "",
            zip: data.user.zip || "",
          });
        } else {
          console.error("Error fetching user data:", res.statusText);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  // Combine cart items with product details
  useEffect(() => {
    if (cartData && cartData.cart && products) {
      const combined = cartData.cart.map((cartItem) => {
        const product = products.find((p) => p._id === cartItem.productId._id);
        return {
          ...cartItem,
          product,
        };
      });
      setCombinedCartItems(combined);
      setSubtotal(cartData.totalAmount);
    }
  }, [cartData, products]);

  // Handle form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/user/updateUser/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setUserInfo(data.user);
        toast.success("User information updated successfully!");
      } else {
        console.error("Error updating user:", res.statusText);
        toast.error("Failed to update user information.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An error occurred while updating user information.");
    }
  };

  // Handle quantity changes
  const handleIncrement = (productId) => {
    setIsChanged(true);
    setCombinedCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
    setSubtotal((prev) => prev + getProductPrice(productId));
  };

  const handleDecrement = (productId) => {
    setIsChanged(true);
    setCombinedCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product._id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
    setSubtotal((prev) => prev - getProductPrice(productId));
  };

  // Get product price based on ID
  const getProductPrice = (productId) => {
    const item = combinedCartItems.find((item) => item.product._id === productId);
    return item ? item.product.discountPrice : 0;
  };

  // Handle save changes
  const handleSave = async () => {
    const loadingToast = toast.loading("Updating cart...");
    try {
      const response = await fetch("/api/cart/updateCart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId,  combinedCartItems }),
      });
      if (response.ok) {
        toast.success("Cart updated successfully!", {
          id: loadingToast,
        });
        setIsChanged(false);
        fetchCartData();
      } else {
        toast.error("Failed to update cart.", { id: loadingToast });
      }
    } catch (error) {
      console.error("Error updating cart:", error);
      toast.error("An error occurred while updating the cart.", { id: loadingToast });
    }
  };

  // Handle payment
  const createOrderId = async () => {
    try {
      const response = await fetch("/api/make-payment", {
        method: "POST",
        body: JSON.stringify({ amount: subtotal * 100 }), // Amount in paise
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (response.ok) {
        return data.orderId;
      } else {
        throw new Error(data.error || "Failed to create order");
      }
    } catch (error) {
      console.error("Error creating order ID:", error);
      toast.error("Error creating order. Please try again.");
      throw error;
    }
  };

  const processPayment = async () => {
    try {
      const orderId = await createOrderId();
      const options = {
        key: process.env.NEXT_PUBLIC_KEY_ID,
        amount: subtotal * 100, // Convert to paise
        currency: "INR",
        name: "E-cart",
        description: "Product Purchase",
        order_id: orderId,
        handler: async function (response) {
          const paymentData = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          // Verify payment
          const result = await fetch("/api/verify-payment", {
            method: "POST",
            body: JSON.stringify(paymentData),
            headers: { "Content-Type": "application/json" },
          });

          if (result.ok) {
            // Save order details
            const orderDetails = {
              user: userId,
              amount: subtotal,
              productDetails: combinedCartItems.map((item) => ({
                productId: item.product._id,
                quantity: item.quantity,
              })),
              shippingAddress: {
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zip: formData.zip,
              },
              paymentDetails: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                cardName: "N/A",
                cardNumber: "N/A",
                expiryDate: "N/A",
                cvv: "N/A",
              },
              paymentMethod: "online",
            };

            try {
              const saveOrderResult = await fetch("/api/orders", {
                method: "POST",
                body: JSON.stringify(orderDetails),
                headers: { "Content-Type": "application/json" },
              });
              if (saveOrderResult.ok) {
                toast.success("Order placed successfully!");
                router.push("/");
              } else {
                toast.error("Failed to place order. Please try again.");
              }
            } catch (error) {
              console.error("Error saving order:", error);
              toast.error("An error occurred while placing your order.");
            }
          } else {
            toast.error("Payment verification failed.");
          }
        },
        prefill: {
          email: session.user.email,
        },
        theme: {
          color: "#6B21A8",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response) {
        toast.error(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  // Handle Cash on Delivery
  const handleCODOrder = async () => {
    try {
      const orderDetails = {
        user: userId,
        amount: subtotal,
        productDetails: combinedCartItems.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        paymentMethod: "cod",
      };

      const saveOrderResult = await fetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(orderDetails),
        headers: { "Content-Type": "application/json" },
      });

      if (saveOrderResult.ok) {
        toast.success("Order placed successfully! Please pay cash on delivery.");
        router.push("/");
      } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing COD order:", error);
      toast.error("An error occurred while placing your order.");
    }
  };

  // Handle payment method change
  const handlePaymentChange = (value) => {
    setPaymentMethod(value);
  };

  // Handle discount application (Basic example)
  const applyDiscount = () => {
    // Implement your discount logic here
    const discountAmount = 50; // Example fixed discount
    setDiscount(discountAmount);
    setSubtotal((prev) => prev - discountAmount);
    toast.success("Discount applied!");
  };

  // Handle place order button click
  const handlePlaceOrder = async () => {
    if (paymentMethod === "online") {
      await processPayment();
    } else if (paymentMethod === "cod") {
      await handleCODOrder();
    }
  };

  // Handle delete product
  const deleteProduct = async (productId) => {
    const loadingToast = toast.loading("Deleting product...");
    try {
      const response = await fetch("/api/cart/deleteProduct", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId }),
      });

      if (response.ok) {
        setCombinedCartItems((prevItems) => prevItems.filter((item) => item.product._id !== productId));
        setSubtotal((prev) => prev - getProductPrice(productId));
        toast.success("Product removed successfully!", { id: loadingToast });
      } else {
        const errorData = await response.json();
        console.error("Error deleting product:", errorData.message);
        toast.error("Failed to remove product.", { id: loadingToast });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An error occurred while removing the product.", { id: loadingToast });
    }
  };

  if (!userInfo) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
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

  return (
    <div className="w-full p-5 bg-slate-100 min-h-screen flex flex-col gap-5 phone:p-2">
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Toaster  />
      <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2"><IoBagCheckOutline className="text-2xl phone:text-lg"/><h1 className="text-3xl font-bold flex items-end gap-2 phone:text-lg">Checkout Page</h1></div>
      <hr className="w-64"/>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Section: User Info Form */}
        <div>
          <UserInfoForm
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
          />
        </div>
        {/* Right Section: Cart Items and Order Summary */}
        <div className="space-y-6">
          <CartItems
            products={combinedCartItems}
            handleIncrement={handleIncrement}
            handleDecrement={handleDecrement}
            deleteProduct={deleteProduct}
          />
          {isChanged && (
            <button
              onClick={handleSave}
              className="w-full bg-blue-500 py-2 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save Changes
            </button>
          )}
            <div className="mt-8 max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="flex space-x-4 phone:flex-col phone:space-x-0 phone:gap-2">
          <input
            type="text"
            placeholder="Discount Code"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <button
            onClick={applyDiscount}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors phone:w-full"
          >
            Apply
          </button>
        </div>
      </div>
          <OrderSummary
            subtotal={subtotal}
            discount={discount}
            shippingFees={0}
            total={subtotal - discount}
          />
         
          <PaymentOptions
            paymentMethod={paymentMethod}
            handlePaymentChange={handlePaymentChange}
          />
          <CheckoutButton
            paymentMethod={paymentMethod}
            processPayment={processPayment}
            handleCODOrder={handleCODOrder}
          />
        </div>
      </div>
      {/* Discount Code and Additional Features */}
     
    </div>
  );
};

export default CheckoutPage;
