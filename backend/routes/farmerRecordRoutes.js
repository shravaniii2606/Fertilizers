const express = require('express');
const { getFarmerRecordMetrics } = require('../controllers/farmerRecordController');

const router = express.Router();

router.get('/metrics', getFarmerRecordMetrics);

module.exports = router;
