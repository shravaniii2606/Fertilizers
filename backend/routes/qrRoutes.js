const express = require('express');
const { generateBagQRCodes } = require('../controllers/qrController');

const router = express.Router();

router.post('/', generateBagQRCodes);

module.exports = router;
