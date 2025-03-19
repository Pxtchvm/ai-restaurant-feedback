const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Restaurant = require("../models/restaurantModel");
const Review = require("../models/reviewModel");
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
  {
    firstName: "Jose",
    lastName: "Rizal",
    email: "joserizal@example.com",
    password: "password123",
    role: "user",
  },
  {
    firstName: "Maria",
    lastName: "Santos",
    email: "maria@example.com",
    password: "password123",
    role: "user",
  },
  {
    firstName: "Juan",
    lastName: "Dela Cruz",
    email: "juan@example.com",
    password: "password123",
    role: "user",
  },
  {
    firstName: "Ana",
    lastName: "Reyes",
    email: "ana@example.com",
    password: "password123",
    role: "user",
  },
  {
    firstName: "Carlos",
    lastName: "Garcia",
    email: "carlos@example.com",
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
    featuredImage: "https://i.imgur.com/EhNcCL2.png",
    photos: [
      "https://i.imgur.com/sUehjaK.png",
      "https://i.imgur.com/MkgOfBI.png",
      "https://i.imgur.com/c0dx6V2.png",
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
    featuredImage: "https://i.imgur.com/6Phas1V.png",
    photos: [
      "https://i.imgur.com/4OdyqYI.png",
      "https://i.imgur.com/o7FnQTI.png",
      "https://i.imgur.com/UM0SLgq.png",
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
    featuredImage: "https://i.imgur.com/vPDRmU0.png",
    photos: [
      "https://i.imgur.com/qCs8JCG.png",
      "https://i.imgur.com/zYoWEpJ.png",
      "https://i.imgur.com/kxCNoLI.png",
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
    expectedSentiment: {
      overall: 0.8,
      intensity: "strong",
      categories: {
        food: 0.9,
        service: 0.8,
        ambiance: 0.7,
        value: 0.6,
      },
      keywords: [
        "delicious",
        "prompt",
        "friendly",
        "cozy",
        "reasonable",
        "quality",
      ],
      sentimentPhrases: [
        {
          text: "The food was absolutely delicious!",
          sentiment: "positive",
          score: 0.9,
        },
        {
          text: "The service was prompt and friendly.",
          sentiment: "positive",
          score: 0.8,
        },
        {
          text: "I love the cozy atmosphere of this place.",
          sentiment: "positive",
          score: 0.7,
        },
        {
          text: "Prices were reasonable for the quality of food.",
          sentiment: "positive",
          score: 0.6,
        },
      ],
    },
  },
  {
    rating: 4,
    text: "Great food and excellent service. The ambiance is nice but it can get a bit noisy during peak hours. The prices are a bit on the higher side but worth it for the quality.",
    expectedSentiment: {
      overall: 0.5,
      intensity: "moderate",
      categories: {
        food: 0.8,
        service: 0.9,
        ambiance: 0.3,
        value: 0.1,
      },
      keywords: [
        "great",
        "excellent",
        "nice",
        "noisy",
        "higher",
        "worth",
        "quality",
      ],
      sentimentPhrases: [
        {
          text: "Great food and excellent service.",
          sentiment: "positive",
          score: 0.9,
        },
        {
          text: "The ambiance is nice but it can get a bit noisy during peak hours.",
          sentiment: "neutral",
          score: 0.3,
        },
        {
          text: "The prices are a bit on the higher side but worth it for the quality.",
          sentiment: "neutral",
          score: 0.1,
        },
      ],
    },
  },
  {
    rating: 5,
    text: "One of the best dining experiences I've had. The chef is clearly passionate about the food, and it shows in every dish. The staff was attentive without being intrusive. Highly recommend!",
    expectedSentiment: {
      overall: 0.9,
      intensity: "strong",
      categories: {
        food: 0.9,
        service: 0.8,
        ambiance: 0.7,
        value: null,
      },
      keywords: [
        "best",
        "dining",
        "experiences",
        "passionate",
        "attentive",
        "recommend",
      ],
      sentimentPhrases: [
        {
          text: "One of the best dining experiences I've had.",
          sentiment: "positive",
          score: 0.9,
        },
        {
          text: "The chef is clearly passionate about the food, and it shows in every dish.",
          sentiment: "positive",
          score: 0.9,
        },
        {
          text: "The staff was attentive without being intrusive.",
          sentiment: "positive",
          score: 0.8,
        },
        { text: "Highly recommend!", sentiment: "positive", score: 0.9 },
      ],
    },
  },
  {
    rating: 5,
    text: "Absolutely phenomenal! The adobo was tender, the sinigang perfectly tangy, and the desserts had just the right sweetness. A true taste of home!",
    expectedSentiment: {
      overall: 0.9,
      intensity: "strong",
      categories: {
        food: 0.95,
        service: null,
        ambiance: null,
        value: null,
      },
      keywords: ["phenomenal", "tender", "tangy", "sweetness", "taste", "home"],
      sentimentPhrases: [
        { text: "Absolutely phenomenal!", sentiment: "positive", score: 0.95 },
        {
          text: "The adobo was tender, the sinigang perfectly tangy, and the desserts had just the right sweetness.",
          sentiment: "positive",
          score: 0.9,
        },
        { text: "A true taste of home!", sentiment: "positive", score: 0.85 },
      ],
    },
  },
  {
    rating: 5,
    text: "I couldn't stop smiling after this meal. Every dish burst with flavor and the traditional Filipino touches made it extra special. A must-try for any food lover!",
    expectedSentiment: {
      overall: 0.85,
      intensity: "strong",
      categories: {
        food: 0.9,
        service: null,
        ambiance: 0.6,
        value: null,
      },
      keywords: [
        "smiling",
        "flavor",
        "traditional",
        "Filipino",
        "special",
        "must-try",
      ],
      sentimentPhrases: [
        {
          text: "I couldn't stop smiling after this meal.",
          sentiment: "positive",
          score: 0.85,
        },
        {
          text: "Every dish burst with flavor and the traditional Filipino touches made it extra special.",
          sentiment: "positive",
          score: 0.9,
        },
        {
          text: "A must-try for any food lover!",
          sentiment: "positive",
          score: 0.85,
        },
      ],
    },
  },

  // Mixed reviews
  {
    rating: 3,
    text: "Decent food but nothing special. The service was okay, but the wait time was longer than expected. Ambiance is nice, but the prices are a bit high for what you get.",
    expectedSentiment: {
      overall: -0.1,
      intensity: "mild",
      categories: {
        food: 0.2,
        service: -0.3,
        ambiance: 0.4,
        value: -0.4,
      },
      keywords: [
        "decent",
        "nothing special",
        "okay",
        "wait time",
        "longer",
        "nice",
        "high",
      ],
      sentimentPhrases: [
        {
          text: "Decent food but nothing special.",
          sentiment: "neutral",
          score: 0.2,
        },
        {
          text: "The service was okay, but the wait time was longer than expected.",
          sentiment: "negative",
          score: -0.3,
        },
        {
          text: "Ambiance is nice, but the prices are a bit high for what you get.",
          sentiment: "negative",
          score: -0.4,
        },
      ],
    },
  },
  {
    rating: 3,
    text: "Average experience overall. The food was good but not outstanding. Service was inconsistent - some staff were great, others seemed disinterested. Probably won't rush back but wouldn't rule out a return visit.",
    expectedSentiment: {
      overall: 0.0,
      intensity: "neutral",
      categories: {
        food: 0.3,
        service: -0.2,
        ambiance: null,
        value: null,
      },
      keywords: [
        "average",
        "good",
        "not outstanding",
        "inconsistent",
        "great",
        "disinterested",
      ],
      sentimentPhrases: [
        {
          text: "Average experience overall.",
          sentiment: "neutral",
          score: 0.0,
        },
        {
          text: "The food was good but not outstanding.",
          sentiment: "neutral",
          score: 0.3,
        },
        {
          text: "Service was inconsistent - some staff were great, others seemed disinterested.",
          sentiment: "negative",
          score: -0.2,
        },
        {
          text: "Probably won't rush back but wouldn't rule out a return visit.",
          sentiment: "neutral",
          score: 0.0,
        },
      ],
    },
  },
  {
    rating: 3,
    text: "The meal was acceptable, yet it felt like it was missing a spark. The flavors were somewhat diluted and the presentation could have been more refined. A middle-of-the-road experience.",
    expectedSentiment: {
      overall: -0.1,
      intensity: "mild",
      categories: {
        food: -0.2,
        service: null,
        ambiance: null,
        value: null,
      },
      keywords: [
        "acceptable",
        "missing",
        "spark",
        "diluted",
        "presentation",
        "middle-of-the-road",
      ],
      sentimentPhrases: [
        {
          text: "The meal was acceptable, yet it felt like it was missing a spark.",
          sentiment: "neutral",
          score: -0.1,
        },
        {
          text: "The flavors were somewhat diluted and the presentation could have been more refined.",
          sentiment: "negative",
          score: -0.2,
        },
        {
          text: "A middle-of-the-road experience.",
          sentiment: "neutral",
          score: 0.0,
        },
      ],
    },
  },

  // Negative reviews
  {
    rating: 2,
    text: "Disappointed with my experience. The food was served cold and lacked flavor. Service was slow and the waiter seemed annoyed when we asked for recommendations. Too expensive for the quality offered.",
    expectedSentiment: {
      overall: -0.7,
      intensity: "strong",
      categories: {
        food: -0.7,
        service: -0.8,
        ambiance: null,
        value: -0.8,
      },
      keywords: [
        "disappointed",
        "cold",
        "lacked flavor",
        "slow",
        "annoyed",
        "expensive",
      ],
      sentimentPhrases: [
        {
          text: "Disappointed with my experience.",
          sentiment: "negative",
          score: -0.6,
        },
        {
          text: "The food was served cold and lacked flavor.",
          sentiment: "negative",
          score: -0.7,
        },
        {
          text: "Service was slow and the waiter seemed annoyed when we asked for recommendations.",
          sentiment: "negative",
          score: -0.8,
        },
        {
          text: "Too expensive for the quality offered.",
          sentiment: "negative",
          score: -0.8,
        },
      ],
    },
  },
  {
    rating: 1,
    text: "Terrible experience from start to finish. We waited 45 minutes for a table despite having a reservation. The food was bland and overpriced. The staff was rude and inattentive. Will not be returning.",
    expectedSentiment: {
      overall: -0.9,
      intensity: "strong",
      categories: {
        food: -0.7,
        service: -0.9,
        ambiance: -0.6,
        value: -0.8,
      },
      keywords: [
        "terrible",
        "waited",
        "bland",
        "overpriced",
        "rude",
        "inattentive",
      ],
      sentimentPhrases: [
        {
          text: "Terrible experience from start to finish.",
          sentiment: "negative",
          score: -0.9,
        },
        {
          text: "We waited 45 minutes for a table despite having a reservation.",
          sentiment: "negative",
          score: -0.8,
        },
        {
          text: "The food was bland and overpriced.",
          sentiment: "negative",
          score: -0.7,
        },
        {
          text: "The staff was rude and inattentive.",
          sentiment: "negative",
          score: -0.9,
        },
        { text: "Will not be returning.", sentiment: "negative", score: -0.8 },
      ],
    },
  },
  {
    rating: 1,
    text: "I was really looking forward to authentic Filipino cuisine, but this was a letdown. The dishes were poorly executed, and the balance of flavors was completely off.",
    expectedSentiment: {
      overall: -0.8,
      intensity: "strong",
      categories: {
        food: -0.9,
        service: null,
        ambiance: null,
        value: null,
      },
      keywords: ["letdown", "poorly executed", "balance", "flavors", "off"],
      sentimentPhrases: [
        {
          text: "I was really looking forward to authentic Filipino cuisine, but this was a letdown.",
          sentiment: "negative",
          score: -0.7,
        },
        {
          text: "The dishes were poorly executed, and the balance of flavors was completely off.",
          sentiment: "negative",
          score: -0.9,
        },
      ],
    },
  },
  {
    rating: 2,
    text: "The atmosphere was inviting, but the food missed the mark. My favorite dish arrived lukewarm and tasted generic. The overall experience was underwhelming.",
    expectedSentiment: {
      overall: -0.5,
      intensity: "moderate",
      categories: {
        food: -0.7,
        service: -0.4,
        ambiance: 0.4,
        value: null,
      },
      keywords: [
        "inviting",
        "missed",
        "mark",
        "lukewarm",
        "generic",
        "underwhelming",
      ],
      sentimentPhrases: [
        {
          text: "The atmosphere was inviting, but the food missed the mark.",
          sentiment: "mixed",
          score: -0.2,
        },
        {
          text: "My favorite dish arrived lukewarm and tasted generic.",
          sentiment: "negative",
          score: -0.7,
        },
        {
          text: "The overall experience was underwhelming.",
          sentiment: "negative",
          score: -0.6,
        },
      ],
    },
  },
];

/**
 * Custom sentiment analysis for seeding purposes
 * This simulates what the OpenAI service would return but without requiring an API call
 * @param {string} text - Review text
 * @returns {Object} Sentiment analysis object matching OpenAI service format
 */
const seedSentimentAnalysis = async (text) => {
  // Find the template that matches this text
  const matchingTemplate = reviewTemplates.find(
    (template) => template.text === text
  );

  if (matchingTemplate && matchingTemplate.expectedSentiment) {
    // Return the pre-defined sentiment for this review
    return matchingTemplate.expectedSentiment;
  }

  // Fallback for any reviews that don't have pre-defined sentiment analysis
  // Determine sentiment based on rating (this is simplified - real analysis would be more complex)
  const matchingRating =
    reviewTemplates.find((template) => template.text === text)?.rating || 3;

  let overallScore;
  if (matchingRating >= 4) {
    overallScore = 0.7; // Positive
  } else if (matchingRating <= 2) {
    overallScore = -0.7; // Negative
  } else {
    overallScore = 0.0; // Neutral
  }

  return {
    overall: overallScore,
    intensity:
      matchingRating >= 4 ? "strong" : matchingRating <= 2 ? "strong" : "mild",
    categories: {
      food: matchingRating >= 4 ? 0.7 : matchingRating <= 2 ? -0.7 : 0.0,
      service: matchingRating >= 4 ? 0.7 : matchingRating <= 2 ? -0.7 : 0.0,
      ambiance: matchingRating >= 4 ? 0.6 : matchingRating <= 2 ? -0.6 : 0.0,
      value: matchingRating >= 4 ? 0.6 : matchingRating <= 2 ? -0.6 : 0.0,
    },
    keywords: text
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 4)
      .slice(0, 10),
    sentimentPhrases: [
      {
        text: text.split(".")[0] + ".",
        sentiment:
          matchingRating >= 4
            ? "positive"
            : matchingRating <= 2
            ? "negative"
            : "neutral",
        score: overallScore,
      },
    ],
  };
};

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
      // Create user with hashed password
      const newUser = await User.create({
        ...user,
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

    // Process reviews for each restaurant sequentially
    for (const restaurant of createdRestaurants) {
      console.log(`Creating reviews for ${restaurant.name}...`);

      // For each user, create a review for the restaurant
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

        try {
          // Use our local sentiment analysis function for seeding
          reviewData.sentiment = await seedSentimentAnalysis(
            reviewTemplate.text
          );

          // Create review
          await Review.create(reviewData);
          reviewCount++;
        } catch (err) {
          console.error(`Error creating review: ${err.message}`);
        }
      }

      // Update restaurant aggregate rating
      await restaurant.updateAggregateRating();
      console.log(`Reviews and ratings updated for: ${restaurant.name}`);
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
