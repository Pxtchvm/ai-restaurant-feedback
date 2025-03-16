import axios from "axios";

/**
 * Create an axios instance with baseURL and default headers
 * Use proxy setting in package.json for development
 */
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Add response interceptor for global error handling
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration (401 errors)
    if (error.response && error.response.status === 401) {
      // Check if this is not already a login/auth request
      if (!error.config.url.includes("/auth/")) {
        // Remove token and redirect to login
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
