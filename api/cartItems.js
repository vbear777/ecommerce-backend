import { getCart, addCartItem, updateCartItem, deleteCartItem } from "../lib/db.js";


export default async function handler(req, res) {
if (req.method === "GET") {
return res.status(200).json(await getCart());
}
if (req.method === "POST") {
return res.status(201).json(await addCartItem(req.body));
}
if (req.method === "PUT") {
return res.status(200).json(await updateCartItem(req.body));
}
if (req.method === "DELETE") {
return res.status(204).json(await deleteCartItem(req.query.productId));
}
res.status(405).json({ error: "Method not allowed" });
}