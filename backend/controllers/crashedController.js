
const Crashed = require('../models/crashed');
const DataReading = require('../models/DataReading');
const { getHospitalFromToken } = require('../helpers/jsonToken');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming you have a User model

exports.getCrashesByHospitalId = async (req, res) => {
  try {
    // Fetch crashes for the hospital
    const crashes = await Crashed.find({ hospitalId: req.user.id });

    // Create a map to store the latest crash per user
    const latestCrashes = {};

    crashes.forEach(crash => {
      if (!latestCrashes[crash.userId] || new Date(crash.time) > new Date(latestCrashes[crash.userId].time)) {
        latestCrashes[crash.userId] = crash;
      }
    });

    // Get user details for the latest crashes
    const crashDetails = await Promise.all(
      Object.values(latestCrashes).map(async crash => {
        const user = await User.findById(crash.userId); // Fetch user details
         const latestReading = await DataReading.findOne(
           { userId: crash.userId },
           {},
           { sort: { createdAt: -1 } }
         );
    
        return {
          crash,
          userDetails: user, // Include user details
          latestReading: latestReading // Include latest reading
        };
      })
    );

    res.status(200).json(crashDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// ... existing code ...
exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const token = authHeader.split(' ')[1];
    const user = await getHospitalFromToken(token);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};
