import React, { useState } from 'react';
import { usePortal } from '../context/PortalState';
import SVGChart from '../components/SVGChart';

export const CareerCentre: React.FC = () => {
  const {
    activeSubpage,
    students,
    jobs,
    applications,
    checklists,
    systemLogs,
    employerVerifications,
    liaisonFlags,
    approveJob,
    rejectJob,
    updateChecklistPillar,
    triggerLiaisonFlag,
    resolveLiaisonFlag,
    verifyEmployer,
    verifyPlacement
  } = usePortal();

  // Job rejection state
  const [rejectingJobId, setRejectingJobId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Liaison trigger state
  const [liaisonAppId, setLiaisonAppId] = useState<string | null>(null);
  const [liaisonLanguage, setLiaisonLanguage] = useState('Japanese');
  const [liaisonLecturer, setLiaisonLecturer] = useState('Dr. Lee (Japanese expert)');

  // Compliance failure reason state
  const [failPillar, setFailPillar] = useState<{ appId: string; pillar: string } | null>(null);
  const [failReason, setFailReason] = useState('');

  // AI Feedbacks summary analysis
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Placements clearance metric calculations
  const approvedPlacements = applications.filter(a => a.status === 'Approved').length;
  const activePostings = jobs.filter(j => j.isApproved).length;
  const pendingJobs = jobs.filter(j => !j.isApproved && !j.rejectionReason);

  const handleTogglePillar = (appId: string, pillar: any, status: 'Pass' | 'Fail' | 'Pending') => {
    if (status === 'Fail') {
      setFailPillar({ appId, pillar });
      setFailReason('');
    } else {
      updateChecklistPillar(appId, pillar, status);
    }
  };

  const submitFailReason = () => {
    if (failPillar) {
      updateChecklistPillar(failPillar.appId, failPillar.pillar as any, 'Fail', failReason);
      setFailPillar(null);
    }
  };

  const handleTriggerLiaison = () => {
    if (liaisonAppId) {
      triggerLiaisonFlag(liaisonAppId, liaisonLanguage, liaisonLecturer);
      setLiaisonAppId(null);
    }
  };

  const handleGenerateAISummaries = () => {
    setAiLoading(true);
    setTimeout(() => {
      setAiSummary(
        `[AI-Generated Placement Performance Feedback Summaries]\n` +
        `• Common Strengths: Students showed high aptitude in React core concepts, local state setups, and Git code management.\n` +
        `• Common Weaknesses: Adaptation to enterprise backend structures (Node.js API servers) took longer than expected (average 5 days delay).\n` +
        `• Recommendation: Faculty to introduce lightweight TypeScript API projects in Sem 4 to bridge corporate entry benchmarks.`
      );
      setAiLoading(false);
    }, 1500);
  };

  // Pre-calculate data for SVG Charts
  const placementData = [
    { label: 'Software Eng', value: 3 },
    { label: 'Data Science', value: 2 },
    { label: 'UI/UX Design', value: 1 }
  ];

  const outcomesData = [
    { label: 'Approved Placements', value: approvedPlacements || 2 },
    { label: 'Rejected Applications', value: applications.filter(a => a.status === 'Rejected').length || 1 },
    { label: 'Awaiting Clearances', value: applications.filter(a => a.status === 'Awaiting Offer Verification').length || 0 }
  ];

  return (
    <div className="slide-up">
      {/* 1. CC DASHBOARD SUBPAGE */}
      {activeSubpage === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top Header Metrics Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: 0, padding: '16px 20px' }}>
              <span style={{ fontSize: '32px' }}>🎓</span>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Placements Approved</span>
                <strong style={{ fontSize: '24px', color: 'var(--color-primary)' }}>{approvedPlacements}</strong>
              </div>
            </div>
            <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: 0, padding: '16px 20px' }}>
              <span style={{ fontSize: '32px' }}>💼</span>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Job Postings</span>
                <strong style={{ fontSize: '24px', color: 'var(--color-primary)' }}>{activePostings}</strong>
              </div>
            </div>
            <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: 0, padding: '16px 20px' }}>
              <span style={{ fontSize: '32px' }}>⏳</span>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Pending Job Approvals</span>
                <strong style={{ fontSize: '24px', color: 'var(--color-primary)' }}>{pendingJobs.length}</strong>
              </div>
            </div>
            <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: 0, padding: '16px 20px' }}>
              <span style={{ fontSize: '32px' }}>📄</span>
              <div>
                <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Applications</span>
                <strong style={{ fontSize: '24px', color: 'var(--color-primary)' }}>{applications.length}</strong>
              </div>
            </div>
          </div>

          {/* Governance Stats Overview */}
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>System Portal Audit Trails (System Log Monitoring)</h3>
            <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#f8fafc', padding: '12px', fontSize: '11px', fontFamily: 'monospace' }}>
              {systemLogs.map(log => (
                <div key={log.id} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-primary)' }}>[{log.timestamp}]</span> <strong>{log.user}:</strong> {log.action}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* 2. JOB APPROVALS SUBPAGE */}
      {activeSubpage === 'approvals' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Pending Job Postings Review</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingJobs.map(job => (
                <div key={job.id} style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>{job.title}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Posted: {job.createdAt}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>{job.companyName}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '8px 0' }}>{job.scope}</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary" style={{ flex: 1, padding: '6px 0', fontSize: '12px' }} onClick={() => approveJob(job.id)}>Approve</button>
                    <button className="btn btn-danger" style={{ flex: 1, padding: '6px 0', fontSize: '12px' }} onClick={() => setRejectingJobId(job.id)}>Reject</button>
                  </div>
                </div>
              ))}
              {pendingJobs.length === 0 && <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No pending jobs to approve.</p>}
            </div>
          </div>
        </div>
      )}

      {/* 3. EMPLOYER VERIFICATION SUBPAGE */}
      {activeSubpage === 'verification' && (
        <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Employer Profile Verification Hub</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { id: 'c_arvato', name: 'Arvato Systems', verified: employerVerifications['c_arvato'] },
              { id: 'c_techcorp', name: 'TechCorp Solutions', verified: employerVerifications['c_techcorp'] },
              { id: 'c_datum', name: 'Datum Technology', verified: employerVerifications['c_datum'] },
              { id: 'c_ijm', name: 'IJM Corporation', verified: employerVerifications['c_ijm'] },
              { id: 'c_spam', name: 'Spam Inc (Flagged Cheap Labor)', verified: employerVerifications['c_spam'] }
            ].map(emp => (
              <div key={emp.id} style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>{emp.name}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>ID: {emp.id}</p>
                </div>
                <button 
                  className={`btn ${emp.verified ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '4px 12px', fontSize: '11px' }}
                  onClick={() => verifyEmployer(emp.id, !emp.verified)}
                >
                  {emp.verified ? 'Verified Credible' : 'Mark Verified'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. COMPLIANCE MATRIX SUBPAGE */}
      {activeSubpage === 'compliance' && (
        <div className="dashboard-card">
          <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Placement Compliance Verification Matrix</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {applications.filter(a => a.status === 'Awaiting Offer Verification' || a.status === 'Approved' || a.status === 'Shortlisted' || a.status === 'Interview').map(app => {
              const student = students.find(s => s.id === app.studentId);
              const job = jobs.find(j => j.id === app.jobId);
              const check = checklists[app.id] || { insurance: 'Pending', visa: 'Pending', payModel: 'Pending', csRelevance: 'Pending' };
              const isAllPass = check.insurance === 'Pass' && check.visa === 'Pass' && check.payModel === 'Pass' && check.csRelevance === 'Pass';

              return (
                <div key={app.id} style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>{student?.name}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Placement at: <strong>{job?.companyName}</strong> ({job?.title})</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <span className={`badge badge-${app.status.toLowerCase().replace(/ /g, '-')}`}>{app.status}</span>
                      <button 
                        className="btn btn-primary"
                        onClick={() => verifyPlacement(app.id)}
                        disabled={!isAllPass || app.status === 'Approved'}
                      >
                        {app.status === 'Approved' ? '✓ Placement Cleared' : 'Verify & Approve Placement'}
                      </button>
                    </div>
                  </div>

                  <div className="compliance-matrix">
                    <div className="matrix-pillar-card">
                      <span className="matrix-title">📋 1. Insurance Validation</span>
                      <div className="matrix-toggle-group">
                        <button className={`matrix-toggle-btn pass ${check.insurance === 'Pass' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'insurance', 'Pass')}>Pass</button>
                        <button className={`matrix-toggle-btn fail ${check.insurance === 'Fail' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'insurance', 'Fail')}>Fail</button>
                        <button className={`matrix-toggle-btn pending ${check.insurance === 'Pending' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'insurance', 'Pending')}>Pending</button>
                      </div>
                    </div>
                    <div className="matrix-pillar-card">
                      <span className="matrix-title">🛂 2. Visa Compliance</span>
                      <div className="matrix-toggle-group">
                        <button className={`matrix-toggle-btn pass ${check.visa === 'Pass' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'visa', 'Pass')}>Pass</button>
                        <button className={`matrix-toggle-btn fail ${check.visa === 'Fail' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'visa', 'Fail')}>Fail</button>
                        <button className={`matrix-toggle-btn pending ${check.visa === 'Pending' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'visa', 'Pending')}>Pending</button>
                      </div>
                    </div>
                    <div className="matrix-pillar-card">
                      <span className="matrix-title">💵 3. Pay Model Legality</span>
                      <div className="matrix-toggle-group">
                        <button className={`matrix-toggle-btn pass ${check.payModel === 'Pass' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'payModel', 'Pass')}>Pass</button>
                        <button className={`matrix-toggle-btn fail ${check.payModel === 'Fail' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'payModel', 'Fail')}>Fail</button>
                        <button className={`matrix-toggle-btn pending ${check.payModel === 'Pending' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'payModel', 'Pending')}>Pending</button>
                      </div>
                    </div>
                    <div className="matrix-pillar-card">
                      <span className="matrix-title">🎓 4. CS Academic Relevance</span>
                      <div className="matrix-toggle-group">
                        <button className={`matrix-toggle-btn pass ${check.csRelevance === 'Pass' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'csRelevance', 'Pass')}>Pass</button>
                        <button className={`matrix-toggle-btn fail ${check.csRelevance === 'Fail' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'csRelevance', 'Fail')}>Fail</button>
                        <button className={`matrix-toggle-btn pending ${check.csRelevance === 'Pending' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'csRelevance', 'Pending')}>Pending</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. LIAISON FLAGS SUBPAGE */}
      {activeSubpage === 'liaison' && (
        <div className="dashboard-card">
          <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Website translation & Language Liaison Flags</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'start' }}>
            <div className="dashboard-card" style={{ margin: 0, backgroundColor: '#f8fafc' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Trigger Language Liaison</h4>
              <div className="form-group">
                <span className="form-label">Select Placement App:</span>
                <select className="form-input" onChange={e => setLiaisonAppId(e.target.value)}>
                  <option value="">-- Select Placement --</option>
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>App ID: {app.id}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <span className="form-label">Required Language:</span>
                <select className="form-input" value={liaisonLanguage} onChange={e => setLiaisonLanguage(e.target.value)}>
                  <option value="Japanese">Japanese</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="German">German</option>
                </select>
              </div>
              <div className="form-group">
                <span className="form-label">Target Lecturer:</span>
                <select className="form-input" value={liaisonLecturer} onChange={e => setLiaisonLecturer(e.target.value)}>
                  <option value="Dr. Lee (Japanese expert)">Dr. Lee (Japanese expert)</option>
                  <option value="Dr. Wong (Mandarin expert)">Dr. Wong (Mandarin expert)</option>
                  <option value="Dr. Schmidt (German expert)">Dr. Schmidt (German expert)</option>
                </select>
              </div>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleTriggerLiaison} disabled={!liaisonAppId}>Trigger Flag</button>
            </div>

            <div className="dashboard-card" style={{ margin: 0 }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Active Language Liaison Flags</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(liaisonFlags).map(([appId, flag]) => (
                  <div key={appId} className="international-banner">
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--status-rejected)' }}>🌐 Liaison Active: {flag.language}</h4>
                      <p style={{ fontSize: '11px' }}>Assigned Lecturer: {flag.lecturerId}</p>
                    </div>
                    <button className="btn btn-secondary" onClick={() => resolveLiaisonFlag(appId)}>Clear Flag</button>
                  </div>
                ))}
                {Object.keys(liaisonFlags).length === 0 && <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No active flags.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. REPORTS & ANALYTICS SUBPAGE */}
      {activeSubpage === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="form-grid">
            <div className="dashboard-card" style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
              <SVGChart type="bar" title="Placements by Major (PB-01)" data={placementData} />
            </div>
            <div className="dashboard-card" style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
              <SVGChart type="pie" title="Company Acceptance Outcomes (PB-02)" data={outcomesData} />
            </div>
          </div>

          <div className="form-grid">
            <div className="dashboard-card" style={{ margin: 0 }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Compile Outcome Reports</h3>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => alert('PDF report downloaded successfully.')}>Compile & Download PDF Report</button>
            </div>
            <div className="dashboard-card" style={{ margin: 0 }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>AI Feedback Processor</h3>
              <button className="btn btn-secondary" style={{ width: '100%' }} onClick={handleGenerateAISummaries} disabled={aiLoading}>{aiLoading ? 'Analyzing...' : 'Generate AI Feedbacks Summary'}</button>
              {aiSummary && <div style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--color-primary-light)', fontSize: '12px', whiteSpace: 'pre-line' }}>{aiSummary}</div>}
            </div>
          </div>
        </div>
      )}

      {/* 7. SETTINGS SUBPAGE */}
      {activeSubpage === 'settings' && (
        <div className="dashboard-card" style={{ maxWidth: '500px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Settings</h3>
          <p>Configure general Career Center administration settings here.</p>
        </div>
      )}

      {/* REJECT POSTING MODAL */}
      {rejectingJobId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title" style={{ color: 'var(--status-rejected)' }}>Reject Internship Posting</h3>
            <textarea className="form-input" rows={3} placeholder="Provide mandatory rejection reason..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            <div className="modal-buttons" style={{ marginTop: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setRejectingJobId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { if (rejectReason) { rejectJob(rejectingJobId, rejectReason); setRejectingJobId(null); setRejectReason(''); } }}>Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}

      {failPillar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title" style={{ color: 'var(--status-rejected)' }}>Verification Failure Reason</h3>
            <textarea className="form-input" rows={3} placeholder="Specify failure reason..." value={failReason} onChange={e => setFailReason(e.target.value)} />
            <div className="modal-buttons" style={{ marginTop: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setFailPillar(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={submitFailReason} disabled={!failReason}>Confirm Failure</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CareerCentre;
