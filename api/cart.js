import { getCart, addCartItem, updateCartItem, deleteCartItem } from "../lib/db.js";

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const cart = await getCart();
      return res.status(200).json(cart);
    }
    if (req.method === 'POST') {
      const item = await addCartItem(req.body);
      return res.status(201).json(item);
    }
    if (req.method === 'PUT') {
      const updated = await updateCartItem(req.body);
      return res.status(200).json(updated);
    }
    if (req.method === 'DELETE') {
      await deleteCartItem(req.query.productId);
      return res.status(204).send();
    }
    res.setHeader('Allow', 'GET,POST,PUT,DELETE');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
