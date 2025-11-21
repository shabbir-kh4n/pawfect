const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const AdoptionRequest = require('../models/AdoptionRequest');
const AdoptionPet = require('../models/AdoptionPet');
const Chat = require('../models/Chat');
const Pet = require('../models/Pet');

// @route   POST /api/adoption-requests
// @desc    Create a new adoption request
// @access  Protected
router.post('/', protect, async (req, res) => {
  try {
    const { petId, requesterName, requesterEmail, requesterPhone, message } = req.body;

    // Validate required fields
    if (!petId || !requesterName || !requesterEmail || !requesterPhone || !message) {
      return res.status(400).json({ 
        message: 'Please provide all required fields' 
      });
    }

    // Find the pet
    const pet = await AdoptionPet.findById(petId).populate('user', 'email');
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if user is trying to adopt their own pet
    if (pet.user._id.toString() === req.user.id) {
      return res.status(400).json({ message: 'You cannot adopt your own pet' });
    }

    // Create adoption request
    const adoptionRequest = await AdoptionRequest.create({
      pet: petId,
      petOwner: pet.user._id,
      requester: req.user.id,
      requesterName,
      requesterEmail,
      requesterPhone,
      message,
    });

    // Create chat for this adoption request
    const chat = await Chat.create({
      adoptionRequest: adoptionRequest._id,
      pet: petId,
      petOwner: pet.user._id,
      adopter: req.user.id,
      lastMessage: message,
    });

    // Update adoption request with chat reference
    adoptionRequest.chat = chat._id;
    await adoptionRequest.save();

    res.status(201).json({
      message: 'Adoption request submitted successfully! You can now chat with the pet owner.',
      request: adoptionRequest,
      chatId: chat._id,
    });
  } catch (error) {
    console.error('Error creating adoption request:', error);
    res.status(500).json({ message: 'Server error while submitting adoption request' });
  }
});

// @route   GET /api/adoption-requests/my-requests
// @desc    Get all adoption requests made by the current user
// @access  Protected
router.get('/my-requests', protect, async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ requester: req.user.id })
      .populate('pet', 'petName species breed photos')
      .populate('petOwner', 'email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Adoption requests retrieved successfully',
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('Error fetching adoption requests:', error);
    res.status(500).json({ message: 'Server error while fetching adoption requests' });
  }
});

// @route   GET /api/adoption-requests/received
// @desc    Get all adoption requests received by the current user (for their pets)
// @access  Protected
router.get('/received', protect, async (req, res) => {
  try {
    const requests = await AdoptionRequest.find({ petOwner: req.user.id })
      .populate('pet', 'petName species breed photos')
      .populate('requester', 'email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: 'Received adoption requests retrieved successfully',
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error('Error fetching received adoption requests:', error);
    res.status(500).json({ message: 'Server error while fetching received adoption requests' });
  }
});

// @route   POST /api/adoption-requests/:requestId/confirm-completion
// @desc    Confirm adoption completion (requires both parties)
// @access  Protected
router.post('/:requestId/confirm-completion', protect, async (req, res) => {
  try {
    const { requestId } = req.params;

    const adoptionRequest = await AdoptionRequest.findById(requestId).populate('pet');

    if (!adoptionRequest) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    // Check if user is part of this adoption
    const isOwner = adoptionRequest.petOwner.toString() === req.user.id;
    const isAdopter = adoptionRequest.requester.toString() === req.user.id;

    if (!isOwner && !isAdopter) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Update completion status
    if (isOwner) {
      adoptionRequest.completedByOwner = true;
    } else {
      adoptionRequest.completedByAdopter = true;
    }

    // Check if both parties have confirmed
    if (adoptionRequest.completedByOwner && adoptionRequest.completedByAdopter) {
      adoptionRequest.adoptionCompleted = true;
      adoptionRequest.completedAt = Date.now();
      adoptionRequest.status = 'Completed';

      // Update pet status to Adopted
      const pet = await AdoptionPet.findById(adoptionRequest.pet);
      if (pet) {
        pet.status = 'Adopted';
        // Transfer pet ownership to adopter
        if (pet && adoptionRequest.requester) {
          pet.user = adoptionRequest.requester;
          await pet.save();
        }
      }

      // Also add to adopter's health tracker (Pet collection)
      // Check if already exists to avoid duplicates
      const existingPet = await Pet.findOne({ user: adoptionRequest.requester, name: pet.petName });
      if (!existingPet) {
        // Copy all relevant fields from AdoptionPet to Pet
        const petData = {
          user: adoptionRequest.requester,
          name: pet.petName,
          breed: pet.breed,
          birthDate: pet.birthDate,
          weight: pet.weight,
          image: (pet.photos && pet.photos.length > 0) ? pet.photos[0] : undefined,
          age: pet.age,
          species: pet.species,
          description: pet.description,
          // Add more fields as needed
        };
        const newPet = await Pet.create(petData);

        // Migrate health records from AdoptionPet to new Pet
        const HealthRecord = require('../models/HealthRecord');
        const oldRecords = await HealthRecord.find({ pet: pet._id });
        for (const record of oldRecords) {
          await HealthRecord.create({
            user: adoptionRequest.requester,
            pet: newPet._id,
            recordType: record.recordType,
            date: record.date,
            veterinarian: record.veterinarian,
            nextDueDate: record.nextDueDate,
          });
        }
      }

      await adoptionRequest.save();

      // Different success messages for owner and adopter
      const successMessage = isOwner 
        ? 'Donation successful! 🎉 Thank you for helping find a loving home.' 
        : 'Adoption successful! 🎉 Welcome your new companion!';

      return res.status(200).json({
        message: successMessage,
        request: adoptionRequest,
        completed: true,
      });
    }

    await adoptionRequest.save();

    res.status(200).json({
      message: 'Your confirmation has been recorded. Waiting for the other party to confirm.',
      request: adoptionRequest,
      completed: false,
    });
  } catch (error) {
    console.error('Error confirming adoption completion:', error);
    res.status(500).json({ message: 'Server error while confirming adoption completion' });
  }
});

module.exports = router;
