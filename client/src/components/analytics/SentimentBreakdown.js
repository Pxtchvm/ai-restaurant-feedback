import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

const SentimentBreakdown = ({ distribution }) => {
  // Define sentiment colors
  const colors = {
    positive: "#10B981", // green-500
    neutral: "#F59E0B", // amber-500
    negative: "#EF4444", // red-500
  };

  // Prepare data for pie chart
  const chartData = {
    labels: ["Positive", "Neutral", "Negative"],
    datasets: [
      {
        data: [
          distribution.positive || 0,
          distribution.neutral || 0,
          distribution.negative || 0,
        ],
        backgroundColor: [colors.positive, colors.neutral, colors.negative],
        borderColor: ["#ffffff", "#ffffff", "#ffffff"],
        borderWidth: 2,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.parsed}%`;
          },
        },
      },
    },
  };

  // If all values are 0, show placeholder message
  if (
    distribution.positive === 0 &&
    distribution.neutral === 0 &&
    distribution.negative === 0
  ) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">
          No sentiment data available for this time period.
        </p>
      </div>
    );
  }

  // Render pie chart and sentiment metrics
  return (
    <div className="grid grid-cols-1 sm:grid-cols-7 gap-6 h-full">
      {/* Pie Chart */}
      <div className="sm:col-span-3 flex items-center justify-center">
        <Pie data={chartData} options={options} />
      </div>

      {/* Sentiment Metrics */}
      <div className="sm:col-span-4 flex flex-col justify-center space-y-4">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Positive Reviews</span>
              <span className="text-sm font-medium">
                {distribution.positive || 0}%
              </span>
            </div>
            <div className="mt-1 h-2 relative max-w-xl rounded-full overflow-hidden">
              <div className="w-full h-full bg-gray-200 absolute"></div>
              <div
                className="h-full bg-green-500 absolute"
                style={{ width: `${distribution.positive || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Neutral Reviews</span>
              <span className="text-sm font-medium">
                {distribution.neutral || 0}%
              </span>
            </div>
            <div className="mt-1 h-2 relative max-w-xl rounded-full overflow-hidden">
              <div className="w-full h-full bg-gray-200 absolute"></div>
              <div
                className="h-full bg-amber-500 absolute"
                style={{ width: `${distribution.neutral || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
          <div className="flex-1">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Negative Reviews</span>
              <span className="text-sm font-medium">
                {distribution.negative || 0}%
              </span>
            </div>
            <div className="mt-1 h-2 relative max-w-xl rounded-full overflow-hidden">
              <div className="w-full h-full bg-gray-200 absolute"></div>
              <div
                className="h-full bg-red-500 absolute"
                style={{ width: `${distribution.negative || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SentimentBreakdown;
