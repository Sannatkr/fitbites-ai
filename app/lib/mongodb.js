// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.NEXT_APP_MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// User Schema
const UserSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Health Metrics Schema
const HealthMetricSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "other"],
  },
  age: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  heightCm: {
    type: Number,
    required: true,
  },
  activityLevel: {
    type: String,
    required: true,
    enum: ["mostly_inactive", "somewhat_active", "active", "very_active"],
  },
  bmi: {
    type: String,
    required: true,
  },
  caloriesIntake: {
    type: Number,
    required: true,
  },
  targetWeight: {
    type: Number,
    required: true,
  },
  macros: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const HealthMetric =
  mongoose.models.HealthMetric ||
  mongoose.model("HealthMetric", HealthMetricSchema);

export { dbConnect, User, HealthMetric };
