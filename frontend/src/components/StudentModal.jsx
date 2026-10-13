import React, { useState, useEffect } from 'react';
import { X, Save, UserPlus } from 'lucide-react';

export default function StudentModal({ isOpen, onClose, onSave, studentToEdit }) {
  const isEditing = Boolean(studentToEdit);

  const initialFormState = {
    studentId: '',
    name: '',
    email: '',
    department: 'Computer Science',
    semester: 1,
    contact: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (studentToEdit) {
      setFormData({
        studentId: studentToEdit.studentId || '',
        name: studentToEdit.name || '',
        email: studentToEdit.email || '',
        department: studentToEdit.department || 'Computer Science',
        semester: studentToEdit.semester || 1,
        contact: studentToEdit.contact || ''
      });
    } else {
      setFormData(initialFormState);
    }
    setError('');
  }, [studentToEdit, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'semester' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.studentId.trim()) {
      setError('Student ID is required (e.g. ST101).');
      return;
    }
    if (!formData.name.trim()) {
      setError('Student Name is required.');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email address is required.');
      return;
    }
    if (!formData.contact.trim()) {
      setError('Contact phone number is required.');
      return;
    }

    try {
      setSubmitting(true);
      await onSave(formData, isEditing);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save student details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {isEditing ? `Edit Student: ${formData.studentId}` : 'Add New Student'}
          </h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.875rem'
                }}
              >
                {error}
              </div>
            )}

            <div className="form-grid">
              {/* Student ID */}
              <div className="form-group">
                <label className="form-label">
                  Student ID <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="studentId"
                  className="form-control"
                  placeholder="e.g. ST101"
                  value={formData.studentId}
                  onChange={handleChange}
                  disabled={isEditing}
                  required
                />
              </div>

              {/* Semester */}
              <div className="form-group">
                <label className="form-label">
                  Semester <span className="required">*</span>
                </label>
                <select
                  name="semester"
                  className="form-control"
                  value={formData.semester}
                  onChange={handleChange}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              {/* Full Name */}
              <div className="form-group col-span-2">
                <label className="form-label">
                  Full Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="form-group col-span-2">
                <label className="form-label">
                  Email Address <span className="required">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="e.g. rahul@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label">
                  Department <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="department"
                  className="form-control"
                  placeholder="e.g. Computer Science"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Contact */}
              <div className="form-group">
                <label className="form-label">
                  Contact Number <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  name="contact"
                  className="form-control"
                  placeholder="e.g. 9876543210"
                  value={formData.contact}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? (
                'Saving...'
              ) : isEditing ? (
                <>
                  <Save size={16} /> Update Student
                </>
              ) : (
                <>
                  <UserPlus size={16} /> Add Student
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
