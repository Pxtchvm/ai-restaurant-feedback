import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

const MyReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("");
  const [editingReview, setEditingReview] = useState(null);
  const [editText, setEditText] = useState("");
  const [editRating, setEditRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user's reviews
  useEffect(() => {
    const fetchMyReviews = async () => {
      try {
        setLoading(true);
        const response = await api.get("/reviews/me");
        setReviews(response.data.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load your reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyReviews();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Sort and filter reviews
  const getSortedAndFilteredReviews = () => {
    let filteredReviews = [...reviews];

    // Filter by rating
    if (filterRating) {
      const rating = parseInt(filterRating);
      filteredReviews = filteredReviews.filter(
        (review) => review.rating === rating
      );
    }

    // Sort by selected criterion
    switch (sortBy) {
      case "newest":
        return filteredReviews.sort(
          (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate)
        );
      case "oldest":
        return filteredReviews.sort(
          (a, b) => new Date(a.reviewDate) - new Date(b.reviewDate)
        );
      case "highest":
        return filteredReviews.sort((a, b) => b.rating - a.rating);
      case "lowest":
        return filteredReviews.sort((a, b) => a.rating - b.rating);
      default:
        return filteredReviews;
    }
  };

  // Handle editing a review
  const handleEditClick = (review) => {
    setEditingReview(review);
    setEditText(review.text);
    setEditRating(review.rating);
  };

  // Handle updating a review
  const handleUpdateReview = async () => {
    if (editRating === 0) {
      toast.error("Please select a rating");
      return;
    }

    if (editText.trim().length < 10) {
      toast.error("Review text must be at least 10 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.put(`/reviews/${editingReview._id}`, {
        rating: editRating,
        text: editText,
      });

      // Update the review in the local state
      setReviews(
        reviews.map((review) =>
          review._id === editingReview._id ? response.data.data : review
        )
      );

      // Reset editing state
      setEditingReview(null);
      setEditText("");
      setEditRating(0);

      toast.success("Your review has been updated successfully!");
    } catch (error) {
      console.error("Error updating review:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update review. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle deleting a review
  const handleDeleteReview = async (reviewId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this review? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/reviews/${reviewId}`);

      // Remove the review from local state
      setReviews(reviews.filter((review) => review._id !== reviewId));

      toast.success("Your review has been deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete review. Please try again."
      );
    }
  };

  // Render review card
  const renderReviewCard = (review) => {
    const isEditing = editingReview && editingReview._id === review._id;

    return (
      <div
        key={review._id}
        className="bg-white rounded-lg shadow-md overflow-hidden"
      >
        {/* Restaurant info and rating */}
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <Link
              to={`/restaurants/${review.restaurant._id}`}
              className="font-medium text-lg text-primary-600 hover:text-primary-800"
            >
              {review.restaurant.name}
            </Link>

            {!isEditing && (
              <div className="flex items-center">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-5 w-5 ${
                        i < review.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Review date: {formatDate(review.reviewDate)}
          </p>
        </div>

        {/* Review content */}
        <div className="p-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Rating
                </label>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className="focus:outline-none"
                      onClick={() => setEditRating(star)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-8 w-8 ${
                          star <= editRating
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
                    {
                      [
                        "",
                        "Terrible",
                        "Poor",
                        "Average",
                        "Very Good",
                        "Excellent",
                      ][editRating]
                    }
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows="4"
                  className="form-input w-full"
                  placeholder="Share your experience at this restaurant..."
                ></textarea>
                {editText.trim().length < 10 && (
                  <p className="mt-1 text-sm text-red-600">
                    Review must be at least 10 characters
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setEditingReview(null)}
                  className="btn-secondary px-4 py-2"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateReview}
                  className="btn-primary px-4 py-2"
                  disabled={
                    isSubmitting ||
                    editText.trim().length < 10 ||
                    editRating === 0
                  }
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
                      Updating...
                    </span>
                  ) : (
                    "Update Review"
                  )}
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-700 mb-4">{review.text}</p>

              {/* Sentiment Analysis */}
              {review.sentiment && review.sentiment.overall !== undefined && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Sentiment Analysis
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Overall: {(review.sentiment.overall * 100).toFixed(1)}%
                    </div>

                    {review.sentiment.categories &&
                      Object.entries(review.sentiment.categories).map(
                        ([category, score]) => {
                          if (score === null || score === undefined)
                            return null;

                          const scorePercentage = (score * 100).toFixed(1);
                          let bgColor = "bg-gray-100 text-gray-800";

                          if (score > 0.3)
                            bgColor = "bg-green-100 text-green-800";
                          else if (score < -0.3)
                            bgColor = "bg-red-100 text-red-800";
                          else bgColor = "bg-yellow-100 text-yellow-800";

                          return (
                            <div
                              key={category}
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${bgColor}`}
                            >
                              {category.charAt(0).toUpperCase() +
                                category.slice(1)}
                              : {scorePercentage}%
                            </div>
                          );
                        }
                      )}
                  </div>
                </div>
              )}

              {/* Owner Response */}
              {review.response && (
                <div className="bg-gray-50 p-3 rounded-lg mt-3 border-l-4 border-primary-500">
                  <h4 className="font-medium text-sm">Response from Owner</h4>
                  <p className="text-gray-500 text-xs">
                    {formatDate(review.response.date)}
                  </p>
                  <p className="text-gray-700 text-sm mt-2">
                    {review.response.text}
                  </p>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => handleEditClick(review)}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>

                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Reviews</h1>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No Reviews Yet</h2>
          <p className="text-gray-600 mb-4">
            You haven't written any reviews yet. Start sharing your dining
            experiences to help others!
          </p>
          <Link to="/restaurants" className="btn-primary px-6 py-2">
            Find Restaurants to Review
          </Link>
        </div>
      ) : (
        <>
          {/* Filters and sort controls */}
          <div className="flex flex-col md:flex-row justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <h2 className="text-lg font-semibold">
                Your Reviews ({reviews.length})
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {/* Filter dropdown */}
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="form-input text-sm py-1"
              >
                <option value="">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-input text-sm py-1"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
          </div>

          {/* Reviews grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {getSortedAndFilteredReviews().map(renderReviewCard)}
          </div>

          {getSortedAndFilteredReviews().length === 0 && (
            <div className="bg-yellow-50 border border-yellow-100 text-yellow-800 px-4 py-3 rounded mt-4 text-center">
              No reviews match your current filters. Try adjusting your filters
              to see more reviews.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyReviewsPage;
