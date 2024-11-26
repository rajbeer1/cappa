const mongoose = require('mongoose');

const dataReadingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      type: {
        type: String, // 'Point'
        enum: ['Point'], // 'Point' is the only type supported
        required: false,
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: false,
      },
    },
    accelerometer: {
      x: { type: Number, required: false },
      y: { type: Number, required: false },
      z: { type: Number, required: false },
    },
    crashDetected: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('DataReading', dataReadingSchema);
