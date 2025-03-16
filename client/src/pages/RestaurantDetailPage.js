import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../utils/api";

// Import components for the tabs
import RestaurantInfo from "../components/restaurant/RestaurantInfo";
import ReviewsList from "../components/restaurant/ReviewsList";
import SentimentAnalysis from "../components/restaurant/SentimentAnalysis";
import WriteReviewForm from "../components/restaurant/WriteReviewForm";

const RestaurantDetailPage = () => {
  const { id } = useParams();
  const { currentUser, isAuthenticated } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [activeTab, setActiveTab] = useState("info");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  // Define the tabs
  const tabs = [
    { id: "info", label: "Restaurant Info" },
    { id: "reviews", label: "Reviews" },
    { id: "analysis", label: "Analysis" },
  ];

  // Fetch restaurant data and sentiment analysis
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        setLoading(true);

        // Get restaurant details
        const restaurantResponse = await api.get(`/restaurants/${id}`);
        setRestaurant(restaurantResponse.data.data);

        // Get restaurant reviews
        const reviewsResponse = await api.get(`/restaurants/${id}/reviews`);
        setReviews(reviewsResponse.data.data);

        // Get sentiment analysis
        const sentimentResponse = await api.get(
          `/analysis/restaurant/${id}/sentiment`
        );
        setSentiment(sentimentResponse.data.data);

        // Check if current user has already reviewed this restaurant
        if (isAuthenticated && currentUser) {
          const userReviewsResponse = await api.get("/reviews/me");
          const hasReviewed = userReviewsResponse.data.data.some(
            (review) => review.restaurant._id === id
          );
          setHasUserReviewed(hasReviewed);
        }
      } catch (err) {
        console.error("Error fetching restaurant data:", err);
        setError(
          "Failed to load restaurant information. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantData();
  }, [id, isAuthenticated, currentUser]);

  // Handle new review submission
  const handleReviewSubmitted = async (newReview) => {
    // Add the new review to the reviews list
    setReviews((prev) => [newReview, ...prev]);
    setHasUserReviewed(true);

    // Refetch sentiment analysis to update with new review
    try {
      const sentimentResponse = await api.get(
        `/analysis/restaurant/${id}/sentiment`
      );
      setSentiment(sentimentResponse.data.data);
    } catch (err) {
      console.error("Error updating sentiment analysis:", err);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-custom py-12">
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="container-custom py-12">
        <div className="bg-yellow-100 border border-yellow-200 text-yellow-700 px-4 py-3 rounded">
          Restaurant not found.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Restaurant Header */}
      <div
        className="bg-gray-800 text-white py-8 relative"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${
            restaurant.featuredImage ||
            "https://source.unsplash.com/random/1200x400/?restaurant"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container-custom relative z-10">
          <div className="flex flex-col lg:flex-row justify-between">
            <div>
              <nav className="text-sm mb-2" aria-label="Breadcrumb">
                <ol className="flex space-x-2">
                  <li>
                    <Link to="/" className="hover:text-primary-300">
                      Home
                    </Link>
                  </li>
                  <li>/</li>
                  <li>
                    <Link to="/restaurants" className="hover:text-primary-300">
                      Restaurants
                    </Link>
                  </li>
                  <li>/</li>
                  <li className="text-primary-300">{restaurant.name}</li>
                </ol>
              </nav>

              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {restaurant.name}
              </h1>

              <div className="flex flex-wrap items-center text-sm md:text-base space-x-4 mb-4">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-yellow-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="font-bold">
                    {restaurant.aggregateRating.overall.toFixed(1)}
                  </span>
                  <span className="ml-1 text-gray-300">
                    ({restaurant.aggregateRating.reviewCount} reviews)
                  </span>
                </div>

                <span>•</span>

                <div>{restaurant.cuisine.join(", ")}</div>

                <span>•</span>

                <div>{restaurant.priceRange}</div>
              </div>

              <div className="flex flex-wrap items-center text-sm space-x-6">
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>
                    {restaurant.location.address}, {restaurant.location.city}
                  </span>
                </div>

                {restaurant.contactInfo?.phone && (
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{restaurant.contactInfo.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 lg:mt-0 flex space-x-2">
              {isAuthenticated && !hasUserReviewed && (
                <button
                  onClick={() => {
                    setActiveTab("reviews");
                    setTimeout(() => {
                      document
                        .getElementById("write-review-form")
                        ?.scrollIntoView({ behavior: "smooth" });
                    }, 100);
                  }}
                  className="btn-primary px-4 py-2"
                >
                  Write a Review
                </button>
              )}

              <a
                href={`https://maps.google.com/?q=${restaurant.location.address}, ${restaurant.location.city}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary px-4 py-2"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="container-custom py-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`py-4 px-1 border-b-2 font-medium text-sm md:text-base whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-6">
          {/* Tab Content */}
          {activeTab === "info" && <RestaurantInfo restaurant={restaurant} />}

          {activeTab === "reviews" && (
            <div className="space-y-8">
              {isAuthenticated && !hasUserReviewed && (
                <div
                  id="write-review-form"
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Write a Review</h2>
                  <WriteReviewForm
                    restaurantId={id}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </div>
              )}

              <ReviewsList reviews={reviews} />
            </div>
          )}

          {activeTab === "analysis" && (
            <SentimentAnalysis sentiment={sentiment} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetailPage;
