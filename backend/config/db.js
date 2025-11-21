import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

export async function connectDB() {
  try {
    await client.connect();
    db = client.db(process.env.DB_NAME);
    console.log("✅ Connected to MongoDB:", process.env.DB_NAME);
    return db;
  } catch (err) { 
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

export function getDB() {
  if (!db) throw new Error("❌ Database not connected!");
  return db;
}
