import React from "react";
import { Routes, Route } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

// Layout components
import MainLayout from "./components/layouts/MainLayout";
import DashboardLayout from "./components/layouts/DashboardLayout";

// Public pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import RestaurantsPage from "./pages/RestaurantsPage";
import RestaurantDetailPage from "./pages/RestaurantDetailPage";
import AllReviewsPage from "./pages/AllReviewsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import NotFoundPage from "./pages/NotFoundPage";

// Auth pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

// Dashboard pages
import DashboardHomePage from "./pages/Dashboard/DashboardHomePage";
import MyReviewsPage from "./pages/Dashboard/MyReviewsPage";
import MyRestaurantsPage from "./pages/Dashboard/MyRestaurantsPage";
import ProfileSettingsPage from "./pages/Dashboard/ProfileSettingsPage";
import AddRestaurantPage from "./pages/Dashboard/AddRestaurantPage";
import EditRestaurantPage from "./pages/Dashboard/EditRestaurantPage";
import RestaurantAnalyticsPage from "./pages/Dashboard/RestaurantAnalyticsPage";

// Guards
import PrivateRoute from "./components/auth/PrivateRoute";
import RoleRoute from "./components/auth/RoleRoute";

function App() {
  const { loading } = useAuth();

  if (loading) {
    // You could add a nice loading spinner here
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public routes with MainLayout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="restaurants" element={<RestaurantsPage />} />
        <Route path="restaurants/:id" element={<RestaurantDetailPage />} />
        <Route path="reviews" element={<AllReviewsPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Protected dashboard routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<DashboardHomePage />} />
        <Route path="reviews" element={<MyReviewsPage />} />
        <Route path="profile" element={<ProfileSettingsPage />} />

        {/* Restaurant owner only routes */}
        <Route
          path="my-restaurants"
          element={
            <RoleRoute roles={["restaurant-owner", "admin"]}>
              <MyRestaurantsPage />
            </RoleRoute>
          }
        />
        <Route
          path="add-restaurant"
          element={
            <RoleRoute roles={["restaurant-owner", "admin"]}>
              <AddRestaurantPage />
            </RoleRoute>
          }
        />
        <Route
          path="edit-restaurant/:id"
          element={
            <RoleRoute roles={["restaurant-owner", "admin"]}>
              <EditRestaurantPage />
            </RoleRoute>
          }
        />
        <Route
          path="restaurant/:id/analytics"
          element={
            <RoleRoute roles={["restaurant-owner", "admin"]}>
              <RestaurantAnalyticsPage />
            </RoleRoute>
          }
        />
      </Route>

      {/* 404 page for unmatched routes */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
