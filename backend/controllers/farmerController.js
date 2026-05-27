const { getSupabaseClient } = require('../supabase');

const farmersTable = process.env.SUPABASE_FARMERS_TABLE || 'farmers';

async function listFarmers(req, res) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from(farmersTable)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ farmers: data || [] });
  } catch (error) {
    const causeMessage = error.cause?.message || error.cause?.code || null;
    const details = [error.message, causeMessage].filter(Boolean).join(' | ');
    console.error('List farmers failed:', error);
    return res.status(500).json({ error: details || 'Unknown server error' });
  }
}

module.exports = {
  listFarmers,
};
