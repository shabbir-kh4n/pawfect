const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @route   POST /api/ai/generate-name
// @desc    Generate pet names using Claude AI
// @access  Public
router.post('/generate-name', async (req, res) => {
  try {
    const { petType, gender, keywords } = req.body;

    // Validate required fields
    if (!petType) {
      return res.status(400).json({ 
        message: 'Please provide a pet type' 
      });
    }

    // Build the prompt
    const genderText = gender ? `${gender} ` : '';
    const keywordsText = keywords ? ` that is ${keywords}` : '';
    
    const prompt = `You are a creative pet name generator. Suggest 10 unique and creative names for a ${genderText}${petType}${keywordsText}. 

Return your answer as a JSON array of strings containing only the names, like this:
["Name1", "Name2", "Name3", ...]

Make the names creative, fitting for the pet type, and considering any keywords provided. Mix different styles: cute, strong, playful, elegant, etc.`;

    console.log('Generating names for:', { petType, gender, keywords });

    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    console.log('Gemini response:', responseText);

    // Parse the JSON array from the response
    let names;
    try {
      // Try to parse the response directly
      names = JSON.parse(responseText);
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON array from the text
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        names = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: split by newlines and clean up
        names = responseText
          .split('\n')
          .map(line => line.trim().replace(/^["'\-\d.)\s]+|["'\s]+$/g, ''))
          .filter(name => name.length > 0 && name.length < 30)
          .slice(0, 10);
      }
    }

    // Ensure we have an array
    if (!Array.isArray(names)) {
      names = [names];
    }

    // Validate and clean the names
    const validNames = names
      .filter(name => typeof name === 'string' && name.trim().length > 0)
      .map(name => name.trim())
      .slice(0, 10); // Ensure max 10 names

    if (validNames.length === 0) {
      return res.status(500).json({ 
        message: 'Failed to generate valid names. Please try again.' 
      });
    }

    res.status(200).json(validNames);
  } catch (error) {
    console.error('Error generating pet names:', error);
    
    // Check for API key error
    if (error.message?.includes('API key')) {
      return res.status(500).json({ 
        message: 'API configuration error. Please check the server configuration.' 
      });
    }

    res.status(500).json({ 
      message: 'Failed to generate pet names. Please try again later.' 
    });
  }
});

module.exports = router;
