const mongoose = require('mongoose');

const crashedSchema = new mongoose.Schema({
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time: { type: Date, default: Date.now },
});

// Ensure unique combination of hospitalId and userId
// crashedSchema.index({ hospitalId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Crashed', crashedSchema);
