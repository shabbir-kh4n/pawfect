const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const AdoptionPet = require('../models/AdoptionPet');

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

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

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 500
    });
    
    const responseText = completion.choices[0].message.content;
    console.log('Groq response:', responseText);

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

// @route   POST /api/ai/quiz-match
// @desc    Match user quiz answers with available pets using AI
// @access  Public
router.post('/quiz-match', async (req, res) => {
  try {
    const { userAnswers } = req.body;

    // Validate required fields
    if (!userAnswers || Object.keys(userAnswers).length === 0) {
      return res.status(400).json({ 
        message: 'Please provide your quiz answers' 
      });
    }

    // Fetch all available pets from database
    const allPets = await AdoptionPet.find({});

    if (allPets.length === 0) {
      return res.status(404).json({ 
        message: 'No pets available for adoption at the moment' 
      });
    }

    console.log(`Matching quiz answers against ${allPets.length} pets`);

    // Build the prompt for AI matching
    const prompt = `You are an expert pet adoption counselor. A user has completed a compatibility quiz with these answers:
${JSON.stringify(userAnswers, null, 2)}

Here are the available pets for adoption:
${JSON.stringify(allPets.map(pet => ({
  _id: pet._id,
  petName: pet.petName,
  species: pet.species,
  breed: pet.breed,
  age: pet.age,
  gender: pet.gender,
  size: pet.size,
  energyLevel: pet.energyLevel,
  goodWithKids: pet.goodWithKids,
  goodWithPets: pet.goodWithPets,
  description: pet.description,
  city: pet.city,
  state: pet.state
})), null, 2)}

Please analyze these pets and return the TOP 3 best matches for this user based on their quiz answers. Consider factors like:
- Living space compatibility (apartment vs yard)
- Time availability
- Activity level match
- Experience level needed
- Size preference
- Budget considerations

Return the result as a valid JSON array of objects. Each object must contain:
1. The complete pet data (all fields from the pets above)
2. A "matchReason" field with a short, friendly explanation (2-3 sentences) of why this pet is a great match

Format your response EXACTLY as a JSON array like this:
[
  {
    "_id": "pet_id_here",
    "petName": "name",
    "species": "species",
    "breed": "breed",
    "age": number,
    "gender": "gender",
    "size": "size",
    "energyLevel": "level",
    "goodWithKids": boolean,
    "goodWithPets": boolean,
    "description": "description",
    "city": "city",
    "state": "state",
    "photos": [],
    "matchReason": "Your explanation here"
  }
]

Return ONLY the JSON array, no additional text or markdown.`;

    // Call Groq API
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    });
    
    const responseText = completion.choices[0].message.content;
    console.log('Groq quiz match response:', responseText);

    // Parse the JSON array from the response
    let matches;
    try {
      // Remove markdown code blocks if present
      let cleanedText = responseText.trim();
      if (cleanedText.startsWith('```json')) {
        cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/```\s*$/, '');
      } else if (cleanedText.startsWith('```')) {
        cleanedText = cleanedText.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }
      
      matches = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Parse error:', parseError);
      // Try to extract JSON array from the text
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        matches = JSON.parse(jsonMatch[0]);
      } else {
        return res.status(500).json({ 
          message: 'Failed to process AI response. Please try again.' 
        });
      }
    }

    // Validate matches
    if (!Array.isArray(matches) || matches.length === 0) {
      return res.status(500).json({ 
        message: 'No suitable matches found. Please try again.' 
      });
    }

    // Ensure we have the full pet data by merging with actual pets
    const enrichedMatches = matches.slice(0, 3).map(match => {
      const actualPet = allPets.find(p => p._id.toString() === match._id.toString());
      return {
        ...actualPet?.toObject(),
        matchReason: match.matchReason || 'This pet matches your preferences!'
      };
    });

    res.status(200).json(enrichedMatches);
  } catch (error) {
    console.error('Error matching pets:', error);
    
    // Check for API key error
    if (error.message?.includes('API key')) {
      return res.status(500).json({ 
        message: 'API configuration error. Please check the server configuration.' 
      });
    }

    res.status(500).json({ 
      message: 'Failed to match pets. Please try again later.' 
    });
  }
});

module.exports = router;
