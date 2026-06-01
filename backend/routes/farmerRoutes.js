const express = require('express');
const { listFarmers, getFarmerByAadhar } = require('../controllers/farmerController');

const router = express.Router();

router.get('/', listFarmers);
router.get('/:aadhar', getFarmerByAadhar);

module.exports = router;
