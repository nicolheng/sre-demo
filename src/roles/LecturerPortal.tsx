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
  const [mockChats, setMockChats] = useState<Record<string, { sender: string; text: string; time: string }[]>>({
    'John Lim': [
      { sender: 'You', text: 'Hi John, please ensure your Week 4 log is submitted soon.', time: '1 day ago' },
      { sender: 'John Lim', text: 'Yes Dr., I will complete it by this evening.', time: '12 hours ago' }
    ],
    'Career Center': [
      { sender: 'Career Center', text: 'Academic review statements are required for student clearances.', time: '2 days ago' }
    ]
  });

  const assignedStudentIds = ['s1', 's2'];
  const myStudents = students.filter(s => assignedStudentIds.includes(s.id));

  const handleAddStatement = (studentId: string) => {
    if (!statementText) return;
    addFacultyStatement(studentId, lecturerName, statementText);
    setStatementText('');
    setStatementToast(true);
    setTimeout(() => setStatementToast(false), 3000);
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
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Upcoming Meetings</p>
              <h3 style={{ fontSize: '28px', color: 'var(--color-primary)' }}>4</h3>
              <button onClick={() => setActiveSubpage('monitoring')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', marginTop: '6px' }}>View calendar →</button>
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
              <button className="btn btn-secondary" style={{ width: '100%', padding: '6px 0', fontSize: '11px', marginTop: '14px' }} onClick={() => setActiveSubpage('monitoring')}>Open Progress Tracker</button>
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
              <button className="btn btn-secondary" style={{ width: '100%', padding: '6px 0', fontSize: '11px', marginTop: '12px' }} onClick={() => setActiveSubpage('monitoring')}>View Full Calendar</button>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <h5 style={{ fontSize: '13px', fontWeight: 700, marginBottom: '10px' }}>Quick Actions</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button className="btn btn-secondary" style={{ padding: '6px 0', fontSize: '9px' }} onClick={() => setActiveSubpage('reports')}>Review Reports</button>
                <button className="btn btn-secondary" style={{ padding: '6px 0', fontSize: '9px' }} onClick={() => setActiveSubpage('messages')}>Message Student</button>
                <button className="btn btn-secondary" style={{ padding: '6px 0', fontSize: '9px' }} onClick={() => setActiveSubpage('students')}>Add Note</button>
                <button className="btn btn-secondary" style={{ padding: '6px 0', fontSize: '9px' }} onClick={() => setActiveSubpage('monitoring')}>Schedule Meeting</button>
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
      {activeSubpage === 'partners' && (
        <div className="dashboard-card">
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Industry Collaboration Partners</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px' }}>
              <h4>Datum Technology</h4>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Location: Kuala Lumpur | Assigned Students: 5</p>
            </div>
            <div style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px' }}>
              <h4>IJM Corporation</h4>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Location: Petaling Jaya | Assigned Students: 4</p>
            </div>
          </div>
        </div>
      )}

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
      {activeSubpage === 'planning' && (
        <div className="dashboard-card">
          <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Project Planning Timeline (Gantt Graph)</h3>
          <GanttChart />
        </div>
      )}

      {/* 6. PROGRESS MONITORING (Visit Planner) SUBPAGE */}
      {activeSubpage === 'monitoring' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            {/* Column 1: Weekly Logbook Submission Trends */}
            <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>📅 Weekly Logbook Submission Trends</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                  <p style={{ fontWeight: 600, color: 'var(--color-text-main)', fontSize: '13px', marginBottom: '8px' }}>Submission Trend & Vetting Analysis</p>
                  <p style={{ margin: '0 0 8px 0' }}>• **Week 5 Submission Rate**: Currently at <strong>72%</strong>. Awaiting 5 student uploads.</p>
                  <p style={{ margin: '0 0 8px 0' }}>• **Site Visit Relevance**: Use the optimized route planner to schedule field site visits for students with missing logs.</p>
                  <p style={{ margin: 0 }}>• **Alerts**: Week 4 compliance drop was addressed. Remaining reviews are being vetted.</p>
                </div>
              </div>
            </div>

            {/* Column 2: Company Site Visit Planner */}
            <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>🚗 Global Site Visit Planner</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Plan routes and select dates to schedule physical supervision visits for matching industry placements.
              </p>
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <span className="form-label">Visit Date:</span>
                <input type="date" className="form-input" value={visitDate} onChange={e => setVisitDate(e.target.value)} />
              </div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => { 
                    setVisitToast(`✓ Best travel route calculated for ${visitDate}. Scroll down to see details.`); 
                    setShowRouteItinerary(true);
                  }}
                >
                  Plan Route
                </button>
                <button className="btn btn-secondary" onClick={() => setShowRoutes(!showRoutes)}>{showRoutes ? 'Hide' : 'Show'} Proximity Zones</button>
              </div>
              {visitToast && <p style={{ color: 'var(--status-offered)', fontSize: '12px', marginBottom: '12px', fontWeight: 600 }}>{visitToast}</p>}
              
              {showRoutes && (
                <div style={{ padding: '12px', backgroundColor: '#f8fafc', fontSize: '12px', borderRadius: '6px', borderLeft: '3px solid var(--color-primary)', marginBottom: '16px' }}>
                  <p style={{ margin: '0 0 6px 0' }}>🗺️ <strong>Zone Alpha:</strong> Datum Tech & TechCorp - Route optimized for postcode 40xxx.</p>
                  <p style={{ margin: 0 }}>🗺️ <strong>Zone Beta:</strong> IJM Corp - Route optimized for postcode 47xxx.</p>
                </div>
              )}

              {showRouteItinerary && (
                <div style={{ padding: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', fontSize: '11.5px' }}>
                  <h4 style={{ color: 'var(--color-primary)', fontSize: '13px', margin: '0 0 12px 0', fontWeight: 700 }}>🗺️ Best Optimized Site Visit Route for {visitDate}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: '12px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '-5px', top: '2px', backgroundColor: 'var(--color-primary)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                      <strong>09:00 AM — University Campus</strong>
                      <p style={{ margin: '2px 0 0 0', color: 'var(--color-text-muted)' }}>Departing from Faculty of Computing.</p>
                    </div>
                    <div style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: '12px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '-5px', top: '2px', backgroundColor: 'var(--color-primary)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                      <strong>09:40 AM — Datum Technology (Kuala Lumpur)</strong>
                      <p style={{ margin: '2px 0 0 0', color: 'var(--color-text-muted)' }}>Visit student: <strong>John Lim</strong>. Vetting Week 4 logs.</p>
                    </div>
                    <div style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: '12px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '-5px', top: '2px', backgroundColor: 'var(--color-primary)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                      <strong>12:00 PM — Lunch & Midday Break</strong>
                    </div>
                    <div style={{ borderLeft: '2px solid var(--color-primary)', paddingLeft: '12px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '-5px', top: '2px', backgroundColor: 'var(--color-primary)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                      <strong>01:30 PM — IJM Corporation (Petaling Jaya)</strong>
                      <p style={{ margin: '2px 0 0 0', color: 'var(--color-text-muted)' }}>Visit student: <strong>Maya</strong>. Audit midterm report clearance status.</p>
                    </div>
                    <div style={{ paddingLeft: '12px', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '-5px', top: '2px', backgroundColor: 'var(--color-primary)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                      <strong>03:30 PM — Return to Campus</strong>
                    </div>
                  </div>
                  <div style={{ borderTop: '1px solid #bbf7d0', marginTop: '12px', paddingTop: '8px', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    ⚡ <strong>Route optimization metrics:</strong> 38.5 km travel distance | Est. duration 1h 22m. (Zone Alpha ➔ Zone Beta).
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};
export default LecturerPortal;
