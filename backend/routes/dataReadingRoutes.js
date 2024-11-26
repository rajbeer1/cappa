const express = require('express');
const router = express.Router();
const dataReadingController = require('../controllers/dataReadingcontroller');

router.post('/',dataReadingController.protect, dataReadingController.createDataReading);
router.get('/',dataReadingController.protect, dataReadingController.getDataReadings);
router.get('/latest',dataReadingController.protect, dataReadingController.getLatestDataReading);
module.exports = router;
