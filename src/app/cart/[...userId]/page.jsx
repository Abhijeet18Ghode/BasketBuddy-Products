"use client";
import { useParams } from 'next/navigation';
import React, { useState, useEffect, useContext } from 'react';
import { AiFillDelete } from "react-icons/ai";
import { IoArrowBack } from "react-icons/io5";
import Link from 'next/link';
import Script from 'next/script';
import { CartContext } from '../../../../lib/CartContext';
import axios from 'axios';
import { FaMinus } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import toast, { Toaster } from 'react-hot-toast';
import { useCart } from '@/app/provider/CartContext';
import Image from 'next/image';
import { ProductContext } from '@/app/provider/ProductContext';
import Lottie from 'lottie-react';
import EmptyCart from "../../animData/emptyCart.json"
const Page = () => {
  const { products, loading, error } = useContext(ProductContext);
  const {cartData} = useCart()
  const { fetchCartData } = useCart();
  const { userId } = useParams();
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [subtotal, setSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isChanged, setIsChanged] = useState(false);
  const [combinedCartItems,setCombineCartItems] = useState(null)
  console.log("c = ",cartData)
  useEffect(() => {
    if (cartData && cartData.cart) {
      const handleSetCartItems = () => {
        // Map through the cart items and find the product for each cart item
        const combinedCartItems = cartData.cart.map(cartItem => {
          const product = products?.find(p => p._id === cartItem?.productId?._id); // Find product by matching productId
          return {
            ...cartItem,
            product // Add the full product details to the cart item
          };
        });
  
        // Set the combined cart items state
        setCombineCartItems(combinedCartItems);
      };
  
      handleSetCartItems(); // Invoke the function once cartData is available
    }
  }, [cartData, products]); // Add products as dependency to update if product data changes
  
  console.log(combinedCartItems)
  // Fetch products in the cart
  // useEffect(() => {
  //   const fetchCartItems = async () => {
  //     try {
  //       const response = await fetch('/api/cart/getCartItems', {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //         body: JSON.stringify({ userId }), // Ensure userId is sent as JSON
  //       });

  //       const data = await response.json();
  //       console.log('Cart Products Response Data:', data); // Debugging line

  //       if (data.cart && Array.isArray(data.cart) && data.cart.length > 0) {
  //         const productIds = Object.keys(data.cart).map(key => data.cart[key].productId._id);
  //         const productDetailsResponse = await fetch('/api/cart/getProductsByIds', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //           body: JSON.stringify({ productIds }), // Send productIds as JSON
  //         });

  //         const productDetails = await productDetailsResponse.json();

  //         // Map quantity to products
  //         const productsWithQuantity = productDetails.products.map(product => {
  //           const cartItem = data.cart.find(item => item.productId._id === product._id);
  //           return {
  //             ...product,
  //             quantity: cartItem.quantity,
  //           };
  //         });

  //         setProducts(productsWithQuantity); // Use the product details with quantity
  //         setSubtotal(data.totalAmount);
  //       } else {
  //         // Cart is empty
  //         setProducts([]);
  //         setSubtotal(0);
  //       }
  //     } catch (error) {
  //       setError(error);
  //       console.error("Error fetching cart products:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   if (userId) {
  //     fetchCartItems();
  //   } else {
  //     setProducts([]);
  //     setSubtotal(0);
  //   }
  // }, [userId]);

  // console.log(products);

  const createOrderId = async () => {
    try {
      const response = await fetch('/api/make-payment', {
        method: 'POST',
        body: JSON.stringify({ amount: subtotal * 100 }), // Amount in paise
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok) {
        return data.orderId;
      } else {
        throw new Error(data.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order ID:', error);
      alert('Error creating order. Please try again.');
    }
  };

  // Process Payment
  const processPayment = async (e) => {
    e.preventDefault();
    try {
      const orderId = await createOrderId();
      const options = {
        key: process.env.NEXT_PUBLIC_KEY_ID,
        amount: subtotal * 100, // Convert to paise (smallest currency unit)
        currency: "INR",
        name: 'E-cart',
        description: 'Product Purchase',
        order_id: orderId,
        handler: async function (response) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch('/api/verify-payment', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' },
          });
          console.log(result);
          if (result.ok) {
            alert("Payment succeeded");
          } else {
            alert(result);
          }
        },
        prefill: {
          email: "myemail@gmail.com",
        },
        theme: {
          color: '#3399cc',
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on('payment.failed', function (response) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.log(error);
    }
  };

  const handleIncrement = (productId) => {
    console.log("Incrementing product with id:", productId); // Debug log
    setIsChanged(true);
    setCombineCartItems((prevItems) => {
      return prevItems.map((item) => {
        console.log("Current item:", item); // Debug log
        return item.product._id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item;
      });
    });
  };
  
  const handleDecrement = (productId) => {
    console.log("Decrementing product with id:", productId); // Debug log
    setIsChanged(true);
    setCombineCartItems((prevItems) => {
      return prevItems.map((item) => {
        console.log("Current item:", item); // Debug log
        return item?.product?._id === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item;
      });
    });
  };
  

  const handleSave = async () => {
    const loadingToast = toast.loading('Updating cart...');
    try {
      const response = await fetch('/api/cart/updateCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, combinedCartItems }), // Send userId and updated product quantities
      });
      console.log(response);
      if (response.ok) {
        setIsChanged(!isChanged)
        toast.success('Cart Updated Successfully', {
          id: loadingToast, // Use the id to update the existing toast
        });
      
       fetchCartData()
       
      } else {
        toast.error('Failed to Update Cart', {
          id: loadingToast, // Use the id to update the existing toast
        });
      }
    } catch (error) {
      console.error('Error updating cart:', error);
      alert('An error occurred while updating the cart');
    }
  };

  const deleteProduct = async (productId) => {
    const loadingToast = toast.loading('Deleting Product...');
    try {
      const response = await fetch("/api/cart/deleteProduct", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, productId }),
      });
  
      if (response.ok) {
        
        // Update the UI immediately after deletion
        setCombineCartItems((prevItems) => prevItems.filter(item => item.product._id !== productId));
        fetchCartData()
        // Find and update subtotal
        const productToDelete = combinedCartItems.find(item => item.product._id === productId);
        setSubtotal(prevSubtotal => prevSubtotal - (productToDelete.product.price * productToDelete.quantity));
  
        toast.success('Product removed successfully',{id:loadingToast});
      } else {
        const errorData = await response.json();
        console.error("Error deleting product:", errorData.message);
        toast.error('Failed to remove product');
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error('An error occurred while removing the product');
    }
  };
  
  const clearcart = async () => {
    try {
      const response = await fetch("/api/cart/clearCart", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }), // Ensure userId is sent as JSON
      });

      if (response.ok) {
        setCombineCartItems([]);
        setSubtotal(0);

        toast.success('Clear Cart successfully');
      } else {
        const errorData = await response.json();
        console.error("Error deleting product:", errorData.message);
        toast.error('Failed to remove product');
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error('An error occurred while removing the product');
    }
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  // if (isLoading) {
  //   return <div>Loading...</div>; // Render loading state if data is still being fetched
  // }

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className=' w-full flex flex-col  p-5 phone:p-2'>
      <Toaster/>
        {/* <Link href={"/"} className="text-xl">
          <IoArrowBack />
        </Link> */}
        <div className='w-full h-[85vh]   flex flex-col  items-start justify-between  gap-5 bg-slate-100 p-5 rounded-2xl phone:h-auto '>
        <div className='flex items-center justify-between w-full '>
              <div className='flex flex-col items-start gap-1'>
              <h1 className='text-3xl font-bold flex items-center gap-2 phone:text-lg'>Shopping Bag</h1>
              <p className='text-lg text-slate-400 phone:text-sm'>{cartData?.cart?.length} Products in your Bag</p>
              </div>
              <div className='flex items-center gap-2'>
              {isChanged && (
                    <button
                      onClick={handleSave}
                      className="bg-green-500 text-white p-2 rounded-lg phone:text-xs"
                    >
                      Save Changes
                    </button>
                  )}
              <button onClick={clearcart} className='flex items-center gap-2 text-white bg-red-500 p-2 rounded-lg phone:text-xs'>Clear Bag <AiFillDelete className='text-2xl phone:text-xs' /></button>
              </div>
            </div>
         <div className='w-full flex items-start justify-between gap-5 h-5/6 phone:flex-col phone:h-auto'>
         <div className='w-3/4 flex flex-col gap-10 bg-white rounded-2xl shadow-lg h-full overflow-auto scrollbar-none phone:w-full '>
            
           
              
                
                  {combinedCartItems?.length > 0 ?
                
                     <div className='w-full h-full  p-5 phone:p-2'>
                     <table className='w-full flex flex-col gap-5 h-full'>
                    <thead className='w-full'>
                    <tr className='w-full flex items-center justify-between'>
                      <th className='w-1/3 text-center flex items-center justify-center phone:w-3/4 phone:text-xs'>Product</th>
                      <th className='w-1/4 text-center flex items-center justify-center phone:hidden'>Brand</th>
                      <th className='w-1/4 text-center flex items-center justify-center phone:text-xs'>Quantity</th>
                      <th className='w-1/4 text-center flex items-center justify-center phone:hidden'>Price</th>
                      <th className='w-1/4 text-center flex items-center justify-center phone:text-xs'>Total Price</th>
                      <th className='w-1/6 '></th>
                    </tr>
                  </thead>
                    <tbody className='flex flex-col gap-5'>
                  
                    {combinedCartItems.map((product) => (
                      <div key={product.product._id} className='flex flex-col '>
                        <tr key={product.product._id} className='w-full flex items-center justify-between  p-3 rounded-lg'>
                        <td className='w-1/3 text-start flex items-center gap-5 phone:w-3/4 phone:flex-col'>
                          <Image width={100} height={100}  src={product?.product?.thumbnail[0]} alt={product?.product?.title} className="bg-slate-100 w-20 h-20 object-contain p-5 rounded-xl phone:w-10 phone:h-10 phone:p-2" />
                          <Link href={`/product/${product?.product?._id}`} className="phone:text-xs">{product?.product?.title}</Link>
                        </td>
                        <td className='w-1/4 text-start flex items-start justify-center phone:hidden'>
                          <span className="phone:text-xs">{product?.product?.brand}</span>
                        </td>
                        <td className="w-1/4 text-center flex items-center justify-center gap-5 phone:gap-1">
                    <button className="text-slate-400 text-lg border-x border-y p-1 rounded-sm phone:text-xs" onClick={() => handleDecrement(product?.product?._id)}>
                    <FaMinus />
                    </button>
                    <span className="text-xl phone:text-xs">{product?.quantity}</span>
                    <button className="text-slate-400 text-lg border-x border-y p-1 rounded-sm phone:text-xs" onClick={() => handleIncrement(product?.product?._id)}>
                    <FaPlus />
                    </button>
                  </td>
                        <td className='w-1/4 text-start flex items-center justify-center phone:hidden'>
                          <span className="phone:text-xs">Rs.{product?.product?.discountPrice}</span>
                        </td>
                        <td className='w-1/4 flex items-center justify-center '>
                          <h1 className='font-bold phone:text-xs'>Rs.{product?.price * product?.quantity}</h1>
                        </td>
                        <td className='w-1/6 text-center flex items-center justify-center text-2xl'>
                          <button onClick={() => deleteProduct(product?.product?._id)} className='text-red-500'><AiFillDelete /></button>
                        </td>
                        
                      </tr>
                      <hr className='w-full'/>
                      </div>
                    ))}
                    </tbody>  </table>
                    </div>: (
                    <div className=' w-full flex flex-col items-center h-full justify-center gap-5 phone:gap-2 '>
                    <Lottie loop={true} animationData={EmptyCart} className='w-full h-96 phone:h-56'/>
                    <p className='text-xl font-bold phone:text-sm'>No Product in Your Cart</p>
                    <Link href={"/"} className='bg-blue-700 text-white text-xl p-3 rounded-lg font-extrabold phone:text-sm phone:mb-2'>Explore Now</Link>
                    </div>
                  )}
                  
               
            
          </div>
          <div className='w-1/4 flex flex-col gap-5 p-5 bg-white rounded-2xl phone:w-full'>
            <div className='w-full flex flex-col items-start gap-3'>
              <h1 className='text-xl font-bold'>Promo Code</h1>
              <div className='flex items-center w-full justify-between gap-1'>
                <input className='w-3/4 pt-2 pb-2 pl-3 pr-3 outline-none bg-transparent border-x border-y border-slate-300 rounded-lg' placeholder='Type Here' />
                <button className='w-1/4 pt-2 pb-2 pl-3 pr-3 bg-gray-700 text-white rounded-lg '>Apply</button>
              </div>
            </div>
            <hr className='w-full border-t border-slate-300' />
            <div className='flex flex-col gap-5'>
              <h1>SubTotal: Rs.{cartData?.totalAmount}</h1>
              <p>Discount: Rs.0.00</p>
              <h1 className='text-xl font-bold'>Total: Rs.{cartData?.totalAmount}</h1>
            </div>
            <Link href={"/checkout"}  className='bg-gray-700 w-full p-2 text-white font-bold rounded-lg text-center'>Continue to Checkout</Link>
          </div>
         </div>
        </div>
      </div>
     
    </>
  );
};

export default Page;
