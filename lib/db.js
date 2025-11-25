import fs from "fs";
import path from "path";


const DB_PATH = path.join(process.cwd(), "db.json");


function load() {
if (!fs.existsSync(DB_PATH)) {
fs.writeFileSync(DB_PATH, JSON.stringify({ products: [], cart: [], orders: [], deliveryOptions: [] }, null, 2));
}
return JSON.parse(fs.readFileSync(DB_PATH, "utf8"));
}
function save(data) {
fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export async function getProducts(search) {
const db = load();
let products = db.products;
if (search) {
const s = search.toLowerCase();
products = products.filter(p => p.name.toLowerCase().includes(s) || p.keywords.some(k => k.toLowerCase().includes(s)));
}
return products;
}


export async function getCart() {
return load().cart;
}

export async function addCartItem({ productId, quantity }) {
const db = load();
const existing = db.cart.find(c => c.productId === productId);
if (existing) existing.quantity += quantity;
else db.cart.push({ productId, quantity, deliveryOptionId: "1" });
save(db);
return existing || db.cart.at(-1);
}

export async function updateCartItem({ productId, quantity, deliveryOptionId }) {
const db = load();
const item = db.cart.find(c => c.productId === productId);
if (!item) throw new Error("Item not found");
if (quantity !== undefined) item.quantity = quantity;
if (deliveryOptionId !== undefined) item.deliveryOptionId = deliveryOptionId;
save(db);
return item;
}



export async function deleteCartItem(productId) {
const db = load();
db.cart = db.cart.filter(c => c.productId !== productId);
save(db);
}


export async function listOrders() {
return load().orders;
}

export async function getOrder(id) {
return load().orders.find(o => o.id == id) || null;
}


export async function createOrder() {
const db = load();
const id = db.orders.length + 1;
const cart = db.cart;
const total = cart.reduce((sum, item) => sum + item.quantity * 10000, 0);
const order = { id, time: Date.now(), items: cart, total };
db.orders.push(order);
db.cart = [];
save(db);
return order;
}

export async function getPaymentSummary() {
const db = load();
const cart = db.cart;
const productCostCents = cart.reduce((s, i) => s + i.quantity * 10000, 0);
const shippingCostCents = cart.length * 5000;
const totalBefore = productCostCents + shippingCostCents;
const tax = Math.round(totalBefore * 0.1);
return {
totalItems: cart.length,
productCostCents,
shippingCostCents,
totalCostBeforeTaxCents: totalBefore,
taxCents: tax,
totalCostCents: totalBefore + tax
};
}

export async function resetAll() {
const initial = { products: [], cart: [], orders: [], deliveryOptions: [] };
save(initial);
}