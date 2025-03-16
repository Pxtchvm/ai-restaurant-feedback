const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Review = require("../models/reviewModel");
const Restaurant = require("../models/restaurantModel");
const { analyzeSentiment } = require("../services/sentimentService");

/**
 * @desc    Get all reviews with filtering and pagination
 * @route   GET /api/reviews
 * @access  Public
 */
const getReviews = asyncHandler(async (req, res) => {
  // Extract query parameters
  const {
    minRating,
    maxRating,
    startDate,
    endDate,
    page = 1,
    limit = 10,
    sort = "-reviewDate",
  } = req.query;

  // Build query
  let query = { visibility: "public" };

  // Filter by rating range
  if (minRating) {
    query.rating = { ...query.rating, $gte: parseInt(minRating) };
  }

  if (maxRating) {
    query.rating = { ...query.rating, $lte: parseInt(maxRating) };
  }

  // Filter by date range
  if (startDate || endDate) {
    query.reviewDate = {};

    if (startDate) {
      query.reviewDate.$gte = new Date(startDate);
    }

    if (endDate) {
      query.reviewDate.$lte = new Date(endDate);
    }
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  // Execute query with pagination and sorting
  const reviews = await Review.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .populate("user", "firstName lastName profileImage")
    .populate("restaurant", "name featuredImage location cuisine");

  // Get total count for pagination info
  const totalCount = await Review.countDocuments(query);

  // Pagination result
  const pagination = {
    totalItems: totalCount,
    totalPages: Math.ceil(totalCount / limitNum),
    currentPage: parseInt(page),
    pageSize: limitNum,
    hasMore: skip + reviews.length < totalCount,
  };

  // Return response
  res.status(200).json({
    success: true,
    count: reviews.length,
    pagination,
    data: reviews,
  });
});

/**
 * @desc    Get a single review by ID
 * @route   GET /api/reviews/:id
 * @access  Public
 */
const getReviewById = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate("user", "firstName lastName profileImage")
    .populate("restaurant", "name featuredImage location cuisine");

  if (!review) {
    res.status(404);
    throw new Error(`Review not found with id ${req.params.id}`);
  }

  // Hide private reviews unless requested by the author or admin
  if (
    review.visibility === "private" &&
    (!req.user ||
      (req.user.id !== review.user._id.toString() && req.user.role !== "admin"))
  ) {
    res.status(403);
    throw new Error("Not authorized to view this review");
  }

  // Return response
  res.status(200).json({
    success: true,
    data: review,
  });
});

/**
 * @desc    Create a new review
 * @route   POST /api/reviews
 * @access  Private
 */
const createReview = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error("Validation failed", { errors: errors.array() });
  }

  const { restaurant: restaurantId, rating, text } = req.body;

  // Check if restaurant exists
  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) {
    res.status(404);
    throw new Error(`Restaurant not found with id ${restaurantId}`);
  }

  // Check if the user already has a review for this restaurant
  const existingReview = await Review.findOne({
    restaurant: restaurantId,
    user: req.user.id,
  });

  if (existingReview) {
    res.status(400);
    throw new Error("You have already reviewed this restaurant");
  }

  // Create review data
  const reviewData = {
    restaurant: restaurantId,
    user: req.user.id,
    rating,
    text,
    reviewDate: Date.now(),
  };

  // Perform sentiment analysis
  const sentimentResults = analyzeSentiment(text);
  reviewData.sentiment = sentimentResults;

  // Create review
  const review = await Review.create(reviewData);

  // Update restaurant aggregate rating
  await restaurant.updateAggregateRating();

  // Return response with populated user data
  const populatedReview = await Review.findById(review._id).populate(
    "user",
    "firstName lastName profileImage"
  );

  res.status(201).json({
    success: true,
    data: populatedReview,
  });
});

/**
 * @desc    Update a review
 * @route   PUT /api/reviews/:id
 * @access  Private
 */
const updateReview = asyncHandler(async (req, res) => {
  // Find review
  let review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error(`Review not found with id ${req.params.id}`);
  }

  // Check ownership
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this review");
  }

  // Update allowed fields only
  const { rating, text, visibility } = req.body;
  const updateData = {};

  if (rating) updateData.rating = rating;
  if (text) {
    updateData.text = text;
    // Re-analyze sentiment if text changes
    updateData.sentiment = analyzeSentiment(text);
  }
  if (visibility && ["public", "private"].includes(visibility)) {
    updateData.visibility = visibility;
  }

  // Update review
  review = await Review.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate("user", "firstName lastName profileImage");

  // Update restaurant aggregate rating
  const restaurant = await Restaurant.findById(review.restaurant);
  if (restaurant) {
    await restaurant.updateAggregateRating();
  }

  // Return response
  res.status(200).json({
    success: true,
    data: review,
  });
});

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private
 */
const deleteReview = asyncHandler(async (req, res) => {
  // Find review
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error(`Review not found with id ${req.params.id}`);
  }

  // Check ownership
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this review");
  }

  // Soft delete by changing visibility to 'deleted'
  review.visibility = "deleted";
  await review.save();

  // Update restaurant aggregate rating
  const restaurant = await Restaurant.findById(review.restaurant);
  if (restaurant) {
    await restaurant.updateAggregateRating();
  }

  // Return response
  res.status(200).json({
    success: true,
    message: "Review deleted successfully",
  });
});

/**
 * @desc    Respond to a review (for restaurant owners)
 * @route   POST /api/reviews/:id/respond
 * @access  Private (restaurant-owner, admin)
 */
const respondToReview = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error("Validation failed", { errors: errors.array() });
  }

  const { text } = req.body;

  // Find review
  let review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error(`Review not found with id ${req.params.id}`);
  }

  // Find restaurant
  const restaurant = await Restaurant.findById(review.restaurant);
  if (!restaurant) {
    res.status(404);
    throw new Error("Restaurant not found");
  }

  // Check if user is the restaurant owner or admin
  if (
    restaurant.owner.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to respond to this review");
  }

  // Add response
  review.response = {
    text,
    date: Date.now(),
    user: req.user.id,
  };

  // Save review
  await review.save();

  // Return updated review
  const updatedReview = await Review.findById(req.params.id).populate(
    "user",
    "firstName lastName profileImage"
  );

  res.status(200).json({
    success: true,
    data: updatedReview,
  });
});

/**
 * @desc    Get current user's reviews
 * @route   GET /api/reviews/me
 * @access  Private
 */
const getMyReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ user: req.user.id })
    .sort("-reviewDate")
    .populate("restaurant", "name featuredImage location cuisine");

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  respondToReview,
  getMyReviews,
};
