import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

// Components
import ReviewTrends from "../../components/analytics/ReviewTrends";
import SentimentBreakdown from "../../components/analytics/SentimentBreakdown";
import CategoryScores from "../../components/analytics/CategoryScores";
import ImprovementSuggestions from "../../components/analytics/ImprovementSuggestions";
import RatingDistribution from "../../components/analytics/RatingDistribution";
import KeywordCloud from "../../components/analytics/KeywordCloud";

const RestaurantAnalyticsPage = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [improvements, setImprovements] = useState(null);
  const [timeRange, setTimeRange] = useState("6months");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch restaurant and analytics data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get restaurant details
        const restaurantResponse = await api.get(`/restaurants/${id}`);
        setRestaurant(restaurantResponse.data.data);

        // Get sentiment analysis
        const sentimentResponse = await api.get(
          `/analysis/restaurant/${id}/sentiment?period=${timeRange}`
        );
        setSentiment(sentimentResponse.data.data);

        // Get improvement suggestions
        const improvementsResponse = await api.get(
          `/analysis/restaurant/${id}/improvements`
        );
        setImprovements(improvementsResponse.data.data);
      } catch (err) {
        console.error("Error fetching analytics data:", err);
        setError("Failed to load analytics data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, timeRange]);

  // Handle time range change
  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">{restaurant?.name} Analytics</h1>
            <p className="text-gray-500 mt-1">
              Insights and trends based on customer reviews
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <Link
              to={`/restaurants/${id}`}
              className="btn-secondary px-4 py-2 text-sm flex items-center"
              target="_blank"
            >
              <svg
                className="h-4 w-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              View Public Page
            </Link>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="mb-3 sm:mb-0">
            <h2 className="text-lg font-semibold">Review Analytics</h2>
            <p className="text-sm text-gray-500">
              Based on {sentiment?.total || 0} reviews from the{" "}
              {sentiment?.periodLabel?.toLowerCase() || "last 6 months"}
            </p>
          </div>

          <div>
            <label
              htmlFor="timeRange"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Time Period:
            </label>
            <select
              id="timeRange"
              value={timeRange}
              onChange={handleTimeRangeChange}
              className="form-input text-sm py-1"
            >
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {!sentiment?.total ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">No Reviews Yet</h2>
          <p className="text-gray-600 mb-4">
            There are no reviews for this restaurant during the selected time
            period.
          </p>
        </div>
      ) : (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary-100 text-primary-600 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Average Rating</p>
                  <p className="text-2xl font-semibold">
                    {restaurant?.aggregateRating?.overall.toFixed(1)}
                  </p>
                  <p className="text-sm text-gray-500">Out of 5</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Positive Sentiment</p>
                  <p className="text-2xl font-semibold">
                    {sentiment?.sentimentDistribution?.positive}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {sentiment?.total} total reviews
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Last Review</p>
                  <p className="text-2xl font-semibold">
                    {sentiment?.trends && sentiment.trends.length > 0
                      ? formatDate(
                          sentiment.trends[sentiment.trends.length - 1].period +
                            "-01"
                        )
                      : "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">Date</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Trend</p>
                  {sentiment?.trends && sentiment.trends.length >= 2 ? (
                    <>
                      <p
                        className={`text-2xl font-semibold ${
                          sentiment.trends[sentiment.trends.length - 1]
                            .avgSentiment >
                          sentiment.trends[sentiment.trends.length - 2]
                            .avgSentiment
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {sentiment.trends[sentiment.trends.length - 1]
                          .avgSentiment >
                        sentiment.trends[sentiment.trends.length - 2]
                          .avgSentiment
                          ? "Up"
                          : "Down"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(
                          Math.abs(
                            sentiment.trends[sentiment.trends.length - 1]
                              .avgSentiment -
                              sentiment.trends[sentiment.trends.length - 2]
                                .avgSentiment
                          ) * 100 || 0
                        ).toFixed(1)}
                        % change
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-2xl font-semibold">--</p>
                      <p className="text-sm text-gray-500">No trend data</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Review Trends Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Review Trends</h2>
              <div className="h-72">
                <ReviewTrends trends={sentiment?.trends || []} />
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">
                Rating Distribution
              </h2>
              <div className="h-72">
                <RatingDistribution
                  distribution={sentiment?.ratingDistribution || {}}
                />
              </div>
            </div>

            {/* Sentiment Breakdown */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">
                Sentiment Breakdown
              </h2>
              <div className="h-72">
                <SentimentBreakdown
                  distribution={
                    sentiment?.sentimentDistribution || {
                      positive: 0,
                      neutral: 0,
                      negative: 0,
                    }
                  }
                />
              </div>
            </div>

            {/* Category Scores */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">Category Scores</h2>
              <div className="h-72">
                <CategoryScores categories={sentiment?.categories || {}} />
              </div>
            </div>
          </div>

          {/* Keyword Cloud & Improvement Suggestions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Keyword Cloud */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">
                Frequently Mentioned Keywords
              </h2>
              <KeywordCloud keywords={sentiment?.keywords || []} />
            </div>

            {/* Improvement Suggestions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold mb-4">
                Improvement Suggestions
              </h2>
              <ImprovementSuggestions improvements={improvements} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RestaurantAnalyticsPage;
