"use client"
import React, { createContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
// Create a context
export const ProductContext = createContext();

// Create a provider component
export const ProductProvider = ({ children }) => {
  const { data: session, status } = useSession(); 
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch products from an API
 
  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/getAllProducts', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-store', // Prevents caching
        },
      }); // Replace with your API endpoint
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
  
      const data = await response.json();
      setProducts(data.AllProducts);
      setFilteredProducts(data.AllProducts)
      setLoading(false);
      console.log("sameer error in api")
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  // Fetch products when the component mounts
  useEffect(() => {
      fetchProducts();

  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error ,setProducts,fetchProducts,filteredProducts,setFilteredProducts}}>
      {children}
    </ProductContext.Provider>
  );
};
