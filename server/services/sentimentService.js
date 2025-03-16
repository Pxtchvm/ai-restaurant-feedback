const natural = require("natural");

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;
const sentiment = new natural.SentimentAnalyzer("English", stemmer, "afinn");

// Stopwords to filter out (common words that don't carry sentiment)
const stopwords = [
  "i",
  "me",
  "my",
  "myself",
  "we",
  "our",
  "ours",
  "ourselves",
  "you",
  "your",
  "yours",
  "yourself",
  "yourselves",
  "he",
  "him",
  "his",
  "himself",
  "she",
  "her",
  "hers",
  "herself",
  "it",
  "its",
  "itself",
  "they",
  "them",
  "their",
  "theirs",
  "themselves",
  "what",
  "which",
  "who",
  "whom",
  "this",
  "that",
  "these",
  "those",
  "am",
  "is",
  "are",
  "was",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "having",
  "do",
  "does",
  "did",
  "doing",
  "a",
  "an",
  "the",
  "and",
  "but",
  "if",
  "or",
  "because",
  "as",
  "until",
  "while",
  "of",
  "at",
  "by",
  "for",
  "with",
  "about",
  "against",
  "between",
  "into",
  "through",
  "during",
  "before",
  "after",
  "above",
  "below",
  "to",
  "from",
  "up",
  "down",
  "in",
  "out",
  "on",
  "off",
  "over",
  "under",
  "again",
  "further",
  "then",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "any",
  "both",
  "each",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "no",
  "nor",
  "not",
  "only",
  "own",
  "same",
  "so",
  "than",
  "too",
  "very",
  "s",
  "t",
  "can",
  "will",
  "just",
  "don",
  "should",
  "now",
];

// Category keywords for classification
const categoryKeywords = {
  food: [
    "food",
    "dish",
    "menu",
    "taste",
    "delicious",
    "flavor",
    "meal",
    "eat",
    "cuisine",
    "ingredient",
    "cook",
    "chef",
    "dessert",
    "drink",
    "appetizer",
    "entree",
    "breakfast",
    "lunch",
    "dinner",
    "portion",
    "spicy",
    "sweet",
    "savory",
    "bitter",
    "salty",
    "juicy",
    "tender",
    "crispy",
    "fresh",
    "stale",
  ],
  service: [
    "service",
    "staff",
    "waiter",
    "waitress",
    "server",
    "attentive",
    "polite",
    "friendly",
    "rude",
    "slow",
    "quick",
    "prompt",
    "reservation",
    "manager",
    "attention",
    "helpful",
    "efficient",
    "professional",
    "courteous",
  ],
  ambiance: [
    "ambiance",
    "atmosphere",
    "decor",
    "interior",
    "music",
    "noise",
    "quiet",
    "loud",
    "comfort",
    "seating",
    "table",
    "chair",
    "light",
    "dark",
    "cozy",
    "crowd",
    "view",
    "design",
    "layout",
    "clean",
    "dirty",
    "spacious",
    "cramped",
  ],
  value: [
    "price",
    "value",
    "expensive",
    "cheap",
    "affordable",
    "worth",
    "cost",
    "overpriced",
    "bargain",
    "money",
    "bill",
    "payment",
    "reasonable",
    "pricy",
  ],
};

/**
 * Analyze sentiment from review text
 * @param {string} text - The review text to analyze
 * @returns {Object} Sentiment analysis results
 */
const analyzeSentiment = (text) => {
  try {
    // Normalize and tokenize text
    const normalizedText = text.toLowerCase().replace(/[^\w\s]/g, " ");
    const tokens = tokenizer.tokenize(normalizedText);
    const filteredTokens = tokens.filter(
      (token) => !stopwords.includes(token) && token.length > 2
    );

    // Calculate overall sentiment score [-1 to 1]
    const overallScore = sentiment.getSentiment(tokens);

    // Split text into sentences for more granular analysis
    const sentences = splitIntoSentences(text);

    // Analyze sentiment by category
    const categoryScores = analyzeCategorySentiment(sentences, tokens);

    // Extract keywords
    const keywords = extractKeywords(filteredTokens, tokens, sentences);

    // Extract sentiment phrases
    const sentimentPhrases = extractSentimentPhrases(sentences);

    // Determine sentiment intensity
    const intensity = calculateIntensity(overallScore, text);

    return {
      overall: parseFloat(overallScore.toFixed(2)),
      intensity,
      categories: categoryScores,
      keywords,
      sentimentPhrases,
    };
  } catch (error) {
    console.error("Error analyzing sentiment:", error);

    // Return default values if analysis fails
    return {
      overall: 0,
      intensity: "neutral",
      categories: {
        food: 0,
        service: 0,
        ambiance: 0,
        value: 0,
      },
      keywords: [],
      sentimentPhrases: [],
    };
  }
};

/**
 * Split text into sentences
 * @param {string} text - Text to split
 * @returns {Array} Array of sentences
 */
const splitIntoSentences = (text) => {
  // Simple sentence splitting - could be improved with a more sophisticated NLP library
  return text
    .replace(/([.!?])\s+/g, "$1|")
    .replace(/([.!?])$/g, "$1|")
    .split("|")
    .filter((sentence) => sentence.trim().length > 0);
};

/**
 * Analyze sentiment for different categories
 * @param {Array} sentences - Array of sentences
 * @param {Array} tokens - Array of tokens
 * @returns {Object} Category sentiment scores
 */
const analyzeCategorySentiment = (sentences, tokens) => {
  const categoryResults = {
    food: null,
    service: null,
    ambiance: null,
    value: null,
  };

  const categoryCounts = {
    food: 0,
    service: 0,
    ambiance: 0,
    value: 0,
  };

  // Analyze each sentence for category-specific sentiment
  sentences.forEach((sentence) => {
    const sentenceTokens = tokenizer.tokenize(sentence.toLowerCase());
    const sentimentScore = sentiment.getSentiment(sentenceTokens);

    // Check for each category
    Object.keys(categoryKeywords).forEach((category) => {
      // Check if any category keywords exist in the sentence
      const hasCategoryKeyword = categoryKeywords[category].some((keyword) =>
        sentenceTokens.some(
          (token) => token.includes(keyword) || keyword.includes(token)
        )
      );

      if (hasCategoryKeyword) {
        if (categoryResults[category] === null) {
          categoryResults[category] = 0;
        }

        categoryResults[category] += sentimentScore;
        categoryCounts[category]++;
      }
    });
  });

  // Calculate average sentiment for each category
  Object.keys(categoryResults).forEach((category) => {
    if (categoryCounts[category] > 0) {
      categoryResults[category] = parseFloat(
        (categoryResults[category] / categoryCounts[category]).toFixed(2)
      );
    }
  });

  return categoryResults;
};

/**
 * Extract important keywords from the review
 * @param {Array} filteredTokens - Filtered tokens (no stopwords)
 * @param {Array} allTokens - All tokens
 * @param {Array} sentences - Array of sentences
 * @returns {Array} Extracted keywords
 */
const extractKeywords = (filteredTokens, allTokens, sentences) => {
  // Count word frequency
  const wordFrequency = {};

  filteredTokens.forEach((token) => {
    wordFrequency[token] = (wordFrequency[token] || 0) + 1;
  });

  // Convert to array and sort by frequency
  return Object.entries(wordFrequency)
    .filter(([word]) => word.length > 2) // Ignore very short words
    .map(([word, count]) => word)
    .slice(0, 10); // Return top 10 keywords
};

/**
 * Extract phrases that show sentiment
 * @param {Array} sentences - Array of sentences
 * @returns {Array} Sentiment phrases
 */
const extractSentimentPhrases = (sentences) => {
  const phrases = [];

  sentences.forEach((sentence) => {
    const tokens = tokenizer.tokenize(sentence.toLowerCase());
    const score = sentiment.getSentiment(tokens);

    // Only include sentences with clear sentiment (positive or negative)
    if (Math.abs(score) > 0.3) {
      phrases.push({
        text: sentence,
        sentiment: score > 0 ? "positive" : "negative",
        score: parseFloat(score.toFixed(2)),
      });
    }
  });

  // Sort and limit to most positive and negative phrases
  const positiveTopN = phrases
    .filter((p) => p.sentiment === "positive")
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const negativeTopN = phrases
    .filter((p) => p.sentiment === "negative")
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  return [...positiveTopN, ...negativeTopN];
};

/**
 * Calculate sentiment intensity
 * @param {number} overallScore - Overall sentiment score
 * @param {string} text - Original review text
 * @returns {string} Intensity level
 */
const calculateIntensity = (overallScore, text) => {
  // Check for intensity indicators
  const hasExclamation = (text.match(/!/g) || []).length > 1;
  const hasIntensifier =
    /\b(very|really|extremely|absolutely|incredibly)\b/i.test(text);
  const hasAllCaps = /[A-Z]{3,}/.test(text);

  // Calculate absolute score and adjust for intensity indicators
  const absoluteScore = Math.abs(overallScore);
  let adjustedScore = absoluteScore;

  if (hasExclamation) adjustedScore += 0.1;
  if (hasIntensifier) adjustedScore += 0.15;
  if (hasAllCaps) adjustedScore += 0.1;

  // Determine intensity level
  if (adjustedScore < 0.2) return "neutral";
  if (adjustedScore < 0.4) return "mild";
  if (adjustedScore < 0.7) return "moderate";
  return "strong";
};

module.exports = {
  analyzeSentiment,
};
