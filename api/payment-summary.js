import { getPaymentSummary } from '../lib/db.js';

export default async function handler(req, res) {
  try {
    const summary = await getPaymentSummary();
    res.status(200).json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
