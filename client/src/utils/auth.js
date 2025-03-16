import api from "./api";

/**
 * Set JWT token in axios headers
 * @param {string} token - JWT token
 */
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

/**
 * Remove JWT token from axios headers
 */
export const removeAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

/**
 * Check if user has required role
 * @param {object} user - User object
 * @param {string|string[]} roles - Required role(s)
 * @returns {boolean} - True if user has required role
 */
export const hasRole = (user, roles) => {
  if (!user) return false;

  // Convert to array if string
  const requiredRoles = Array.isArray(roles) ? roles : [roles];

  return requiredRoles.includes(user.role);
};

/**
 * Format user's full name
 * @param {object} user - User object
 * @returns {string} - Formatted full name
 */
export const formatUserName = (user) => {
  if (!user) return "";

  return `${user.firstName} ${user.lastName}`;
};
