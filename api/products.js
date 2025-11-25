import { getProducts } from "../lib/db.js";

export default async function handler(req, res) {
  try {
    const { search } = req.query || {};
    const products = await getProducts(search);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
