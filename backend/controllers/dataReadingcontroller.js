const DataReading = require('../models/DataReading');
const Hospital = require('../models/Hospital');
const Crashed = require('../models/crashed');
const { createJwtToken, getUserFromToken } = require('../helpers/jsonToken');
exports.createDataReading = async (req, res) => {
  try {
    const dataReading = new DataReading({
      userId: req.user.id,
      ...req.body,
    });
if (req.body.crashDetected) {
 const latestReading = await DataReading.findOne(
   {
     userId: req.user.id,
     'location.coordinates': { $ne: [] }, // Check that coordinates is not an empty array
   },
   {},
   { sort: { createdAt: -1 } }
 );
 console.log(latestReading)
  if (latestReading) {
    const { coordinates } = latestReading.location; // [lng, lat]

    // Use aggregation to find nearest hospitals
    const nearestHospitals = await Hospital.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: coordinates,
          },
          distanceField: 'dist.calculated',
          maxDistance: 5000, // Example distance in meters
          spherical: true,
          query: {
            'location.coordinates.0': { $ne: null },
            'location.coordinates.1': { $ne: null },
          }, // Ensure location is not null
        },
      },
    ]);
    console.log(nearestHospitals)
    // Create entry in Crashed table for each nearest hospital
    const crashEntries = nearestHospitals.map((hospital) => ({
      hospitalId: hospital._id,
      userId: req.user.id,
      time: new Date(),
    }));

    if (crashEntries.length > 0) {
      await Crashed.insertMany(crashEntries);
    }
  }
}
    const savedReading = await dataReading.save();
    res.status(201).json(savedReading);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getDataReadings = async (req, res) => {
  try {
    const readings = await DataReading.find({ userId: req.user.id });
    res.status(200).json(readings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    const token = authHeader.split(' ')[1];
    const user = await getUserFromToken(token);
    if (!user) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized' });
  }
};
exports.getLatestDataReading = async (req, res) => {
  try {
    const latestReading = await DataReading.findOne(
      { userId: req.user.id },
      {},
      { sort: { createdAt: -1 } }
    );
    
    if (!latestReading) {
      return res.status(404).json({ message: 'No readings found for this user' });
    }
    
    res.status(200).json(latestReading);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};