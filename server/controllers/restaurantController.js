const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Restaurant = require("../models/restaurantModel");
const Review = require("../models/reviewModel");

/**
 * @desc    Get all restaurants with filtering, sorting, and pagination
 * @route   GET /api/restaurants
 * @access  Public
 */
const getRestaurants = asyncHandler(async (req, res) => {
  // Extract query parameters
  const {
    cuisine,
    priceRange,
    rating,
    lat,
    lng,
    distance = 10, // Default to 10km
    page = 1,
    limit = 10,
    sort = "-createdAt",
  } = req.query;

  // Build query
  let query = { isActive: true };

  // Filter by cuisine
  if (cuisine) {
    const cuisines = cuisine.split(",").map((c) => c.trim());
    query.cuisine = { $in: cuisines };
  }

  // Filter by price range
  if (priceRange) {
    const prices = priceRange.split(",").map((p) => p.trim());
    query.priceRange = { $in: prices };
  }

  // Filter by minimum rating
  if (rating) {
    const minRating = parseFloat(rating);
    query["aggregateRating.overall"] = { $gte: minRating };
  }

  // Geospatial query if coordinates provided
  if (lat && lng) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    // Validate coordinates
    if (isNaN(latitude) || isNaN(longitude)) {
      res.status(400);
      throw new Error("Invalid coordinates");
    }

    // Add geospatial query
    query["location.coordinates"] = {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude], // MongoDB expects [lng, lat]
        },
        $maxDistance: parseInt(distance) * 1000, // Convert km to meters
      },
    };
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  // Execute query with pagination and sorting
  const restaurants = await Restaurant.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .select("-__v");

  // Get total count for pagination info
  const totalCount = await Restaurant.countDocuments(query);

  // Pagination result
  const pagination = {
    totalItems: totalCount,
    totalPages: Math.ceil(totalCount / limitNum),
    currentPage: parseInt(page),
    pageSize: limitNum,
    hasMore: skip + restaurants.length < totalCount,
  };

  // Return formatted response
  res.status(200).json({
    success: true,
    count: restaurants.length,
    pagination,
    data: restaurants,
  });
});

/**
 * @desc    Get single restaurant by ID
 * @route   GET /api/restaurants/:id
 * @access  Public
 */
const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error(`Restaurant not found with id ${req.params.id}`);
  }

  // Return response
  res.status(200).json({
    success: true,
    data: restaurant,
  });
});

/**
 * @desc    Create a new restaurant
 * @route   POST /api/restaurants
 * @access  Private (restaurant-owner, admin)
 */
const createRestaurant = asyncHandler(async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    throw new Error("Validation failed", { errors: errors.array() });
  }

  // Set owner to current user ID
  req.body.owner = req.user.id;

  // Create restaurant
  const restaurant = await Restaurant.create(req.body);

  // Return response
  res.status(201).json({
    success: true,
    data: restaurant,
  });
});

/**
 * @desc    Update a restaurant
 * @route   PUT /api/restaurants/:id
 * @access  Private (restaurant-owner, admin)
 */
const updateRestaurant = asyncHandler(async (req, res) => {
  // Find restaurant
  let restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error(`Restaurant not found with id ${req.params.id}`);
  }

  // Check ownership (only owner or admin can update)
  if (
    restaurant.owner.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to update this restaurant");
  }

  // Prevent changing the owner
  if (req.body.owner) {
    delete req.body.owner;
  }

  // Update restaurant
  restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  // Return response
  res.status(200).json({
    success: true,
    data: restaurant,
  });
});

/**
 * @desc    Delete a restaurant (soft delete)
 * @route   DELETE /api/restaurants/:id
 * @access  Private (restaurant-owner, admin)
 */
const deleteRestaurant = asyncHandler(async (req, res) => {
  // Find restaurant
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error(`Restaurant not found with id ${req.params.id}`);
  }

  // Check ownership (only owner or admin can delete)
  if (
    restaurant.owner.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to delete this restaurant");
  }

  // Soft delete by setting isActive to false
  restaurant.isActive = false;
  await restaurant.save();

  // Return response
  res.status(200).json({
    success: true,
    message: "Restaurant deleted successfully",
  });
});

/**
 * @desc    Get reviews for a restaurant
 * @route   GET /api/restaurants/:id/reviews
 * @access  Public
 */
const getRestaurantReviews = asyncHandler(async (req, res) => {
  // Extract query parameters
  const { page = 1, limit = 10, sort = "-reviewDate" } = req.query;

  // Check if restaurant exists
  const restaurant = await Restaurant.findById(req.params.id);

  if (!restaurant) {
    res.status(404);
    throw new Error(`Restaurant not found with id ${req.params.id}`);
  }

  // Calculate pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  // Get reviews for the restaurant with pagination
  const reviews = await Review.find({
    restaurant: req.params.id,
    visibility: "public",
  })
    .sort(sort)
    .skip(skip)
    .limit(limitNum)
    .populate("user", "firstName lastName profileImage");

  // Get total count for pagination info
  const totalCount = await Review.countDocuments({
    restaurant: req.params.id,
    visibility: "public",
  });

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
 * @desc    Get restaurants owned by the current user
 * @route   GET /api/restaurants/me
 * @access  Private
 */
const getMyRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({ owner: req.user.id });

  res.status(200).json({
    success: true,
    count: restaurants.length,
    data: restaurants,
  });
});

module.exports = {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantReviews,
  getMyRestaurants,
};
