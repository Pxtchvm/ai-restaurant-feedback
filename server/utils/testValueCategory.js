// server/utils/testValueCategory.js
require('dotenv').config({ path: '../.env' });
const openAiService = require('../services/openAiService');

/**
 * Test script to verify value category analysis
 */
async function testValueCategory() {
  console.log('Testing Value Category Analysis');
  console.log('===============================\n');
  
  // Reviews that specifically mention value/price
  const reviews = [
    {
      text: 'The food was good but way overpriced for what you get. I paid $50 for a tiny portion that left me still hungry.',
      expected: 'Negative value'
    },
    {
      text: 'Great value for money! The prices are reasonable and portions are generous. Definitely worth every penny.',
      expected: 'Positive value'
    },
    {
      text: 'Prices are average for the area, and the food quality matches. Not a bargain, but not a ripoff either.',
      expected: 'Neutral value'
    },
    {
      text: "While the food was tasty, I'm not sure I'd pay that much again for such small servings. Definitely a special occasion place.",
      expected: 'Mildly negative value'
    }
  ];
  
  for (const [index, review] of reviews.entries()) {
    console.log(`\nTest #${index + 1}: ${review.expected}`);
    console.log(`Review: "${review.text}"`);
    
    try {
      const result = await openAiService.analyzeSentiment(review.text);
      
      if (result) {
        console.log('\nResults:');
        console.log('Overall sentiment:', result.overall);
        console.log('Value category:', result.categories.value);
        
        console.log('\nAll categories:');
        Object.entries(result.categories).forEach(([category, score]) => {
          console.log(`- ${category}: ${score}`);
        });
      } else {
        console.log('Analysis failed');
      }
    } catch (error) {
      console.error('Error:', error.message);
    }
    
    console.log('-'.repeat(50));
  }
}

testValueCategory();