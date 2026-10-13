import React, { useState, useEffect, useCallback } from 'react';
import { Search, UserPlus, Filter, RefreshCw } from 'lucide-react';
import Header from './components/Header';
import ArchitectureBanner from './components/ArchitectureBanner';
import StudentStats from './components/StudentStats';
import StudentTable from './components/StudentTable';
import StudentModal from './components/StudentModal';
import DeleteModal from './components/DeleteModal';
import Toast from './components/Toast';
import { studentAPI } from './services/api';

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Backend Health check
  const [backendHealthy, setBackendHealthy] = useState(false);
  const [checkingHealth, setCheckingHealth] = useState(true);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Check backend health
  const checkHealth = useCallback(async () => {
    setCheckingHealth(true);
    try {
      await studentAPI.checkHealth();
      setBackendHealthy(true);
    } catch (err) {
      setBackendHealthy(false);
    } finally {
      setCheckingHealth(false);
    }
  }, []);

  // Fetch student list
  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await studentAPI.getAll({
        search: searchTerm,
        department: selectedDept
      });
      if (res && res.data) {
        setStudents(res.data);
        setBackendHealthy(true);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setBackendHealthy(false);
      addToast(err.message || 'Failed to fetch students from backend', 'error');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedDept]);

  // Initial load
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchStudents();
    }, 250);
    return () => clearTimeout(timeout);
  }, [fetchStudents]);

  // Handler: Add or Edit Student
  const handleSaveStudent = async (studentData, isEditing) => {
    if (isEditing) {
      await studentAPI.update(studentData.studentId, studentData);
      addToast(`Student '${studentData.studentId}' updated successfully!`, 'success');
    } else {
      await studentAPI.create(studentData);
      addToast(`Student '${studentData.studentId}' added successfully!`, 'success');
    }
    await fetchStudents();
  };

  // Handler: Open edit modal
  const handleEditClick = (student) => {
    setStudentToEdit(student);
    setIsModalOpen(true);
  };

  // Handler: Open delete modal
  const handleDeleteClick = (student) => {
    setStudentToDelete(student);
    setIsDeleteOpen(true);
  };

  // Handler: Confirm delete
  const handleConfirmDelete = async (studentId) => {
    try {
      await studentAPI.delete(studentId);
      addToast(`Student '${studentId}' deleted successfully.`, 'success');
      await fetchStudents();
    } catch (err) {
      addToast(err.message || 'Failed to delete student', 'error');
      throw err;
    }
  };

  // Get department list for filter
  const departments = Array.from(new Set(students.map((s) => s.department).filter(Boolean)));

  return (
    <div className="app-container">
      <Header onRefresh={fetchStudents} loading={loading} />

      <main className="main-content">
        {/* Architecture Status Banner */}
        <ArchitectureBanner
          backendHealthy={backendHealthy}
          checkingHealth={checkingHealth}
        />

        {/* High-level Statistics */}
        <StudentStats students={students} />

        {/* Action & Search Bar */}
        <div className="action-bar">
          <div className="search-group">
            <div className="search-input-wrapper">
              <Search size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Search by ID, name, email, department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {departments.length > 0 && (
              <select
                className="filter-select"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                <option value="">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            )}
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              setStudentToEdit(null);
              setIsModalOpen(true);
            }}
          >
            <UserPlus size={18} /> Add Student
          </button>
        </div>

        {/* Student Records Table */}
        <StudentTable
          students={students}
          loading={loading}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
      </main>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setStudentToEdit(null);
        }}
        onSave={handleSaveStudent}
        studentToEdit={studentToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => {
          setIsDeleteOpen(false);
          setStudentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        student={studentToDelete}
      />

      {/* Toast Feedback Messages */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Student Information Management System &bull; Three-Tier Cloud Architecture
        </p>
        <div className="footer-tags">
          <span className="footer-tag">Netlify (Presentation)</span>
          <span className="footer-tag">Render (Application / API)</span>
          <span className="footer-tag">MongoDB Atlas (Database)</span>
        </div>
      </footer>
    </div>
  );
}
