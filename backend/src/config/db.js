import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

let isConnected = false;
export const inMemoryStore = {
  recipes: []
};

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('example.com') || uri === 'mongodb://localhost:27017/fridgetotable_placeholder') {
    console.log('ℹ️ MONGODB_URI not configured. Using in-memory persistent storage.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB connection warning: ${error.message}`);
    console.log('ℹ️ Running in memory-store mode for saved recipes.');
    isConnected = false;
  }
};

export const isDbConnected = () => isConnected;
