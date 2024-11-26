const Hospital = require('../models/Hospital');
const jwt = require('jsonwebtoken');
const { getHospitalFromToken } = require('../helpers/jsonToken');
// Signup (Register a new hospital)
exports.signup = async (req, res) => {
  const { name, address, location, phoneNumber, email, password } = req.body;

  try {
    const newHospital = new Hospital({
      name,
      address,
      location,
      phoneNumber,
      email,
      password,
    });
    await newHospital.save();
      const token = jwt.sign({ id: newHospital._id }, process.env.JWT_SECRET, {
        expiresIn: '1month',
    });
    res
      .status(201)
      .json({ message: 'Hospital created successfully', token });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: error.message });
  }
};

// Login (Authenticate a hospital)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const hospital = await Hospital.findOne({ email });
    if (!hospital || !(await hospital.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token
    const token = jwt.sign({ id: hospital._id }, process.env.JWT_SECRET, {
      expiresIn: '1month',
    });
    res.status(200).json({ token });
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
exports.getHospital = async (req, res) => {
  try {
    // const users = await User.find().select('-password');
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};