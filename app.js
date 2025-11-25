// app.js
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import productRoutes from './api/products.js';
import deliveryOptionRoutes from './routes/deliveryOptions.js';
import cartItemRoutes from './api/cartItems.js';
import orderRoutes from './api/orders.js';
import resetRoutes from './api/reset.js';
import paymentSummaryRoutes from './api/paymentSummary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// NOTE: untuk produksi di Vercel, jangan andalkan serverless function untuk static assets.
// Jika kamu tetap mau melayani images dari backend, kamu harus deploy backend di server (Render/Heroku),
// atau upload gambar ke frontend public atau CDN.
// Kalau ingin pakai route images di backend local, ini ok untuk dev:
app.use('/images', express.static(path.join(__dirname, 'images')));

// mount routes
app.use('/api/products', productRoutes);
app.use('/api/delivery-options', deliveryOptionRoutes);
app.use('/api/cart-items', cartItemRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reset', resetRoutes);
app.use('/api/payment-summary', paymentSummaryRoutes);

// fallback (optional) - keep lightweight here
app.get('/_health', (req, res) => res.json({ ok: true }));

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
