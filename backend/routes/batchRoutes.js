const express = require('express');
<<<<<<< HEAD
const { createBatch, listBatches, markBagSent } = require('../controllers/batchController');
=======
const { createBatch, listBatches, scanBatchBag } = require('../controllers/batchController');
>>>>>>> 70271fdb8863a50515da39d447cd4990a37ded64

const router = express.Router();

router.get('/', listBatches);
router.post('/', createBatch);
<<<<<<< HEAD
router.post('/scan', markBagSent);
=======
router.post('/scan', scanBatchBag);
>>>>>>> 70271fdb8863a50515da39d447cd4990a37ded64

module.exports = router;
