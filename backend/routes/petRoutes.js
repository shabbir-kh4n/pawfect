const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const Pet = require('../models/Pet');

// @route   POST /api/pets
// @desc    Create a new pet for the logged-in user
// @access  Protected
router.post('/', protect, async (req, res) => {
    try {
        const { name, breed, birthDate, weight } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({ message: 'Please provide a pet name' });
        }

        // Create new pet with user ID from the authenticated request
        const pet = await Pet.create({
            user: req.user.id,
            name,
            breed,
            birthDate,
            weight,
        });

        res.status(201).json({
            message: 'Pet created successfully',
            pet,
        });
    } catch (error) {
        console.error('Error creating pet:', error);
        res.status(500).json({ message: 'Server error while creating pet' });
    }
});

// @route   GET /api/pets
// @desc    Get all pets for the logged-in user
// @access  Protected
router.get('/', protect, async (req, res) => {
    try {
        // Find all pets that belong to the authenticated user
        const pets = await Pet.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Pets retrieved successfully',
            count: pets.length,
            pets,
        });
    } catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({ message: 'Server error while fetching pets' });
    }
});

// @route   GET /api/pets/:id
// @desc    Get a single pet by ID
// @access  Protected
router.get('/:id', protect, async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Make sure the pet belongs to the logged-in user
        if (pet.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this pet' });
        }

        res.status(200).json({
            message: 'Pet retrieved successfully',
            pet,
        });
    } catch (error) {
        console.error('Error fetching pet:', error);
        res.status(500).json({ message: 'Server error while fetching pet' });
    }
});

// @route   PUT /api/pets/:id
// @desc    Update a pet
// @access  Protected
router.put('/:id', protect, async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Make sure the pet belongs to the logged-in user
        if (pet.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this pet' });
        }

        // Update pet fields
        const { name, breed, birthDate, weight } = req.body;

        if (name !== undefined) pet.name = name;
        if (breed !== undefined) pet.breed = breed;
        if (birthDate !== undefined) pet.birthDate = birthDate;
        if (weight !== undefined) pet.weight = weight;

        const updatedPet = await pet.save();

        res.status(200).json({
            message: 'Pet updated successfully',
            pet: updatedPet,
        });
    } catch (error) {
        console.error('Error updating pet:', error);
        res.status(500).json({ message: 'Server error while updating pet' });
    }
});

// @route   DELETE /api/pets/:id
// @desc    Delete a pet
// @access  Protected
router.delete('/:id', protect, async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Make sure the pet belongs to the logged-in user
        if (pet.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this pet' });
        }

        await pet.deleteOne();

        res.status(200).json({
            message: 'Pet deleted successfully',
            id: req.params.id,
        });
    } catch (error) {
        console.error('Error deleting pet:', error);
        res.status(500).json({ message: 'Server error while deleting pet' });
    }
});

module.exports = router;
