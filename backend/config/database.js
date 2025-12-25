const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tech-news', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.dbConnected = true;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error('RUNNING IN OFFLINE MODE: API endpoints will not work, but frontend will load.');
    global.dbConnected = false;
    // process.exit(1); // REMOVED: Don't crash the server on Render
  }
};

module.exports = connectDB;
