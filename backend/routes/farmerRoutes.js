const express = require('express');
const { listFarmers } = require('../controllers/farmerController');

const router = express.Router();

router.get('/', listFarmers);

module.exports = router;
