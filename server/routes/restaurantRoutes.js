const express = require("express");
const { check } = require("express-validator");
const {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantReviews,
  getMyRestaurants,
} = require("../controllers/restaurantController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all restaurants and user-owned restaurants
router.get("/", getRestaurants);
router.get("/me", protect, getMyRestaurants);

// Create new restaurant (restaurant owners and admins only)
router.post(
  "/",
  [
    check("name", "Restaurant name is required").not().isEmpty(),
    check("location.address", "Address is required").not().isEmpty(),
    check("location.city", "City is required").not().isEmpty(),
    check("cuisine", "At least one cuisine type is required").isArray({
      min: 1,
    }),
    check("priceRange", "Valid price range is required").isIn([
      "₱",
      "₱₱",
      "₱₱₱",
      "₱₱₱₱",
    ]),
  ],
  protect,
  authorize("restaurant-owner", "admin"),
  createRestaurant
);

// Get, update and delete specific restaurant
router
  .route("/:id")
  .get(getRestaurantById)
  .put(protect, authorize("restaurant-owner", "admin"), updateRestaurant)
  .delete(protect, authorize("restaurant-owner", "admin"), deleteRestaurant);

// Get restaurant reviews
router.get("/:id/reviews", getRestaurantReviews);

module.exports = router;
