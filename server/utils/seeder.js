const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");
const Review = require("../models/reviewModel");
const { analyzeSentiment } = require("../services/sentimentService");
const { connectDB, disconnectDB } = require("../config/db");

// Load environment variables
dotenv.config({ path: "../.env" });

// Sample data
const users = [
  {
    firstName: "Admin",
    lastName: "User",
    email: "admin@craivings.com",
    password: "password123",
    role: "admin",
  },
  {
    firstName: "Restaurant",
    lastName: "Owner",
    email: "owner@craivings.com",
    password: "password123",
    role: "restaurant-owner",
  },
  {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
  },
  {
    firstName: "Jane",
    lastName: "Smith",
    email: "jane@example.com",
    password: "password123",
    role: "user",
  },
  {
    firstName: "Mike",
    lastName: "Johnson",
    email: "mike@example.com",
    password: "password123",
    role: "user",
  },
];

const restaurants = [
  {
    name: "Flavor Haven",
    description:
      "A cozy restaurant serving fusion cuisine with a focus on local ingredients. Our chefs blend traditional Filipino flavors with international cooking techniques.",
    location: {
      address: "123 Culinary Ave",
      city: "Makati",
      country: "Philippines",
      coordinates: {
        type: "Point",
        coordinates: [121.0244, 14.5547], // [longitude, latitude]
      },
    },
    cuisine: ["Filipino", "Fusion", "Asian"],
    priceRange: "₱₱",
    contactInfo: {
      phone: "+63-2-1234-5678",
      email: "info@flavorhaven.com",
      website: "https://flavorhaven.example.com",
      social: {
        facebook: "https://facebook.com/flavorhaven",
        instagram: "https://instagram.com/flavorhaven",
      },
    },
    businessHours: {
      monday: { open: "11:00", close: "22:00" },
      tuesday: { open: "11:00", close: "22:00" },
      wednesday: { open: "11:00", close: "22:00" },
      thursday: { open: "11:00", close: "23:00" },
      friday: { open: "11:00", close: "23:00" },
      saturday: { open: "10:00", close: "23:00" },
      sunday: { open: "10:00", close: "22:00" },
    },
    featuredImage:
      "https://source.unsplash.com/random/800x400/?filipino,restaurant",
    photos: [
      "https://source.unsplash.com/random/800x600/?filipino,food,1",
      "https://source.unsplash.com/random/800x600/?filipino,food,2",
      "https://source.unsplash.com/random/800x600/?restaurant,interior",
    ],
    features: {
      hasDelivery: true,
      hasTakeout: true,
      hasOutdoorSeating: true,
      acceptsReservations: true,
      isWheelchairAccessible: true,
      hasParking: false,
    },
  },
  {
    name: "Bamboo Garden",
    description:
      "An authentic Chinese restaurant specializing in dim sum and traditional Cantonese dishes. Our recipes have been passed down through generations.",
    location: {
      address: "456 Oriental Blvd",
      city: "Makati",
      country: "Philippines",
      coordinates: {
        type: "Point",
        coordinates: [121.0314, 14.5597], // [longitude, latitude]
      },
    },
    cuisine: ["Chinese", "Cantonese", "Dim Sum"],
    priceRange: "₱₱",
    contactInfo: {
      phone: "+63-2-8765-4321",
      email: "contact@bamboogarden.com",
      website: "https://bamboogarden.example.com",
      social: {
        facebook: "https://facebook.com/bamboogarden",
        instagram: "https://instagram.com/bamboogarden",
      },
    },
    businessHours: {
      monday: { open: "10:00", close: "21:00" },
      tuesday: { open: "10:00", close: "21:00" },
      wednesday: { open: "10:00", close: "21:00" },
      thursday: { open: "10:00", close: "21:00" },
      friday: { open: "10:00", close: "22:00" },
      saturday: { open: "09:00", close: "22:00" },
      sunday: { open: "09:00", close: "21:00" },
    },
    featuredImage:
      "https://source.unsplash.com/random/800x400/?chinese,restaurant",
    photos: [
      "https://source.unsplash.com/random/800x600/?chinese,food,1",
      "https://source.unsplash.com/random/800x600/?chinese,food,2",
      "https://source.unsplash.com/random/800x600/?dim,sum",
    ],
    features: {
      hasDelivery: true,
      hasTakeout: true,
      hasOutdoorSeating: false,
      acceptsReservations: true,
      isWheelchairAccessible: true,
      hasParking: true,
    },
  },
  {
    name: "Italiano Delizioso",
    description:
      "Experience authentic Italian cuisine in the heart of the Philippines. Our pasta is made fresh daily, and our pizzas are baked in a traditional wood-fired oven.",
    location: {
      address: "789 Mediterranean St",
      city: "Quezon City",
      country: "Philippines",
      coordinates: {
        type: "Point",
        coordinates: [121.0389, 14.6372], // [longitude, latitude]
      },
    },
    cuisine: ["Italian", "Mediterranean", "Pizza"],
    priceRange: "₱₱₱",
    contactInfo: {
      phone: "+63-2-9876-5432",
      email: "reservations@italianodelizioso.com",
      website: "https://italianodelizioso.example.com",
      social: {
        facebook: "https://facebook.com/italianodelizioso",
        instagram: "https://instagram.com/italianodelizioso",
        twitter: "https://twitter.com/italianodelizioso",
      },
    },
    businessHours: {
      monday: { open: "12:00", close: "22:00" },
      tuesday: { open: "12:00", close: "22:00" },
      wednesday: { open: "12:00", close: "22:00" },
      thursday: { open: "12:00", close: "23:00" },
      friday: { open: "12:00", close: "23:00" },
      saturday: { open: "12:00", close: "23:00" },
      sunday: { open: "12:00", close: "22:00" },
    },
    featuredImage:
      "https://source.unsplash.com/random/800x400/?italian,restaurant",
    photos: [
      "https://source.unsplash.com/random/800x600/?italian,food,1",
      "https://source.unsplash.com/random/800x600/?pasta",
      "https://source.unsplash.com/random/800x600/?pizza",
    ],
    features: {
      hasDelivery: true,
      hasTakeout: true,
      hasOutdoorSeating: true,
      acceptsReservations: true,
      isWheelchairAccessible: true,
      hasParking: true,
    },
  },
];

// Sample reviews data - will add restaurant and user IDs programmatically
const reviewTemplates = [
  // Positive reviews
  {
    rating: 5,
    text: "The food was absolutely delicious! The service was prompt and friendly. I love the cozy atmosphere of this place. Prices were reasonable for the quality of food.",
  },
  {
    rating: 4,
    text: "Great food and excellent service. The ambiance is nice but it can get a bit noisy during peak hours. The prices are a bit on the higher side but worth it for the quality.",
  },
  {
    rating: 5,
    text: "One of the best dining experiences I've had. The chef is clearly passionate about the food, and it shows in every dish. The staff was attentive without being intrusive. Highly recommend!",
  },

  // Mixed reviews
  {
    rating: 3,
    text: "Decent food but nothing special. The service was okay, but the wait time was longer than expected. Ambiance is nice, but the prices are a bit high for what you get.",
  },
  {
    rating: 3,
    text: "Average experience overall. The food was good but not outstanding. Service was inconsistent - some staff were great, others seemed disinterested. Probably won't rush back but wouldn't rule out a return visit.",
  },

  // Negative reviews
  {
    rating: 2,
    text: "Disappointed with my experience. The food was served cold and lacked flavor. Service was slow and the waiter seemed annoyed when we asked for recommendations. Too expensive for the quality offered.",
  },
  {
    rating: 1,
    text: "Terrible experience from start to finish. We waited 45 minutes for a table despite having a reservation. The food was bland and overpriced. The staff was rude and inattentive. Will not be returning.",
  },
];

// Import data function
const importData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clean existing data
    await User.deleteMany();
    await Restaurant.deleteMany();
    await Review.deleteMany();

    console.log("Database cleaned");

    // Create users with hashed passwords
    const createdUsers = [];
    for (const user of users) {
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(user.password, salt);

      // Create user with hashed password
      const newUser = await User.create({
        ...user,
        password: hashedPassword,
      });

      createdUsers.push(newUser);
    }

    console.log(`${createdUsers.length} users created`);

    // Create restaurants and assign to restaurant owner
    const restaurantOwner = createdUsers.find(
      (user) => user.role === "restaurant-owner"
    );
    const createdRestaurants = [];

    for (const restaurant of restaurants) {
      const newRestaurant = await Restaurant.create({
        ...restaurant,
        owner: restaurantOwner._id,
      });

      createdRestaurants.push(newRestaurant);
    }

    console.log(`${createdRestaurants.length} restaurants created`);

    // Create reviews
    const regularUsers = createdUsers.filter((user) => user.role === "user");
    let reviewCount = 0;

    for (const restaurant of createdRestaurants) {
      // Each user leaves a review for each restaurant
      for (const user of regularUsers) {
        // Select random review template
        const reviewTemplate =
          reviewTemplates[Math.floor(Math.random() * reviewTemplates.length)];

        // Create review data
        const reviewData = {
          restaurant: restaurant._id,
          user: user._id,
          rating: reviewTemplate.rating,
          text: reviewTemplate.text,
          reviewDate: new Date(),
          visibility: "public",
        };

        // Perform sentiment analysis
        reviewData.sentiment = analyzeSentiment(reviewTemplate.text);

        // Create review
        await Review.create(reviewData);
        reviewCount++;
      }

      // Update restaurant aggregate rating
      await restaurant.updateAggregateRating();
    }

    console.log(`${reviewCount} reviews created`);
    console.log("Sample data imported successfully!");

    // Disconnect from database
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    await disconnectDB();
    process.exit(1);
  }
};

// Delete data function
const deleteData = async () => {
  try {
    // Connect to database
    await connectDB();

    // Clean data
    await User.deleteMany();
    await Restaurant.deleteMany();
    await Review.deleteMany();

    console.log("All data deleted successfully!");

    // Disconnect from database
    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error(`Error deleting data: ${error.message}`);
    await disconnectDB();
    process.exit(1);
  }
};

// Process command line arguments
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
} else {
  console.log("Please use correct command:");
  console.log("  npm run seed -- -i  (to import data)");
  console.log("  npm run seed -- -d  (to delete data)");
  process.exit(1);
}
