import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../../utils/api";

const WriteReviewForm = ({ restaurantId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Setup form validation with react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Handle rating hover
  const handleRatingHover = (hoverRating) => {
    setHoveredRating(hoverRating);
  };

  // Handle rating selection
  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmitting(true);

    try {
      const reviewData = {
        restaurant: restaurantId,
        rating: rating,
        text: data.reviewText,
      };

      const response = await api.post("/reviews", reviewData);

      // Call the callback function
      if (onReviewSubmitted) {
        onReviewSubmitted(response.data.data);
      }

      // Reset form
      reset();
      setRating(0);
      setHoveredRating(0);

      toast.success("Your review has been submitted successfully!");
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Rating
        </label>
        <div className="flex items-center mb-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none"
              onClick={() => handleRatingClick(star)}
              onMouseEnter={() => handleRatingHover(star)}
              onMouseLeave={() => handleRatingHover(0)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-8 w-8 ${
                  star <= (hoveredRating || rating)
                    ? "text-yellow-400"
                    : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-500">
            {rating === 0
              ? "Select a rating"
              : ["", "Terrible", "Poor", "Average", "Very Good", "Excellent"][
                  rating
                ]}
          </span>
        </div>
      </div>

      <div className="mb-6">
        <label
          htmlFor="reviewText"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Your Review
        </label>
        <textarea
          id="reviewText"
          rows="5"
          className={`form-input block w-full rounded-md ${
            errors.reviewText ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Share your experience at this restaurant..."
          {...register("reviewText", {
            required: "Please share your experience",
            minLength: {
              value: 10,
              message: "Your review must be at least 10 characters",
            },
          })}
        ></textarea>
        {errors.reviewText && (
          <p className="mt-1 text-sm text-red-600">
            {errors.reviewText.message}
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="btn-primary px-6 py-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Review"
          )}
        </button>
      </div>
    </form>
  );
};

export default WriteReviewForm;
