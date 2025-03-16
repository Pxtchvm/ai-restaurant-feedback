import React, { useState } from "react";

const ImprovementSuggestions = ({ improvements }) => {
  const [activeTab, setActiveTab] = useState("all");

  // If no improvements data or no areas for improvement, show placeholder message
  if (
    !improvements ||
    !improvements.improvementAreas ||
    improvements.improvementAreas.length === 0
  ) {
    return (
      <div className="h-64 flex items-center justify-center text-center">
        <div>
          <svg
            className="h-12 w-12 text-green-500 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-gray-600 font-medium">Looking Good!</p>
          <p className="text-gray-500 mt-1">
            No significant areas for improvement were identified in recent
            reviews.
          </p>
        </div>
      </div>
    );
  }

  // Get all improvement areas
  const allAreas = improvements.improvementAreas || [];

  // Define category icons
  const categoryIcons = {
    food: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
        />
      </svg>
    ),
    service: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
        />
      </svg>
    ),
    ambiance: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    value: (
      <svg
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  return (
    <div>
      {/* Category Tabs */}
      <div className="flex mb-4 border-b border-gray-200 overflow-x-auto">
        <button
          className={`py-2 px-4 text-sm font-medium flex-shrink-0 ${
            activeTab === "all"
              ? "text-primary-600 border-b-2 border-primary-600"
              : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Areas
        </button>

        {allAreas.map((area) => (
          <button
            key={area.category}
            className={`py-2 px-4 text-sm font-medium flex-shrink-0 ${
              activeTab === area.category
                ? "text-primary-600 border-b-2 border-primary-600"
                : "text-gray-500 hover:text-gray-700 border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab(area.category)}
          >
            <span className="capitalize">{area.category}</span> (
            {area.percentage}%)
          </button>
        ))}
      </div>

      {/* Content for All Areas tab */}
      {activeTab === "all" && (
        <div>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Areas for Improvement
            </h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="space-y-2">
                {allAreas.map((area) => (
                  <div key={area.category} className="flex items-center">
                    <div className="mr-2 text-gray-500">
                      {categoryIcons[area.category]}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium capitalize">
                          {area.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          {area.count} mentions
                        </span>
                      </div>
                      <div className="mt-1 h-2 relative max-w-xl rounded-full overflow-hidden">
                        <div className="w-full h-full bg-gray-200 absolute"></div>
                        <div
                          className="h-full bg-primary-500 absolute"
                          style={{ width: `${area.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Top Suggestions
            </h3>
            <div className="space-y-2">
              {Object.entries(improvements.suggestionsByCategory || {}).map(
                ([category, suggestions]) => (
                  <div
                    key={category}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center p-3 bg-gray-50 border-b border-gray-200">
                      <div className="mr-2 text-gray-600">
                        {categoryIcons[category]}
                      </div>
                      <h4 className="font-medium capitalize">{category}</h4>
                    </div>
                    <ul className="p-3 text-sm space-y-1">
                      {suggestions.slice(0, 3).map((suggestion, idx) => (
                        <li key={idx} className="flex items-start">
                          <svg
                            className="h-4 w-4 text-primary-500 mt-0.5 mr-2 flex-shrink-0"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content for specific category tabs */}
      {activeTab !== "all" &&
        improvements.suggestionsByCategory &&
        improvements.suggestionsByCategory[activeTab] && (
          <div>
            {/* Category-specific suggestions */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Suggested Improvements
              </h3>
              <ul className="bg-gray-50 rounded-lg p-4 space-y-2">
                {improvements.suggestionsByCategory[activeTab].map(
                  (suggestion, idx) => (
                    <li key={idx} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-primary-500 mt-0.5 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {suggestion}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Common issues */}
            {improvements.commonIssues &&
              improvements.commonIssues[activeTab] && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Common Issues Mentioned
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {improvements.commonIssues[activeTab].map((issue) => (
                      <span
                        key={issue.issue}
                        className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800"
                        title={`${issue.percentage}% of negative reviews mention this`}
                      >
                        {issue.issue} ({issue.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Example reviews */}
            {improvements.reviewExamples &&
              improvements.reviewExamples[activeTab] && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Example Reviews
                  </h3>
                  <div className="space-y-3">
                    {improvements.reviewExamples[activeTab].map((review) => (
                      <div
                        key={review.id}
                        className="bg-red-50 border-l-4 border-red-400 p-3 rounded"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={`h-4 w-4 ${
                                    i < review.rating
                                      ? "text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
        )}
    </div>
  );
};

export default ImprovementSuggestions;
