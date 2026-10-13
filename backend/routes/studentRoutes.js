const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentStats
} = require('../controllers/studentController');

// Stats route (must be before :id)
router.get('/stats/summary', getStudentStats);

// Main collection routes
router.route('/')
  .get(getAllStudents)
  .post(createStudent);

// Individual student routes
router.route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .delete(deleteStudent);

module.exports = router;
