const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Hospital = require('../models/Hospital');
const createJwtToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    'Rajbeer',
    { expiresIn: '1month' }
  );
};

const getUserFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, 'Rajbeer');
    const user = await User.findById(decoded.userId);
    return user;
  } catch (error) {
    return null;
  }
};
const getHospitalFromToken = async (token) => {
  try {
    const decoded = jwt.verify(token, 'Rajbeer');
    console.log(decoded)
    const user = await Hospital.findById(decoded.id);
    console.log(user)
    return user;
  } catch (error) {
    return null;
  }
};

module.exports = { createJwtToken, getUserFromToken, getHospitalFromToken };
  