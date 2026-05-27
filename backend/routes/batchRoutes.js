const express = require('express');
const { createBatch, listBatches, markBagSent } = require('../controllers/batchController');

const router = express.Router();

router.get('/', listBatches);
router.post('/', createBatch);
router.post('/scan', markBagSent);

module.exports = router;
