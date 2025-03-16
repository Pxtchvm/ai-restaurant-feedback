const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Restaurant ID is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: [true, "Review text is required"],
      trim: true,
      minlength: [10, "Review must be at least 10 characters"],
    },
    reviewDate: {
      type: Date,
      default: Date.now,
    },
    sentiment: {
      overall: {
        type: Number,
        min: -1,
        max: 1,
      },
      intensity: {
        type: String,
        enum: ["mild", "moderate", "strong", "neutral"],
        default: "neutral",
      },
      categories: {
        food: { type: Number, min: -1, max: 1, default: 0 },
        service: { type: Number, min: -1, max: 1, default: 0 },
        ambiance: { type: Number, min: -1, max: 1, default: 0 },
        value: { type: Number, min: -1, max: 1, default: 0 },
      },
      keywords: [String],
      sentimentPhrases: [
        {
          text: String,
          sentiment: String,
          score: Number,
        },
      ],
    },
    response: {
      text: String,
      date: Date,
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    visibility: {
      type: String,
      enum: ["public", "private", "deleted"],
      default: "public",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Ensure one review per user per restaurant
ReviewSchema.index({ restaurant: 1, user: 1 }, { unique: true });

// Index for efficient querying
ReviewSchema.index({ restaurant: 1, reviewDate: -1 });
ReviewSchema.index({ user: 1, reviewDate: -1 });

// Automatically populate user and restaurant data when queried
ReviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "firstName lastName profileImage",
  });
  next();
});

module.exports = mongoose.model("Review", ReviewSchema);
