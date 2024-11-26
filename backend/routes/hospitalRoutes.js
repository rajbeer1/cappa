const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');


// Define routes
router.post('/signup', hospitalController.signup); // Hospital signup
router.post('/login', hospitalController.login); // Hospital login
router.get('/',hospitalController.protect,hospitalController.getHospital)


module.exports = router;
