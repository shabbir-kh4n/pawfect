const mongoose = require('mongoose');

// Define the HealthRecord schema
const healthRecordSchema = new mongoose.Schema(
  {
    // Reference to the user who owns this record
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Reference to the pet this record belongs to
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Pet',
    },
    // Type of health record (vaccination, checkup, treatment, etc.)
    recordType: {
      type: String,
      required: [true, 'Please add a record type'],
      trim: true,
    },
    // Date of the record
    date: {
      type: Date,
      required: [true, 'Please add a date'],
    },
    // Veterinarian who performed the service
    veterinarian: {
      type: String,
      trim: true,
    },
    // Next due date for follow-up or renewal
    nextDueDate: {
      type: Date,
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create and export the HealthRecord model
const HealthRecord = mongoose.model('HealthRecord', healthRecordSchema);

module.exports = HealthRecord;
