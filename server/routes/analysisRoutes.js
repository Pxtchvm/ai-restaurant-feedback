const express = require("express");
const {
  getRestaurantSentiment,
  compareRestaurants,
  getSuggestedImprovements,
} = require("../controllers/analysisController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/restaurant/:id/sentiment", getRestaurantSentiment);
router.get("/restaurants/compare", compareRestaurants);

// Protected routes (restaurant owners and admins only)
router.get(
  "/restaurant/:id/improvements",
  protect,
  authorize("restaurant-owner", "admin"),
  getSuggestedImprovements
);

module.exports = router;
