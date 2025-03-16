import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../utils/api";
import { setAuthToken, removeAuthToken } from "../utils/auth";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token on initial load
  useEffect(() => {
    const loadUser = async () => {
      if (localStorage.getItem("token")) {
        setAuthToken(localStorage.getItem("token"));

        try {
          const res = await api.get("/auth/me");
          setCurrentUser(res.data.data);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem("token");
          removeAuthToken();
          setError(err.response?.data?.message || "Authentication failed");
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
      }

      setLoading(false);
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/register", userData);

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);

      // Set user in state
      setCurrentUser(res.data.user);
      setIsAuthenticated(true);
      setError(null);

      toast.success("Registration successful! Welcome to crAIvings.");

      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      toast.error(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", userData);

      // Save token to localStorage
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);

      // Set user in state
      setCurrentUser(res.data.user);
      setIsAuthenticated(true);
      setError(null);

      toast.success("Login successful! Welcome back.");

      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      toast.error(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from localStorage and axios headers
    localStorage.removeItem("token");
    removeAuthToken();

    // Clear user state
    setCurrentUser(null);
    setIsAuthenticated(false);

    toast.info("You have been logged out");
  };

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const res = await api.put("/auth/updateprofile", userData);

      // Update user in state
      setCurrentUser(res.data.data);
      setError(null);

      toast.success("Profile updated successfully");

      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Profile update failed";
      setError(message);
      toast.error(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (passwordData) => {
    try {
      setLoading(true);
      const res = await api.put("/auth/updatepassword", passwordData);

      // Update token in localStorage and axios headers
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);

      setError(null);

      toast.success("Password updated successfully");

      return res.data;
    } catch (err) {
      const message = err.response?.data?.message || "Password update failed";
      setError(message);
      toast.error(message);

      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Clear errors
  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        updatePassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
