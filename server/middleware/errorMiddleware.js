/**
 * Handle 404 errors for undefined routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Custom error handler
 * Provides standardized error responses
 */
const errorHandler = (err, req, res, next) => {
  // If res.statusCode is 200, change it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Set response status code
  res.status(statusCode);

  // Log error for debugging
  if (process.env.NODE_ENV !== "test") {
    console.error(`Error: ${err.message}`.red);
    console.error(err.stack);
  }

  // Structure the error response
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,

    // Include error details if available (helpful for validation errors)
    errors: err.errors || null,
  });
};

module.exports = { notFound, errorHandler };
