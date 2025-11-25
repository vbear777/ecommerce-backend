import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Check if DATABASE_URL exists
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL tidak ditemukan di file .env");
  process.exit(1);
}

// Create Sequelize instance for Neon PostgreSQL
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

