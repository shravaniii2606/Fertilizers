const express = require('express');
const { createScanRecord, listScanRecords } = require('../controllers/scanRecordController');

const router = express.Router();

router.get('/', listScanRecords);
router.post('/', createScanRecord);

module.exports = router;
