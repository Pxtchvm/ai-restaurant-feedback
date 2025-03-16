import React, { useState } from "react";

const ReviewsList = ({ reviews }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("");

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
  const sortAndFilterReviews = () => {
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

  const sortedAndFilteredReviews = sortAndFilterReviews();

  // Get sentiment class based on score
  const getSentimentClass = (score) => {
    if (!score && score !== 0) return "";
    if (score > 0.3) return "text-green-600";
    if (score < -0.3) return "text-red-600";
    return "text-yellow-600";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col sm:flex-row justify-between mb-6">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0">
          Reviews ({reviews.length})
        </h2>

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

      {sortedAndFilteredReviews.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {filterRating
              ? `No ${filterRating}-star reviews found.`
              : "No reviews yet. Be the first to leave a review!"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedAndFilteredReviews.map((review) => (
            <div
              key={review._id}
              className="border-b border-gray-200 pb-6 last:border-0 last:pb-0"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                    {review.user.firstName?.charAt(0)}
                    {review.user.lastName?.charAt(0)}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2">
                    <div>
                      <h3 className="font-semibold">
                        {review.user.firstName} {review.user.lastName}
                      </h3>
                      <p className="text-gray-500 text-sm">
                        {formatDate(review.reviewDate)}
                      </p>
                    </div>

                    <div className="flex items-center mt-2 sm:mt-0">
                      <div className="flex">
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
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {review.sentiment &&
                        review.sentiment.overall !== undefined && (
                          <span
                            className={`ml-3 text-sm font-medium ${getSentimentClass(
                              review.sentiment.overall
                            )}`}
                          >
                            {review.sentiment.overall > 0.3
                              ? "Positive"
                              : review.sentiment.overall < -0.3
                              ? "Negative"
                              : "Neutral"}
                          </span>
                        )}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4">{review.text}</p>

                  {review.sentiment && review.sentiment.categories && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Sentiment Analysis
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Object.entries(review.sentiment.categories).map(
                          ([category, score]) => {
                            if (score === null) return null;

                            return (
                              <div
                                key={category}
                                className="bg-gray-50 p-2 rounded"
                              >
                                <div className="text-xs font-medium text-gray-500 capitalize">
                                  {category}
                                </div>
                                <div
                                  className={`text-sm font-medium ${getSentimentClass(
                                    score
                                  )}`}
                                >
                                  {score > 0.3
                                    ? "Positive"
                                    : score < -0.3
                                    ? "Negative"
                                    : "Neutral"}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}

                  {/* Owner Response */}
                  {review.response && (
                    <div className="bg-gray-50 p-4 rounded-lg mt-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                              />
                            </svg>
                          </div>
                        </div>
                        <div>
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
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
