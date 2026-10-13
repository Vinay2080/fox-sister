const Student = require('../models/Student');

// Helper to find student by either studentId (custom string) or Mongo ObjectId
const findStudentQuery = (id) => {
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    return { $or: [{ _id: id }, { studentId: id.toUpperCase() }] };
  }
  return { studentId: id.toUpperCase() };
};

// @desc    Get all students (with optional search filter)
// @route   GET /api/students
exports.getAllStudents = async (req, res) => {
  try {
    const { search, department } = req.query;
    let query = {};

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), 'i');
      query.$or = [
        { studentId: regex },
        { name: regex },
        { email: regex },
        { department: regex }
      ];
    }

    if (department && department.trim()) {
      query.department = department.trim();
    }

    const students = await Student.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve students',
      error: error.message
    });
  }
};

// @desc    Get single student by studentId or _id
// @route   GET /api/students/:id
exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findOne(findStudentQuery(req.params.id));

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID '${req.params.id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student record',
      error: error.message
    });
  }
};

// @desc    Create new student
// @route   POST /api/students
exports.createStudent = async (req, res) => {
  try {
    const { studentId, name, email, department, semester, contact } = req.body;

    if (!studentId || !name || !email || !department || !semester || !contact) {
      return res.status(400).json({
        success: false,
        message: 'All fields (studentId, name, email, department, semester, contact) are required.'
      });
    }

    // Check if studentId already exists
    const existingStudent = await Student.findOne({ studentId: studentId.trim().toUpperCase() });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: `Student with Student ID '${studentId}' already exists.`
      });
    }

    const student = await Student.create({
      studentId: studentId.trim().toUpperCase(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      department: department.trim(),
      semester: Number(semester),
      contact: contact.trim()
    });

    res.status(201).json({
      success: true,
      message: 'Student added successfully.',
      data: student
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `A student with this ${field} already exists.`
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create student',
      error: error.message
    });
  }
};

// @desc    Update student details
// @route   PUT /api/students/:id
exports.updateStudent = async (req, res) => {
  try {
    const query = findStudentQuery(req.params.id);
    let student = await Student.findOne(query);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID '${req.params.id}' not found`
      });
    }

    const { studentId, name, email, department, semester, contact } = req.body;

    if (studentId && studentId.trim().toUpperCase() !== student.studentId) {
      const duplicate = await Student.findOne({ studentId: studentId.trim().toUpperCase() });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: `Student ID '${studentId}' is already assigned to another student.`
        });
      }
      student.studentId = studentId.trim().toUpperCase();
    }

    if (name !== undefined) student.name = name.trim();
    if (email !== undefined) student.email = email.trim().toLowerCase();
    if (department !== undefined) student.department = department.trim();
    if (semester !== undefined) student.semester = Number(semester);
    if (contact !== undefined) student.contact = contact.trim();

    const updatedStudent = await student.save();

    res.status(200).json({
      success: true,
      message: 'Student updated successfully.',
      data: updatedStudent
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update student',
      error: error.message
    });
  }
};

// @desc    Delete student record
// @route   DELETE /api/students/:id
exports.deleteStudent = async (req, res) => {
  try {
    const query = findStudentQuery(req.params.id);
    const student = await Student.findOneAndDelete(query);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student with ID '${req.params.id}' not found`
      });
    }

    res.status(200).json({
      success: true,
      message: `Student '${student.studentId}' (${student.name}) deleted successfully.`,
      data: { studentId: student.studentId }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete student',
      error: error.message
    });
  }
};

// @desc    Get summary statistics
// @route   GET /api/students/stats/summary
exports.getStudentStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const departmentStats = await Student.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const semesterStats = await Student.aggregate([
      { $group: { _id: '$semester', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        departments: departmentStats,
        semesters: semesterStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to get stats',
      error: error.message
    });
  }
};
