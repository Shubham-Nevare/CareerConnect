"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Load user/token from localStorage on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (
      storedUser &&
      storedUser !== 'undefined' &&
      storedToken
    ) {
      const parsedUser = JSON.parse(storedUser);
      setUser({
        ...parsedUser,
        id: parsedUser.id || parsedUser._id,
        _id: parsedUser._id || parsedUser.id,
      });
      setToken(storedToken);
    }
    setAuthLoading(false);
  }, []);

  // Fetch the latest user data from backend
  const fetchLatestUser = async (userId, jwtToken) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (res.ok) {
        const latestUser = await res.json();
        setUser({
          ...latestUser,
          id: latestUser.id || latestUser._id,
          _id: latestUser._id || latestUser.id,
        });
        localStorage.setItem('user', JSON.stringify({
          ...latestUser,
          id: latestUser.id || latestUser._id,
          _id: latestUser._id || latestUser.id,
        }));
      }
    } catch (err) {
      // Optionally handle error
    }
  };

  const login = (userData, jwtToken) => {
    setUser({
      ...userData,
      id: userData.id || userData._id,
      _id: userData._id || userData.id,
    });
    setToken(jwtToken);
    localStorage.setItem('user', JSON.stringify({
      ...userData,
      id: userData.id || userData._id,
      _id: userData._id || userData.id,
    }));
    localStorage.setItem('token', jwtToken);

    // Fetch the latest user data from backend
    fetchLatestUser(userData.id || userData._id, jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
