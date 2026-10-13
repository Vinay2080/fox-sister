const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    name: {
      type: String,
      required: [true, 'Student Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address'
      ]
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    semester: {
      type: Number,
      required: [true, 'Semester is required'],
      min: [1, 'Semester must be at least 1'],
      max: [12, 'Semester cannot exceed 12']
    },
    contact: {
      type: String,
      required: [true, 'Contact number is required'],
      trim: true
    }
  },
  {
    timestamps: true,
    collection: 'students'
  }
);

module.exports = mongoose.model('Student', studentSchema);
