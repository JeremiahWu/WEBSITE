import "dotenv/config";
import { Sequelize } from "sequelize";

export const sequelize = new Sequelize(
  process.env.DB_NAME || "labsoft",
  process.env.DB_USER || "labsoft",
  process.env.DB_PASSWORD || "labsoft_secret",
  {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    pool: { min: 0, max: 10, acquire: 30000, idle: 10000 },
    logging: false,
  }
);

export async function connectDatabase() {
  await sequelize.authenticate();
  console.log("[DB] MySQL connected");
  await sequelize.sync();
  console.log("[DB] Tables synced");
}
