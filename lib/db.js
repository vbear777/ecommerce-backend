import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'db.json');

function load() {
  if (!fs.existsSync(DB_PATH)) {
    const initial = {
      products: [
        { id: '1', name: 'Example Product', priceCents: 10000, keywords: ['example'], image: '/images/example.png' }
      ],
      cart: [],
      orders: [],
      deliveryOptions: [
        { id: '1', name: 'Standard', priceCents: 5000, deliveryDays: 3 }
      ]
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2));
  }
  const raw = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(raw);
}

function save(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

export async function getProducts(search) {
  const db = load();
  let products = db.products || [];
  if (search) {
    const s = String(search).toLowerCase();
    products = products.filter(p => (p.name || '').toLowerCase().includes(s) || (p.keywords||[]).some(k => k.toLowerCase().includes(s)));
  }
  return products;
}

export async function getCart() {
  const db = load();
  return db.cart || [];
}

export async function addCartItem({ productId, quantity }) {
  const db = load();
  if (!productId) throw new Error('productId required');
  const qty = Number(quantity) || 1;
  const existing = db.cart.find(c => c.productId === productId);
  if (existing) {
    existing.quantity = existing.quantity + qty;
  } else {
    db.cart.push({ productId, quantity: qty, deliveryOptionId: '1' });
  }
  save(db);
  return db.cart.find(c => c.productId === productId);
}

export async function updateCartItem({ productId, quantity, deliveryOptionId }) {
  const db = load();
  const item = db.cart.find(c => c.productId === productId);
  if (!item) throw new Error('Cart item not found');
  if (quantity !== undefined) item.quantity = Number(quantity);
  if (deliveryOptionId !== undefined) item.deliveryOptionId = deliveryOptionId;
  save(db);
  return item;
}

export async function deleteCartItem(productId) {
  const db = load();
  db.cart = (db.cart || []).filter(c => c.productId !== productId);
  save(db);
}

export async function listOrders() {
  const db = load();
  return db.orders || [];
}

export async function getOrder(id) {
  const db = load();
  return (db.orders || []).find(o => String(o.id) === String(id)) || null;
}

export async function createOrder() {
  const db = load();
  const cart = db.cart || [];
  if (cart.length === 0) throw new Error('Cart is empty');
  const id = (db.orders.length || 0) + 1;
  const totalCostCents = cart.reduce((sum, item) => {
    const product = (db.products || []).find(p => String(p.id) === String(item.productId));
    const price = product ? product.priceCents : 0;
    const shipping = (db.deliveryOptions || []).find(d => d.id === item.deliveryOptionId)?.priceCents || 0;
    return sum + (price * item.quantity) + shipping;
  }, 0);
  const order = {
    id,
    orderTimeMs: Date.now(),
    totalCostCents,
    products: cart.map(ci => ({ productId: ci.productId, quantity: ci.quantity, deliveryOptionId: ci.deliveryOptionId }))
  };
  db.orders.push(order);
  db.cart = [];
  save(db);
  return order;
}

export async function getPaymentSummary() {
  const db = load();
  const cart = db.cart || [];
  const productCostCents = cart.reduce((s, i) => {
    const product = (db.products || []).find(p => String(p.id) === String(i.productId));
    return s + ((product?.priceCents || 0) * i.quantity);
  }, 0);
  const shippingCostCents = cart.reduce((s, i) => {
    const d = (db.deliveryOptions || []).find(dl => dl.id === i.deliveryOptionId);
    return s + (d?.priceCents || 0);
  }, 0);
  const totalBefore = productCostCents + shippingCostCents;
  const tax = Math.round(totalBefore * 0.1);
  return {
    totalItems: cart.reduce((s,i)=>s+i.quantity,0),
    productCostCents,
    shippingCostCents,
    totalCostBeforeTaxCents: totalBefore,
    taxCents: tax,
    totalCostCents: totalBefore + tax
  };
}

export async function resetAll() {
  const initial = {
    products: [
      { id: '1', name: 'Example Product', priceCents: 10000, keywords: ['example'], image: '/images/example.png' }
    ],
    cart: [],
    orders: [],
    deliveryOptions: [
      { id: '1', name: 'Standard', priceCents: 5000, deliveryDays: 3 }
    ]
  };
  save(initial);
}
