import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../utils/api";

const MyRestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's restaurants
  useEffect(() => {
    const fetchMyRestaurants = async () => {
      try {
        setLoading(true);
        const response = await api.get("/restaurants/me");
        setRestaurants(response.data.data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load your restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyRestaurants();
  }, []);

  // Handle deleting a restaurant
  const handleDeleteRestaurant = async (restaurantId) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this restaurant? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await api.delete(`/restaurants/${restaurantId}`);

      // Remove the restaurant from local state
      setRestaurants(
        restaurants.filter((restaurant) => restaurant._id !== restaurantId)
      );

      toast.success("Restaurant has been deleted successfully!");
    } catch (error) {
      console.error("Error deleting restaurant:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to delete restaurant. Please try again."
      );
    }
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

  // Format address
  const formatAddress = (location) => {
    if (!location) return "";
    return `${location.address}, ${location.city}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Restaurants</h1>
        <Link
          to="/dashboard/add-restaurant"
          className="btn-primary px-4 py-2 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add Restaurant
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : restaurants.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <h2 className="text-xl font-semibold mb-2">No Restaurants Yet</h2>
          <p className="text-gray-600 mb-4">
            You haven't added any restaurants yet. Start showcasing your
            business to potential customers!
          </p>
          <Link
            to="/dashboard/add-restaurant"
            className="btn-primary px-6 py-2"
          >
            Add Your First Restaurant
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant._id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Restaurant Image */}
                <div className="md:w-1/4 h-48 md:h-auto">
                  <img
                    src={
                      restaurant.featuredImage ||
                      "https://source.unsplash.com/random/300x200/?restaurant,food"
                    }
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Restaurant Details */}
                <div className="md:w-3/4 p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-1">
                        {restaurant.name}
                      </h2>
                      <p className="text-gray-600 text-sm mb-2">
                        {restaurant.cuisine.join(", ")}
                      </p>
                      <p className="text-gray-500 text-sm mb-4">
                        {formatAddress(restaurant.location)}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      {restaurant.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {restaurant.priceRange}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center text-sm space-x-6 mb-4">
                    <div className="flex items-center text-yellow-500">
                      <svg
                        className="h-5 w-5 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold">
                        {restaurant.aggregateRating?.overall.toFixed(1) ||
                          "New"}
                      </span>
                      <span className="text-gray-500 ml-1">
                        ({restaurant.aggregateRating?.reviewCount || 0} reviews)
                      </span>
                    </div>

                    <div className="flex items-center text-gray-500">
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span>Added {formatDate(restaurant.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Link
                      to={`/restaurants/${restaurant._id}`}
                      className="btn-secondary px-4 py-2 text-sm flex items-center"
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

                    <Link
                      to={`/dashboard/edit-restaurant/${restaurant._id}`}
                      className="btn-primary px-4 py-2 text-sm flex items-center"
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
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                      Edit Details
                    </Link>

                    <Link
                      to={`/dashboard/restaurant/${restaurant._id}/analytics`}
                      className="btn-secondary px-4 py-2 text-sm flex items-center"
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
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                      Analytics
                    </Link>

                    <Link
                      to={`/dashboard/restaurant/${restaurant._id}/reviews`}
                      className="btn-secondary px-4 py-2 text-sm flex items-center"
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
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      Manage Reviews
                    </Link>

                    <button
                      onClick={() => handleDeleteRestaurant(restaurant._id)}
                      className="btn-secondary border-red-300 text-red-600 hover:bg-red-50 px-4 py-2 text-sm flex items-center"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyRestaurantsPage;
