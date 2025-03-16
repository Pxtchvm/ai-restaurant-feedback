const express = require("express");
const { check } = require("express-validator");
const {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  updatePassword,
  verifyToken,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Register user
router.post(
  "/register",
  [
    check("firstName", "First name is required").not().isEmpty(),
    check("lastName", "Last name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 8 characters").isLength({
      min: 8,
    }),
  ],
  registerUser
);

// Login user
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  loginUser
);

// Get current user profile
router.get("/me", protect, getCurrentUser);

// Update user profile
router.put("/updateprofile", protect, updateProfile);

// Update password
router.put(
  "/updatepassword",
  [
    check("currentPassword", "Current password is required").not().isEmpty(),
    check("newPassword", "New password must be at least 8 characters").isLength(
      { min: 8 }
    ),
  ],
  protect,
  updatePassword
);

// Verify token validity
router.get("/verify", protect, verifyToken);

module.exports = router;
