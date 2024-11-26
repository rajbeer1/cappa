const express = require('express');
const crashedController = require('../controllers/crashedController');
const router = express.Router();

router.get(
  '/',crashedController.protect,
  crashedController.getCrashesByHospitalId
);

module.exports = router;
