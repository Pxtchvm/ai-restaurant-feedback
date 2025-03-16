const express = require("express");
const { check } = require("express-validator");
const {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  respondToReview,
  getMyReviews,
} = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all reviews
router.get("/", getReviews);

// Get current user's reviews
router.get("/me", protect, getMyReviews);

// Create review
router.post(
  "/",
  [
    check("restaurant", "Restaurant ID is required").not().isEmpty(),
    check("rating", "Rating must be between 1 and 5").isFloat({
      min: 1,
      max: 5,
    }),
    check("text", "Review text must be at least 10 characters").isLength({
      min: 10,
    }),
  ],
  protect,
  createReview
);

// Get, update and delete specific review
router
  .route("/:id")
  .get(getReviewById)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

// Respond to a review (restaurant owners and admins only)
router.post(
  "/:id/respond",
  [check("text", "Response text is required").not().isEmpty()],
  protect,
  authorize("restaurant-owner", "admin"),
  respondToReview
);

module.exports = router;
