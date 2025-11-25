import { resetAll } from "../lib/db.js";


export default async function handler(req, res) {
await resetAll();
res.status(204).send();
}