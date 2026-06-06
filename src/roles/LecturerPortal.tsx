import React, { useState } from 'react';
import { usePortal } from '../context/PortalState';
import GanttChart from '../components/GanttChart';

export const LecturerPortal: React.FC = () => {
  const {
    students,
    applications,
    logbookEntries,
    facultyStatements,
    blueprintCommits,
    addFacultyStatement,
    addBlueprintCommit
  } = usePortal();

  // Active lecturer simulation (Dr. Aris)
  const lecturerName = 'Dr. Aris';

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'supervision' | 'gantt' | 'compliance' | 'workspace'>('supervision');

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

  // Assigned students to this lecturer (e.g. Julian and Maya)
  const assignedStudentIds = ['s1', 's2'];
  const myStudents = students.filter(s => assignedStudentIds.includes(s.id));

  const handleAddStatement = (studentId: string) => {
    if (!statementText) return;
    addFacultyStatement(studentId, lecturerName, statementText);
    setStatementText('');
    setStatementToast(true);
    setTimeout(() => setStatementToast(false), 3000);
  };

  // Check if student has fresh unread logs (e.g. Week 4 has no locks and was submitted recently)
  const hasFreshLogs = (studentId: string) => {
    const logs = logbookEntries.filter(le => le.studentId === studentId);
    return logs.some(le => !le.isLocked); // unlocked logs act as fresh unread submissions
  };

  return (
    <div className="slide-up">
      {/* Lecturer Greeting Header */}
      <div className="dashboard-card" style={{ padding: '16px 24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Academic Supervisor Portal: {lecturerName}</h2>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
          Supervising: <strong>{myStudents.length} Students</strong> • Faculty: <strong>Computer Science & IT</strong>
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'supervision', label: '🧑‍🎓 Student Supervision' },
          { id: 'gantt', label: '📊 Timeline Gantt' },
          { id: 'compliance', label: '📍 Compliance & Visits' },
          { id: 'workspace', label: '💼 Shared Blueprint Space' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setSelectedStudentId(null); }}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px', padding: '8px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABS VIEWPORT */}
      {activeTab === 'supervision' && (
        <div>
          {selectedStudentId === null ? (
            <div>
              <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>My Assigned Students</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myStudents.map(student => {
                  const logs = logbookEntries.filter(le => le.studentId === student.id);
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
                          {isPendingReview && (
                            <span className="badge badge-interview" style={{ fontSize: '9px', padding: '2px 6px' }}>
                              ⚠️ New Log Uploaded
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          Matric: <strong>{student.matricNumber}</strong> • CGPA: <strong>{student.cgpa}</strong> • Placement: <strong>{activeApp ? 'Active' : 'Awaiting Matching'}</strong>
                        </p>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                          Weekly Logs Logged: <strong>{logs.length} Weeks</strong> (Last submission: {logs[logs.length-1]?.date || 'None'})
                        </p>
                      </div>

                      <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setSelectedStudentId(student.id)}>
                        Manage Student Progress
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            // STUDENT PROGRESS MANAGEMENT SCREEN (PB-33.1)
            (() => {
              const student = students.find(s => s.id === selectedStudentId);
              if (!student) return null;
              const logs = logbookEntries.filter(le => le.studentId === student.id);
              
              return (
                <div className="dashboard-card slide-up">
                  <button className="btn btn-secondary" style={{ marginBottom: '16px' }} onClick={() => setSelectedStudentId(null)}>
                    ← Back to Student List
                  </button>

                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '24px' }}>
                    <img src={student.avatar} alt={student.name} className="user-avatar" style={{ width: '60px', height: '60px' }} />
                    <div>
                      <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>{student.name} — Progress Logs Vetting</h2>
                      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Matric WIA210045 • Major: Software Engineering</p>
                    </div>
                  </div>

                  <div className="form-grid">
                    {/* Log list & Document Native Viewer */}
                    <div>
                      <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Weekly Logbook Records</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {logs.map(log => (
                          <div key={log.id} style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px', backgroundColor: '#fff' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Week {log.weekNumber} (Hours: {log.workingHours})</h4>
                              {!log.isLocked && (
                                <span className="badge badge-interview" style={{ fontSize: '9px' }}>New Submission</span>
                              )}
                            </div>
                            <p style={{ fontSize: '13px' }}><strong>Tasks Done:</strong> {log.tasksCompleted}</p>
                            <p style={{ fontSize: '13px', marginTop: '4px' }}><strong>Milestone achieved:</strong> {log.selfEvaluation}</p>
                            
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                              <button 
                                className="btn btn-secondary" 
                                style={{ padding: '4px 8px', fontSize: '10px' }}
                                onClick={() => setViewerDoc({ name: `Week_${log.weekNumber}_Report.pdf`, type: 'pdf' })}
                              >
                                📄 View PDF Report
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Faculty Statements panel */}
                    <div className="dashboard-card" style={{ margin: 0 }}>
                      <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Faculty Interview Statements</h3>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        Record and append notes detailing syllabus compliance adjustments or supervisor meeting minutes.
                      </p>

                      <div className="form-group">
                        <textarea 
                          className="form-input" 
                          rows={3} 
                          placeholder="e.g. Discussed core modules validation on site. Student is performing excellently..."
                          value={statementText}
                          onChange={e => setStatementText(e.target.value)}
                        />
                      </div>
                      
                      <button className="btn btn-primary" style={{ width: '100%', marginBottom: '16px' }} onClick={() => handleAddStatement(student.id)}>
                        Append Faculty Statement
                      </button>

                      {statementToast && (
                        <div style={{ backgroundColor: 'var(--status-offered)', color: 'white', padding: '6px', borderRadius: '4px', fontSize: '11px', textAlign: 'center', marginBottom: '12px' }}>
                          ✓ Faculty statement logged successfully.
                        </div>
                      )}

                      {/* Display existing statements */}
                      <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>Previous Statements Log</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {facultyStatements.filter(fs => fs.studentId === student.id).map(stmt => (
                            <div key={stmt.id} style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: '8px', fontSize: '12px' }}>
                              <p style={{ fontStyle: 'italic' }}>"{stmt.statement}"</p>
                              <p style={{ color: 'var(--color-text-muted)', fontSize: '10px', marginTop: '4px' }}>
                                Logged by: {stmt.author} on {stmt.timestamp}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()
          )}
        </div>
      )}

      {/* GANTT TIMELINE VIEW (PB-34.1) */}
      {activeTab === 'gantt' && (
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px' }}>Project Planning Graph Timeline</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                Comparing actual weekly completions against baseline targets. Slippages are highlighted in Amber or Red.
              </p>
            </div>
            <select className="form-input" style={{ padding: '6px 12px' }}>
              <option value="s1">Julian (Matric: WIA210045) — Software Engineering</option>
            </select>
          </div>
          
          <GanttChart />
        </div>
      )}

      {/* COMPLIANCE GRID & VISIT PLANNER (PB-41.1) */}
      {activeTab === 'compliance' && (
        <div className="form-grid">
          {/* Compliance Grid */}
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Weekly Logbook Compliance Grid</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Shows continuous weekly logbook submission trends across all assigned students.
            </p>

            <table className="data-table" style={{ border: '1px solid var(--color-border)', borderRadius: '6px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-app)' }}>
                  <th>Student</th>
                  <th>Week 1</th>
                  <th>Week 2</th>
                  <th>Week 3</th>
                  <th>Week 4</th>
                </tr>
              </thead>
              <tbody>
                {myStudents.map(student => {
                  const logs = logbookEntries.filter(le => le.studentId === student.id);
                  return (
                    <tr key={student.id}>
                      <td style={{ fontWeight: 600 }}>{student.name}</td>
                      {/* Check logs for each week */}
                      {[1, 2, 3, 4].map(w => {
                        const hasLog = logs.some(le => le.weekNumber === w);
                        return (
                          <td key={w} style={{ textAlign: 'center' }}>
                            <span 
                              style={{ 
                                display: 'inline-block', 
                                width: '14px', 
                                height: '14px', 
                                borderRadius: '50%', 
                                backgroundColor: hasLog ? 'var(--status-offered)' : 'var(--status-rejected)' 
                              }}
                              title={hasLog ? `Week ${w} Logged` : `Week ${w} Missing`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Visit Planner */}
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Company Visit Planner</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Geographically groups companies by proximity / postal zones to optimize travel schedules.
            </p>

            <div className="form-group">
              <span className="form-label">Scheduled Date:</span>
              <input type="date" className="form-input" value={visitDate} onChange={e => setVisitDate(e.target.value)} />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={() => {
                  setVisitToast("✓ Site Visit scheduled! Google Maps route generated.");
                  setTimeout(() => setVisitToast(null), 3000);
                }}
              >
                Plan Site Visit
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowRoutes(!showRoutes)}
              >
                {showRoutes ? 'Hide Proximity Zones' : 'Show Proximity Zones'}
              </button>
            </div>

            {visitToast && (
              <div style={{ backgroundColor: 'var(--status-offered)', color: 'white', padding: '10px', borderRadius: '4px', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>
                {visitToast}
              </div>
            )}

            {/* Proximity zoning routing details (C-12 constraint) */}
            {showRoutes && (
              <div className="slide-up" style={{ marginTop: '16px', padding: '12px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#f8fafc', fontSize: '12px' }}>
                <p style={{ fontWeight: 600, color: 'var(--color-primary)', marginBottom: '8px' }}>🗺️ Geographic Postal Proximity Routing</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <p>• **Zone Alpha (Postcode 40xxx):** Arvato Systems (Julian) & TechCorp Solutions (Liam) - *Recommended route: Dispatched on same day.*</p>
                  <p>• **Zone Beta (Postcode 50xxx):** Spam Inc - *No active CS placements.*</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '10px', borderTop: '1px solid var(--color-border)', paddingTop: '6px', marginTop: '4px' }}>
                    Constraint C-12: Allocation system forces routing to single postcode nodes to minimize travel inefficiencies.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COLLABORATIVE WORKSPACE (PB-32.1) */}
      {activeTab === 'workspace' && (
        <div className="dashboard-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
            <h3 style={{ fontSize: '18px' }}>Shared Collaborative Blueprint Workspace</h3>
            <span className="badge badge-rejected" style={{ fontSize: '11px' }}>🔒 RBAC Active: Faculty Advisor View</span>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            This workspace bridges university and corporate fields by sharing program blueprints, curriculum adjustments, and student progress metrics.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Version control */}
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Integrated Version Control Timeline</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {blueprintCommits.map(commit => (
                  <div key={commit.id} style={{ border: '1px solid var(--color-border)', padding: '12px', borderRadius: '6px', backgroundColor: '#fff' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                      <strong>{commit.author}</strong>
                      <span>{commit.timestamp}</span>
                    </div>
                    <p style={{ fontSize: '12px', fontWeight: 500 }}>{commit.action}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload blueprints */}
            <div className="dashboard-card" style={{ margin: 0, backgroundColor: '#f8fafc' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Modify Shared Program Blueprints</h4>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Upload or edit curriculum mapping documents. Changes will be logged in the version timeline.
              </p>
              
              <div className="form-group">
                <span className="form-label">Blueprint Scope / Action Remarks:</span>
                <input type="text" className="form-input" id="commit-action" placeholder="e.g. Appended Data Science criteria to syllabus" />
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => {
                  const input = document.getElementById('commit-action') as HTMLInputElement;
                  if (input && input.value) {
                    addBlueprintCommit(lecturerName, input.value);
                    input.value = '';
                    alert('Blueprint change committed to shared workspace.');
                  }
                }}
              >
                Commit Syllabus Adjustments
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT NATIVE VIEWER MODAL */}
      {viewerDoc && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h3 className="modal-title" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                📄 Native Document Viewer: {viewerDoc.name}
              </h3>
              
              {/* Simulated PDF document text */}
              <div style={{ backgroundColor: '#f1f5f9', border: '1px solid var(--color-border)', padding: '24px', borderRadius: '6px', height: '50vh', overflowY: 'auto', fontFamily: 'Courier, monospace', fontSize: '12px' }}>
                <p>==================================================</p>
                <p>   SRE MATCHING PORTAL - INTERNSHIP WEEKLY REPORT   </p>
                <p>==================================================</p>
                <p>Student Name: Julian (Matric: WIA210045)</p>
                <p>Company: Arvato Systems</p>
                <p>Supervisor: Puan Aisyah</p>
                <p>Date Generated: 2026-06-06</p>
                <br />
                <p>[WORK LOGS DETAILS]</p>
                <p>• Completed front-end components for role-switching switcher.</p>
                <p>• Configured CSS Variables (light theme variables).</p>
                <p>• Formulated TS schemas for Gantt Milestone bars.</p>
                <br />
                <p>[LEARNING OUTCOMES ASSESSMENT]</p>
                <p>• Learnt React hooks integration details.</p>
                <p>• Structured layouts cleanly using CSS Grid.</p>
                <p>• Solved minor timeline rendering slippages.</p>
                <p>==================================================</p>
              </div>
            </div>

            <div className="modal-buttons" style={{ marginTop: '16px' }}>
              <button className="btn btn-secondary" onClick={() => setViewerDoc(null)}>Close Viewer</button>
              <button className="btn btn-primary" onClick={() => { alert('Downloading document securely...'); }}>Download Document</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default LecturerPortal;
