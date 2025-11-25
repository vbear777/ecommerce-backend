import { listOrders, getOrder, createOrder } from '../lib/db.js';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const { orderId } = req.query || {};
      if (orderId) {
        const order = await getOrder(orderId);
        if (!order) return res.status(404).json({ error: 'Order not found' });
        return res.status(200).json(order);
      }
      const orders = await listOrders();
      return res.status(200).json(orders);
    }
    if (req.method === 'POST') {
      const order = await createOrder();
      return res.status(201).json(order);
    }
    res.setHeader('Allow', 'GET,POST');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
