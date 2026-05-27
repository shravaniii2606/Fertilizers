const { getSupabaseClient } = require('../supabase');

const batchesTable = process.env.SUPABASE_BATCHES_TABLE || 'batches';

function normalizeBatchPayload(body) {
  const numberOfBags = Number.parseInt(body.numberOfBags, 10);
  const productPrice = body.productPrice === '' || body.productPrice === undefined
    ? null
    : Number.parseFloat(body.productPrice);

  return {
    batch_number: body.batchNumber?.trim() || null,
    number_of_bags: numberOfBags,
    product_name: body.productName?.trim() || null,
    product_price: Number.isFinite(productPrice) ? productPrice : null,
    product_expiry: body.productExpiry || null,
    manufacturer: body.manufacturer?.trim() || null,
    bag_weight: body.bagWeight?.trim() || null,
    bag_ids: Array.isArray(body.bagIds) ? body.bagIds : [],
    qr_codes: Array.isArray(body.qrCodes) ? body.qrCodes : [],
  };
}

async function createBatch(req, res) {
  try {
    const payload = normalizeBatchPayload(req.body);

    if (!payload.batch_number) {
      return res.status(400).json({ error: 'Batch number is required.' });
    }

    if (!Number.isInteger(payload.number_of_bags) || payload.number_of_bags <= 0) {
      return res.status(400).json({ error: 'A valid number of bags is required.' });
    }

    if (payload.bag_ids.length !== payload.number_of_bags) {
      return res.status(400).json({ error: 'Bag IDs count must match the number of bags.' });
    }

    if (payload.qr_codes.length > 0 && payload.qr_codes.length !== payload.number_of_bags) {
      return res.status(400).json({ error: 'QR codes count must match the number of bags.' });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from(batchesTable)
      .insert([payload])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(201).json({ batch: data });
  } catch (error) {
    const causeMessage = error.cause?.message || error.cause?.code || null;
    const details = [error.message, causeMessage].filter(Boolean).join(' | ');
    console.error('Create batch failed:', error);
    return res.status(500).json({ error: details || 'Unknown server error' });
  }
}

async function listBatches(req, res) {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from(batchesTable)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ batches: data });
  } catch (error) {
    const causeMessage = error.cause?.message || error.cause?.code || null;
    const details = [error.message, causeMessage].filter(Boolean).join(' | ');
    console.error('List batches failed:', error);
    return res.status(500).json({ error: details || 'Unknown server error' });
  }
}

module.exports = {
  createBatch,
  listBatches,
};
