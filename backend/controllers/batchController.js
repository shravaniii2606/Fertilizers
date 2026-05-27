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

function normalizeBagId(value) {
  return typeof value === 'string' ? value.trim() : '';
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

async function markBagSent(req, res) {
  try {
    const bagId = normalizeBagId(req.body.bagId);

    if (!bagId) {
      return res.status(400).json({ error: 'Bag ID is required.' });
    }

    const supabase = getSupabaseClient();
    const { data: batches, error: fetchError } = await supabase
      .from(batchesTable)
      .select('*')
      .contains('bag_ids', [bagId])
      .limit(1);

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    const batch = batches?.[0];

    if (!batch) {
      return res.status(404).json({ error: 'No batch found for this bag ID.' });
    }

    const currentQRCodes = Array.isArray(batch.qr_codes) ? batch.qr_codes : [];
    const matchingQRCode = currentQRCodes.find((qrCode) => qrCode?.bagId === bagId);
    const currentStatus = matchingQRCode?.status ?? null;

    if (currentStatus === 'sent') {
      return res.status(200).json({
        bagId,
        batchNumber: batch.batch_number,
        status: currentStatus,
        changed: false,
        message: 'This bag was already marked as sent.',
      });
    }

    if (currentStatus !== null) {
      return res.status(200).json({
        bagId,
        batchNumber: batch.batch_number,
        status: currentStatus,
        changed: false,
        message: `This bag already has status "${currentStatus}".`,
      });
    }

    const nextQRCodes = matchingQRCode
      ? currentQRCodes.map((qrCode) => (
        qrCode?.bagId === bagId
          ? { ...qrCode, status: 'sent' }
          : qrCode
      ))
      : [...currentQRCodes, { bagId, status: 'sent' }];

    const { data: updatedBatch, error: updateError } = await supabase
      .from(batchesTable)
      .update({ qr_codes: nextQRCodes })
      .eq('id', batch.id)
      .select('*')
      .single();

    if (updateError) {
      return res.status(500).json({ error: updateError.message });
    }

    return res.status(200).json({
      bagId,
      batchNumber: updatedBatch.batch_number,
      status: 'sent',
      changed: true,
      message: 'Bag marked as sent.',
    });
  } catch (error) {
    const causeMessage = error.cause?.message || error.cause?.code || null;
    const details = [error.message, causeMessage].filter(Boolean).join(' | ');
    console.error('Mark bag sent failed:', error);
    return res.status(500).json({ error: details || 'Unknown server error' });
  }
}

module.exports = {
  createBatch,
  listBatches,
  markBagSent,
};
