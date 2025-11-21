const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
  {
    adoptionRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdoptionRequest',
      required: true,
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AdoptionPet',
      required: true,
    },
    petOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adopter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    lastMessage: {
      type: String,
      default: '',
    },
    lastMessageTime: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
chatSchema.index({ petOwner: 1, adopter: 1 });
chatSchema.index({ adoptionRequest: 1 });

module.exports = mongoose.model('Chat', chatSchema);
