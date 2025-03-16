const asyncHandler = require("express-async-handler");
const Restaurant = require("../models/restaurantModel");
const Review = require("../models/reviewModel");

/**
 * @desc    Get restaurant sentiment analysis
 * @route   GET /api/analysis/restaurant/:id/sentiment
 * @access  Public
 */
const getRestaurantSentiment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { period = "6months" } = req.query;

  // Verify restaurant exists
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    res.status(404);
    throw new Error(`Restaurant not found with id ${id}`);
  }

  // Calculate date range based on period parameter
  const endDate = new Date();
  let startDate = new Date();

  switch (period) {
    case "30days":
      startDate.setDate(startDate.getDate() - 30);
      break;
    case "90days":
      startDate.setDate(startDate.getDate() - 90);
      break;
    case "6months":
      startDate.setMonth(startDate.getMonth() - 6);
      break;
    case "1year":
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    case "all":
      startDate = new Date(0); // Beginning of time
      break;
    default:
      startDate.setMonth(startDate.getMonth() - 6); // Default to 6 months
  }

  // Get processed reviews for the given time period
  const reviews = await Review.find({
    restaurant: id,
    reviewDate: { $gte: startDate, $lte: endDate },
    visibility: "public",
  });

  // Create default response for no reviews case
  if (reviews.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        total: 0,
        periodLabel: getPeriodLabel(period),
        overallSentiment: 0,
        categories: {
          food: null,
          service: null,
          ambiance: null,
          value: null,
        },
        sentimentDistribution: {
          positive: 0,
          neutral: 0,
          negative: 0,
        },
        ratingDistribution: {
          5: 0,
          4: 0,
          3: 0,
          2: 0,
          1: 0,
        },
        keywords: [],
        sentimentPhrases: [],
        trends: [],
      },
    });
  }

  // Calculate overall sentiment average
  const overallSentiment = calculateOverallSentiment(reviews);

  // Calculate category sentiment averages
  const categorySentiment = calculateCategorySentiment(reviews);

  // Calculate sentiment distribution
  const sentimentDistribution = calculateSentimentDistribution(reviews);

  // Calculate rating distribution
  const ratingDistribution = calculateRatingDistribution(reviews);

  // Extract top keywords
  const keywords = extractTopKeywords(reviews);

  // Extract representative sentiment phrases
  const sentimentPhrases = extractSentimentPhrases(reviews);

  // Calculate trends over time
  const trends = calculateTrends(reviews);

  // Prepare response data
  const analysisData = {
    total: reviews.length,
    periodLabel: getPeriodLabel(period),
    overallSentiment,
    categories: categorySentiment,
    sentimentDistribution,
    ratingDistribution,
    keywords,
    sentimentPhrases,
    trends,
  };

  res.status(200).json({
    success: true,
    data: analysisData,
  });
});

/**
 * @desc    Compare multiple restaurants
 * @route   GET /api/analysis/restaurants/compare
 * @access  Public
 */
const compareRestaurants = asyncHandler(async (req, res) => {
  const { ids, category = "overall" } = req.query;

  if (!ids) {
    res.status(400);
    throw new Error("Restaurant IDs are required for comparison");
  }

  // Split comma-separated restaurant IDs
  const restaurantIds = ids.split(",");

  // Validate number of restaurants
  if (restaurantIds.length < 2 || restaurantIds.length > 5) {
    res.status(400);
    throw new Error("Please provide between 2 and 5 restaurants to compare");
  }

  // Get restaurant details
  const restaurants = await Restaurant.find({
    _id: { $in: restaurantIds },
    isActive: true,
  }).select("name cuisine priceRange aggregateRating location");

  // Check if all restaurants were found
  if (restaurants.length !== restaurantIds.length) {
    res.status(404);
    throw new Error("One or more restaurants not found");
  }

  // Prepare comparison data
  const comparisonData = restaurants.map((restaurant) => {
    let score;

    if (category === "overall") {
      score = restaurant.aggregateRating.overall;
    } else if (["food", "service", "ambiance", "value"].includes(category)) {
      score = restaurant.aggregateRating.categories[category] || 0;
    } else {
      score = restaurant.aggregateRating.overall;
    }

    return {
      id: restaurant._id,
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      priceRange: restaurant.priceRange,
      location: restaurant.location.city,
      score: parseFloat(score.toFixed(1)),
      reviewCount: restaurant.aggregateRating.reviewCount,
    };
  });

  // Sort by score in descending order
  comparisonData.sort((a, b) => b.score - a.score);

  res.status(200).json({
    success: true,
    category,
    data: comparisonData,
  });
});

/**
 * @desc    Get suggested improvements based on negative reviews
 * @route   GET /api/analysis/restaurant/:id/improvements
 * @access  Private (restaurant-owner, admin)
 */
const getSuggestedImprovements = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Verify restaurant exists and is owned by the user
  const restaurant = await Restaurant.findById(id);
  if (!restaurant) {
    res.status(404);
    throw new Error(`Restaurant not found with id ${id}`);
  }

  // Check ownership (only owner or admin can access)
  if (
    restaurant.owner.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    res.status(403);
    throw new Error("Not authorized to access improvement suggestions");
  }

  // Get negative reviews from last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const negativeReviews = await Review.find({
    restaurant: id,
    rating: { $lte: 3 },
    "sentiment.overall": { $lt: 0 },
    reviewDate: { $gte: sixMonthsAgo },
    visibility: "public",
  }).sort("-reviewDate");

  if (negativeReviews.length === 0) {
    return res.status(200).json({
      success: true,
      data: {
        improvementAreas: [],
        suggestionsByCategory: {},
        reviewCount: 0,
        reviewExamples: [],
      },
    });
  }

  // Identify problem areas by category
  const categories = ["food", "service", "ambiance", "value"];
  const categoryCounts = {};
  const categoryIssues = {};

  categories.forEach((category) => {
    categoryCounts[category] = 0;
    categoryIssues[category] = [];
  });

  // Count issues by category
  negativeReviews.forEach((review) => {
    if (!review.sentiment || !review.sentiment.categories) return;

    categories.forEach((category) => {
      if (review.sentiment.categories[category] < -0.2) {
        categoryCounts[category]++;

        // Extract keywords for this category
        if (review.sentiment.keywords && review.sentiment.keywords.length > 0) {
          categoryIssues[category].push(...review.sentiment.keywords);
        }
      }
    });
  });

  // Format problem areas
  const improvementAreas = categories
    .map((category) => ({
      category,
      count: categoryCounts[category],
      percentage: parseFloat(
        ((categoryCounts[category] / negativeReviews.length) * 100).toFixed(1)
      ),
    }))
    .filter((area) => area.count > 0)
    .sort((a, b) => b.count - a.count);

  // Get common issues by category
  const commonIssues = {};

  categories.forEach((category) => {
    if (categoryIssues[category].length === 0) return;

    // Count issues
    const issueCounts = {};
    categoryIssues[category].forEach((issue) => {
      issueCounts[issue] = (issueCounts[issue] || 0) + 1;
    });

    // Get top issues
    commonIssues[category] = Object.entries(issueCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([issue, count]) => ({
        issue,
        count,
        percentage: parseFloat(
          ((count / categoryIssues[category].length) * 100).toFixed(1)
        ),
      }));
  });

  // Generate improvement suggestions
  const suggestionsByCategory = generateSuggestionsByCategory(
    improvementAreas,
    commonIssues
  );

  // Get example negative reviews for each category
  const reviewExamples = {};

  improvementAreas.forEach((area) => {
    const category = area.category;

    // Find reviews with strong negative sentiment in this category
    const examples = negativeReviews
      .filter(
        (review) =>
          review.sentiment &&
          review.sentiment.categories &&
          review.sentiment.categories[category] < -0.3
      )
      .slice(0, 2)
      .map((review) => ({
        id: review._id,
        text: review.text,
        rating: review.rating,
        date: review.reviewDate,
        sentiment: review.sentiment.categories[category],
      }));

    if (examples.length > 0) {
      reviewExamples[category] = examples;
    }
  });

  // Return suggestions
  res.status(200).json({
    success: true,
    data: {
      improvementAreas,
      commonIssues,
      suggestionsByCategory,
      reviewCount: negativeReviews.length,
      reviewExamples,
    },
  });
});

// Helper functions

/**
 * Get human-readable period label
 * @param {string} period - Period identifier
 * @returns {string} Human-readable period label
 */
function getPeriodLabel(period) {
  switch (period) {
    case "30days":
      return "Last 30 days";
    case "90days":
      return "Last 90 days";
    case "6months":
      return "Last 6 months";
    case "1year":
      return "Last year";
    case "all":
      return "All time";
    default:
      return "Last 6 months";
  }
}

/**
 * Calculate overall sentiment average
 * @param {Array} reviews - Array of reviews
 * @returns {number} Overall sentiment average
 */
function calculateOverallSentiment(reviews) {
  const sum = reviews.reduce((total, review) => {
    return total + (review.sentiment?.overall || 0);
  }, 0);

  return parseFloat((sum / reviews.length).toFixed(2));
}

/**
 * Calculate category sentiment averages
 * @param {Array} reviews - Array of reviews
 * @returns {Object} Category sentiment averages
 */
function calculateCategorySentiment(reviews) {
  const categories = ["food", "service", "ambiance", "value"];
  const result = {};
  const categoryCounts = {};

  // Initialize counters
  categories.forEach((category) => {
    result[category] = 0;
    categoryCounts[category] = 0;
  });

  // Sum up sentiment scores by category
  reviews.forEach((review) => {
    if (!review.sentiment || !review.sentiment.categories) return;

    categories.forEach((category) => {
      const score = review.sentiment.categories[category];
      if (score !== null && score !== undefined) {
        result[category] += score;
        categoryCounts[category]++;
      }
    });
  });

  // Calculate averages
  categories.forEach((category) => {
    if (categoryCounts[category] > 0) {
      result[category] = parseFloat(
        (result[category] / categoryCounts[category]).toFixed(2)
      );
    } else {
      result[category] = null; // No data for this category
    }
  });

  return result;
}

/**
 * Calculate sentiment distribution percentages
 * @param {Array} reviews - Array of reviews
 * @returns {Object} Sentiment distribution
 */
function calculateSentimentDistribution(reviews) {
  const distribution = {
    positive: 0,
    neutral: 0,
    negative: 0,
  };

  reviews.forEach((review) => {
    const sentiment = review.sentiment?.overall || 0;

    if (sentiment > 0.2) {
      distribution.positive++;
    } else if (sentiment < -0.2) {
      distribution.negative++;
    } else {
      distribution.neutral++;
    }
  });

  // Convert to percentages
  const total = reviews.length;
  return {
    positive: parseFloat(((distribution.positive / total) * 100).toFixed(1)),
    neutral: parseFloat(((distribution.neutral / total) * 100).toFixed(1)),
    negative: parseFloat(((distribution.negative / total) * 100).toFixed(1)),
  };
}

/**
 * Calculate rating distribution
 * @param {Array} reviews - Array of reviews
 * @returns {Object} Rating distribution
 */
function calculateRatingDistribution(reviews) {
  const distribution = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  reviews.forEach((review) => {
    const rating = Math.round(review.rating);
    if (rating >= 1 && rating <= 5) {
      distribution[rating]++;
    }
  });

  return distribution;
}

/**
 * Extract top keywords from reviews
 * @param {Array} reviews - Array of reviews
 * @returns {Array} Top keywords with counts
 */
function extractTopKeywords(reviews) {
  const keywordCounts = {};

  reviews.forEach((review) => {
    if (!review.sentiment || !review.sentiment.keywords) return;

    review.sentiment.keywords.forEach((keyword) => {
      keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
    });
  });

  // Convert to array and sort
  return Object.entries(keywordCounts)
    .map(([keyword, count]) => ({
      keyword,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);
}

/**
 * Extract representative sentiment phrases
 * @param {Array} reviews - Array of reviews
 * @returns {Object} Positive and negative phrases
 */
function extractSentimentPhrases(reviews) {
  let positivePhrases = [];
  let negativePhrases = [];

  reviews.forEach((review) => {
    if (!review.sentiment || !review.sentiment.sentimentPhrases) return;

    review.sentiment.sentimentPhrases.forEach((phrase) => {
      if (phrase.sentiment === "positive") {
        positivePhrases.push(phrase);
      } else if (phrase.sentiment === "negative") {
        negativePhrases.push(phrase);
      }
    });
  });

  // Sort and limit to top phrases
  positivePhrases.sort((a, b) => b.score - a.score);
  negativePhrases.sort((a, b) => a.score - b.score);

  return {
    positive: positivePhrases.slice(0, 5),
    negative: negativePhrases.slice(0, 5),
  };
}

/**
 * Calculate sentiment trends over time
 * @param {Array} reviews - Array of reviews
 * @returns {Array} Trend data by time period
 */
function calculateTrends(reviews) {
  // Group reviews by month
  const monthlyData = {};

  reviews.forEach((review) => {
    const date = new Date(review.reviewDate);
    const yearMonth = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!monthlyData[yearMonth]) {
      monthlyData[yearMonth] = {
        count: 0,
        sentimentSum: 0,
        ratingSum: 0,
      };
    }

    monthlyData[yearMonth].count++;
    monthlyData[yearMonth].sentimentSum += review.sentiment?.overall || 0;
    monthlyData[yearMonth].ratingSum += review.rating;
  });

  // Convert to array and calculate averages
  return Object.keys(monthlyData)
    .sort()
    .map((yearMonth) => {
      const data = monthlyData[yearMonth];
      return {
        period: yearMonth,
        avgSentiment: parseFloat((data.sentimentSum / data.count).toFixed(2)),
        avgRating: parseFloat((data.ratingSum / data.count).toFixed(1)),
        reviewCount: data.count,
      };
    });
}

/**
 * Generate improvement suggestions based on problem areas
 * @param {Array} improvementAreas - Problem areas
 * @param {Object} commonIssues - Common issues by category
 * @returns {Object} Suggestions by category
 */
function generateSuggestionsByCategory(improvementAreas, commonIssues) {
  const suggestions = {};

  // Food improvement suggestions
  if (improvementAreas.some((area) => area.category === "food")) {
    suggestions.food = [
      "Review menu items receiving negative feedback",
      "Implement quality control measures for consistency",
      "Consider ingredient sourcing improvements",
      "Evaluate food preparation processes",
      "Train kitchen staff on quality standards",
    ];
  }

  // Service improvement suggestions
  if (improvementAreas.some((area) => area.category === "service")) {
    suggestions.service = [
      "Provide additional staff training on customer service",
      "Review staffing levels during peak hours",
      "Implement service recovery protocols",
      "Reduce wait times for seating and orders",
      "Improve communication between front and back of house",
    ];
  }

  // Ambiance improvement suggestions
  if (improvementAreas.some((area) => area.category === "ambiance")) {
    suggestions.ambiance = [
      "Evaluate noise levels and acoustics",
      "Review lighting for appropriate atmosphere",
      "Consider seating arrangement and comfort improvements",
      "Maintain cleanliness standards throughout dining areas",
      "Update décor elements that may appear dated",
    ];
  }

  // Value improvement suggestions
  if (improvementAreas.some((area) => area.category === "value")) {
    suggestions.value = [
      "Review pricing strategy compared to competitors",
      "Consider portion size adjustments",
      "Introduce value meal options or promotions",
      "Ensure menu pricing reflects perceived value",
      "Implement a customer loyalty program",
    ];
  }

  return suggestions;
}

module.exports = {
  getRestaurantSentiment,
  compareRestaurants,
  getSuggestedImprovements,
};
