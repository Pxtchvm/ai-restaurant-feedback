// server/utils/testOpenAiIntegration.js
require("dotenv").config({ path: "../.env" });
const openAiService = require("../services/openAiService");
const { analyzeSentiment } = require("../services/sentimentService");

/**
 * Test script to verify OpenAI integration for sentiment analysis
 */
async function testOpenAiIntegration() {
  console.log("📊 Testing crAIvings OpenAI Integration 📊");
  console.log("=========================================\n");

  // Sample reviews to test with varying sentiments
  const reviews = [
    {
      id: 1,
      text: "I was really looking forward to authentic Filipino cuisine, but this was a letdown. The dishes were poorly executed, and the balance of flavors was completely off.",
      expected: "Negative",
    },
    {
      id: 2,
      text: "The food was absolutely delicious! The service was prompt and friendly. I love the cozy atmosphere of this place. Prices were reasonable for the quality of food.",
      expected: "Positive",
    },
    {
      id: 3,
      text: "Decent food but nothing special. The service was okay, but the wait time was longer than expected. Ambiance is nice, but the prices are a bit high for what you get.",
      expected: "Neutral/Negative",
    },
  ];

  // Check environment setup
  console.log("Environment Check:");
  console.log(`USE_OPENAI: ${process.env.USE_OPENAI}`);
  console.log(
    `OPENAI_API_KEY: ${
      process.env.OPENAI_API_KEY ? "Configured ✓" : "Missing ✗"
    }\n`
  );

  // Test each review
  for (const review of reviews) {
    console.log(`Review #${review.id}:`);
    console.log(`"${review.text}"`);
    console.log(`Expected: ${review.expected}`);

    try {
      // Test direct OpenAI service
      console.log("\nTesting OpenAI Service directly:");
      const openAiResult = await openAiService.analyzeSentiment(review.text);

      if (openAiResult) {
        console.log("OpenAI Status: ✓ Success");
        console.log(
          `Overall Score: ${openAiResult.overall} (${getSentimentLabel(
            openAiResult.overall
          )})`
        );
        console.log("Category Scores:");
        for (const [category, score] of Object.entries(
          openAiResult.categories
        )) {
          if (score !== null) {
            console.log(
              `  - ${category}: ${score} (${getSentimentLabel(score)})`
            );
          }
        }
        console.log("Keywords:", openAiResult.keywords.join(", "));
      } else {
        console.log("OpenAI Status: ✗ Failed");
      }

      // Test combined sentiment service (with fallback)
      console.log("\nTesting Combined Sentiment Service:");
      const combinedResult = await analyzeSentiment(review.text);
      console.log(
        `Final Result: ${combinedResult.overall} (${getSentimentLabel(
          combinedResult.overall
        )})`
      );
      console.log("Service Used:", openAiResult ? "OpenAI" : "Basic Analyzer");
    } catch (error) {
      console.error("Error during test:", error.message);
    }

    console.log("\n-----------------------------------------\n");
  }

  console.log("Test Complete!");
}

/**
 * Get sentiment label from score
 */
function getSentimentLabel(score) {
  if (score > 0.3) return "Positive";
  if (score < -0.3) return "Negative";
  return "Neutral";
}

// Run the test
testOpenAiIntegration();
