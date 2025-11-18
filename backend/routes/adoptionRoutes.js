const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const AdoptionPet = require('../models/AdoptionPet');

// Configure multer disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Save files to uploads folder
  },
  filename: function (req, file, cb) {
    // Create unique filename: timestamp + original extension
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Create multer upload middleware - accept up to 5 photos
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
}).array('photos', 5);

// @route   POST /api/adoption
// @desc    Create a new pet listing for adoption
// @access  Protected
router.post('/', protect, upload, async (req, res) => {
  try {
    console.log('Received adoption request from user:', req.user?.id);
    console.log('Request body:', req.body);
    console.log('Files uploaded:', req.files?.length || 0);

    const {
      petName,
      species,
      breed,
      age,
      gender,
      size,
      color,
      energyLevel,
      description,
      healthStatus,
      vaccinated,
      spayedNeutered,
      goodWithKids,
      goodWithOtherPets,
      isStray,
      city,
      state,
      donatorName,
      donatorEmail,
      donatorPhone,
      reasonForDonation,
    } = req.body;

    // Validate required fields
    if (!petName || !species || !city || !state || !donatorName || !donatorEmail || !donatorPhone) {
      console.log('Validation failed. Missing fields:', {
        petName: !!petName,
        species: !!species,
        city: !!city,
        state: !!state,
        donatorName: !!donatorName,
        donatorEmail: !!donatorEmail,
        donatorPhone: !!donatorPhone
      });
      return res.status(400).json({ 
        message: 'Please provide all required fields: petName, species, city, state, donatorName, donatorEmail, donatorPhone' 
      });
    }

    // Process uploaded photos
    const photoUrls = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

    // Create new adoption pet listing
    const adoptionPet = await AdoptionPet.create({
      user: req.user.id,
      petName,
      species,
      breed,
      age,
      gender,
      size,
      color,
      energyLevel,
      description,
      healthStatus,
      vaccinated: vaccinated === true || vaccinated === 'true',
      spayedNeutered: spayedNeutered === true || spayedNeutered === 'true',
      goodWithKids: goodWithKids === true || goodWithKids === 'true',
      goodWithOtherPets: goodWithOtherPets === true || goodWithOtherPets === 'true',
      isStray: isStray === true || isStray === 'true',
      city,
      state,
      photos: photoUrls, // Save uploaded photo URLs
      donatorName,
      donatorEmail,
      donatorPhone,
      reasonForDonation,
    });

    res.status(201).json({
      message: 'Pet listing created successfully',
      pet: adoptionPet,
    });
  } catch (error) {
    console.error('Error creating adoption pet:', error);
    res.status(500).json({ message: 'Server error while creating pet listing' });
  }
});

// @route   GET /api/adoption
// @desc    Get all pets available for adoption
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Find all adoption pets, sorted by most recent first
    const adoptionPets = await AdoptionPet.find({ status: 'Available' })
      .sort({ createdAt: -1 })
      .populate('user', 'email'); // Optionally populate user email

    res.status(200).json({
      message: 'Adoption pets retrieved successfully',
      count: adoptionPets.length,
      pets: adoptionPets,
    });
  } catch (error) {
    console.error('Error fetching adoption pets:', error);
    res.status(500).json({ message: 'Server error while fetching adoption pets' });
  }
});

// @route   GET /api/adoption/:id
// @desc    Get a single adoption pet by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const adoptionPet = await AdoptionPet.findById(req.params.id)
      .populate('user', 'email');

    if (!adoptionPet) {
      return res.status(404).json({ message: 'Adoption pet not found' });
    }

    res.status(200).json({
      message: 'Adoption pet retrieved successfully',
      pet: adoptionPet,
    });
  } catch (error) {
    console.error('Error fetching adoption pet:', error);
    res.status(500).json({ message: 'Server error while fetching adoption pet' });
  }
});

// @route   PUT /api/adoption/:id
// @desc    Update an adoption pet listing
// @access  Protected (only owner can update)
router.put('/:id', protect, async (req, res) => {
  try {
    const adoptionPet = await AdoptionPet.findById(req.params.id);

    if (!adoptionPet) {
      return res.status(404).json({ message: 'Adoption pet not found' });
    }

    // Make sure the listing belongs to the logged-in user
    if (adoptionPet.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized to update this listing' 
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'petName', 'species', 'breed', 'age', 'gender', 'size', 'color',
      'energyLevel', 'description', 'healthStatus', 'vaccinated',
      'spayedNeutered', 'goodWithKids', 'goodWithOtherPets', 'isStray',
      'city', 'state', 'donatorName', 'donatorEmail', 'donatorPhone',
      'reasonForDonation', 'status'
    ];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        adoptionPet[field] = req.body[field];
      }
    });

    const updatedPet = await adoptionPet.save();

    res.status(200).json({
      message: 'Adoption pet updated successfully',
      pet: updatedPet,
    });
  } catch (error) {
    console.error('Error updating adoption pet:', error);
    res.status(500).json({ message: 'Server error while updating adoption pet' });
  }
});

// @route   DELETE /api/adoption/:id
// @desc    Delete an adoption pet listing
// @access  Protected (only owner can delete)
router.delete('/:id', protect, async (req, res) => {
  try {
    const adoptionPet = await AdoptionPet.findById(req.params.id);

    if (!adoptionPet) {
      return res.status(404).json({ message: 'Adoption pet not found' });
    }

    // Make sure the listing belongs to the logged-in user
    if (adoptionPet.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this listing' 
      });
    }

    await adoptionPet.deleteOne();

    res.status(200).json({
      message: 'Adoption pet listing deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error('Error deleting adoption pet:', error);
    res.status(500).json({ message: 'Server error while deleting adoption pet' });
  }
});

module.exports = router;
