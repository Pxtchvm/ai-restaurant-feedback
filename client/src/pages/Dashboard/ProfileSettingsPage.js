import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useAuth } from "../../contexts/AuthContext";
import api from "../../utils/api";

const ProfileSettingsPage = () => {
  const { currentUser, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Profile form setup
  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      email: currentUser?.email || "",
    },
  });

  // Password form setup
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    watch: watchPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm();

  const newPassword = watchPassword("newPassword");

  // Handle profile update submission
  const onProfileSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await updateProfile(data);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      // Error is already handled in the auth context and shown via toast
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password update submission
  const onPasswordSubmit = async (data) => {
    setIsSubmitting(true);

    try {
      await api.put("/auth/updatepassword", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      resetPassword();
      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to update password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === "profile"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("profile")}
          >
            Profile Information
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm focus:outline-none ${
              activeTab === "password"
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("password")}
          >
            Password
          </button>
        </div>
      </div>

      {/* Profile Information Form */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Profile Information</h2>

          <form
            onSubmit={handleProfileSubmit(onProfileSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className={`form-input w-full ${
                    profileErrors.firstName ? "border-red-500" : ""
                  }`}
                  {...registerProfile("firstName", {
                    required: "First name is required",
                  })}
                />
                {profileErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">
                    {profileErrors.firstName.message}
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
                  className={`form-input w-full ${
                    profileErrors.lastName ? "border-red-500" : ""
                  }`}
                  {...registerProfile("lastName", {
                    required: "Last name is required",
                  })}
                />
                {profileErrors.lastName && (
                  <p className="mt-1 text-sm text-red-600">
                    {profileErrors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={`form-input w-full ${
                  profileErrors.email ? "border-red-500" : ""
                }`}
                {...registerProfile("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {profileErrors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {profileErrors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <div className="py-2 px-3 bg-gray-100 rounded-md text-gray-700">
                {currentUser?.role === "restaurant-owner"
                  ? "Restaurant Owner"
                  : currentUser?.role === "admin"
                  ? "Administrator"
                  : "Regular User"}
                <p className="text-xs text-gray-500 mt-1">
                  Account type cannot be changed after registration.
                </p>
              </div>
            </div>

            <div className="flex justify-end">
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
                  "Update Profile"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Password Form */}
      {activeTab === "password" && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Change Password</h2>

          <form
            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
            className="space-y-6"
          >
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Current Password
              </label>
              <input
                id="currentPassword"
                type="password"
                className={`form-input w-full ${
                  passwordErrors.currentPassword ? "border-red-500" : ""
                }`}
                {...registerPassword("currentPassword", {
                  required: "Current password is required",
                })}
              />
              {passwordErrors.currentPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordErrors.currentPassword.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                className={`form-input w-full ${
                  passwordErrors.newPassword ? "border-red-500" : ""
                }`}
                {...registerPassword("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
              />
              {passwordErrors.newPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordErrors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                className={`form-input w-full ${
                  passwordErrors.confirmPassword ? "border-red-500" : ""
                }`}
                {...registerPassword("confirmPassword", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === newPassword || "The passwords do not match",
                })}
              />
              {passwordErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
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
                  "Update Password"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProfileSettingsPage;
