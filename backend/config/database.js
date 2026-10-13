const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('ERROR: MONGODB_URI environment variable is not defined.');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoURI, {
      dbName: process.env.DB_NAME || 'studentDB'
    });

    console.log(`MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
