const mongoose = require("mongoose");

const RestaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
      maxlength: [100, "Name cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot be more than 1000 characters"],
    },
    location: {
      address: {
        type: String,
        required: [true, "Address is required"],
      },
      city: {
        type: String,
        required: [true, "City is required"],
      },
      state: String,
      country: {
        type: String,
        required: [true, "Country is required"],
        default: "Philippines",
      },
      zipCode: String,
      coordinates: {
        // GeoJSON Point
        type: {
          type: String,
          enum: ["Point"],
          default: "Point",
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          index: "2dsphere",
        },
      },
    },
    cuisine: {
      type: [String],
      required: [true, "At least one cuisine type is required"],
    },
    priceRange: {
      type: String,
      enum: ["₱", "₱₱", "₱₱₱", "₱₱₱₱"],
      required: [true, "Price range is required"],
    },
    contactInfo: {
      phone: String,
      email: String,
      website: String,
      social: {
        facebook: String,
        instagram: String,
        twitter: String,
      },
    },
    businessHours: {
      monday: { open: String, close: String },
      tuesday: { open: String, close: String },
      wednesday: { open: String, close: String },
      thursday: { open: String, close: String },
      friday: { open: String, close: String },
      saturday: { open: String, close: String },
      sunday: { open: String, close: String },
    },
    photos: [String],
    featuredImage: String,
    aggregateRating: {
      overall: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
      },
      categories: {
        food: { type: Number, min: 0, max: 5, default: 0 },
        service: { type: Number, min: 0, max: 5, default: 0 },
        ambiance: { type: Number, min: 0, max: 5, default: 0 },
        value: { type: Number, min: 0, max: 5, default: 0 },
      },
      reviewCount: {
        type: Number,
        default: 0,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    features: {
      hasDelivery: { type: Boolean, default: false },
      hasTakeout: { type: Boolean, default: false },
      hasOutdoorSeating: { type: Boolean, default: false },
      acceptsReservations: { type: Boolean, default: false },
      isWheelchairAccessible: { type: Boolean, default: false },
      hasParking: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Index for geospatial queries
RestaurantSchema.index({ "location.coordinates": "2dsphere" });

// Index for text search
RestaurantSchema.index({
  name: "text",
  description: "text",
  cuisine: "text",
});

// Virtual for reviews
RestaurantSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "restaurant",
  justOne: false,
});

/**
 * Calculate and update aggregate ratings
 * Called whenever reviews are added, updated or removed
 */
RestaurantSchema.methods.updateAggregateRating = async function () {
  const Review = mongoose.model("Review");

  const reviews = await Review.find({ restaurant: this._id });

  if (reviews.length === 0) {
    this.aggregateRating = {
      overall: 0,
      categories: {
        food: 0,
        service: 0,
        ambiance: 0,
        value: 0,
      },
      reviewCount: 0,
      lastUpdated: Date.now(),
    };

    await this.save();
    return;
  }

  // Calculate overall rating (average of all review ratings)
  const ratingSum = reviews.reduce((sum, review) => sum + review.rating, 0);
  const overallRating = parseFloat((ratingSum / reviews.length).toFixed(1));

  // Calculate category ratings from sentiment analysis
  const categories = ["food", "service", "ambiance", "value"];
  const categoryScores = {};

  categories.forEach((category) => {
    const categoryReviews = reviews.filter(
      (review) =>
        review.sentiment &&
        review.sentiment.categories &&
        review.sentiment.categories[category] !== undefined &&
        review.sentiment.categories[category] !== null
    );

    if (categoryReviews.length > 0) {
      // Convert sentiment (-1 to 1) to rating scale (0 to 5)
      // Formula: (sentiment + 1) * 2.5
      const sum = categoryReviews.reduce((sum, review) => {
        return sum + (review.sentiment.categories[category] + 1) * 2.5;
      }, 0);

      categoryScores[category] = parseFloat(
        (sum / categoryReviews.length).toFixed(1)
      );
    } else {
      categoryScores[category] = 0;
    }
  });

  // Update the aggregateRating field
  this.aggregateRating = {
    overall: overallRating,
    categories: categoryScores,
    reviewCount: reviews.length,
    lastUpdated: Date.now(),
  };

  await this.save();
};

module.exports = mongoose.model("Restaurant", RestaurantSchema);
