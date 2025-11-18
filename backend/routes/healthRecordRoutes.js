const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const HealthRecord = require('../models/HealthRecord');
const Pet = require('../models/Pet');

// @route   POST /api/records
// @desc    Create a new health record for a pet
// @access  Protected
router.post('/', protect, async (req, res) => {
  try {
    const { petId, recordType, date, veterinarian, nextDueDate } = req.body;

    // Validate required fields
    if (!petId || !recordType || !date) {
      return res.status(400).json({ 
        message: 'Please provide petId, recordType, and date' 
      });
    }

    // Verify the pet exists and belongs to the user
    const pet = await Pet.findById(petId);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized to add records for this pet' 
      });
    }

    // Create new health record
    const healthRecord = await HealthRecord.create({
      user: req.user.id,
      pet: petId,
      recordType,
      date,
      veterinarian,
      nextDueDate,
    });

    res.status(201).json({
      message: 'Health record created successfully',
      record: healthRecord,
    });
  } catch (error) {
    console.error('Error creating health record:', error);
    res.status(500).json({ message: 'Server error while creating health record' });
  }
});

// @route   GET /api/records/:petId
// @desc    Get all health records for a specific pet
// @access  Protected
router.get('/:petId', protect, async (req, res) => {
  try {
    const { petId } = req.params;

    // Verify the pet exists and belongs to the user
    const pet = await Pet.findById(petId);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized to view records for this pet' 
      });
    }

    // Find all health records for this pet
    const healthRecords = await HealthRecord.find({ 
      pet: petId,
      user: req.user.id 
    }).sort({ date: -1 });

    res.status(200).json({
      message: 'Health records retrieved successfully',
      count: healthRecords.length,
      records: healthRecords,
    });
  } catch (error) {
    console.error('Error fetching health records:', error);
    res.status(500).json({ message: 'Server error while fetching health records' });
  }
});

// @route   GET /api/records/record/:id
// @desc    Get a single health record by ID
// @access  Protected
router.get('/record/:id', protect, async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    // Make sure the record belongs to the logged-in user
    if (record.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized to view this health record' 
      });
    }

    res.status(200).json({
      message: 'Health record retrieved successfully',
      record,
    });
  } catch (error) {
    console.error('Error fetching health record:', error);
    res.status(500).json({ message: 'Server error while fetching health record' });
  }
});

// @route   PUT /api/records/:id
// @desc    Update a health record
// @access  Protected
router.put('/:id', protect, async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    // Make sure the record belongs to the logged-in user
    if (record.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized to update this health record' 
      });
    }

    // Update record fields
    const { recordType, date, veterinarian, nextDueDate } = req.body;
    
    if (recordType !== undefined) record.recordType = recordType;
    if (date !== undefined) record.date = date;
    if (veterinarian !== undefined) record.veterinarian = veterinarian;
    if (nextDueDate !== undefined) record.nextDueDate = nextDueDate;

    const updatedRecord = await record.save();

    res.status(200).json({
      message: 'Health record updated successfully',
      record: updatedRecord,
    });
  } catch (error) {
    console.error('Error updating health record:', error);
    res.status(500).json({ message: 'Server error while updating health record' });
  }
});

// @route   DELETE /api/records/:id
// @desc    Delete a health record
// @access  Protected
router.delete('/:id', protect, async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Health record not found' });
    }

    // Make sure the record belongs to the logged-in user
    if (record.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this health record' 
      });
    }

    await record.deleteOne();

    res.status(200).json({
      message: 'Health record deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error('Error deleting health record:', error);
    res.status(500).json({ message: 'Server error while deleting health record' });
  }
});

module.exports = router;
