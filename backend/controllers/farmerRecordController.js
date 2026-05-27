const { getSupabaseClient } = require('../supabase');

const farmerRecordsTable = process.env.SUPABASE_FARMER_RECORDS_TABLE || 'farmer_records';

function getErrorMessage(error) {
  const causeMessage = error.cause?.message || error.cause?.code || null;

  if (causeMessage?.includes('ENOTFOUND') || error.message?.includes('ENOTFOUND')) {
    return 'Supabase host could not be found. Check backend/.env SUPABASE_URL and make sure it matches your Supabase Project URL.';
  }

  return [error.message, causeMessage].filter(Boolean).join(' | ') || 'Unknown server error';
}

async function getFarmerRecordMetrics(req, res) {
  try {
    const supabase = getSupabaseClient();

    const { count: totalFarmers, error: totalError } = await supabase
      .from(farmerRecordsTable)
      .select('id', { count: 'exact', head: true });

    if (totalError) {
      return res.status(500).json({ error: totalError.message });
    }

    const { count: activeFarmers, error: activeError } = await supabase
      .from(farmerRecordsTable)
      .select('id', { count: 'exact', head: true })
      .ilike('status', 'active');

    if (activeError) {
      return res.status(500).json({ error: activeError.message });
    }

    return res.status(200).json({
      totalFarmers: totalFarmers || 0,
      activeFarmers: activeFarmers || 0,
    });
  } catch (error) {
    console.error('Get farmer record metrics failed:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

module.exports = {
  getFarmerRecordMetrics,
};
