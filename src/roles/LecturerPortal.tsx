import React, { useState } from 'react';
import { usePortal } from '../context/PortalState';
import GanttChart from '../components/GanttChart';
import SVGChart from '../components/SVGChart';

export const LecturerPortal: React.FC = () => {
  const {
    activeSubpage,
    setActiveSubpage,
    students,
    applications,
    jobs,
    logbookEntries,
    addFacultyStatement,
    loggedInUser
  } = usePortal();

  // Active lecturer profile
  const lecturerName = loggedInUser?.name || 'Dr. Lim Wei Ming';

  // Selected student for detail review
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

  // Document viewer modal
  const [viewerDoc, setViewerDoc] = useState<{ name: string; type: string } | null>(null);

  // Faculty statement form
  const [statementText, setStatementText] = useState('');
  const [statementToast, setStatementToast] = useState(false);

  // Site visit planning simulation
  const [visitDate, setVisitDate] = useState('2026-06-22');
  const [visitToast, setVisitToast] = useState<string | null>(null);
  const [showRoutes, setShowRoutes] = useState(false);
  const [showRouteItinerary, setShowRouteItinerary] = useState(false);

  // Student detail page site visit states
  const [studentVisitDates, setStudentVisitDates] = useState<Record<string, string>>({});
  const [studentVisitToasts, setStudentVisitToasts] = useState<Record<string, string>>({});
  const [studentShowZones, setStudentShowZones] = useState<Record<string, boolean>>({});

  // Helper to render compliance status indicator for a student and week
  const getLogbookStatusIndicator = (studentId: string, weekNum: number) => {
    const entry = logbookEntries.find(le => le.studentId === studentId && le.weekNumber === weekNum);
    if (!entry) return <span style={{ fontSize: '14px', color: 'var(--status-screening)' }}>🔴</span>; // Missing
    return entry.isLocked ?
      <span style={{ fontSize: '14px', color: 'var(--status-offered)' }}>🟢</span> : // Verified
      <span style={{ fontSize: '14px', color: 'var(--status-interview)' }}>🟡</span>; // Pending verification
  };

  // Chat Messenger
  const [chatRecipient, setChatRecipient] = useState('John Lim');
  const [messageInput, setMessageInput] = useState('');
  // Settings States
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [autoRemind, setAutoRemind] = useState(false);
  const [calendarSync, setCalendarSync] = useState(false);
  const [settingsToast, setSettingsToast] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [mockChats, setMockChats] = useState<Record<string, { sender: string; text: string; time: string }[]>>({
    'John Lim': [
      { sender: 'You', text: 'Hi John, please ensure your Week 4 log is submitted soon.', time: '1 day ago' },
      { sender: 'John Lim', text: 'Yes Dr., I will complete it by this evening.', time: '12 hours ago' }
    ],
    'Career Center': [
      { sender: 'Career Center', text: 'Academic review statements are required for student clearances.', time: '2 days ago' }
    ],
    'Sarah Tan (IJM)': [
      { sender: 'Sarah Tan (IJM)', text: 'Hello Dr. Lim, we have scheduled interviews for Maya and John.', time: '2 days ago' }
    ],
    'Marcus Vance (Datum)': [
      { sender: 'Marcus Vance (Datum)', text: 'Dear Dr. Lim, the mobile development intern scopes have been uploaded.', time: '3 days ago' }
    ]
  });

  // Project Planning & Inquiry States
  const [planningStudentId, setPlanningStudentId] = useState<string>('s1');
  const [showInquiryModal, setShowInquiryModal] = useState<{ name: string; role: string; companyName: string } | null>(null);
  const [inquirySubject, setInquirySubject] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquiryToast, setInquiryToast] = useState(false);
  const [inquiryToastMessage, setInquiryToastMessage] = useState('✓ Official Inquiry submitted successfully! The representative will be notified.');

  // Partner Management States
  const [activePartners, setActivePartners] = useState([
    {
      id: 'p1',
      name: 'Datum Technology',
      location: 'Kuala Lumpur',
      assignedStudents: 5,
      emoji: '💻',
      contactName: 'Marcus Vance',
      contactRole: 'Senior Recruitment Lead',
      contactEmail: 'marcus.vance@datum.com',
      contactPhone: '+60 12-555 4321'
    },
    {
      id: 'p2',
      name: 'IJM Corporation',
      location: 'Petaling Jaya',
      assignedStudents: 4,
      emoji: '🏗️',
      contactName: 'Sarah Tan',
      contactRole: 'HR Relations Manager',
      contactEmail: 'sarah.tan@ijm.com',
      contactPhone: '+60 17-999 8888'
    }
  ]);

  const [suggestedPartners, setSuggestedPartners] = useState([
    {
      id: 's_petronas',
      name: 'PETRONAS Digital',
      location: 'Kuala Lumpur',
      industry: 'Energy & Oil/Gas Tech',
      emoji: '⚡',
      potentialRoles: 'Data Scientist, Cloud Operations Engineer',
      reason: 'Matches 3 supervised students specializing in Cloud & Infrastructure.'
    },
    {
      id: 's_grab',
      name: 'Grab Malaysia',
      location: 'Kuala Lumpur',
      industry: 'On-Demand Tech & E-Commerce',
      emoji: '🚗',
      potentialRoles: 'Mobile App Developer, React Native / Backend dev',
      reason: 'Highly matches 2 supervised students with high React & TS experience.'
    },
    {
      id: 's_intel',
      name: 'Intel Malaysia',
      location: 'Penang',
      industry: 'Hardware Engineering',
      emoji: '🔌',
      potentialRoles: 'Firmware Design, Embedded Systems Engineer',
      reason: 'Highly matches 1 student specializing in IoT architecture.'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);

  // Form states for new partner
  const [newPartnerName, setNewPartnerName] = useState('');
  const [newPartnerLocation, setNewPartnerLocation] = useState('');
  const [newPartnerEmoji, setNewPartnerEmoji] = useState('🏢');
  const [newPartnerContactName, setNewPartnerContactName] = useState('');
  const [newPartnerContactRole, setNewPartnerContactRole] = useState('');
  const [newPartnerContactEmail, setNewPartnerContactEmail] = useState('');
  const [newPartnerContactPhone, setNewPartnerContactPhone] = useState('');
  const [newPartnerAssignedCount, setNewPartnerAssignedCount] = useState(0);

  const assignedStudentIds = ['s1', 's2'];
  const myStudents = students.filter(s => assignedStudentIds.includes(s.id));

  const handleAddStatement = (studentId: string) => {
    if (!statementText) return;
    addFacultyStatement(studentId, lecturerName, statementText);
    setStatementText('');
    setStatementToast(true);
    setTimeout(() => setStatementToast(false), 3000);
  };

  const handleAddPartnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPartnerName.trim() || !newPartnerLocation.trim() || !newPartnerContactName.trim()) {
      alert("Please fill in the Company Name, Location, and Coordinator Name.");
      return;
    }
    const newPartner = {
      id: `p_${Date.now()}`,
      name: newPartnerName,
      location: newPartnerLocation,
      assignedStudents: Number(newPartnerAssignedCount) || 0,
      emoji: newPartnerEmoji,
      contactName: newPartnerContactName,
      contactRole: newPartnerContactRole || 'Company Representative',
      contactEmail: newPartnerContactEmail || `${newPartnerContactName.toLowerCase().replace(' ', '.')}@${newPartnerName.toLowerCase().split(' ')[0]}.com`,
      contactPhone: newPartnerContactPhone || '+60 12-345 6789'
    };
    
    setActivePartners([...activePartners, newPartner]);
    
    // Seed in mockChats
    const chatKey = `${newPartner.contactName} (${newPartner.name.split(' ')[0]})`;
    if (!mockChats[chatKey]) {
      setMockChats(prev => ({
        ...prev,
        [chatKey]: [{ sender: chatKey, text: `Hello Dr. Lim, looking forward to collaborating with your university!`, time: 'Just now' }]
      }));
    }
    
    setShowAddPartnerModal(false);
    setNewPartnerName('');
    setNewPartnerLocation('');
    setNewPartnerEmoji('🏢');
    setNewPartnerContactName('');
    setNewPartnerContactRole('');
    setNewPartnerContactEmail('');
    setNewPartnerContactPhone('');
    setNewPartnerAssignedCount(0);
    
    setInquiryToastMessage('✓ New Industry Partner registered successfully!');
    setInquiryToast(true);
    setTimeout(() => setInquiryToast(false), 4000);
  };

  const handleConnectSuggested = (partner: typeof suggestedPartners[0]) => {
    setSuggestedPartners(prev => prev.filter(s => s.id !== partner.id));

    let cName = 'Azlan Shah';
    let cRole = 'Head of Digital Talent';
    let cEmail = 'azlan.shah@petronas.com.my';
    let cPhone = '+60 19-333 5555';

    if (partner.id === 's_grab') {
      cName = 'Cheryl Lau';
      cRole = 'Lead Talent Acquisition';
      cEmail = 'cheryl.lau@grab.com';
      cPhone = '+60 12-444 8888';
    } else if (partner.id === 's_intel') {
      cName = 'Dr. K. S. Rajah';
      cRole = 'Academic Outreach Director';
      cEmail = 'ks.rajah@intel.com';
      cPhone = '+60 14-777 9999';
    }

    const newActivePartner = {
      id: partner.id,
      name: partner.name,
      location: partner.location,
      assignedStudents: 0,
      emoji: partner.emoji,
      contactName: cName,
      contactRole: cRole,
      contactEmail: cEmail,
      contactPhone: cPhone
    };

    setActivePartners(prev => [...prev, newActivePartner]);

    const chatKey = `${cName} (${partner.name.split(' ')[0]})`;
    if (!mockChats[chatKey]) {
      setMockChats(prev => ({
        ...prev,
        [chatKey]: [{ sender: chatKey, text: `Hello Dr. Lim, we are thrilled to initiate a partnership with your university!`, time: 'Just now' }]
      }));
    }

    setInquiryToastMessage(`✓ Partnership initiated with ${partner.name}! Coordinator ${cName} has been registered.`);
    setInquiryToast(true);
    setTimeout(() => setInquiryToast(false), 4000);
  };

  const hasFreshLogs = (studentId: string) => {
    const logs = logbookEntries.filter(le => le.studentId === studentId);
    return logs.some(le => !le.isLocked);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;
    const chatHist = mockChats[chatRecipient] || [];
    setMockChats({
      ...mockChats,
      [chatRecipient]: [...chatHist, { sender: 'You', text: messageInput, time: 'Just now' }]
    });
    setMessageInput('');
  };

  return (
    <div className="slide-up">
      {/* 1. LECTURER DASHBOARD SUBPAGE (Matches Screenshot 4 layout!) */}
      {activeSubpage === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Top Stats Row (4 cards) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div className="dashboard-card" style={{ margin: 0, padding: '16px 20px' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Assigned Students</p>
              <h3 style={{ fontSize: '28px', color: 'var(--color-primary)' }}>18</h3>
              <button onClick={() => setActiveSubpage('students')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', marginTop: '6px' }}>View all students →</button>
            </div>
            <div className="dashboard-card" style={{ margin: 0, padding: '16px 20px' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Reports Pending Review</p>
              <h3 style={{ fontSize: '28px', color: 'var(--status-interview)' }}>6</h3>
              <button onClick={() => setActiveSubpage('reports')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', marginTop: '6px' }}>View reports →</button>
            </div>
            <div className="dashboard-card" style={{ margin: 0, padding: '16px 20px' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Industry Partners</p>
              <h3 style={{ fontSize: '28px', color: 'var(--status-screening)' }}>12</h3>
              <button onClick={() => setActiveSubpage('partners')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', marginTop: '6px' }}>View partners →</button>
            </div>
            <div className="dashboard-card" style={{ margin: 0, padding: '16px 20px' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Project Planning</p>
              <h3 style={{ fontSize: '28px', color: 'var(--color-primary)' }}>Active</h3>
              <button onClick={() => setActiveSubpage('planning')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', marginTop: '6px' }}>View plan →</button>
            </div>
          </div>

          {/* My Students Table + Progress Overview + Recent Report Submissions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '20px' }}>
            {/* My Students */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h5 style={{ fontSize: '13px', fontWeight: 700 }}>My Students</h5>
                <button onClick={() => setActiveSubpage('students')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '10px', fontWeight: 600 }}>View All Students →</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                    <th style={{ paddingBottom: '6px' }}>Student</th>
                    <th style={{ paddingBottom: '6px' }}>Company</th>
                    <th style={{ paddingBottom: '6px' }}>Progress</th>
                    <th style={{ paddingBottom: '6px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '8px 0', fontWeight: 700 }}>John Lim</td>
                    <td style={{ padding: '8px 0' }}>Datum Tech</td>
                    <td style={{ padding: '8px 0' }}>75%</td>
                    <td style={{ padding: '8px 0' }}><span className="badge badge-offered" style={{ fontSize: '9px', padding: '2px 6px' }}>On Track</span></td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', fontWeight: 700 }}>Maya</td>
                    <td style={{ padding: '8px 0' }}>IJM Corp</td>
                    <td style={{ padding: '8px 0' }}>40%</td>
                    <td style={{ padding: '8px 0' }}><span className="badge badge-interview" style={{ fontSize: '9px', padding: '2px 6px' }}>Review Needed</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Progress Overview */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <h5 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>Progress Overview</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>John Lim</span>
                    <span>80%</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}><div style={{ width: '80%', height: '100%', backgroundColor: 'var(--color-primary)' }}></div></div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span>Maya</span>
                    <span>50%</span>
                  </div>
                  <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}><div style={{ width: '50%', height: '100%', backgroundColor: 'var(--status-interview)' }}></div></div>
                </div>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '6px 0', fontSize: '11px', marginTop: '14px' }} onClick={() => setActiveSubpage('planning')}>Open Project Plan</button>
            </div>

            {/* Recent Report Submissions */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <h5 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>Recent Report Submissions</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10px' }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
                  <p><strong>Week 5 Report</strong> - John Lim</p>
                  <span className="badge badge-interview" style={{ padding: '2px 6px', fontSize: '8px' }}>Pending Review</span>
                </div>
                <div>
                  <p><strong>Midterm Report</strong> - Maya</p>
                  <span className="badge badge-offered" style={{ padding: '2px 6px', fontSize: '8px' }}>Approved</span>
                </div>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '6px 0', fontSize: '11px', marginTop: '14px' }} onClick={() => setActiveSubpage('reports')}>Review Reports</button>
            </div>
          </div>

          {/* Industry Partners + Project Planning Review + Upcoming Meetings + Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {/* Industry Partners */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <h5 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>Industry Partners</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                <p><strong>Datum Technology</strong> - 5 students</p>
                <p><strong>IJM Corporation</strong> - 4 students</p>
                <p><strong>PETRONAS Digital</strong> - 3 students</p>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '6px 0', fontSize: '11px', marginTop: '12px' }} onClick={() => setActiveSubpage('partners')}>View All Partners</button>
            </div>

            {/* Project Planning Review */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <h5 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>Project Planning Review</h5>
              <p style={{ fontSize: '11px' }}><strong>John Lim</strong> - Datum Tech</p>
              <p style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Project: AI Notification Management System</p>
              <div style={{ backgroundColor: '#f8fafc', padding: '6px', borderRadius: '4px', fontSize: '10px', margin: '8px 0', fontStyle: 'italic' }}>
                "Good progress overall. Refine the system architecture."
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '6px 0', fontSize: '11px' }} onClick={() => setActiveSubpage('planning')}>Open Project Plan</button>
            </div>

            {/* Upcoming Meetings */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <h5 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>Upcoming Meetings</h5>
              <div style={{ fontSize: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <p><strong>19 May:</strong> Datum Tech HR (10 AM)</p>
                <p><strong>21 May:</strong> Student Consult (2 PM)</p>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '6px 0', fontSize: '11px', marginTop: '12px' }} onClick={() => setActiveSubpage('planning')}>View Timeline</button>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <h5 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>Quick Actions</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button className="btn btn-secondary" style={{ padding: '6px 0', fontSize: '9px' }} onClick={() => setActiveSubpage('reports')}>Review Reports</button>
                <button className="btn btn-secondary" style={{ padding: '6px 0', fontSize: '9px' }} onClick={() => setActiveSubpage('messages')}>Message Student</button>
                <button className="btn btn-secondary" style={{ padding: '6px 0', fontSize: '9px' }} onClick={() => setActiveSubpage('students')}>Add Note</button>
                <button className="btn btn-secondary" style={{ padding: '6px 0', fontSize: '9px' }} onClick={() => setActiveSubpage('planning')}>View Project Plan</button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. MY STUDENTS / supervision SUBPAGE */}
      {activeSubpage === 'students' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {selectedStudentId === null ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Weekly Logbook Submission Trends (FR-41) */}
              <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>📅 Weekly Logbook Submission Trends</h3>
                <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1.5, minWidth: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <SVGChart
                      type="bar"
                      title="Logbook Submission Rates (%) by Week"
                      data={[
                        { label: 'Week 1', value: 95 },
                        { label: 'Week 2', value: 89 },
                        { label: 'Week 3', value: 92 },
                        { label: 'Week 4', value: 84 },
                        { label: 'Week 5', value: 72 }
                      ]}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: '240px', fontSize: '12px', color: 'var(--color-text-muted)', borderLeft: '1px solid var(--color-border)', paddingLeft: '24px' }}>
                    <p style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '13px', marginBottom: '8px' }}>Submission Trend & Vetting Analysis</p>
                    <p style={{ margin: '0 0 8px 0' }}>• **Week 5 Submission Rate**: Currently at <strong>72%</strong>. Awaiting 5 student uploads.</p>
                    <p style={{ margin: '0 0 8px 0' }}>• **Site Visit Relevance**: Use the optimized route planner below to schedule field site visits for students with missing logs.</p>
                    <p style={{ margin: 0 }}>• **Alerts**: Week 4 compliance drop was addressed. Remaining reviews are being vetted.</p>
                  </div>
                </div>
              </div>

              {/* Side-by-side: Site Visit Planner & Compliance Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>

                {/* Company Site Visit Planner */}
                <div className="dashboard-card" style={{ margin: 0, padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '12px', fontWeight: 700 }}>🚗 Company Site Visit Planner</h3>
                  <div className="form-group" style={{ marginBottom: '12px' }}>
                    <span className="form-label" style={{ fontSize: '12px' }}>Visit Date:</span>
                    <input type="date" className="form-input" style={{ height: '32px', padding: '4px 8px', fontSize: '12px' }} value={visitDate} onChange={e => setVisitDate(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                      onClick={() => {
                        setVisitToast(`✓ Best travel route calculated for ${visitDate}. Scroll down to see details.`);
                        setShowRouteItinerary(true);
                      }}
                    >
                      Plan Route
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '11px' }}
                      onClick={() => setShowRoutes(!showRoutes)}
                    >
                      {showRoutes ? 'Hide' : 'Show'} Proximity Zones
                    </button>
                  </div>

                  {visitToast && (
                    <p style={{ color: 'var(--status-offered)', fontSize: '11.5px', marginBottom: '12px', fontWeight: 600 }}>
                      {visitToast}
                    </p>
                  )}

                  {showRoutes && (
                    <div style={{ padding: '10px', backgroundColor: '#f8fafc', fontSize: '11px', borderRadius: '6px', borderLeft: '3px solid var(--color-primary)', marginBottom: '12px' }}>
                      <p style={{ margin: '0 0 4px 0' }}>🗺️ <strong>Zone Alpha:</strong> Datum Tech & TechCorp - Route optimized for post code 40xxx.</p>
                      <p style={{ margin: 0 }}>🗺️ <strong>Zone Beta:</strong> IJM Corp - Route optimized for post code 47xxx.</p>
                    </div>
                  )}

                  {showRouteItinerary && (
                    <div style={{ padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '11px' }}>
                      <h4 style={{ color: 'var(--color-primary)', fontSize: '12px', margin: '0 0 10px 0', fontWeight: 700 }}>🗺️ Optimized Site Visit Route ({visitDate})</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: '10px', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '-5px', top: '3px', backgroundColor: 'var(--color-primary)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                          <strong>09:00 AM — University Campus</strong>
                          <p style={{ margin: '2px 0 0 0', color: 'var(--color-text-muted)', fontSize: '10px' }}>Depart from Faculty of Computing.</p>
                        </div>
                        <div style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: '10px', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '-5px', top: '3px', backgroundColor: 'var(--color-primary)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                          <strong>09:40 AM — Datum Technology (KL)</strong>
                          <p style={{ margin: '2px 0 0 0', color: 'var(--color-text-muted)', fontSize: '10px' }}>Audit **John Lim**'s Week 4 logbook compliance.</p>
                        </div>
                        <div style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: '10px', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '-5px', top: '3px', backgroundColor: 'var(--color-primary)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                          <strong>01:30 PM — IJM Corporation (PJ)</strong>
                          <p style={{ margin: '2px 0 0 0', color: 'var(--color-text-muted)', fontSize: '10px' }}>Visit student: **Maya**. Meet company supervisor.</p>
                        </div>
                        <div style={{ paddingLeft: '10px', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: '-5px', top: '3px', backgroundColor: 'var(--color-primary)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                          <strong>03:30 PM — Return to Campus</strong>
                        </div>
                      </div>
                      <div style={{ borderTop: '1px solid #bbf7d0', marginTop: '10px', paddingTop: '6px', fontSize: '10px', color: 'var(--color-text-muted)' }}>
                        ⚡ Optimized Route: 38.5 km travel distance | Est. duration 1h 22m.
                      </div>
                    </div>
                  )}
                </div>

                {/* Weekly Compliance Grid */}
                <div className="dashboard-card" style={{ margin: 0, padding: '20px' }}>
                  <h3 style={{ fontSize: '16px', marginBottom: '12px', fontWeight: 700 }}>📋 Weekly Compliance Grid</h3>
                  <div style={{ overflowX: 'auto' }}>
                    <table className="data-table" style={{ width: '100%', minWidth: '400px' }}>
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '8px' }}>Student</th>
                          <th style={{ textAlign: 'center', padding: '8px' }}>W1</th>
                          <th style={{ textAlign: 'center', padding: '8px' }}>W2</th>
                          <th style={{ textAlign: 'center', padding: '8px' }}>W3</th>
                          <th style={{ textAlign: 'center', padding: '8px' }}>W4</th>
                          <th style={{ textAlign: 'center', padding: '8px' }}>W5</th>
                        </tr>
                      </thead>
                      <tbody>
                        {myStudents.map(student => (
                          <tr key={student.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <td style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', fontWeight: 600 }}>
                              <img src={student.avatar} alt={student.name} style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }} />
                              {student.name}
                            </td>
                            <td style={{ textAlign: 'center', padding: '8px' }}>{getLogbookStatusIndicator(student.id, 1)}</td>
                            <td style={{ textAlign: 'center', padding: '8px' }}>{getLogbookStatusIndicator(student.id, 2)}</td>
                            <td style={{ textAlign: 'center', padding: '8px' }}>{getLogbookStatusIndicator(student.id, 3)}</td>
                            <td style={{ textAlign: 'center', padding: '8px' }}>{getLogbookStatusIndicator(student.id, 4)}</td>
                            <td style={{ textAlign: 'center', padding: '8px' }}>{getLogbookStatusIndicator(student.id, 5)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>

              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>My Assigned Students</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {myStudents.map(student => {
                    const isPendingReview = hasFreshLogs(student.id);
                    const activeApp = applications.find(a => a.studentId === student.id && (a.status === 'Approved' || a.status === 'Interview' || a.status === 'Shortlisted'));

                    return (
                      <div
                        key={student.id}
                        className="dashboard-card"
                        style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '20px', alignItems: 'center', margin: 0, padding: '16px 20px' }}
                      >
                        <img src={student.avatar} alt={student.name} className="user-avatar" style={{ width: '50px', height: '50px' }} />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>{student.name}</h4>
                            {isPendingReview && <span className="badge badge-interview" style={{ fontSize: '9px', padding: '2px 6px' }}>New Log Uploaded</span>}
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Matric: {student.matricNumber} | Placement: {activeApp ? 'Active' : 'Awaiting Matching'}</p>
                        </div>
                        <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setSelectedStudentId(student.id)}>
                          Manage Progress
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            (() => {
              const student = students.find(s => s.id === selectedStudentId);
              if (!student) return null;
              const logs = logbookEntries.filter(le => le.studentId === student.id);
              const activeApp = applications.find(a => a.studentId === student.id && (a.status === 'Approved' || a.status === 'Interview' || a.status === 'Shortlisted' || a.status === 'Awaiting Offer Verification'));
              const matchingJob = activeApp ? jobs.find(j => j.id === activeApp.jobId) : null;
              const companyName = matchingJob ? matchingJob.companyName : 'Not Placed';

              return (
                <div className="dashboard-card slide-up" style={{ margin: 0 }}>
                  <button className="btn btn-secondary" style={{ marginBottom: '16px' }} onClick={() => setSelectedStudentId(null)}>← Back to Student List</button>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '24px' }}>
                    <img src={student.avatar} alt={student.name} className="user-avatar" style={{ width: '60px', height: '60px' }} />
                    <div>
                      <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{student.name} — Logs Vetting</h2>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div>
                      <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Weekly Logbook Records</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {logs.map(log => (
                          <div key={log.id} style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px', backgroundColor: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <h4 style={{ margin: 0 }}>Week {log.weekNumber} (Hours: {log.workingHours})</h4>
                              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{log.date}</span>
                            </div>
                            <p style={{ fontSize: '13px', margin: '4px 0' }}><strong>Tasks Done:</strong> {log.tasksCompleted}</p>
                            <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '10px', marginTop: '8px' }} onClick={() => setViewerDoc({ name: `Week_${log.weekNumber}_Report.pdf`, type: 'pdf' })}>📄 View PDF Report</button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div className="dashboard-card" style={{ margin: 0 }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Faculty Interview Statements</h3>
                        <textarea className="form-input" rows={3} placeholder="Add comments..." value={statementText} onChange={e => setStatementText(e.target.value)} />
                        <button className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }} onClick={() => handleAddStatement(student.id)}>Append Statement</button>
                        {statementToast && <p style={{ color: 'var(--status-offered)', fontSize: '12px', marginTop: '6px' }}>✓ Logged Statement.</p>}
                      </div>

                      {/* Site Visit Planner Card for this specific student */}
                      <div className="dashboard-card" style={{ margin: 0 }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '12px', fontWeight: 700 }}>🚗 Schedule Site Visit to {companyName}</h3>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                          Plan a physical visitation for {student.name} at {companyName}.
                        </p>
                        <div className="form-group" style={{ marginBottom: '12px' }}>
                          <span className="form-label" style={{ fontSize: '11px' }}>Visit Date:</span>
                          <input
                            type="date"
                            className="form-input"
                            style={{ height: '30px', padding: '4px 8px', fontSize: '11px' }}
                            value={studentVisitDates[student.id] || '2026-06-22'}
                            onChange={e => setStudentVisitDates({ ...studentVisitDates, [student.id]: e.target.value })}
                          />
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-primary"
                            style={{ flex: 1, padding: '6px 12px', fontSize: '11px' }}
                            onClick={() => {
                              setStudentVisitToasts({ ...studentVisitToasts, [student.id]: `✓ Visit to ${companyName} scheduled on ${studentVisitDates[student.id] || '2026-06-22'}.` });
                              setTimeout(() => {
                                setStudentVisitToasts(prev => {
                                  const next = { ...prev };
                                  delete next[student.id];
                                  return next;
                                });
                              }, 3000);
                            }}
                          >
                            Plan Visit
                          </button>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '11px' }}
                            onClick={() => setStudentShowZones({ ...studentShowZones, [student.id]: !studentShowZones[student.id] })}
                          >
                            {studentShowZones[student.id] ? 'Hide' : 'Show'} Route
                          </button>
                        </div>
                        {studentVisitToasts[student.id] && (
                          <p style={{ color: 'var(--status-offered)', fontSize: '11.5px', marginTop: '8px', fontWeight: 600 }}>
                            {studentVisitToasts[student.id]}
                          </p>
                        )}
                        {studentShowZones[student.id] && (
                          <div style={{ marginTop: '10px', padding: '8px 12px', backgroundColor: '#f8fafc', fontSize: '11px', borderRadius: '6px', borderLeft: '3px solid var(--color-primary)' }}>
                            <p style={{ margin: '0 0 4px 0', fontWeight: 700 }}>🗺️ Travel Details:</p>
                            <p style={{ margin: 0 }}>University Campus ➔ **{companyName}** (Estimated: 25 mins, 14 km via highway).</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* 3. INDUSTRY PARTNERS SUBPAGE */}
      {activeSubpage === 'partners' && (() => {
        const filteredPartners = activePartners.filter(partner => {
          const q = searchQuery.toLowerCase().trim();
          return (
            partner.name.toLowerCase().includes(q) ||
            partner.location.toLowerCase().includes(q) ||
            partner.contactName.toLowerCase().includes(q)
          );
        });

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header info block */}
            <div className="dashboard-card" style={{ margin: 0, padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, fontFamily: 'var(--font-display)', margin: '0 0 6px 0' }}>
                  🏢 Industry Collaboration Partners
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0 }}>
                  Connect directly with company representatives, coordinate student placements, and manage academic-industry inquiries.
                </p>
              </div>

              {/* Controls Row (Search and Add button) */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '14px' }}>🔍</span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Search by company name, location, or coordinator name..."
                    style={{ paddingLeft: '36px', height: '42px', fontSize: '13px', margin: 0 }}
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')} 
                      style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '16px' }}
                    >
                      &times;
                    </button>
                  )}
                </div>
                <button 
                  className="btn btn-primary" 
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 20px', height: '42px', fontSize: '13px', whiteSpace: 'nowrap' }}
                  onClick={() => setShowAddPartnerModal(true)}
                >
                  <span>➕</span> Add Partner
                </button>
              </div>
            </div>

            {/* Active Partners Cards Grid */}
            {filteredPartners.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {filteredPartners.map((partner) => (
                  <div key={partner.id} className="dashboard-card" style={{ margin: 0, padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '320px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <span style={{ fontSize: '32px', backgroundColor: 'var(--bg-app)', padding: '8px', borderRadius: '8px' }}>{partner.emoji}</span>
                        <span className="badge badge-approved" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '11px' }}>
                          Active Partner
                        </span>
                      </div>
                      <h4 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0' }}>{partner.name}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0 0 16px 0' }}>
                        Location: {partner.location} | Assigned Students: <strong>{partner.assignedStudents}</strong>
                      </p>
                      
                      {/* Contact Sub-Card */}
                      <div style={{ backgroundColor: 'var(--bg-app)', padding: '14px', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '20px' }}>
                        <span style={{ fontSize: '10.5px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                          👤 Coordinator Contact
                        </span>
                        <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 2px 0' }}>{partner.contactName}</h5>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '0 0 8px 0' }}>{partner.contactRole}</p>
                        <p style={{ fontSize: '11.5px', margin: '0 0 4px 0' }}>📧 {partner.contactEmail}</p>
                        <p style={{ fontSize: '11.5px', margin: 0 }}>📞 {partner.contactPhone}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn btn-primary" 
                        style={{ flex: 1.2, padding: '8px 0', fontSize: '12px' }}
                        onClick={() => {
                          const chatKey = `${partner.contactName} (${partner.name.split(' ')[0]})`;
                          if (!mockChats[chatKey]) {
                            setMockChats({
                              ...mockChats,
                              [chatKey]: [{ sender: chatKey, text: 'Hello Dr. Lim, we can coordinate the details here.', time: 'Just now' }]
                            });
                          }
                          setChatRecipient(chatKey);
                          setActiveSubpage('messages');
                        }}
                      >
                        💬 Message Coordinator
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        style={{ flex: 1, padding: '8px 0', fontSize: '12px' }}
                        onClick={() => {
                          setShowInquiryModal({ name: partner.contactName, role: partner.contactRole, companyName: partner.name });
                          setInquirySubject('Official Student Placement Inquiry');
                          setInquiryMessage(`Dear ${partner.contactName.split(' ')[0]},\n\nI would like to query about the current progress and evaluation feedback for our assigned software developer interns.`);
                          setInquiryToastMessage('✓ Official Inquiry submitted successfully! The representative will be notified.');
                        }}
                      >
                        ✉️ Send Inquiry
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="dashboard-card" style={{ margin: 0, padding: '40px', textAlign: 'center' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🔍</span>
                <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '8px' }}>
                  No matching partners found
                </h4>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                  We couldn't find any active partners matching "{searchQuery}".
                </p>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '6px 16px', fontSize: '12.5px' }}
                  onClick={() => setSearchQuery('')}
                >
                  Clear Search Filter
                </button>
              </div>
            )}

            {/* Suggested & Potential Partners Recommendation Section */}
            <div style={{ marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '24px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>💡</span> Suggested & Potential Partners
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0 0 16px 0' }}>
                These industry partners match your supervised student profiles and could offer suitable placements.
              </p>

              {suggestedPartners.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  {suggestedPartners.map((partner) => (
                    <div 
                      key={partner.id} 
                      className="dashboard-card" 
                      style={{ margin: 0, padding: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', border: '1px dashed var(--color-border)', minHeight: '190px' }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <span style={{ fontSize: '24px', backgroundColor: 'var(--bg-app)', padding: '6px', borderRadius: '6px' }}>{partner.emoji}</span>
                          <span className="badge badge-interview" style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#fef3c7', color: '#d97706' }}>
                            Potential Partner
                          </span>
                        </div>
                        <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 4px 0' }}>{partner.name}</h5>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '0 0 8px 0' }}>
                          📍 {partner.location} | {partner.industry}
                        </p>
                        <p style={{ fontSize: '11.5px', color: 'var(--color-text-main)', margin: '0 0 12px 0', textOverflow: 'ellipsis', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          🎯 <strong>Target Roles:</strong> {partner.potentialRoles}
                          <br/>
                          <span style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{partner.reason}</span>
                        </p>
                      </div>
                      <button 
                        className="btn btn-secondary" 
                        style={{ width: '100%', padding: '6px 0', fontSize: '11.5px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        onClick={() => handleConnectSuggested(partner)}
                      >
                        <span>🤝</span> Connect Partner
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary)', padding: '16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>✨</span>
                  <div style={{ fontSize: '13px', color: 'var(--color-text-main)' }}>
                    <strong>All suggested partners have been connected!</strong> You have initiated relationships with all recommended representatives.
                  </div>
                </div>
              )}
            </div>

            {/* Custom toast alerts */}
            {inquiryToast && (
              <div style={{ backgroundColor: 'var(--status-offered)', color: 'white', padding: '12px', borderRadius: '6px', fontSize: '13px', textAlign: 'center', animation: 'slideUp 0.2s ease forwards' }}>
                {inquiryToastMessage}
              </div>
            )}
          </div>
        );
      })()}

      {/* 4. INTERNSHIP REPORTS SUBPAGE */}
      {activeSubpage === 'reports' && (
        <div className="dashboard-card">
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Student Submitted Reports</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4>Week 5 Progress Logbook</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Student: John Lim | Submitted: 2 Jun 2026</p>
              </div>
              <button className="btn btn-primary" onClick={() => setViewerDoc({ name: 'Week_5_Report.pdf', type: 'pdf' })}>View PDF</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. PROJECT PLANNING (Gantt chart) SUBPAGE */}
      {activeSubpage === 'planning' && (() => {
        const selectedStudent = myStudents.find(s => s.id === planningStudentId) || myStudents[0];
        
        return (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'stretch' }}>
            {/* Left Column: Student List Selection Cards */}
            <div className="dashboard-card" style={{ margin: 0, padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', height: 'fit-content' }}>
              <div>
                <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0', color: 'var(--color-text-main)' }}>
                  🧑‍🎓 Supervised Students
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
                  Select a student to inspect their progress.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                {myStudents.map((student) => {
                  const isActive = student.id === planningStudentId;
                  
                  return (
                    <div
                      key={student.id}
                      onClick={() => setPlanningStudentId(student.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        backgroundColor: isActive ? 'var(--color-primary-light, #eff6ff)' : 'var(--bg-app, #f8fafc)',
                        border: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
                        boxShadow: isActive ? '0 4px 12px rgba(59, 130, 246, 0.08)' : 'none'
                      }}
                      className="student-planning-card"
                    >
                      <img
                        src={student.avatar}
                        alt={student.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: isActive ? '2px solid var(--color-primary)' : '1px solid var(--color-border)'
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h5 style={{ 
                          fontSize: '13.5px', 
                          fontWeight: isActive ? 700 : 600, 
                          margin: 0,
                          color: isActive ? 'var(--color-primary)' : 'var(--color-text-main)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {student.name}
                        </h5>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
                          Matric: {student.matricNumber}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Dynamic Project Progress Detail */}
            <div className="dashboard-card" style={{ margin: 0, padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {selectedStudent ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)', margin: 0 }}>
                          📅 {selectedStudent.name} - Project Progress
                        </h3>
                        <span className="badge badge-approved" style={{ fontSize: '10.5px', padding: '3px 8px', backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>
                          CGPA {selectedStudent.cgpa}
                        </span>
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0 }}>
                        Supervised Final Year Project (FYP) timeline, milestones, and delay tracking details.
                      </p>
                    </div>
                  </div>

                  <div>
                    <GanttChart studentId={selectedStudent.id} />
                  </div>
                </>
              ) : (
                <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                  <p>Please select a student from the left panel to inspect planning details.</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* 7. MESSAGES SUBPAGE */}
      {activeSubpage === 'messages' && (
        <div className="dashboard-card" style={{ height: '500px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', padding: 0, overflow: 'hidden' }}>
          <div style={{ borderRight: '1px solid var(--color-border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4>Contacts</h4>
            {Object.keys(mockChats).map(c => (
              <button key={c} className={`btn ${chatRecipient === c ? 'btn-primary' : 'btn-secondary'}`} style={{ justifyContent: 'flex-start', padding: '10px', fontSize: '12px' }} onClick={() => setChatRecipient(c)}>💬 {c}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)' }}>{chatRecipient}</div>
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
              {mockChats[chatRecipient]?.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start', backgroundColor: msg.sender === 'You' ? 'var(--color-primary-light)' : '#f1f5f9', padding: '8px 12px', borderRadius: '12px', marginBottom: '8px' }}>
                  <p style={{ fontSize: '13px' }}>{msg.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} style={{ padding: '20px', display: 'flex', gap: '10px', borderTop: '1px solid var(--color-border)' }}>
              <input type="text" className="form-input" placeholder="Type message..." style={{ flex: 1 }} value={messageInput} onChange={e => setMessageInput(e.target.value)} />
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
          </div>
        </div>
      )}

      {/* 8. PROFILE SUBPAGE */}
      {activeSubpage === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
          {/* Main Info Card */}
          <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>Lecturer Profile Details</h3>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '20px' }}>
              <img
                src={loggedInUser?.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120'}
                alt="Profile"
                className="user-avatar"
                style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary)' }}
              />
              <div>
                <h4 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-main)' }}>{lecturerName}</h4>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {loggedInUser?.subText || 'Faculty of Computing'} • Academic Advisor
                </p>
                <span className="badge badge-offered" style={{ marginTop: '8px', display: 'inline-block', fontSize: '10px', padding: '3px 8px' }}>
                  Verified Faculty Advisor
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Faculty / Division</p>
                <p style={{ fontSize: '15px', fontWeight: 600 }}>{loggedInUser?.details?.faculty || 'Faculty of Computing'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Specialization Area</p>
                <p style={{ fontSize: '15px', fontWeight: 600 }}>{loggedInUser?.details?.specialization || 'Software Engineering'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Registered Email</p>
                <p style={{ fontSize: '15px', fontWeight: 600 }}>{loggedInUser?.email || 'lim.weiming@university.edu.my'}</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Contact Number</p>
                <p style={{ fontSize: '15px', fontWeight: 600 }}>+60 3-8921 6000</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Office Location</p>
                <p style={{ fontSize: '15px', fontWeight: 600 }}>Block A, Level 3, Room 302</p>
              </div>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>Supervision Load</p>
                <p style={{ fontSize: '15px', fontWeight: 600 }}>18 Active Students (2 Direct Supervision)</p>
              </div>
            </div>
          </div>

          {/* Supervised Projects Card */}
          <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>📚 Active Supervised Student Projects</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myStudents.map(student => {
                const activeApp = applications.find(a => a.studentId === student.id && (a.status === 'Approved' || a.status === 'Interview' || a.status === 'Shortlisted'));
                const matchingJob = activeApp ? jobs.find(j => j.id === activeApp.jobId) : null;
                const projectName = student.id === 's1' ? 'AI Notification Management System' : 'Enterprise Web Portal Infrastructure';
                const progressVal = student.id === 's1' ? '75%' : '40%';
                const statusBadgeClass = student.id === 's1' ? 'badge-offered' : 'badge-interview';
                const statusText = student.id === 's1' ? 'On Track' : 'Review Needed';

                return (
                  <div key={student.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-bg-light, #ffffff)' }}>
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                      <img src={student.avatar} alt={student.name} style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 4px 0' }}>{projectName}</h4>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
                          Student: <strong>{student.name}</strong> ({student.matricNumber}) • Company: <strong>{matchingJob ? matchingJob.companyName : 'Not Placed'}</strong>
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ textAlign: 'right' }}>
                        <span className={`badge ${statusBadgeClass}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                          {statusText}
                        </span>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                          Progress: <strong>{progressVal}</strong>
                        </p>
                      </div>
                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => { setSelectedStudentId(student.id); setActiveSubpage('students'); }}>
                        Manage
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 9. SETTINGS SUBPAGE */}
      {activeSubpage === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', width: '100%', alignItems: 'start' }}>

          {/* Notification and Automation Preferences */}
          <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>⚙️ Portal Preferences & Notifications</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Configure how you receive updates regarding student submissions, compliance status, and system reminders.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 4px 0' }}>Email Notifications</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Receive email alerts when students submit logs or messages.</p>
                </div>
                <input
                  type="checkbox"
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  checked={notifyEmail}
                  onChange={e => setNotifyEmail(e.target.checked)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 4px 0' }}>Push Web Alerts</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Show desktop push notifications for urgent compliance updates.</p>
                </div>
                <input
                  type="checkbox"
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  checked={notifyPush}
                  onChange={e => setNotifyPush(e.target.checked)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 4px 0' }}>Automated Student Reminders</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Send auto-reminders to students with outstanding unsubmitted weekly logs.</p>
                </div>
                <input
                  type="checkbox"
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  checked={autoRemind}
                  onChange={e => setAutoRemind(e.target.checked)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 4px 0' }}>Calendar Sync Integration</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Sync scheduled student meetings and site visits to Google Calendar.</p>
                </div>
                <button
                  className={`btn ${calendarSync ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '6px 14px', fontSize: '11px', borderRadius: '6px' }}
                  onClick={() => setCalendarSync(!calendarSync)}
                >
                  {calendarSync ? '✓ Connected' : 'Connect'}
                </button>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => {
                setSettingsToast(true);
                setTimeout(() => setSettingsToast(false), 3000);
              }}
              style={{ width: '100%', marginTop: '24px' }}
            >
              Save Preferences
            </button>
            {settingsToast && (
              <p style={{ color: 'var(--status-offered)', fontSize: '12.5px', marginTop: '12px', textAlign: 'center', fontWeight: 600 }}>
                ✓ System preferences saved successfully.
              </p>
            )}
          </div>

          {/* Account Security (Password Reset) */}
          <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>🔒 Account Security</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Change your password to maintain account integrity.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <span className="form-label" style={{ fontSize: '11px' }}>Current Password:</span>
                <input
                  type="password"
                  className="form-input"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ height: '32px', padding: '6px 10px', fontSize: '12px' }}
                />
              </div>

              <div className="form-group">
                <span className="form-label" style={{ fontSize: '11px' }}>New Password:</span>
                <input
                  type="password"
                  className="form-input"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ height: '32px', padding: '6px 10px', fontSize: '12px' }}
                />
              </div>

              <div className="form-group">
                <span className="form-label" style={{ fontSize: '11px' }}>Confirm New Password:</span>
                <input
                  type="password"
                  className="form-input"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{ height: '32px', padding: '6px 10px', fontSize: '12px' }}
                />
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => {
                  if (!currentPassword || !newPassword || !confirmPassword) {
                    alert("Please fill in all password fields.");
                    return;
                  }
                  if (newPassword !== confirmPassword) {
                    alert("New passwords do not match!");
                    return;
                  }
                  alert("Password updated successfully!");
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                style={{ width: '100%', marginTop: '10px' }}
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT VIEWER MODAL */}
      {viewerDoc && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3>📄 Document Viewer: {viewerDoc.name}</h3>
              <div style={{ backgroundColor: '#f1f5f9', padding: '20px', borderRadius: '6px', height: '50vh', overflowY: 'auto', fontFamily: 'monospace', fontSize: '12px', marginTop: '16px' }}>
                <p>--- SRE MATCHING PORTAL PDF REPORT ---</p>
                <p>Student Name: John Lim</p>
                <p>Tasks completed: Configured front-end components and local context hooks.</p>
              </div>
            </div>
            <div className="modal-buttons" style={{ marginTop: '16px' }}>
              <button className="btn btn-secondary" onClick={() => setViewerDoc(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* SEND INQUIRY MODAL */}
      {showInquiryModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>
                ✉️ Send Academic Placement Inquiry
              </h3>
              <button 
                onClick={() => setShowInquiryModal(null)} 
                style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            <div style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Addressed to: <strong style={{ color: 'var(--color-text-main)' }}>{showInquiryModal.name}</strong> ({showInquiryModal.role}) at <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{showInquiryModal.companyName}</span>
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Inquiry Subject:</label>
              <input
                type="text"
                className="form-input"
                value={inquirySubject}
                onChange={e => setInquirySubject(e.target.value)}
                placeholder="Subject..."
                style={{ height: '36px', fontSize: '13px' }}
              />
            </div>

            <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Message:</label>
              <textarea
                className="form-input"
                value={inquiryMessage}
                onChange={e => setInquiryMessage(e.target.value)}
                placeholder="Write your inquiry message here..."
                style={{ height: '140px', fontSize: '13px', resize: 'vertical', padding: '10px' }}
              />
            </div>

            <div className="modal-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '4px' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowInquiryModal(null)}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  if (!inquirySubject.trim() || !inquiryMessage.trim()) {
                    alert('Please fill in both the Subject and Message fields.');
                    return;
                  }
                  // Trigger toast notification
                  setInquiryToast(true);
                  setTimeout(() => setInquiryToast(false), 4000);
                  
                  // Close modal & clear state
                  setShowInquiryModal(null);
                  setInquirySubject('');
                  setInquiryMessage('');
                }}
                style={{ padding: '8px 20px', fontSize: '13px' }}
              >
                Send Inquiry
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ADD PARTNER MODAL */}
      {showAddPartnerModal && (
        <div className="modal-overlay">
          <form 
            onSubmit={handleAddPartnerSubmit} 
            className="modal-content" 
            style={{ maxWidth: '550px', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '90vh', overflowY: 'auto' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, fontFamily: 'var(--font-display)' }}>
                🏢 Register New Industry Partner
              </h3>
              <button 
                type="button"
                onClick={() => setShowAddPartnerModal(false)} 
                style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', color: 'var(--color-text-muted)', lineHeight: 1 }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Company Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={newPartnerName}
                  onChange={e => setNewPartnerName(e.target.value)}
                  placeholder="e.g. PETRONAS Digital"
                  style={{ height: '36px', fontSize: '13px', margin: 0 }}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Location *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={newPartnerLocation}
                  onChange={e => setNewPartnerLocation(e.target.value)}
                  placeholder="e.g. Kuala Lumpur"
                  style={{ height: '36px', fontSize: '13px', margin: 0 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Industry Emoji Icon</label>
                <select
                  className="form-input"
                  value={newPartnerEmoji}
                  onChange={e => setNewPartnerEmoji(e.target.value)}
                  style={{ height: '36px', fontSize: '13px', margin: 0 }}
                >
                  <option value="🏢">🏢 General Corporate</option>
                  <option value="💻">💻 Tech / Software</option>
                  <option value="🏗️">🏗️ Engineering / Construction</option>
                  <option value="⚡">⚡ Energy / Utilities</option>
                  <option value="🚗">🚗 Transport / Logistics</option>
                  <option value="🔌">🔌 Hardware / Electronics</option>
                  <option value="🌐">🌐 Telecommunications</option>
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Assigned Students</label>
                <input
                  type="number"
                  className="form-input"
                  min="0"
                  value={newPartnerAssignedCount}
                  onChange={e => setNewPartnerAssignedCount(Number(e.target.value))}
                  style={{ height: '36px', fontSize: '13px', margin: 0 }}
                />
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '4px' }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--color-text-muted)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                👤 Coordinator Contact Information
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Coordinator Name *</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  value={newPartnerContactName}
                  onChange={e => setNewPartnerContactName(e.target.value)}
                  placeholder="e.g. Azlan Shah"
                  style={{ height: '36px', fontSize: '13px', margin: 0 }}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Role / Designation</label>
                <input
                  type="text"
                  className="form-input"
                  value={newPartnerContactRole}
                  onChange={e => setNewPartnerContactRole(e.target.value)}
                  placeholder="e.g. Head of Talent"
                  style={{ height: '36px', fontSize: '13px', margin: 0 }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  value={newPartnerContactEmail}
                  onChange={e => setNewPartnerContactEmail(e.target.value)}
                  placeholder="e.g. coordinator@company.com"
                  style={{ height: '36px', fontSize: '13px', margin: 0 }}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  value={newPartnerContactPhone}
                  onChange={e => setNewPartnerContactPhone(e.target.value)}
                  placeholder="e.g. +60 12-345 6789"
                  style={{ height: '36px', fontSize: '13px', margin: 0 }}
                />
              </div>
            </div>

            <div className="modal-buttons" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '12px' }}>
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => setShowAddPartnerModal(false)}
                style={{ padding: '8px 16px', fontSize: '13px' }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ padding: '8px 20px', fontSize: '13px' }}
              >
                Register Partner
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default LecturerPortal;