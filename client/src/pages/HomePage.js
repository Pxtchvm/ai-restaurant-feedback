import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const HomePage = () => {
  const [topRestaurants, setTopRestaurants] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);

        // Get top restaurants
        const restaurantsResponse = await api.get(
          "/restaurants?sort=-aggregateRating.overall&limit=4"
        );

        // Get recent reviews
        const reviewsResponse = await api.get(
          "/reviews?sort=-reviewDate&limit=3"
        );

        setTopRestaurants(restaurantsResponse.data.data);
        setRecentReviews(reviewsResponse.data.data);
      } catch (err) {
        console.error("Error fetching home data:", err);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Format restaurant address
  const formatAddress = (location) => {
    if (!location) return "";
    return `${location.address}, ${location.city}`;
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

  return (
    <div>
      {/* Hero section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                Discover Restaurants with AI-Powered Insights
              </h1>
              <p className="text-xl mb-8 text-primary-100">
                crAIvings analyzes thousands of restaurant reviews to help you
                find the perfect dining experience
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/restaurants"
                  className="btn bg-white text-primary-700 hover:bg-primary-50 px-6 py-3 rounded-lg font-medium text-center"
                >
                  Find Restaurants
                </Link>
                <Link
                  to="/about"
                  className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-700 px-6 py-3 rounded-lg font-medium text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img
                src="https://source.unsplash.com/random/600x400/?restaurant,dining"
                alt="Restaurant dining experience"
                className="rounded-lg shadow-xl max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How it works section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            How crAIvings Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discover</h3>
              <p className="text-gray-600">
                Find restaurants based on cuisine, location, and price range
                with our advanced search features.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze</h3>
              <p className="text-gray-600">
                Our AI analyzes reviews to extract insights about food quality,
                service, ambiance, and value.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
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
              <h3 className="text-xl font-semibold mb-2">Decide</h3>
              <p className="text-gray-600">
                Make informed decisions based on detailed sentiment analysis and
                customer experiences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured restaurants section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Top-Rated Restaurants</h2>
            <Link
              to="/restaurants"
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4">{error}</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topRestaurants.map((restaurant) => (
                <Link
                  key={restaurant._id}
                  to={`/restaurants/${restaurant._id}`}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="h-48 overflow-hidden">
                    <img
                      src={
                        restaurant.featuredImage ||
                        "https://source.unsplash.com/random/300x200/?restaurant,food"
                      }
                      alt={restaurant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                        {restaurant.aggregateRating.overall.toFixed(1)}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">
                      {restaurant.cuisine.join(", ")}
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      {formatAddress(restaurant.location)}
                    </p>
                    <div className="mt-3 flex justify-between items-center">
                      <span className="text-gray-700">
                        {restaurant.priceRange}
                      </span>
                      <span className="text-sm text-gray-500">
                        {restaurant.aggregateRating.reviewCount} reviews
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recent reviews section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Recent Reviews</h2>
            <Link
              to="/reviews"
              className="text-primary-600 hover:text-primary-800 font-medium"
            >
              View all
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-600 p-4">{error}</div>
          ) : (
            <div className="space-y-6">
              {recentReviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-lg shadow-md p-6"
                >
                  <div className="flex items-start">
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
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <Link
                          to={`/restaurants/${review.restaurant._id}`}
                          className="text-lg font-semibold hover:text-primary-600"
                        >
                          {review.restaurant.name}
                        </Link>
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
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Call to action section */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to discover your next favorite restaurant?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-3xl mx-auto">
            Join crAIvings today to explore restaurants with AI-powered insights
            and share your own dining experiences.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="btn bg-white text-primary-700 hover:bg-primary-50 px-8 py-3 rounded-lg font-medium"
            >
              Sign Up
            </Link>
            <Link
              to="/restaurants"
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-3 rounded-lg font-medium"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
