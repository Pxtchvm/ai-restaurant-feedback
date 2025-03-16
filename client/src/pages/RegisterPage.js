import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../contexts/AuthContext";

const RegisterPage = () => {
  const {
    register: registerUser,
    isAuthenticated,
    error,
    clearError,
  } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [role, setRole] = useState("user");

  // Setup form validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Handle form submission
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await registerUser({
        ...data,
        role,
      });
      // Auth context will handle redirect via useEffect above
    } catch (err) {
      // Error handling is done in the auth context
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
              Create a new account
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={`form-input ${
                      errors.firstName ? "border-red-500" : ""
                    }`}
                    placeholder="John"
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={`form-input ${
                      errors.lastName ? "border-red-500" : ""
                    }`}
                    placeholder="Doe"
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  className={`form-input ${
                    errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="you@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  className={`form-input ${
                    errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters",
                    },
                  })}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={`form-input ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                  placeholder="••••••••"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "The passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Type
                </label>
                <div className="mt-2 flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="role-user"
                      name="role"
                      type="radio"
                      className="h-4 w-4 text-primary-600 border-gray-300"
                      checked={role === "user"}
                      onChange={() => setRole("user")}
                    />
                    <label
                      htmlFor="role-user"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Diner
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="role-owner"
                      name="role"
                      type="radio"
                      className="h-4 w-4 text-primary-600 border-gray-300"
                      checked={role === "restaurant-owner"}
                      onChange={() => setRole("restaurant-owner")}
                    />
                    <label
                      htmlFor="role-owner"
                      className="ml-2 block text-sm text-gray-700"
                    >
                      Restaurant Owner
                    </label>
                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Restaurant owners can add and manage their restaurants and
                  respond to reviews.
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    id="terms"
                    type="checkbox"
                    className={`h-4 w-4 text-primary-600 border-gray-300 rounded ${
                      errors.terms ? "border-red-500" : ""
                    }`}
                    {...register("terms", {
                      required: "You must agree to the terms and conditions",
                    })}
                  />
                  <label
                    htmlFor="terms"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-primary-600 hover:text-primary-800"
                    >
                      terms and conditions
                    </Link>
                  </label>
                </div>
                {errors.terms && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.terms.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full btn-primary py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
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
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-800"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
