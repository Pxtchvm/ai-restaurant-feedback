const mongoose = require("mongoose");

/**
 * Connect to MongoDB database
 * Uses environment variables for configuration
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Mongoose 6+ no longer needs these options
      // useNewUrlParser and useUnifiedTopology are now default true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

/**
 * Disconnect from MongoDB database
 * Useful for testing and graceful shutdowns
 */
const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB Disconnected");
  } catch (error) {
    console.error(`Error disconnecting from MongoDB: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
