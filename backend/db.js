const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/portfolio';

async function connect() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: undefined });
    console.log('MongoDB connected to', MONGO_URI);
  } catch (err) {
    console.warn('MongoDB connection failed:', err && err.message ? err.message : err);
  }
}

module.exports = { connect, mongoose };
