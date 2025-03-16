import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const AllReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Filter states
  const [filters, setFilters] = useState({
    minRating: "",
    maxRating: "",
    sort: "-reviewDate",
  });

  // Fetch reviews with current filters
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);

        // Build query params
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", 8);
        params.append("sort", filters.sort);

        if (filters.minRating) {
          params.append("minRating", filters.minRating);
        }

        if (filters.maxRating) {
          params.append("maxRating", filters.maxRating);
        }

        const response = await api.get(`/reviews?${params.toString()}`);

        setReviews(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setError("Failed to load reviews. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [page, filters]);

  // Handle filter changes
  const handleRatingFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleSortChange = (event) => {
    setFilters((prev) => ({ ...prev, sort: event.target.value }));
    setPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      minRating: "",
      maxRating: "",
      sort: "-reviewDate",
    });
    setPage(1);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get sentiment class based on score
  const getSentimentClass = (score) => {
    if (!score && score !== 0) return "";
    if (score > 0.3) return "text-green-600";
    if (score < -0.3) return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <div className="py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Reviews</h1>

        {/* Filters and Reviews List */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filters</h2>
                <button
                  onClick={resetFilters}
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  Reset All
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sort}
                  onChange={handleSortChange}
                  className="form-input w-full"
                >
                  <option value="-reviewDate">Newest First</option>
                  <option value="reviewDate">Oldest First</option>
                  <option value="-rating">Highest Rated</option>
                  <option value="rating">Lowest Rated</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Rating
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Min Rating
                    </label>
                    <select
                      name="minRating"
                      value={filters.minRating}
                      onChange={handleRatingFilterChange}
                      className="form-input w-full"
                    >
                      <option value="">Any</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">
                      Max Rating
                    </label>
                    <select
                      name="maxRating"
                      value={filters.maxRating}
                      onChange={handleRatingFilterChange}
                      className="form-input w-full"
                    >
                      <option value="">Any</option>
                      <option value="1">1</option>
                      <option value="2">2</option>
                      <option value="3">3</option>
                      <option value="4">4</option>
                      <option value="5">5</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : reviews.length === 0 ? (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">No reviews found</h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to find more reviews.
                </p>
                <button onClick={resetFilters} className="btn-primary">
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div
                      key={review._id}
                      className="bg-white rounded-lg shadow-md p-6"
                    >
                      <div className="flex items-start">
                        {review.restaurant && (
                          <Link to={`/restaurants/${review.restaurant._id}`}>
                            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 mr-4">
                              <img
                                src={
                                  review.restaurant.featuredImage ||
                                  "https://source.unsplash.com/random/100x100/?restaurant"
                                }
                                alt={review.restaurant.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </Link>
                        )}
                        <div className="flex-1">
                          <div className="flex justify-between">
                            {review.restaurant && (
                              <Link
                                to={`/restaurants/${review.restaurant._id}`}
                                className="text-lg font-semibold hover:text-primary-600"
                              >
                                {review.restaurant.name}
                              </Link>
                            )}
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-5 w-5 ${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-500 text-sm">
                            {formatDate(review.reviewDate)} by{" "}
                            {review.user.firstName} {review.user.lastName}
                          </p>
                          <p className="mt-3 text-gray-700">{review.text}</p>

                          {/* Sentiment Tag (if available) */}
                          {review.sentiment &&
                            review.sentiment.overall !== undefined && (
                              <div className="mt-3">
                                <span
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    review.sentiment.overall > 0.3
                                      ? "bg-green-100 text-green-800"
                                      : review.sentiment.overall < -0.3
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {review.sentiment.overall > 0.3
                                    ? "Positive"
                                    : review.sentiment.overall < -0.3
                                    ? "Negative"
                                    : "Neutral"}
                                </span>
                              </div>
                            )}

                          {/* Owner Response */}
                          {review.response && (
                            <div className="bg-gray-50 p-3 rounded-lg mt-3 border-l-4 border-primary-500">
                              <h4 className="font-medium text-sm">
                                Response from Owner
                              </h4>
                              <p className="text-gray-500 text-xs">
                                {formatDate(review.response.date)}
                              </p>
                              <p className="text-gray-700 text-sm mt-2">
                                {review.response.text}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <nav className="flex items-center space-x-1">
                      <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                        className={`px-3 py-1 rounded ${
                          page === 1
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-primary-50"
                        }`}
                      >
                        &laquo;
                      </button>

                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const pageNumber = index + 1;
                        // Show only a window of pages
                        if (
                          pageNumber === 1 ||
                          pageNumber === pagination.totalPages ||
                          (pageNumber >= page - 1 && pageNumber <= page + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => setPage(pageNumber)}
                              className={`px-3 py-1 rounded ${
                                page === pageNumber
                                  ? "bg-primary-600 text-white"
                                  : "bg-white text-gray-700 hover:bg-primary-50"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                        // Add ellipsis
                        if (
                          (pageNumber === 2 && page > 3) ||
                          (pageNumber === pagination.totalPages - 1 &&
                            page < pagination.totalPages - 2)
                        ) {
                          return <span key={pageNumber}>...</span>;
                        }
                        return null;
                      })}

                      <button
                        onClick={() =>
                          setPage((prev) =>
                            Math.min(prev + 1, pagination.totalPages)
                          )
                        }
                        disabled={page === pagination.totalPages}
                        className={`px-3 py-1 rounded ${
                          page === pagination.totalPages
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-white text-gray-700 hover:bg-primary-50"
                        }`}
                      >
                        &raquo;
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllReviewsPage;
