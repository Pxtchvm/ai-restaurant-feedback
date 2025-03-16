import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/api";
import { formatUserName } from "../../utils/auth";

const DashboardHomePage = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    recentReviews: [],
    reviewCount: 0,
    restaurantCount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // Get all user reviews
        const reviewsResponse = await api.get("/reviews/me");
        const reviews = reviewsResponse.data.data;

        // Sort reviews by date and get the 3 most recent
        const recentReviews = [...reviews]
          .sort((a, b) => new Date(b.reviewDate) - new Date(a.reviewDate))
          .slice(0, 3);

        // Get user's restaurants if they are a restaurant owner
        let restaurantCount = 0;
        if (
          currentUser.role === "restaurant-owner" ||
          currentUser.role === "admin"
        ) {
          const restaurantsResponse = await api.get("/restaurants/me");
          restaurantCount = restaurantsResponse.data.count;
        }

        setStats({
          recentReviews,
          reviewCount: reviews.length,
          restaurantCount,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [currentUser.role]);

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
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-2">
          Welcome back, {formatUserName(currentUser)}!
        </h2>
        <p className="text-gray-600">
          Here's an overview of your activity on crAIvings.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
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
              <p className="text-gray-500 text-sm">Your Reviews</p>
              <p className="text-2xl font-semibold">{stats.reviewCount}</p>
            </div>
          </div>
          <div className="mt-4 text-right">
            <Link
              to="/dashboard/reviews"
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              View all reviews →
            </Link>
          </div>
        </div>

        {/* Restaurant Owner specific stats */}
        {(currentUser.role === "restaurant-owner" ||
          currentUser.role === "admin") && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 mr-4">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Your Restaurants</p>
                <p className="text-2xl font-semibold">
                  {stats.restaurantCount}
                </p>
              </div>
            </div>
            <div className="mt-4 text-right">
              <Link
                to="/dashboard/my-restaurants"
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Manage restaurants →
              </Link>
            </div>
          </div>
        )}

        {/* Account Status */}
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
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Account Status</p>
              <p className="text-2xl font-semibold">Active</p>
            </div>
          </div>
          <div className="mt-4 text-right">
            <Link
              to="/dashboard/profile"
              className="text-sm text-primary-600 hover:text-primary-800"
            >
              View profile →
            </Link>
          </div>
        </div>

        {/* Account Type */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
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
                  d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                />
              </svg>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Account Type</p>
              <p className="text-2xl font-semibold capitalize">
                {currentUser.role === "restaurant-owner"
                  ? "Owner"
                  : currentUser.role}
              </p>
            </div>
          </div>
          <div className="mt-4 text-right">
            <span className="text-sm text-gray-500">
              Since {new Date(currentUser.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>

      {/* Recent Reviews */}
      {stats.recentReviews.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Your Recent Reviews</h3>
          </div>

          <div className="divide-y divide-gray-200">
            {stats.recentReviews.map((review) => (
              <div key={review._id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <Link
                    to={`/restaurants/${review.restaurant._id}`}
                    className="font-medium text-primary-600 hover:text-primary-800"
                  >
                    {review.restaurant.name}
                  </Link>
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 ${
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
                    <span className="ml-2 text-sm text-gray-500">
                      {formatDate(review.reviewDate)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm line-clamp-2">
                  {review.text}
                </p>
              </div>
            ))}
          </div>

          <div className="px-6 py-3 bg-gray-50 text-right">
            <Link
              to="/dashboard/reviews"
              className="text-sm text-primary-600 hover:text-primary-800 font-medium"
            >
              View all reviews →
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 text-center">
          <p className="text-gray-500">You haven't written any reviews yet.</p>
          <Link
            to="/restaurants"
            className="mt-2 inline-block text-primary-600 hover:text-primary-800"
          >
            Find restaurants to review →
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/restaurants"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium mb-2">Find Restaurants</h3>
          <p className="text-gray-600 text-sm">
            Discover new places to dine and leave reviews.
          </p>
        </Link>

        <Link
          to="/dashboard/reviews"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
        >
          <div className="mx-auto w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
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
          <h3 className="text-lg font-medium mb-2">Manage Reviews</h3>
          <p className="text-gray-600 text-sm">
            View and edit your restaurant reviews.
          </p>
        </Link>

        {currentUser.role === "restaurant-owner" ? (
          <Link
            to="/dashboard/my-restaurants"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="mx-auto w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
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
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-2">Manage Restaurants</h3>
            <p className="text-gray-600 text-sm">
              Add or edit your restaurant listings.
            </p>
          </Link>
        ) : (
          <Link
            to="/dashboard/profile"
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow text-center"
          >
            <div className="mx-auto w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 mb-4">
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
            <h3 className="text-lg font-medium mb-2">Edit Profile</h3>
            <p className="text-gray-600 text-sm">
              Update your account settings and preferences.
            </p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default DashboardHomePage;
