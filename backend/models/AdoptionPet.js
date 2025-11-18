const mongoose = require('mongoose');

// Define the AdoptionPet schema
const adoptionPetSchema = new mongoose.Schema(
  {
    // Reference to the user who donated/listed this pet
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Basic Pet Information
    petName: {
      type: String,
      required: [true, 'Please add a pet name'],
      trim: true,
    },
    species: {
      type: String,
      required: [true, 'Please specify the species'],
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: [0, 'Age must be a positive number'],
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unknown'],
    },
    size: {
      type: String,
      enum: ['Small', 'Medium', 'Large', 'Extra Large'],
    },
    color: {
      type: String,
      trim: true,
    },
    energyLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High', 'Very High'],
    },
    description: {
      type: String,
      trim: true,
    },
    healthStatus: {
      type: String,
      trim: true,
    },
    // Health & Behavior Flags
    vaccinated: {
      type: Boolean,
      default: false,
    },
    spayedNeutered: {
      type: Boolean,
      default: false,
    },
    goodWithKids: {
      type: Boolean,
      default: false,
    },
    goodWithOtherPets: {
      type: Boolean,
      default: false,
    },
    isStray: {
      type: Boolean,
      default: false,
    },
    // Location Information
    city: {
      type: String,
      required: [true, 'Please add a city'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'Please add a state'],
      trim: true,
    },
    // Photos (array of image URLs or file paths)
    photos: {
      type: [String],
      default: [],
    },
    // Donator/Contact Information
    donatorName: {
      type: String,
      required: [true, 'Please add your name'],
      trim: true,
    },
    donatorEmail: {
      type: String,
      required: [true, 'Please add your email'],
      trim: true,
      lowercase: true,
    },
    donatorPhone: {
      type: String,
      required: [true, 'Please add your phone number'],
      trim: true,
    },
    reasonForDonation: {
      type: String,
      trim: true,
    },
    // Status field (optional, for tracking adoption status)
    status: {
      type: String,
      enum: ['Available', 'Pending', 'Adopted'],
      default: 'Available',
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create and export the AdoptionPet model
const AdoptionPet = mongoose.model('AdoptionPet', adoptionPetSchema);

module.exports = AdoptionPet;
