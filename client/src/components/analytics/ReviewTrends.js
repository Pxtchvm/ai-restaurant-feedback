import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ReviewTrends = ({ trends }) => {
  // Format date labels (YYYY-MM to MMM YYYY)
  const formatMonthYear = (yearMonth) => {
    if (!yearMonth) return "";

    const [year, month] = yearMonth.split("-");
    const date = new Date(year, month - 1);

    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Prepare data for chart
  const chartData = {
    labels: trends.map((trend) => formatMonthYear(trend.period)),
    datasets: [
      {
        label: "Average Rating",
        data: trends.map((trend) => trend.avgRating),
        borderColor: "#3B82F6", // blue-500
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "#3B82F6",
        pointRadius: 4,
        tension: 0.3,
        yAxisID: "y",
      },
      {
        label: "Sentiment Score",
        data: trends.map((trend) => (trend.avgSentiment * 100).toFixed(1)),
        borderColor: "#10B981", // green-500
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "#10B981",
        pointRadius: 4,
        tension: 0.3,
        yAxisID: "y1",
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        position: "left",
        title: {
          display: true,
          text: "Rating (1-5)",
        },
        min: 0,
        max: 5,
        ticks: {
          stepSize: 1,
        },
      },
      y1: {
        position: "right",
        title: {
          display: true,
          text: "Sentiment (%)",
        },
        min: -100,
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 0) {
                label += context.parsed.y.toFixed(1);
              } else {
                label += context.parsed.y + "%";
              }
            }
            return label;
          },
        },
      },
    },
  };

  // If no trends data, show placeholder message
  if (!trends || trends.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">
          No trend data available for this time period.
        </p>
      </div>
    );
  }

  // Render the chart
  return <Line data={chartData} options={options} />;
};

export default ReviewTrends;
