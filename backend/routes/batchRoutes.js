const express = require('express');
const { createBatch, listBatches } = require('../controllers/batchController');

const router = express.Router();

router.get('/', listBatches);
router.post('/', createBatch);

module.exports = router;
