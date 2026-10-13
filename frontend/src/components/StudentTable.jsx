import React from 'react';
import { Edit2, Trash2, UserX, Mail, Phone } from 'lucide-react';

export default function StudentTable({ students, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div style={{ fontSize: '1.1rem', fontWeight: '600' }}>Loading student records...</div>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>
            Fetching data from Render API &amp; MongoDB Atlas
          </p>
        </div>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <div className="empty-state-icon">
            <UserX size={48} />
          </div>
          <h3>No Student Records Found</h3>
          <p>Click "Add Student" to create your first record, or clear your search filter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <div style={{ overflowX: 'auto' }}>
        <table className="student-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Email Address</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Contact</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student._id || student.studentId}>
                <td>
                  <span className="student-id-badge">{student.studentId}</span>
                </td>
                <td style={{ fontWeight: 600, color: '#0f172a' }}>{student.name}</td>
                <td style={{ color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Mail size={14} color="#94a3b8" />
                    <span>{student.email}</span>
                  </div>
                </td>
                <td>{student.department}</td>
                <td>
                  <span className="semester-badge">Sem {student.semester}</span>
                </td>
                <td style={{ color: '#475569' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={14} color="#94a3b8" />
                    <span>{student.contact}</span>
                  </div>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="btn-icon edit"
                      onClick={() => onEdit(student)}
                      title="Edit Student Details"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => onDelete(student)}
                      title="Delete Student Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
