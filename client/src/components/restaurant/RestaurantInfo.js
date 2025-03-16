import React from "react";

const RestaurantInfo = ({ restaurant }) => {
  // Format business hours
  const formatHours = (hoursObj) => {
    if (!hoursObj || !hoursObj.open || !hoursObj.close) return "Closed";
    return `${hoursObj.open} - ${hoursObj.close}`;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column - Description and Features */}
      <div className="lg:col-span-2 space-y-6">
        {/* Description */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">About</h2>
          <p className="text-gray-700">
            {restaurant.description ||
              "No description available for this restaurant."}
          </p>
        </div>

        {/* Features */}
        {restaurant.features &&
          Object.values(restaurant.features).some((feature) => feature) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurant.features.hasDelivery && (
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Delivery Available</span>
                  </div>
                )}

                {restaurant.features.hasTakeout && (
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Takeout Available</span>
                  </div>
                )}

                {restaurant.features.hasOutdoorSeating && (
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Outdoor Seating</span>
                  </div>
                )}

                {restaurant.features.acceptsReservations && (
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Accepts Reservations</span>
                  </div>
                )}

                {restaurant.features.isWheelchairAccessible && (
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Wheelchair Accessible</span>
                  </div>
                )}

                {restaurant.features.hasParking && (
                  <div className="flex items-center">
                    <svg
                      className="h-5 w-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span>Parking Available</span>
                  </div>
                )}
              </div>
            </div>
          )}

        {/* Photo Gallery */}
        {restaurant.photos && restaurant.photos.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {restaurant.photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-w-16 aspect-h-12 overflow-hidden rounded-lg"
                >
                  <img
                    src={photo}
                    alt={`${restaurant.name} - Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Contact Info, Business Hours, Location */}
      <div className="space-y-6">
        {/* Contact Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="space-y-3">
            {restaurant.contactInfo?.phone && (
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
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
                <div>
                  <p className="text-gray-700">
                    {restaurant.contactInfo.phone}
                  </p>
                </div>
              </div>
            )}

            {restaurant.contactInfo?.email && (
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <a
                    href={`mailto:${restaurant.contactInfo.email}`}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    {restaurant.contactInfo.email}
                  </a>
                </div>
              </div>
            )}

            {restaurant.contactInfo?.website && (
              <div className="flex items-start">
                <svg
                  className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <div>
                  <a
                    href={restaurant.contactInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-800"
                  >
                    {restaurant.contactInfo.website.replace(/^https?:\/\//, "")}
                  </a>
                </div>
              </div>
            )}

            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
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
              <div>
                <p className="text-gray-700">{restaurant.location.address}</p>
                <p className="text-gray-700">
                  {restaurant.location.city}, {restaurant.location.state || ""}{" "}
                  {restaurant.location.zipCode || ""}
                </p>
                <p className="text-gray-700">{restaurant.location.country}</p>
              </div>
            </div>

            {/* Social Media */}
            {restaurant.contactInfo?.social &&
              Object.values(restaurant.contactInfo.social).some(
                (link) => link
              ) && (
                <div className="flex items-start pt-2">
                  <svg
                    className="h-5 w-5 text-gray-500 mr-3 mt-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  <div className="flex space-x-3">
                    {restaurant.contactInfo.social.facebook && (
                      <a
                        href={restaurant.contactInfo.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                        </svg>
                      </a>
                    )}

                    {restaurant.contactInfo.social.instagram && (
                      <a
                        href={restaurant.contactInfo.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-600 hover:text-pink-800"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                        </svg>
                      </a>
                    )}

                    {restaurant.contactInfo.social.twitter && (
                      <a
                        href={restaurant.contactInfo.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              )}
          </div>
        </div>
        {/* Business Hours */}
        {restaurant.businessHours &&
          Object.values(restaurant.businessHours).some(
            (day) => day.open || day.close
          ) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4">Business Hours</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-700">Monday</span>
                  <span className="text-gray-700">
                    {formatHours(restaurant.businessHours.monday)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Tuesday</span>
                  <span className="text-gray-700">
                    {formatHours(restaurant.businessHours.tuesday)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Wednesday</span>
                  <span className="text-gray-700">
                    {formatHours(restaurant.businessHours.wednesday)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Thursday</span>
                  <span className="text-gray-700">
                    {formatHours(restaurant.businessHours.thursday)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Friday</span>
                  <span className="text-gray-700">
                    {formatHours(restaurant.businessHours.friday)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Saturday</span>
                  <span className="text-gray-700">
                    {formatHours(restaurant.businessHours.saturday)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Sunday</span>
                  <span className="text-gray-700">
                    {formatHours(restaurant.businessHours.sunday)}
                  </span>
                </div>
              </div>
            </div>
          )}
        {/* Map */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Location</h2>
          <div className="h-64 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            <div className="text-center p-4">
              <p className="text-gray-600 mb-2">
                {restaurant.location.address}, {restaurant.location.city},{" "}
                {restaurant.location.country}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${restaurant.location.address}, ${restaurant.location.city}, ${restaurant.location.country}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-block px-4 py-2 mt-2"
              >
                View on Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantInfo;
