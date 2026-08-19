const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/motorsport-telemetry';
  
  if (process.env.USE_IN_MEMORY_DB === 'true') {
    try {
      console.log('[Database] Initializing In-Memory MongoDB Server...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`[Database] In-Memory MongoDB Connected successfully at: ${uri}`);
      return;
    } catch (memErr) {
      console.warn('[Database] In-Memory MongoDB setup failed, falling back to URI:', memErr.message);
    }
  }

  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
    console.log(`[Database] MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Direct MongoDB connection failed (${error.message}). Trying In-Memory Mongo...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      console.log(`[Database] In-Memory MongoDB Connected successfully at: ${uri}`);
    } catch (memErr) {
      console.error('[Database] All MongoDB connection attempts failed:', memErr.message);
    }
  }
};

module.exports = connectDB;
