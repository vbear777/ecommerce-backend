import { createOrder, listOrders, getOrder } from "../lib/db.js";


export default async function handler(req, res) {
if (req.method === "GET") {
if (req.query.orderId) return res.status(200).json(await getOrder(req.query.orderId));
return res.status(200).json(await listOrders());
}
if (req.method === "POST") {
return res.status(201).json(await createOrder());
}
res.status(405).json({ error: "Method not allowed" });
}