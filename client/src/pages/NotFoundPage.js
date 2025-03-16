import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-primary-600">404</h1>
          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Page not found
          </h2>
          <p className="mt-3 text-lg text-gray-600">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
          <Link to="/" className="btn-primary py-2 px-6">
            Go back home
          </Link>
          <Link to="/restaurants" className="btn-secondary py-2 px-6">
            Browse restaurants
          </Link>
        </div>

        <div className="mt-16">
          <p className="text-sm text-gray-500">
            Lost your appetite? Try searching for restaurants instead.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
