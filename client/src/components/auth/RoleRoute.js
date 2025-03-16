import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

/**
 * RoleRoute component to protect routes based on user roles
 * Redirects to dashboard home if user doesn't have required role
 *
 * @param {string[]} roles - Array of allowed roles
 */
const RoleRoute = ({ roles, children }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();

  // If still loading, show spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to dashboard if not authenticated or not authorized
  if (!isAuthenticated || !roles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Render children if authorized
  return children;
};

export default RoleRoute;
