import React from 'react';
import { Users, Building2, BookOpen } from 'lucide-react';

export default function StudentStats({ students }) {
  const total = students.length;
  const uniqueDepartments = new Set(students.map((s) => s.department)).size;
  const uniqueSemesters = new Set(students.map((s) => s.semester)).size;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div>
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Registered Students</div>
        </div>
        <div className="stat-icon">
          <Users size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div>
          <div className="stat-value">{uniqueDepartments}</div>
          <div className="stat-label">Active Departments</div>
        </div>
        <div className="stat-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
          <Building2 size={24} />
        </div>
      </div>

      <div className="stat-card">
        <div>
          <div className="stat-value">{uniqueSemesters}</div>
          <div className="stat-label">Semesters Enrolled</div>
        </div>
        <div className="stat-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
          <BookOpen size={24} />
        </div>
      </div>
    </div>
  );
}
