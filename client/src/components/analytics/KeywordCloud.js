import React from "react";

const KeywordCloud = ({ keywords }) => {
  // If no keywords, show placeholder message
  if (!keywords || keywords.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-500">
          No keyword data available for this time period.
        </p>
      </div>
    );
  }

  // Get the max count for scaling
  const maxCount = Math.max(...keywords.map((keyword) => keyword.count));

  // Get font size based on count (min 14px, max 28px)
  const getFontSize = (count) => {
    const minSize = 14;
    const maxSize = 28;
    const size = minSize + (count / maxCount) * (maxSize - minSize);
    return Math.round(size);
  };

  // Get a color based on index
  const getColor = (index) => {
    const colors = [
      "text-blue-600",
      "text-green-600",
      "text-indigo-600",
      "text-purple-600",
      "text-pink-600",
      "text-red-600",
      "text-orange-600",
      "text-amber-600",
      "text-yellow-600",
      "text-lime-600",
      "text-emerald-600",
      "text-teal-600",
      "text-cyan-600",
      "text-sky-600",
      "text-violet-600",
      "text-fuchsia-600",
      "text-rose-600",
    ];

    return colors[index % colors.length];
  };

  return (
    <div className="text-center py-6">
      {keywords.length === 0 ? (
        <p className="text-gray-500">No keywords found in reviews.</p>
      ) : (
        <div className="flex flex-wrap justify-center items-center gap-3">
          {keywords.map((keyword, index) => (
            <div
              key={keyword.keyword}
              className={`px-3 py-1 ${getColor(
                index
              )} hover:opacity-80 transition-opacity`}
              style={{
                fontSize: `${getFontSize(keyword.count)}px`,
                cursor: "default",
              }}
              title={`${keyword.keyword} (mentioned ${keyword.count} times)`}
            >
              {keyword.keyword}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KeywordCloud;
