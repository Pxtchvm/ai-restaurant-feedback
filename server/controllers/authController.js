const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const User = require("../models/userModel");

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error("Validation failed", { errors: errors.array() });
  }

  const { firstName, lastName, email, password, role } = req.body;

  // Check if user already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  // Determine role (prevent unauthorized role assignments)
  const userRole = role === "restaurant-owner" ? "restaurant-owner" : "user";

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: userRole,
  });

  if (user) {
    // Generate JWT token
    const token = user.getSignedJwtToken();

    // Return success response with token and user data
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error("Validation failed", { errors: errors.array() });
  }

  const { email, password } = req.body;

  // Check if user exists
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Check if user is active
  if (!user.active) {
    res.status(401);
    throw new Error("Your account has been deactivated");
  }

  // Update last login
  user.lastLogin = Date.now();
  await user.save({ validateBeforeSave: false });

  // Generate JWT token
  const token = user.getSignedJwtToken();

  // Return success response
  res.status(200).json({
    success: true,
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  // User is already available from auth middleware
  res.status(200).json({
    success: true,
    data: {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
      profileImage: req.user.profileImage,
      createdAt: req.user.createdAt,
    },
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/updateprofile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  // Fields to update
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(
    (key) => fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  // Check if email is being updated and is already in use
  if (fieldsToUpdate.email && fieldsToUpdate.email !== req.user.email) {
    const userWithEmail = await User.findOne({ email: fieldsToUpdate.email });
    if (userWithEmail) {
      res.status(400);
      throw new Error("Email already in use");
    }
  }

  // Update user
  const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    },
  });
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/updatepassword
 * @access  Private
 */
const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Get user with password
  const user = await User.findById(req.user._id).select("+password");

  // Check current password
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  // Update password
  user.password = newPassword;
  await user.save();

  // Generate new token
  const token = user.getSignedJwtToken();

  res.status(200).json({
    success: true,
    token,
  });
});

/**
 * @desc    Verify token validity
 * @route   POST /api/auth/verify
 * @access  Public
 */
const verifyToken = asyncHandler(async (req, res) => {
  // The user will be attached to req by auth middleware if token is valid
  res.status(200).json({
    success: true,
    message: "Token is valid",
    user: {
      id: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  updateProfile,
  updatePassword,
  verifyToken,
};
