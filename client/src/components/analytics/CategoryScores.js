import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CategoryScores = ({ categories }) => {
  // Define category colors
  const colors = {
    food: "#3B82F6", // blue-500
    service: "#8B5CF6", // violet-500
    ambiance: "#EC4899", // pink-500
    value: "#F97316", // orange-500
  };

  // Convert sentiment scores (-1 to 1) to percentage (-100 to 100)
  const dataValues = Object.entries(categories).map(([category, score]) => {
    return score !== null ? parseFloat((score * 100).toFixed(1)) : 0;
  });

  // Prepare data for the chart
  const chartData = {
    labels: ["Food", "Service", "Ambiance", "Value"],
    datasets: [
      {
        data: dataValues,
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

  // Chart options
  const options = {
    indexAxis: "y",
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        min: -100,
        max: 100,
        grid: {
          display: false,
        },
        ticks: {
          callback: function (value) {
            return value + "%";
          },
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
  };

  // If all categories are null, show placeholder message
  if (
    categories.food === null &&
    categories.service === null &&
    categories.ambiance === null &&
    categories.value === null
  ) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">
          No category data available for this time period.
        </p>
      </div>
    );
  }

  // Helper function to get CSS class based on sentiment score
  const getSentimentClass = (score) => {
    if (!score && score !== 0) return "text-gray-500";
    if (score > 20) return "text-green-600";
    if (score < -20) return "text-red-600";
    return "text-yellow-600";
  };

  // Get sentiment label based on score
  const getSentimentLabel = (score) => {
    if (!score && score !== 0) return "N/A";
    if (score > 20) return "Positive";
    if (score < -20) return "Negative";
    return "Neutral";
  };

  // Get indicator arrow based on score
  const getSentimentIndicator = (score) => {
    if (!score && score !== 0) return null;
    if (score > 20) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      );
    }
    if (score < -20) {
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-red-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      );
    }
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 text-yellow-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 12h14"
        />
      </svg>
    );
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-7 gap-6">
      {/* Bar Chart */}
      <div className="lg:col-span-4 flex items-center">
        <Bar data={chartData} options={options} />
      </div>

      {/* Category Details */}
      <div className="lg:col-span-3">
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(categories).map(([category, score]) => {
            const percentageScore =
              score !== null ? parseFloat((score * 100).toFixed(1)) : null;

            return (
              <div key={category} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: colors[category] }}
                  ></div>
                  <h3 className="text-sm font-medium text-gray-800 capitalize">
                    {category}
                  </h3>
                </div>

                <div
                  className={`flex items-center ${getSentimentClass(
                    percentageScore
                  )}`}
                >
                  <span className="text-2xl font-bold mr-1">
                    {percentageScore !== null ? `${percentageScore}%` : "N/A"}
                  </span>
                  {getSentimentIndicator(percentageScore)}
                </div>

                <p className={`text-xs ${getSentimentClass(percentageScore)}`}>
                  {getSentimentLabel(percentageScore)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-4 text-sm text-gray-500">
          <p>
            The scores represent customer sentiment in each category. Higher
            percentages indicate more positive feedback.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryScores;
