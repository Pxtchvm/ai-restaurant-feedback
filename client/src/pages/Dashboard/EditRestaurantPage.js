import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import api from "../../utils/api";

// List of available cuisines
const CUISINES = [
  "Filipino",
  "Chinese",
  "Japanese",
  "Korean",
  "Thai",
  "Vietnamese",
  "Italian",
  "French",
  "Greek",
  "Mediterranean",
  "Mexican",
  "Indian",
  "American",
  "BBQ",
  "Seafood",
  "Vegetarian",
  "Vegan",
  "Fusion",
  "Dessert",
  "Cafe",
  "Fast Food",
];

const EditRestaurantPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [error, setError] = useState(null);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setIsLoading(true);
        const response = await api.get(`/restaurants/${id}`);
        const restaurant = response.data.data;

        // Set selected cuisines
        setSelectedCuisines(restaurant.cuisine || []);

        // Prepare form data
        const formData = {
          name: restaurant.name,
          description: restaurant.description || "",
          location: {
            address: restaurant.location?.address || "",
            city: restaurant.location?.city || "",
            state: restaurant.location?.state || "",
            country: restaurant.location?.country || "Philippines",
            zipCode: restaurant.location?.zipCode || "",
          },
          priceRange: restaurant.priceRange || "₱₱",
          featuredImage: restaurant.featuredImage || "",
          contactInfo: {
            phone: restaurant.contactInfo?.phone || "",
            email: restaurant.contactInfo?.email || "",
            website: restaurant.contactInfo?.website || "",
            social: {
              facebook: restaurant.contactInfo?.social?.facebook || "",
              instagram: restaurant.contactInfo?.social?.instagram || "",
              twitter: restaurant.contactInfo?.social?.twitter || "",
            },
          },
          features: {
            hasDelivery: restaurant.features?.hasDelivery || false,
            hasTakeout: restaurant.features?.hasTakeout || false,
            hasOutdoorSeating: restaurant.features?.hasOutdoorSeating || false,
            acceptsReservations:
              restaurant.features?.acceptsReservations || false,
            isWheelchairAccessible:
              restaurant.features?.isWheelchairAccessible || false,
            hasParking: restaurant.features?.hasParking || false,
          },
          businessHours: {
            monday: restaurant.businessHours?.monday || { open: "", close: "" },
            tuesday: restaurant.businessHours?.tuesday || {
              open: "",
              close: "",
            },
            wednesday: restaurant.businessHours?.wednesday || {
              open: "",
              close: "",
            },
            thursday: restaurant.businessHours?.thursday || {
              open: "",
              close: "",
            },
            friday: restaurant.businessHours?.friday || { open: "", close: "" },
            saturday: restaurant.businessHours?.saturday || {
              open: "",
              close: "",
            },
            sunday: restaurant.businessHours?.sunday || { open: "", close: "" },
          },
        };

        // Reset form with restaurant data
        reset(formData);

        // Set features individually (checkboxes)
        if (restaurant.features) {
          Object.entries(restaurant.features).forEach(([key, value]) => {
            setValue(`features.${key}`, value);
          });
        }

        // Set business hours individually
        if (restaurant.businessHours) {
          Object.entries(restaurant.businessHours).forEach(([day, hours]) => {
            setValue(`businessHours.${day}.open`, hours.open || "");
            setValue(`businessHours.${day}.close`, hours.close || "");
          });
        }
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setError(
          "Failed to load restaurant information. Please try again later."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRestaurant();
  }, [id, reset, setValue]);

  // Handle cuisine selection
  const handleCuisineToggle = (cuisine) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter((c) => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (selectedCuisines.length === 0) {
      toast.error("Please select at least one cuisine type");
      return;
    }

    setIsSubmitting(true);

    try {
      // Add cuisines to the data
      const restaurantData = {
        ...data,
        cuisine: selectedCuisines,
      };

      // Send API request to update restaurant
      await api.put(`/restaurants/${id}`, restaurantData);

      toast.success("Restaurant updated successfully!");
      navigate(`/dashboard/my-restaurants`);
    } catch (error) {
      console.error("Error updating restaurant:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update restaurant. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
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
      <h1 className="text-2xl font-bold mb-6">Edit Restaurant</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Restaurant Name *
              </label>
              <input
                id="name"
                type="text"
                className={`form-input w-full ${
                  errors.name ? "border-red-500" : ""
                }`}
                {...register("name", {
                  required: "Restaurant name is required",
                  maxLength: {
                    value: 100,
                    message: "Name cannot be more than 100 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="description"
                rows="4"
                className={`form-input w-full ${
                  errors.description ? "border-red-500" : ""
                }`}
                placeholder="Tell customers about your restaurant..."
                {...register("description", {
                  maxLength: {
                    value: 1000,
                    message: "Description cannot be more than 1000 characters",
                  },
                })}
              ></textarea>
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cuisine Types *
              </label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {CUISINES.map((cuisine) => (
                  <div key={cuisine} className="flex items-center">
                    <input
                      id={`cuisine-${cuisine}`}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                      checked={selectedCuisines.includes(cuisine)}
                      onChange={() => handleCuisineToggle(cuisine)}
                    />
                    <label
                      htmlFor={`cuisine-${cuisine}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {cuisine}
                    </label>
                  </div>
                ))}
              </div>
              {selectedCuisines.length === 0 && (
                <p className="mt-1 text-sm text-red-600">
                  Please select at least one cuisine type
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {["₱", "₱₱", "₱₱₱", "₱₱₱₱"].map((price) => (
                  <label
                    key={price}
                    className={`flex items-center justify-center px-4 py-2 border rounded-md cursor-pointer ${
                      price === getValue("priceRange")
                        ? "bg-primary-50 border-primary-500"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      className="sr-only"
                      value={price}
                      {...register("priceRange", {
                        required: "Price range is required",
                      })}
                    />
                    <span>{price}</span>
                    <span className="ml-1 text-gray-500 text-xs">
                      {price === "₱"
                        ? "(Inexpensive)"
                        : price === "₱₱"
                        ? "(Moderate)"
                        : price === "₱₱₱"
                        ? "(Expensive)"
                        : "(Very Expensive)"}
                    </span>
                  </label>
                ))}
              </div>
              {errors.priceRange && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.priceRange.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Featured Image URL
              </label>
              <input
                type="text"
                className="form-input w-full"
                placeholder="https://example.com/your-image.jpg"
                {...register("featuredImage")}
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter a URL for your restaurant's main image
              </p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Location</h2>
          <div className="space-y-6">
            <div>
              <label
                htmlFor="location.address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Street Address *
              </label>
              <input
                id="location.address"
                type="text"
                className={`form-input w-full ${
                  errors.location?.address ? "border-red-500" : ""
                }`}
                {...register("location.address", {
                  required: "Street address is required",
                })}
              />
              {errors.location?.address && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.location.address.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="location.city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  City *
                </label>
                <input
                  id="location.city"
                  type="text"
                  className={`form-input w-full ${
                    errors.location?.city ? "border-red-500" : ""
                  }`}
                  {...register("location.city", {
                    required: "City is required",
                  })}
                />
                {errors.location?.city && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location.city.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location.state"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  State/Province
                </label>
                <input
                  id="location.state"
                  type="text"
                  className="form-input w-full"
                  {...register("location.state")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="location.country"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Country *
                </label>
                <input
                  id="location.country"
                  type="text"
                  className={`form-input w-full ${
                    errors.location?.country ? "border-red-500" : ""
                  }`}
                  {...register("location.country", {
                    required: "Country is required",
                  })}
                />
                {errors.location?.country && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.location.country.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="location.zipCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Zip/Postal Code
                </label>
                <input
                  id="location.zipCode"
                  type="text"
                  className="form-input w-full"
                  {...register("location.zipCode")}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="contactInfo.phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="contactInfo.phone"
                  type="text"
                  className="form-input w-full"
                  placeholder="+63 XXX XXX XXXX"
                  {...register("contactInfo.phone")}
                />
              </div>

              <div>
                <label
                  htmlFor="contactInfo.email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="contactInfo.email"
                  type="email"
                  className={`form-input w-full ${
                    errors.contactInfo?.email ? "border-red-500" : ""
                  }`}
                  placeholder="restaurant@example.com"
                  {...register("contactInfo.email", {
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.contactInfo?.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.contactInfo.email.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="contactInfo.website"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Website
              </label>
              <input
                id="contactInfo.website"
                type="text"
                className={`form-input w-full ${
                  errors.contactInfo?.website ? "border-red-500" : ""
                }`}
                placeholder="https://example.com"
                {...register("contactInfo.website", {
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
                    message: "Invalid website URL",
                  },
                })}
              />
              {errors.contactInfo?.website && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.contactInfo.website.message}
                </p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Social Media
              </h3>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="contactInfo.social.facebook"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Facebook
                  </label>
                  <input
                    id="contactInfo.social.facebook"
                    type="text"
                    className="form-input w-full"
                    placeholder="https://facebook.com/yourrestaurant"
                    {...register("contactInfo.social.facebook")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactInfo.social.instagram"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Instagram
                  </label>
                  <input
                    id="contactInfo.social.instagram"
                    type="text"
                    className="form-input w-full"
                    placeholder="https://instagram.com/yourrestaurant"
                    {...register("contactInfo.social.instagram")}
                  />
                </div>

                <div>
                  <label
                    htmlFor="contactInfo.social.twitter"
                    className="block text-sm text-gray-700 mb-1"
                  >
                    Twitter
                  </label>
                  <input
                    id="contactInfo.social.twitter"
                    type="text"
                    className="form-input w-full"
                    placeholder="https://twitter.com/yourrestaurant"
                    {...register("contactInfo.social.twitter")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Business Hours</h2>
          <div className="space-y-4">
            {[
              "monday",
              "tuesday",
              "wednesday",
              "thursday",
              "friday",
              "saturday",
              "sunday",
            ].map((day) => (
              <div key={day} className="grid grid-cols-5 gap-4 items-center">
                <div className="col-span-1">
                  <span className="block text-sm font-medium text-gray-700 capitalize">
                    {day}
                  </span>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor={`businessHours.${day}.open`}
                    className="sr-only"
                  >
                    Opening Time
                  </label>
                  <input
                    id={`businessHours.${day}.open`}
                    type="time"
                    className="form-input w-full"
                    {...register(`businessHours.${day}.open`)}
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor={`businessHours.${day}.close`}
                    className="sr-only"
                  >
                    Closing Time
                  </label>
                  <input
                    id={`businessHours.${day}.close`}
                    type="time"
                    className="form-input w-full"
                    {...register(`businessHours.${day}.close`)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Restaurant Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <input
                id="features.hasDelivery"
                type="checkbox"
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                {...register("features.hasDelivery")}
              />
              <label
                htmlFor="features.hasDelivery"
                className="ml-2 block text-sm text-gray-700"
              >
                Offers Delivery
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="features.hasTakeout"
                type="checkbox"
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                {...register("features.hasTakeout")}
              />
              <label
                htmlFor="features.hasTakeout"
                className="ml-2 block text-sm text-gray-700"
              >
                Offers Takeout
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="features.hasOutdoorSeating"
                type="checkbox"
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                {...register("features.hasOutdoorSeating")}
              />
              <label
                htmlFor="features.hasOutdoorSeating"
                className="ml-2 block text-sm text-gray-700"
              >
                Outdoor Seating Available
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="features.acceptsReservations"
                type="checkbox"
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                {...register("features.acceptsReservations")}
              />
              <label
                htmlFor="features.acceptsReservations"
                className="ml-2 block text-sm text-gray-700"
              >
                Accepts Reservations
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="features.isWheelchairAccessible"
                type="checkbox"
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                {...register("features.isWheelchairAccessible")}
              />
              <label
                htmlFor="features.isWheelchairAccessible"
                className="ml-2 block text-sm text-gray-700"
              >
                Wheelchair Accessible
              </label>
            </div>

            <div className="flex items-center">
              <input
                id="features.hasParking"
                type="checkbox"
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                {...register("features.hasParking")}
              />
              <label
                htmlFor="features.hasParking"
                className="ml-2 block text-sm text-gray-700"
              >
                Parking Available
              </label>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="btn-secondary px-6 py-2"
            onClick={() => navigate("/dashboard/my-restaurants")}
          >
            Cancel
          </button>
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
                Updating...
              </span>
            ) : (
              "Update Restaurant"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Function to get form values (used for the price range radio buttons)
const getValue = (name) => {
  const element = document.querySelector(`input[name="${name}"]:checked`);
  return element ? element.value : "";
};

export default EditRestaurantPage;
