"use client"
import React, { createContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Create a context
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
  const { data: session, status } = useSession(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch user data from the API
  const fetchUserData = async () => {
    if (!session?.user?.id) {
      return; // Don't fetch if user ID is undefined
    }

    try {
      const response = await fetch(`/api/user/getUserInfo/${session.user.id}`); // Replace with your API endpoint
      const data = await response.json();
      setUser(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch user data when session is available
  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session]); // Add session as a dependency

  return (
    <UserContext.Provider value={{ user, loading, error, setUser, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};
