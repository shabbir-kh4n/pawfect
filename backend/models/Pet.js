const mongoose = require('mongoose');

// Define the Pet schema
const petSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this pet
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Pet's name
    name: {
      type: String,
      required: [true, 'Please add a pet name'],
      trim: true,
    },
    // Pet's breed
    breed: {
      type: String,
      trim: true,
    },
    // Pet's birth date
    birthDate: {
      type: Date,
    },
    // Pet's weight (in kg or lbs)
    weight: {
      type: Number,
      min: [0, 'Weight must be a positive number'],
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create and export the Pet model
const Pet = mongoose.model('Pet', petSchema);

module.exports = Pet;
