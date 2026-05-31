// const mongoose = require('mongoose');

// const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

// async function connect() {
//   try {
//     await mongoose.connect(MONGO_URI, { dbName: undefined });
//     console.log('MongoDB connected to', MONGO_URI);
//   } catch (err) {
//     console.warn('MongoDB connection failed:', err && err.message ? err.message : err);
//   }
// }

// module.exports = { connect, mongoose };
const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

async function connect() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("MongoDB connection failed:", err.message);
  }
}

module.exports = { connect };