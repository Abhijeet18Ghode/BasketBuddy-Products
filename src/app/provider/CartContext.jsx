import React, { createContext, useState, useEffect, useContext } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast'; // Assuming you use react-hot-toast for notifications

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data: session, status } = useSession(); 
  const [cartData, setCartData] = useState([]);

  // Function to fetch cart data from API
  const fetchCartData = async () => {
    if (session?.user?.id) {
      try {
        const response = await fetch('/api/cart/getCartItems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: session.user.id }), 
        });
        const data = await response.json();
        setCartData(data);
      } catch (error) {
        console.error('Error fetching cart data:', error);
      }
    }
  };

  // Function to add product to the cart
  const addToCart = async (productId, quantity) => {
    const loadingToast = toast.loading('Adding To cart...');
    
    if (session?.user?.id) {
      try {
        const response = await axios.post('/api/cart', {
          userId: session.user.id,
          productId,
          quantity,
        });
        const { message, cart } = response.data;

        if (response.status === 200) {
          // Optimistically update the cart state on successful addition
          setCartData(cart);
          toast.success(message, { id: loadingToast });
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          // Product already in the cart
          toast.error('Product already in the cart', { id: loadingToast });
        } else {
          // Other error
          toast.error('Error adding product to cart', { id: loadingToast });
        }
      }
    } else {
      toast.error('You need to log in first', { id: loadingToast });
    }
  };

  // Fetch cart data as soon as session and user ID are available
  useEffect(() => {
    if (status !== 'loading' && session?.user?.id) {
      fetchCartData();
    }
  }, [status, session]);

  return (
    <CartContext.Provider value={{ cartData, fetchCartData, addToCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
