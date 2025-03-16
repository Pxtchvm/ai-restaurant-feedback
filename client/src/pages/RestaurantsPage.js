import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

const RestaurantsPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});

  // Filter states
  const [filters, setFilters] = useState({
    cuisine: [],
    priceRange: [],
    rating: "",
    sort: "-aggregateRating.overall",
  });

  // Available filter options
  const cuisineOptions = [
    "Filipino",
    "Chinese",
    "Japanese",
    "Italian",
    "American",
    "Korean",
    "Thai",
    "Indian",
    "Mediterranean",
    "Fusion",
  ];

  const priceRangeOptions = [
    { value: "₱", label: "₱ (Inexpensive)" },
    { value: "₱₱", label: "₱₱ (Moderate)" },
    { value: "₱₱₱", label: "₱₱₱ (Expensive)" },
    { value: "₱₱₱₱", label: "₱₱₱₱ (Very Expensive)" },
  ];

  const sortOptions = [
    { value: "-aggregateRating.overall", label: "Highest Rated" },
    { value: "aggregateRating.overall", label: "Lowest Rated" },
    { value: "-aggregateRating.reviewCount", label: "Most Reviewed" },
    { value: "-createdAt", label: "Newest" },
    { value: "name", label: "Name (A-Z)" },
    { value: "-name", label: "Name (Z-A)" },
  ];

  // Fetch restaurants with current filters
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);

        // Build query params
        const params = new URLSearchParams();
        params.append("page", page);
        params.append("limit", 8);
        params.append("sort", filters.sort);

        if (filters.cuisine.length > 0) {
          params.append("cuisine", filters.cuisine.join(","));
        }

        if (filters.priceRange.length > 0) {
          params.append("priceRange", filters.priceRange.join(","));
        }

        if (filters.rating) {
          params.append("rating", filters.rating);
        }

        const response = await api.get(`/restaurants?${params.toString()}`);

        setRestaurants(response.data.data);
        setPagination(response.data.pagination);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setError("Failed to load restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [page, filters]);

  // Handle filter changes
  const handleCuisineChange = (cuisine) => {
    setFilters((prev) => {
      const updatedCuisines = prev.cuisine.includes(cuisine)
        ? prev.cuisine.filter((c) => c !== cuisine)
        : [...prev.cuisine, cuisine];

      return { ...prev, cuisine: updatedCuisines };
    });
    setPage(1); // Reset to first page when filter changes
  };

  const handlePriceRangeChange = (price) => {
    setFilters((prev) => {
      const updatedPrices = prev.priceRange.includes(price)
        ? prev.priceRange.filter((p) => p !== price)
        : [...prev.priceRange, price];

      return { ...prev, priceRange: updatedPrices };
    });
    setPage(1);
  };

  const handleRatingChange = (event) => {
    setFilters((prev) => ({ ...prev, rating: event.target.value }));
    setPage(1);
  };

  const handleSortChange = (event) => {
    setFilters((prev) => ({ ...prev, sort: event.target.value }));
    setPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      cuisine: [],
      priceRange: [],
      rating: "",
      sort: "-aggregateRating.overall",
    });
    setPage(1);
  };

  // Helper function to format address
  const formatAddress = (location) => {
    if (!location) return "";
    return `${location.address}, ${location.city}`;
  };

  return (
    <div className="py-8">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Restaurants</h1>

        {/* Filters and Restaurants Grid */}
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
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={filters.rating}
                  onChange={handleRatingChange}
                  className="form-input w-full"
                >
                  <option value="">Any Rating</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Price Range
                </h3>
                <div className="space-y-2">
                  {priceRangeOptions.map((price) => (
                    <div key={price.value} className="flex items-center">
                      <input
                        id={`price-${price.value}`}
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        checked={filters.priceRange.includes(price.value)}
                        onChange={() => handlePriceRangeChange(price.value)}
                      />
                      <label
                        htmlFor={`price-${price.value}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {price.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cuisine Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Cuisine
                </h3>
                <div className="space-y-2 max-h-56 overflow-y-auto">
                  {cuisineOptions.map((cuisine) => (
                    <div key={cuisine} className="flex items-center">
                      <input
                        id={`cuisine-${cuisine}`}
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 border-gray-300 rounded"
                        checked={filters.cuisine.includes(cuisine)}
                        onChange={() => handleCuisineChange(cuisine)}
                      />
                      <label
                        htmlFor={`cuisine-${cuisine}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {cuisine}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Restaurants Grid */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : restaurants.length === 0 ? (
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">
                  No restaurants found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to find more restaurants.
                </p>
                <button onClick={resetFilters} className="btn-primary">
                  Reset Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {restaurants.map((restaurant) => (
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

export default RestaurantsPage;
