// /api/zettle-webhook.js
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Optional: simple shared-secret via query string token
    // Set WEBHOOK_TOKEN in Vercel, and add ?token=YOURTOKEN to the webhook URL in Zettle
    const tokenFromQuery = req.query?.token || req.query?.TOKEN;
    if (process.env.WEBHOOK_TOKEN && tokenFromQuery !== process.env.WEBHOOK_TOKEN) {
      return res.status(401).json({ error: 'Invalid or missing token' });
    }

    const s = req.body || {};

    // Normalize incoming fields (adjust if your Zettle payload names differ)
    const amountNumber = s?.amount?.amount ?? s?.amount ?? 0;
    const currency = s?.amount?.currencyId ?? s?.currency ?? 'SEK';
    const txId = s?.purchaseUUID ?? s?.transactionId ?? crypto.randomUUID();
    const storeId = s?.organizationUuid ?? s?.storeId ?? 'unknown';
    const terminalId = s?.terminalId ?? s?.originatorTransactionId ?? null;
    const timestamp = s?.timestamp ?? new Date().toISOString();

    const body = {
      type: 'purchase',
      amount: amountNumber,
      currency,
      txId,
      storeId,
      terminalId,
      timestamp,
      source: 'zettle'
    };

    const r = await fetch(process.env.WASHERE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      const txt = await r.text();
      return res.status(502).json({ error: 'WasHere webhook failed', txt });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Gateway error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: '1mb' } },
};
