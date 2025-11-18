const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const VetService = require('../models/VetService');

// @route   POST /api/services
// @desc    Create a new vet service/clinic
// @access  Protected
router.post('/', protect, async (req, res) => {
  try {
    const { name, address, phone, services, is247, isEmergency } = req.body;

    // Validate required fields
    if (!name || !address) {
      return res.status(400).json({ 
        message: 'Please provide name and address' 
      });
    }

    // Create new vet service
    const vetService = await VetService.create({
      name,
      address,
      phone,
      services,
      is247,
      isEmergency,
      addedBy: req.user.id,
    });

    res.status(201).json({
      message: 'Vet service created successfully',
      service: vetService,
    });
  } catch (error) {
    console.error('Error creating vet service:', error);
    res.status(500).json({ message: 'Server error while creating vet service' });
  }
});

// @route   GET /api/services
// @desc    Get all vet services
// @access  Public
router.get('/', async (req, res) => {
  try {
    // Find all vet services, sorted by most recent first
    const vetServices = await VetService.find()
      .sort({ createdAt: -1 })
      .populate('addedBy', 'email');

    res.status(200).json({
      message: 'Vet services retrieved successfully',
      count: vetServices.length,
      services: vetServices,
    });
  } catch (error) {
    console.error('Error fetching vet services:', error);
    res.status(500).json({ message: 'Server error while fetching vet services' });
  }
});

// @route   GET /api/services/:id
// @desc    Get a single vet service by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const vetService = await VetService.findById(req.params.id)
      .populate('addedBy', 'email');

    if (!vetService) {
      return res.status(404).json({ message: 'Vet service not found' });
    }

    res.status(200).json({
      message: 'Vet service retrieved successfully',
      service: vetService,
    });
  } catch (error) {
    console.error('Error fetching vet service:', error);
    res.status(500).json({ message: 'Server error while fetching vet service' });
  }
});

// @route   PUT /api/services/:id
// @desc    Update a vet service
// @access  Protected (only owner can update)
router.put('/:id', protect, async (req, res) => {
  try {
    const vetService = await VetService.findById(req.params.id);

    if (!vetService) {
      return res.status(404).json({ message: 'Vet service not found' });
    }

    // Check if user is the owner
    if (vetService.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    // Update fields
    const { name, address, phone, services, is247, isEmergency } = req.body;
    
    vetService.name = name || vetService.name;
    vetService.address = address || vetService.address;
    vetService.phone = phone || vetService.phone;
    vetService.services = services || vetService.services;
    vetService.is247 = is247 !== undefined ? is247 : vetService.is247;
    vetService.isEmergency = isEmergency !== undefined ? isEmergency : vetService.isEmergency;

    const updatedService = await vetService.save();

    res.status(200).json({
      message: 'Vet service updated successfully',
      service: updatedService,
    });
  } catch (error) {
    console.error('Error updating vet service:', error);
    res.status(500).json({ message: 'Server error while updating vet service' });
  }
});

// @route   DELETE /api/services/:id
// @desc    Delete a vet service
// @access  Protected (only owner can delete)
router.delete('/:id', protect, async (req, res) => {
  try {
    const vetService = await VetService.findById(req.params.id);

    if (!vetService) {
      return res.status(404).json({ message: 'Vet service not found' });
    }

    // Check if user is the owner
    if (vetService.addedBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    await vetService.deleteOne();

    res.status(200).json({
      message: 'Vet service deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting vet service:', error);
    res.status(500).json({ message: 'Server error while deleting vet service' });
  }
});

module.exports = router;
