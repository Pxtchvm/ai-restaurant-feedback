// server/services/openAiService.js
const axios = require("axios");

/**
 * Service to handle OpenAI API requests for sentiment analysis
 */
class OpenAiService {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.apiUrl = "https://api.openai.com/v1/chat/completions";
    this.model = "gpt-3.5-turbo"; // Can use gpt-4 for even better results if available
  }

  /**
   * Analyze sentiment of a review text using OpenAI
   * @param {string} text - Review text to analyze
   * @returns {Object} Sentiment analysis results matching the expected format
   */
  async analyzeSentiment(text) {
    try {
      if (!this.apiKey) {
        throw new Error("OpenAI API key is not configured");
      }

      // Create a prompt that asks for structured sentiment analysis
      const prompt = [
        {
          role: "system",
          content: `You are a sentiment analysis expert for restaurant reviews. 
            Analyze the following review and provide a structured response with:
            1. Overall sentiment score (from -1 to 1 where -1 is very negative, 0 is neutral, 1 is very positive)
            2. Category-specific sentiment for these four categories (same -1 to 1 scale):
               - Food: Quality, taste, presentation, and menu options
               - Service: Staff friendliness, speed, attentiveness, professionalism
               - Ambiance: Atmosphere, decor, noise level, comfort, cleanliness
               - Value: Price-to-quality ratio, portion sizes, whether the experience was worth the money
            3. Key sentiment phrases with their sentiment (positive or negative)
            4. Top keywords mentioned in the review
            
            For the value category specifically, look for mentions of:
            - Price, cost, expensive, cheap, affordable, overpriced, reasonable
            - Worth it, value for money, bang for buck
            - Portion size relative to price
            - Statements about whether the experience justified the cost
            
            Even if value isn't explicitly mentioned, infer the value sentiment when possible from context, especially when price is mentioned alongside quality assessments.
            
            Return your analysis as valid JSON with the following structure:
            {
              "overall": number,
              "intensity": "mild"|"moderate"|"strong"|"neutral",
              "categories": {
                "food": number|null,
                "service": number|null,
                "ambiance": number|null,
                "value": number|null
              },
              "keywords": string[],
              "sentimentPhrases": [{"text": string, "sentiment": "positive"|"negative", "score": number}]
            }`,
        },
        {
          role: "user",
          content: `Analyze this restaurant review: "${text}"`,
        },
      ];

      // Make the API request
      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: prompt,
          temperature: 0.1, // Lower temperature for more consistent results
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      );

      // Extract and parse the JSON response
      const content = response.data.choices[0].message.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);

      if (!jsonMatch) {
        throw new Error("Failed to parse OpenAI response");
      }

      try {
        // Parse the JSON and return
        const analysisResult = JSON.parse(jsonMatch[0]);

        // Log category values for debugging
        console.log(
          "OpenAI sentiment categories:",
          JSON.stringify(analysisResult.categories)
        );

        // Ensure we have a valid structure
        return this.validateAndFormatResult(analysisResult);
      } catch (parseError) {
        console.error("Error parsing OpenAI JSON response:", parseError);
        throw new Error("Failed to parse OpenAI JSON response");
      }
    } catch (error) {
      console.error("OpenAI sentiment analysis failed:", error.message);
      // We'll return null so the calling code can fall back to the basic analyzer
      return null;
    }
  }

  /**
   * Validate and format the analysis result to ensure it matches expected structure
   * @param {Object} result - The raw analysis result
   * @returns {Object} Formatted result
   */
  validateAndFormatResult(result) {
    // Create a valid default structure
    const defaultResult = {
      overall: 0,
      intensity: "neutral",
      categories: {
        food: null,
        service: null,
        ambiance: null,
        value: null,
      },
      keywords: [],
      sentimentPhrases: [],
    };

    // Check if result has proper shape
    if (!result || typeof result !== "object") {
      return defaultResult;
    }

    // Merge with defaults to ensure complete structure
    return {
      overall:
        typeof result.overall === "number"
          ? Math.max(-1, Math.min(1, result.overall))
          : 0,
      intensity: ["mild", "moderate", "strong", "neutral"].includes(
        result.intensity
      )
        ? result.intensity
        : "neutral",
      categories: {
        food:
          result.categories?.food !== undefined
            ? Math.max(-1, Math.min(1, result.categories.food))
            : null,
        service:
          result.categories?.service !== undefined
            ? Math.max(-1, Math.min(1, result.categories.service))
            : null,
        ambiance:
          result.categories?.ambiance !== undefined
            ? Math.max(-1, Math.min(1, result.categories.ambiance))
            : null,
        value:
          result.categories?.value !== undefined
            ? Math.max(-1, Math.min(1, result.categories.value))
            : null,
      },
      keywords: Array.isArray(result.keywords)
        ? result.keywords.slice(0, 10)
        : [],
      sentimentPhrases: Array.isArray(result.sentimentPhrases)
        ? result.sentimentPhrases
            .map((phrase) => ({
              text: String(phrase.text || ""),
              sentiment:
                phrase.sentiment === "negative" ? "negative" : "positive",
              score:
                typeof phrase.score === "number"
                  ? Math.max(-1, Math.min(1, phrase.score))
                  : 0,
            }))
            .slice(0, 6)
        : [],
    };
  }
}

module.exports = new OpenAiService();
