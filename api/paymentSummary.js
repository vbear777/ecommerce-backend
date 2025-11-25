import { getPaymentSummary } from "../lib/db.js";


export default async function handler(req, res) {
res.status(200).json(await getPaymentSummary());
}