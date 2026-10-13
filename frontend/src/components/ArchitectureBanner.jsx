import React from 'react';
import { Globe, Server, Database, CheckCircle2, AlertCircle } from 'lucide-react';
import { studentAPI } from '../services/api';

export default function ArchitectureBanner({ backendHealthy, checkingHealth }) {
  const apiUrl = studentAPI.getBaseUrl();

  return (
    <div className="tiers-banner">
      {/* Tier 1: Netlify */}
      <div className="tier-card">
        <div className="tier-icon-wrap tier-netlify">
          <Globe size={22} />
        </div>
        <div className="tier-info">
          <h4>Tier 1: Presentation</h4>
          <div className="tier-name">
            Netlify <span className="status-dot online" title="Frontend is active"></span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>React SPA Client</span>
        </div>
      </div>

      {/* Tier 2: Render */}
      <div className="tier-card">
        <div className="tier-icon-wrap tier-render">
          <Server size={22} />
        </div>
        <div className="tier-info">
          <h4>Tier 2: Application</h4>
          <div className="tier-name">
            Render
            <span
              className={`status-dot ${backendHealthy ? 'online' : 'offline'}`}
              title={backendHealthy ? 'Backend API connected' : 'Backend API unreachable'}
            ></span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b', wordBreak: 'break-all' }}>
            {checkingHealth ? 'Checking health...' : apiUrl}
          </span>
        </div>
      </div>

      {/* Tier 3: MongoDB Atlas */}
      <div className="tier-card">
        <div className="tier-icon-wrap tier-mongo">
          <Database size={22} />
        </div>
        <div className="tier-info">
          <h4>Tier 3: Database</h4>
          <div className="tier-name">
            MongoDB Atlas
            <span
              className={`status-dot ${backendHealthy ? 'online' : 'offline'}`}
              title={backendHealthy ? 'Database connected via Backend' : 'Waiting for connection'}
            ></span>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>studentDB &rarr; students</span>
        </div>
      </div>
    </div>
  );
}
