const mongoose = require('mongoose');

const vetServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a service name'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please add an address'],
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    services: {
      type: [String],
      default: [],
    },
    is247: {
      type: Boolean,
      default: false,
    },
    isEmergency: {
      type: Boolean,
      default: false,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const VetService = mongoose.model('VetService', vetServiceSchema);

module.exports = VetService;
