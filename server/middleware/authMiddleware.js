const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token and adds the user data to the request object
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header (remove 'Bearer ' prefix)
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (exclude password)
      req.user = await User.findById(decoded.id).select("-password");

      // If user not found or inactive, throw error
      if (!req.user || !req.user.active) {
        res.status(401);
        throw new Error("Not authorized - user not found or inactive");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized - token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized - no token provided");
  }
});

/**
 * Middleware to allow only specific user roles
 * Must be used after protect middleware
 * @param {...String} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(
        `Role '${req.user.role}' is not authorized to access this route`
      );
    }
    next();
  };
};

module.exports = { protect, authorize };
