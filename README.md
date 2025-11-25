# E-commerce backend (Vercel serverless)

This backend is designed for deployment on Vercel Serverless Functions.
It uses a simple file-based JSON store (db.json) because SQLite/Sequelize
are not suitable for Vercel serverless environments.

## Structure
- api/           → serverless function endpoints
- lib/db.js      → simple JSON read/write helper
- db.json        → data store (created automatically)

## Local development
- Install Vercel CLI: `npm i -g vercel`
- Start dev server: `vercel dev`
- Or run tests by calling endpoints locally with `node` not required.

## Notes
- This is intentionally minimal and stateless. For production, migrate to a managed DB (Supabase, PlanetScale, etc.)
