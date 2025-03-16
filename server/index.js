const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");
const { connectDB } = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");

// Load environment variables
require("dotenv").config();

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(morgan("dev")); // HTTP request logger

// Define routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/restaurants", require("./routes/restaurantRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/analysis", require("./routes/analysisRoutes"));

// Base route for API status
app.get("/api/status", (req, res) => {
  res.json({
    status: "online",
    message: "crAIvings API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV,
  });
});

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static(path.join(__dirname, "../client/build")));

  // Any route that is not an API route will be served the React app
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client/build/index.html"));
  });
}

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} in ${
      process.env.NODE_ENV || "development"
    } mode`
  );
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  // Don't exit the process in development
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
});

module.exports = app; // Export for testing
