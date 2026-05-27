const { getSupabaseClient } = require('../supabase');

const batchesTable = process.env.SUPABASE_BATCHES_TABLE || 'batches';

function getErrorMessage(error) {
  const causeMessage = error.cause?.message || error.cause?.code || null;

  if (causeMessage?.includes('ENOTFOUND') || error.message?.includes('ENOTFOUND')) {
    return 'Supabase host could not be found. Check backend/.env SUPABASE_URL and make sure it matches your Supabase Project URL.';
  }

  return [error.message, causeMessage].filter(Boolean).join(' | ') || 'Unknown server error';
}

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
    console.error('Create batch failed:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
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
    console.error('List batches failed:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

async function scanBatchBag(req, res) {
  try {
    const bagId = req.body.bagId?.trim();

    if (!bagId) {
      return res.status(400).json({ error: 'Bag ID is required.' });
    }

    const supabase = getSupabaseClient();
    const { data: batches, error: findError } = await supabase
      .from(batchesTable)
      .select('id, batch_number, qr_codes');

    if (findError) {
      return res.status(500).json({ error: findError.message });
    }

    const batch = (batches || []).find((currentBatch) => (
      (currentBatch.qr_codes || []).some((qrCode) => qrCode?.bagId === bagId)
    ));

    if (!batch) {
      return res.status(404).json({ error: `No batch found for bag ID ${bagId}.` });
    }

    let changed = false;
    const updatedQrCodes = (batch.qr_codes || []).map((qrCode) => {
      if (qrCode?.bagId !== bagId) {
        return qrCode;
      }

      if (qrCode.status === 'sent') {
        return qrCode;
      }

      changed = true;
      return {
        ...qrCode,
        status: 'sent',
      };
    });

    if (changed) {
      const { error: updateError } = await supabase
        .from(batchesTable)
        .update({ qr_codes: updatedQrCodes })
        .eq('id', batch.id);

      if (updateError) {
        return res.status(500).json({ error: updateError.message });
      }
    }

    return res.status(200).json({
      bagId,
      batchNumber: batch.batch_number,
      status: 'sent',
      changed,
      message: changed ? 'Status changed from null to sent.' : 'Status is already sent.',
    });
  } catch (error) {
    console.error('Scan batch bag failed:', error);
    return res.status(500).json({ error: getErrorMessage(error) });
  }
}

module.exports = {
  createBatch,
  listBatches,
  scanBatchBag,
};
