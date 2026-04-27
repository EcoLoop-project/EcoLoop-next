import mongoose from "mongoose";
const DB_URI = process.env.DB_URI;

if (!DB_URI) {
  throw new Error("DB_URI is not defined in environment variables");
}

let cached = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(DB_URI, {
      bufferCommands: false,
    });
  }
cached.conn = await cached.promise;
  return cached.conn;
}