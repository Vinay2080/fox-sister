const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('ERROR: MONGODB_URI environment variable is not defined.');
      process.exit(1);
    }

    const targetDb = process.env.DB_NAME || (process.env.NODE_ENV === 'staging' ? 'studentDB_staging' : 'studentDB');

    // Strict safety check: Staging environment must NEVER target production studentDB
    if (process.env.NODE_ENV === 'staging' && targetDb === 'studentDB') {
      console.error('FATAL SAFETY ERROR: Staging environment is blocked from connecting to production database "studentDB".');
      process.exit(1);
    }

    const conn = await mongoose.connect(mongoURI, {
      dbName: targetDb
    });

    console.log(`MongoDB Connected: ${conn.connection.host} (Database: ${conn.connection.name})`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
