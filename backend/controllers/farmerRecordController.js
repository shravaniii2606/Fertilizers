const { getSupabaseClient } = require('../supabase');

function getErrorMessage(error) {
  const causeMessage = error.cause?.message || error.cause?.code || null;
  if (causeMessage?.includes('ENOTFOUND') || error.message?.includes('ENOTFOUND')) {
    return 'Supabase host could not be found. Check backend/.env SUPABASE_URL.';
  }
  return [error.message, causeMessage].filter(Boolean).join(' | ') || 'Unknown server error';
}

// GET /api/farmer-records/metrics
async function getFarmerRecordMetrics(req, res) {
  try {
    const supabase = getSupabaseClient();

    const { count: totalFarmers, error: totalError } = await supabase
      .from('farmer_records')
      .select('aadhar_id', { count: 'exact', head: true });

    if (totalError) {
      return res.status(500).json({ error: totalError.message });
    }

    return res.status(200).json({
      totalFarmers: totalFarmers || 0,
      activeFarmers: totalFarmers || 0,
    });
  } catch (error) {
    console.error('Get farmer record metrics failed:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

// GET /api/farmer-records/
// Returns list of all farmers (basic info only)
async function listAllFarmers(req, res) {
  try {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('farmer_records')
      .select('aadhar_id, name, village, district, limit, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ farmers: data || [] });
  } catch (error) {
    console.error('List all farmers failed:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

// GET /api/farmer-records/:aadhar
// Returns full joined detail: farmer + land + crop + soil health
async function getFarmerDetails(req, res) {
  try {
    const { aadhar } = req.params;
    if (!aadhar) {
      return res.status(400).json({ error: 'Aadhar ID parameter is required.' });
    }

    const supabase = getSupabaseClient();

    // Run all four queries in parallel for speed
    const [farmerRes, landRes, cropRes, soilRes] = await Promise.all([
      supabase
        .from('farmer_records')
        .select('aadhar_id, name, village, district, limit')
        .eq('aadhar_id', aadhar)
        .single(),
      supabase
        .from('land_records')
        .select('id, land_area')
        .eq('aadhar_id', aadhar),
      supabase
        .from('crop_records')
        .select('id, season, crop_types')
        .eq('aadhar_id', aadhar),
      supabase
        .from('soilhealth_records')
        .select('id, nitrogen, phosphorus, potassium')
        .eq('aadhar_id', aadhar),
    ]);

    if (farmerRes.error) {
      if (farmerRes.error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Farmer not found.' });
      }
      return res.status(500).json({ error: farmerRes.error.message });
    }

    return res.status(200).json({
      farmer:      farmerRes.data,
      land:        landRes.data    || [],
      crops:       cropRes.data    || [],
      soilHealth:  soilRes.data    || [],
    });
  } catch (error) {
    console.error('Get farmer details failed:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

module.exports = {
  getFarmerRecordMetrics,
  listAllFarmers,
  getFarmerDetails,
};
