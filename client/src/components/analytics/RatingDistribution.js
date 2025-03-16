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

const RatingDistribution = ({ distribution }) => {
  // Format data for the chart
  const chartData = {
    labels: ["5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star"],
    datasets: [
      {
        data: [
          distribution["5"] || 0,
          distribution["4"] || 0,
          distribution["3"] || 0,
          distribution["2"] || 0,
          distribution["1"] || 0,
        ],
        backgroundColor: [
          "rgba(16, 185, 129, 0.8)", // 5 star - green
          "rgba(59, 130, 246, 0.8)", // 4 star - blue
          "rgba(245, 158, 11, 0.8)", // 3 star - amber
          "rgba(249, 115, 22, 0.8)", // 2 star - orange
          "rgba(239, 68, 68, 0.8)", // 1 star - red
        ],
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: false,
        },
        ticks: {
          precision: 0,
        },
      },
      x: {
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
          title: function (context) {
            return context[0].label;
          },
          label: function (context) {
            return `${context.parsed.y} reviews`;
          },
        },
      },
    },
  };

  // Calculate total reviews
  const totalReviews = Object.values(distribution).reduce(
    (sum, count) => sum + count,
    0
  );

  // Calculate percentages
  const getPercentage = (count) => {
    return totalReviews > 0 ? ((count / totalReviews) * 100).toFixed(1) : 0;
  };

  // If no data, show placeholder message
  if (totalReviews === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">
          No rating data available for this time period.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-7 gap-6">
      {/* Bar Chart */}
      <div className="lg:col-span-4 flex items-center">
        <Bar data={chartData} options={options} />
      </div>

      {/* Rating Breakdown */}
      <div className="lg:col-span-3 flex flex-col justify-center">
        <div className="space-y-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">5 Stars</span>
                <span className="text-sm font-medium">
                  {distribution["5"] || 0} (
                  {getPercentage(distribution["5"] || 0)}%)
                </span>
              </div>
              <div className="mt-1 h-2 relative max-w-xl rounded-full overflow-hidden">
                <div className="w-full h-full bg-gray-200 absolute"></div>
                <div
                  className="h-full bg-green-500 absolute"
                  style={{ width: `${getPercentage(distribution["5"] || 0)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">4 Stars</span>
                <span className="text-sm font-medium">
                  {distribution["4"] || 0} (
                  {getPercentage(distribution["4"] || 0)}%)
                </span>
              </div>
              <div className="mt-1 h-2 relative max-w-xl rounded-full overflow-hidden">
                <div className="w-full h-full bg-gray-200 absolute"></div>
                <div
                  className="h-full bg-blue-500 absolute"
                  style={{ width: `${getPercentage(distribution["4"] || 0)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">3 Stars</span>
                <span className="text-sm font-medium">
                  {distribution["3"] || 0} (
                  {getPercentage(distribution["3"] || 0)}%)
                </span>
              </div>
              <div className="mt-1 h-2 relative max-w-xl rounded-full overflow-hidden">
                <div className="w-full h-full bg-gray-200 absolute"></div>
                <div
                  className="h-full bg-amber-500 absolute"
                  style={{ width: `${getPercentage(distribution["3"] || 0)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">2 Stars</span>
                <span className="text-sm font-medium">
                  {distribution["2"] || 0} (
                  {getPercentage(distribution["2"] || 0)}%)
                </span>
              </div>
              <div className="mt-1 h-2 relative max-w-xl rounded-full overflow-hidden">
                <div className="w-full h-full bg-gray-200 absolute"></div>
                <div
                  className="h-full bg-orange-500 absolute"
                  style={{ width: `${getPercentage(distribution["2"] || 0)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">1 Star</span>
                <span className="text-sm font-medium">
                  {distribution["1"] || 0} (
                  {getPercentage(distribution["1"] || 0)}%)
                </span>
              </div>
              <div className="mt-1 h-2 relative max-w-xl rounded-full overflow-hidden">
                <div className="w-full h-full bg-gray-200 absolute"></div>
                <div
                  className="h-full bg-red-500 absolute"
                  style={{ width: `${getPercentage(distribution["1"] || 0)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 text-sm text-gray-500">
          <p>Total: {totalReviews} reviews</p>
        </div>
      </div>
    </div>
  );
};

export default RatingDistribution;
