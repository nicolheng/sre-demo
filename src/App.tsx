import React, { useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalState';
import type { UserRole } from './context/PortalState';
import StudentPortal from './roles/StudentPortal';
import EmployerPortal from './roles/EmployerPortal';
import LecturerPortal from './roles/LecturerPortal';
import CareerCentre from './roles/CareerCentre';
import MobileFrame from './components/MobileFrame';

const PortalShell: React.FC = () => {
  const { currentRole, setCurrentRole } = usePortal();
  
  // Toggle for Student Mobile View Simulator
  const [mobilePreview, setMobilePreview] = useState(true);

  // Sidebar link icons and labels based on active role
  const getSidebarConfig = () => {
    switch (currentRole) {
      case 'Student':
        return {
          title: 'Student Talents Hub',
          links: [
            { icon: '📋', label: 'My Applications' },
            { icon: '🔍', label: 'Discover Jobs' },
            { icon: '📖', label: 'Logbook Entries' },
            { icon: '📅', label: 'Interview Scheduler' },
            { icon: '⭐', label: 'Company Reviews' }
          ],
          user: {
            name: 'Julian (Student)',
            sub: 'WIA210045 • CGPA 3.82',
            avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'
          }
        };
      case 'Employer':
        return {
          title: 'Arvato HR Portal',
          links: [
            { icon: '👥', label: 'Applicant Hub' },
            { icon: '📊', label: 'Candidate Matrix' },
            { icon: '📆', label: 'Interview Slots' },
            { icon: '📝', label: 'Configure Postings' },
            { icon: '🤝', label: 'University Sync' }
          ],
          user: {
            name: 'Puan Aisyah (HR)',
            sub: 'Arvato Systems',
            avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120'
          }
        };
      case 'Lecturer':
        return {
          title: 'Supervision Workspace',
          links: [
            { icon: '🧑‍🎓', label: 'My Student Logs' },
            { icon: '📊', label: 'Gantt Timelines' },
            { icon: '📍', label: 'Visit Route Maps' },
            { icon: '💼', label: 'Collaborative Hub' }
          ],
          user: {
            name: 'Dr. Aris (Lecturer)',
            sub: 'Faculty of CS & IT',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120'
          }
        };
      case 'CareerCentre':
        return {
          title: 'Governance Portal',
          links: [
            { icon: '🛡️', label: 'Draft Approvals' },
            { icon: '📋', label: 'Checklist Matrix' },
            { icon: '🌐', label: 'Liaison Flags' },
            { icon: '📈', label: 'Outcomes & Reports' }
          ],
          user: {
            name: 'Puan Siti (CC Staff)',
            sub: 'Lead Coordinator',
            avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120'
          }
        };
    }
  };

  const config = getSidebarConfig();

  return (
    <div className="app-container">
      {/* Global Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">🎓</div>
          <div className="logo-text">
            <h1>SRE MATCH</h1>
            <span>Micro-Internship Portal</span>
          </div>
        </div>

        {/* Global Role Switcher */}
        <div className="role-switcher">
          {(['Student', 'Employer', 'Lecturer', 'CareerCentre'] as UserRole[]).map(role => (
            <button
              key={role}
              onClick={() => setCurrentRole(role)}
              className={`role-btn ${currentRole === role ? 'active' : ''}`}
            >
              {role === 'Student' && '🧑‍🎓 Student'}
              {role === 'Employer' && '💼 Employer HR'}
              {role === 'Lecturer' && '🧑‍🏫 Lecturer'}
              {role === 'CareerCentre' && '🛡️ Career Centre'}
            </button>
          ))}
        </div>
      </header>

      {/* Main Body */}
      <div className="app-body">
        {/* Sidebar */}
        <aside className="app-sidebar">
          <div className="sidebar-menu">
            <h3 className="menu-title">{config.title}</h3>
            {config.links.map((link, idx) => (
              <button key={idx} className="sidebar-link active">
                <span className="sidebar-link-icon">{link.icon}</span>
                <span>{link.label}</span>
              </button>
            ))}
          </div>

          <div className="sidebar-footer">
            <img src={config.user.avatar} alt={config.user.name} className="user-avatar" />
            <div className="user-info">
              <h4>{config.user.name}</h4>
              <p>{config.user.sub}</p>
            </div>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="app-content">
          {currentRole === 'Student' ? (
            <div>
              {/* Mobile preview toggle display */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>Student Talents Portal</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Mobile Layout Preview:</span>
                  <button 
                    className={`btn ${mobilePreview ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ padding: '4px 12px', fontSize: '11px', borderRadius: '12px' }}
                    onClick={() => setMobilePreview(!mobilePreview)}
                  >
                    {mobilePreview ? 'ON (Simulated Phone)' : 'OFF (Desktop View)'}
                  </button>
                </div>
              </div>
              
              <MobileFrame active={mobilePreview} onToggle={setMobilePreview}>
                <StudentPortal />
              </MobileFrame>
            </div>
          ) : (
            <div className="slide-up">
              <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '24px' }}>
                {currentRole === 'Employer' && 'Employer HR Sourcing Dashboard'}
                {currentRole === 'Lecturer' && 'Academic Supervision & Compliance Panel'}
                {currentRole === 'CareerCentre' && 'Career Centre Oversight & Audit Manager'}
              </h2>
              {currentRole === 'Employer' && <EmployerPortal />}
              {currentRole === 'Lecturer' && <LecturerPortal />}
              {currentRole === 'CareerCentre' && <CareerCentre />}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <PortalProvider>
      <PortalShell />
    </PortalProvider>
  );
};

export default App;
