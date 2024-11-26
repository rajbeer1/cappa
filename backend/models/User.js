const mongoose = require('mongoose');

const bloodGroupEnum = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const userSchema = new mongoose.Schema(
  {
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    DOB: {
      type: Date,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    fatherName: {
         type: String,
      required: true,
    },
    emergencyContactNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    bloodGroup: {
      type: String,
      enum: bloodGroupEnum,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
