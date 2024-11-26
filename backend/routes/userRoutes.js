const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.post('/signup', userController.signup);
router.post('/login', userController.login);

// Protected routes
router.get('/', userController.protect, userController.getUsers);

module.exports = router;
