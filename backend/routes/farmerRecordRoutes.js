const express = require('express');
const {
  getFarmerRecordMetrics,
  listAllFarmers,
  getFarmerDetails,
} = require('../controllers/farmerRecordController');

const router = express.Router();

// GET /api/farmer-records/metrics  — summary counts
router.get('/metrics', getFarmerRecordMetrics);

// GET /api/farmer-records/          — list all farmers (basic info)
router.get('/', listAllFarmers);

// GET /api/farmer-records/:aadhar   — full detail across all 4 tables
router.get('/:aadhar', getFarmerDetails);

module.exports = router;
