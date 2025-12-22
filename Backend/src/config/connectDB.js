import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    console.log("✅ Connected DB:", process.env.DB_NAME);
    return connection;
  } catch (e) {
    console.log("❌ DB connection failed:", e);
    process.exit(1);
  }
};

export default connectDB;
