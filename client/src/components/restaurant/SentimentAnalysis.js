import React from "react";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SentimentAnalysis = ({ sentiment }) => {
  if (!sentiment) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No analysis data available yet.</p>
      </div>
    );
  }

  // Sentiment colors
  const colors = {
    positive: "#10B981", // green-500
    neutral: "#F59E0B", // amber-500
    negative: "#EF4444", // red-500
    food: "#3B82F6", // blue-500
    service: "#8B5CF6", // violet-500
    ambiance: "#EC4899", // pink-500
    value: "#F97316", // orange-500
  };

  // Prepare data for Sentiment Distribution chart
  const sentimentDistributionData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          sentiment.sentimentDistribution.positive,
          sentiment.sentimentDistribution.neutral,
          sentiment.sentimentDistribution.negative,
        ],
        backgroundColor: [colors.positive, colors.neutral, colors.negative],
        borderColor: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
        borderWidth: 2,
      },
    ],
  };

  // Prepare data for Rating Distribution chart
  const ratingDistributionData = {
    labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
    datasets: [
      {
        label: "Number of Reviews",
        data: [
          sentiment.ratingDistribution["5"],
          sentiment.ratingDistribution["4"],
          sentiment.ratingDistribution["3"],
          sentiment.ratingDistribution["2"],
          sentiment.ratingDistribution["1"],
        ],
        backgroundColor: "#3B82F6", // blue-500
        borderColor: "#2563EB", // blue-600
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  // Prepare data for Category Sentiment chart
  const categoryLabels = ["Food", "Service", "Ambiance", "Value"];
  const categoryData = [
    sentiment.categories.food || 0,
    sentiment.categories.service || 0,
    sentiment.categories.ambiance || 0,
    sentiment.categories.value || 0,
  ];

  // Convert sentiment scores (-1 to 1) to percentage (-100 to 100)
  const categoryPercentages = categoryData.map((score) =>
    parseFloat((score * 100).toFixed(1))
  );

  const categorySentimentData = {
    labels: categoryLabels,
    datasets: [
      {
        label: "Sentiment Score",
        data: categoryPercentages,
        backgroundColor: [
          colors.food,
          colors.service,
          colors.ambiance,
          colors.value,
        ],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  // Options for Category Sentiment chart
  const categorySentimentOptions = {
    indexAxis: "y",
    scales: {
      x: {
        min: -100,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.parsed.x + "%";
          },
        },
      },
    },
    maintainAspectRatio: false,
  };

  // Helper function to get CSS class based on sentiment score
  const getSentimentClass = (score) => {
    if (score > 0.2) return "text-green-600";
    if (score < -0.2) return "text-red-600";
    return "text-yellow-600";
  };

  // Helper function to format sentiment score as percentage
  const formatSentimentPercentage = (score) => {
    if (score === null || score === undefined) return "N/A";
    return `${(score * 100).toFixed(1)}%`;
  };

  // Helper function to get sentiment label
  const getSentimentLabel = (score) => {
    if (score > 0.2) return "Positive";
    if (score < -0.2) return "Negative";
    return "Neutral";
  };

  return (
    <div className="space-y-8">
      {/* Overview Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          AI Sentiment Analysis Overview
        </h2>
        <p className="text-gray-700 mb-6">
          Our AI has analyzed {sentiment.total} reviews from the{" "}
          {sentiment.periodLabel.toLowerCase()} to extract insights about this
          restaurant.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Overall Sentiment
            </h3>
            <div
              className={`text-2xl font-bold ${getSentimentClass(
                sentiment.overallSentiment
              )}`}
            >
              {formatSentimentPercentage(sentiment.overallSentiment)}
            </div>
            <div className="text-sm text-gray-500">
              {getSentimentLabel(sentiment.overallSentiment)}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Food Quality
            </h3>
            <div
              className={`text-2xl font-bold ${getSentimentClass(
                sentiment.categories.food
              )}`}
            >
              {formatSentimentPercentage(sentiment.categories.food)}
            </div>
            <div className="text-sm text-gray-500">
              {getSentimentLabel(sentiment.categories.food)}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Service</h3>
            <div
              className={`text-2xl font-bold ${getSentimentClass(
                sentiment.categories.service
              )}`}
            >
              {formatSentimentPercentage(sentiment.categories.service)}
            </div>
            <div className="text-sm text-gray-500">
              {getSentimentLabel(sentiment.categories.service)}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-1">Value</h3>
            <div
              className={`text-2xl font-bold ${getSentimentClass(
                sentiment.categories.value
              )}`}
            >
              {formatSentimentPercentage(sentiment.categories.value)}
            </div>
            <div className="text-sm text-gray-500">
              {getSentimentLabel(sentiment.categories.value)}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Sentiment Distribution</h2>
          <div className="h-64">
            <Pie
              data={sentimentDistributionData}
              options={{
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                  tooltip: {
                    callbacks: {
                      label: function (context) {
                        return `${context.label}: ${context.parsed}%`;
                      },
                    },
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        {/* Rating Distribution Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Rating Distribution</h2>
          <div className="h-64">
            <Bar
              data={ratingDistributionData}
              options={{
                plugins: {
                  legend: {
                    display: false,
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: false,
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>

      {/* Category Sentiment Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          Category Sentiment Analysis
        </h2>
        <div className="h-80">
          <Bar
            data={categorySentimentData}
            options={categorySentimentOptions}
          />
        </div>
      </div>

      {/* Key Phrases Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Representative Phrases</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Positive Phrases */}
          <div>
            <h3 className="text-sm font-medium text-green-600 mb-3">
              What People Love
            </h3>
            <ul className="space-y-3">
              {sentiment.sentimentPhrases?.positive?.length > 0 ? (
                sentiment.sentimentPhrases.positive.map((phrase, index) => (
                  <li
                    key={index}
                    className="bg-green-50 border-l-4 border-green-500 p-3 rounded"
                  >
                    <p className="text-sm text-gray-700">"{phrase.text}"</p>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">
                  No positive phrases found.
                </li>
              )}
            </ul>
          </div>

          {/* Negative Phrases */}
          <div>
            <h3 className="text-sm font-medium text-red-600 mb-3">
              Areas for Improvement
            </h3>
            <ul className="space-y-3">
              {sentiment.sentimentPhrases?.negative?.length > 0 ? (
                sentiment.sentimentPhrases.negative.map((phrase, index) => (
                  <li
                    key={index}
                    className="bg-red-50 border-l-4 border-red-500 p-3 rounded"
                  >
                    <p className="text-sm text-gray-700">"{phrase.text}"</p>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-sm">
                  No negative phrases found.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Keywords Section */}
      {sentiment.keywords && sentiment.keywords.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">
            Frequently Mentioned Keywords
          </h2>
          <div className="flex flex-wrap gap-2">
            {sentiment.keywords.map((item, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
              >
                {item.keyword} ({item.count})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Trends Section */}
      {sentiment.trends && sentiment.trends.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Sentiment Trends</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Period
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reviews
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Avg. Rating
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Sentiment
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sentiment.trends.map((trend, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trend.period}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trend.reviewCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {trend.avgRating.toFixed(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          trend.avgSentiment > 0.2
                            ? "bg-green-100 text-green-800"
                            : trend.avgSentiment < -0.2
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {formatSentimentPercentage(trend.avgSentiment)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentimentAnalysis;
