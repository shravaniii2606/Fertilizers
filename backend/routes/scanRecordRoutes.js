const express = require('express');
const router = express.Router();
const { getSupabaseClient } = require('../supabase'); // ← matches batchController
const { createScanRecord, listScanRecords, getTotalBagsScanned } = require('../controllers/scanRecordController');
router.get('/', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('dealer_scan_records')
      .select('*')
      .order('scanned_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    res.json({ scanRecords: data || [] });
  } catch (err) {
    console.error('scanRecordRoutes GET failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const supabase = getSupabaseClient();
    const { decodedPayload, batch, dealer_id, dealer_name, location } = req.body;

    const { data, error } = await supabase
      .from('dealer_scan_records')
      .insert([{
        bag_id:         decodedPayload?.bagId || decodedPayload?.bag_id || null,
        batch_number:   decodedPayload?.batchNumber || batch?.batch_number || null,
        product_name:   batch?.product_name || null,
        number_of_bags: batch?.number_of_bags || null,
        manufacturer:   batch?.manufacturer || null,
        bag_weight:     batch?.bag_weight || null,
        dealer_id:      dealer_id || null,
        dealer_name:    dealer_name || null,
        location:       location || null,
        scanned_at:     new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json({ scanRecord: data });
  } catch (err) {
    console.error('scanRecordRoutes POST failed:', err.message);
    res.status(500).json({ error: err.message });
  }
});
router.get('/total-bags', getTotalBagsScanned);
module.exports = router;