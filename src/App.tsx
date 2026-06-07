import React, { useState } from 'react';
import { PortalProvider, usePortal } from './context/PortalState';
import StudentPortal from './roles/StudentPortal';
import EmployerPortal from './roles/EmployerPortal';
import LecturerPortal from './roles/LecturerPortal';
import CareerCentre from './roles/CareerCentre';
import MobileFrame from './components/MobileFrame';
import AuthPortal from './components/AuthPortal';

const PortalShell: React.FC = () => {
  const { 
    isAuthenticated, 
    loggedInUser, 
    currentRole, 
    activeSubpage, 
    setActiveSubpage,
    logout 
  } = usePortal();
  
  // Toggle for Student Mobile View Simulator
  const [mobilePreview, setMobilePreview] = useState(false);

  if (!isAuthenticated || !loggedInUser) {
    return <AuthPortal />;
  }

  // Sidebar links based on active role (matching screens precisely!)
  const getSidebarConfig = () => {
    switch (currentRole) {
      case 'Student':
        return {
          title: 'Student Portal',
          themeClass: 'theme-student',
          links: [
            { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { id: 'applications', icon: '📋', label: 'My Applications' },
            { id: 'portfolio', icon: '💼', label: 'Portfolio' },
            { id: 'assessments', icon: '📝', label: 'Assessments' },
            { id: 'interviews', icon: '📅', label: 'Interview Booking' },
            { id: 'logbook', icon: '📊', label: 'Weekly Progress' },
            { id: 'offer-letter', icon: '✉️', label: 'Offer Letter' },
            { id: 'reviews', icon: '⭐', label: 'Reviews' },
            { id: 'messages', icon: '💬', label: 'Messages' },
            { id: 'profile', icon: '👤', label: 'Profile' },
            { id: 'settings', icon: '⚙️', label: 'Settings' }
          ]
        };
      case 'Employer':
        return {
          title: 'HR Dashboard',
          themeClass: 'theme-employer',
          links: [
            { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { id: 'jobs', icon: '📝', label: 'Job Postings' },
            { id: 'candidates', icon: '👥', label: 'Candidates' },
            { id: 'shortlisted', icon: '⭐', label: 'Shortlisted' },
            { id: 'interviews', icon: '📅', label: 'Interviews' },
            { id: 'ai-recs', icon: '🤖', label: 'AI Recommendations' },
            { id: 'messages', icon: '💬', label: 'Messages' },
            { id: 'reports', icon: '📊', label: 'Reports & Analytics' },
            { id: 'settings', icon: '⚙️', label: 'Settings' }
          ]
        };
      case 'Lecturer':
        return {
          title: 'Lecturer Dashboard',
          themeClass: 'theme-lecturer',
          links: [
            { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { id: 'students', icon: '🧑‍🎓', label: 'My Students' },
            { id: 'partners', icon: '🏢', label: 'Industry Partners' },
            { id: 'reports', icon: '📋', label: 'Internship Reports' },
            { id: 'planning', icon: '📅', label: 'Project Planning' },
            { id: 'monitoring', icon: '📊', label: 'Progress Monitoring' },
            { id: 'messages', icon: '💬', label: 'Messages' },
            { id: 'profile', icon: '👤', label: 'Profile' },
            { id: 'settings', icon: '⚙️', label: 'Settings' }
          ]
        };
      case 'CareerCentre':
        return {
          title: 'Governance Portal',
          themeClass: 'theme-career',
          links: [
            { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { id: 'approvals', icon: '🛡️', label: 'Job Approvals' },
            { id: 'verification', icon: '🏢', label: 'Employer Verification' },
            { id: 'compliance', icon: '📋', label: 'Compliance Matrix' },
            { id: 'liaison', icon: '🌐', label: 'Liaison Flags' },
            { id: 'reports', icon: '📊', label: 'Reports & Analytics' },
            { id: 'settings', icon: '⚙️', label: 'Settings' }
          ]
        };
    }
  };

  const config = getSidebarConfig();

  // Notification count simulation
  const getNotificationCount = () => {
    if (currentRole === 'Student') return 3;
    if (currentRole === 'Employer') return 5;
    if (currentRole === 'Lecturer') return 4;
    return 2;
  };

  return (
    <div className={`app-container ${config.themeClass}`}>
      {/* Global Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">🎓</div>
          <div className="logo-text">
            <h1>Internship Portal</h1>
            <span>{currentRole === 'CareerCentre' ? 'Career Centre staff' : `${currentRole} panel`}</span>
          </div>
        </div>

        {/* Header Right Items: Notifications & User Widget */}
        <div className="header-right-items">
          <div className="notification-bell-wrapper">
            <span className="bell-icon">🔔</span>
            <span className="bell-badge">{getNotificationCount()}</span>
          </div>
          <div className="header-user-profile">
            <img src={loggedInUser.avatar} alt={loggedInUser.name} className="user-avatar-header" />
            <div className="user-header-details">
              <span className="user-header-name">{loggedInUser.name}</span>
              <span className="user-header-role">{loggedInUser.role}</span>
            </div>
            <span className="header-dropdown-arrow">▼</span>
          </div>

          <button 
            className="btn btn-secondary" 
            style={{ 
              padding: '6px 12px', 
              fontSize: '12px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginLeft: '12px',
              height: '36px'
            }} 
            onClick={logout}
          >
            <span>🚪</span>
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="app-body">
        {/* Sidebar */}
        <aside className="app-sidebar">
          <div className="sidebar-top-section">
            <h3 className="menu-title">{config.title}</h3>
            <div className="sidebar-menu">
              {config.links.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setActiveSubpage(link.id)}
                  className={`sidebar-link ${activeSubpage === link.id ? 'active' : ''}`}
                >
                  <span className="sidebar-link-icon">{link.icon}</span>
                  <span>{link.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="sidebar-bottom-section">
            {/* User profile widget at the bottom */}
            <div className="sidebar-footer">
              <img src={loggedInUser.avatar} alt={loggedInUser.name} className="user-avatar" />
              <div className="user-info">
                <h4>{loggedInUser.name}</h4>
                <p>{loggedInUser.subText || loggedInUser.email}</p>
              </div>
            </div>

            {/* Logout Trigger */}
            <button className="sidebar-link active logout-btn" onClick={logout} style={{ marginTop: '12px' }}>
              <span className="sidebar-link-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="app-content">
          {currentRole === 'Student' ? (
            <div>
              {/* Mobile preview toggle display */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                    {activeSubpage === 'dashboard' ? 'Student Dashboard' : `Student Portal — ${activeSubpage.charAt(0).toUpperCase() + activeSubpage.slice(1)}`}
                  </h2>
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    Matric Card: <strong>{loggedInUser.details?.matric}</strong> • CGPA: <strong>3.82</strong> • Major: <strong>{loggedInUser.details?.major}</strong>
                  </p>
                </div>
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
                {currentRole === 'Employer' && (activeSubpage === 'dashboard' ? 'Employer HR Sourcing Dashboard' : `HR Recruiter — ${activeSubpage.toUpperCase()}`)}
                {currentRole === 'Lecturer' && (activeSubpage === 'dashboard' ? 'Academic Supervision & Compliance Panel' : `Faculty Advisor — ${activeSubpage.toUpperCase()}`)}
                {currentRole === 'CareerCentre' && (activeSubpage === 'dashboard' ? 'Career Centre Oversight & Audit Manager' : `Governance Portal — ${activeSubpage.toUpperCase()}`)}
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
