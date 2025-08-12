"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);
  const router = useRouter();

  // Helper to check JWT expiration
  function isTokenExpired(token) {
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  useEffect(() => {
    // Load user/token from localStorage on mount
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedUser !== "undefined" && storedToken) {
      if (isTokenExpired(storedToken)) {
        setSessionExpired(true);
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setAuthLoading(false);
        return;
      }
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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (res.status === 401) {
        setSessionExpired(true);
        logout();
        return;
      }
      if (res.ok) {
        const latestUser = await res.json();
        setUser({
          ...latestUser,
          id: latestUser.id || latestUser._id,
          _id: latestUser._id || latestUser.id,
        });
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...latestUser,
            id: latestUser.id || latestUser._id,
            _id: latestUser._id || latestUser.id,
          })
        );
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
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...userData,
        id: userData.id || userData._id,
        _id: userData._id || userData.id,
      })
    );
    localStorage.setItem("token", jwtToken);

    // Fetch the latest user data from backend
    fetchLatestUser(userData.id || userData._id, jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, authLoading }}>
      {children}
      {sessionExpired && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-4">Session Expired</h2>
            <p className="mb-6">Your session expired, login again.</p>
            <button
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition cursor-pointer"
              onClick={() => {
                setSessionExpired(false);
                router.push("/login");
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
