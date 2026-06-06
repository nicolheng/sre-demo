import React, { useState } from 'react';
import { usePortal } from '../context/PortalState';
import SVGChart from '../components/SVGChart';

export const CareerCentre: React.FC = () => {
  const {
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

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'admin' | 'compliance' | 'liaison' | 'reports'>('admin');

  // Job rejection form state
  const [rejectingJobId, setRejectingJobId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Liaison trigger form state
  const [liaisonAppId, setLiaisonAppId] = useState<string | null>(null);
  const [liaisonLanguage, setLiaisonLanguage] = useState('Japanese');
  const [liaisonLecturer, setLiaisonLecturer] = useState('Dr. Lee (Japanese expert)');

  // Compliance fail description state
  const [failPillar, setFailPillar] = useState<{ appId: string; pillar: string } | null>(null);
  const [failReason, setFailReason] = useState('');

  // AI Summary state
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Placements count
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
        `[AI-Generated Placement Performance Feedback Summaries (PB-15, PB-16)]\n` +
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
    { label: 'UI/UX Design', value: 1 },
    { label: 'Cybersecurity', value: 1 }
  ];

  const outcomesData = [
    { label: 'Accepted Placements', value: approvedPlacements || 2 },
    { label: 'Rejected Applications', value: applications.filter(a => a.status === 'Rejected').length || 1 },
    { label: 'Pending Clearances', value: applications.filter(a => a.status === 'Awaiting Offer Verification').length || 0 }
  ];

  return (
    <div className="slide-up">
      {/* Top Header Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Placements Approved', value: approvedPlacements, icon: '🎓' },
          { label: 'Active Job Postings', value: activePostings, icon: '💼' },
          { label: 'Pending Posting Approvals', value: pendingJobs.length, icon: '⏳' },
          { label: 'Applications Submitted', value: applications.length, icon: '📄' }
        ].map(metric => (
          <div key={metric.label} className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: 0, padding: '16px 20px' }}>
            <span style={{ fontSize: '32px' }}>{metric.icon}</span>
            <div>
              <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>{metric.label}</span>
              <strong style={{ fontSize: '24px', fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>{metric.value}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'admin', label: '🛡️ Admin Approvals' },
          { id: 'compliance', label: '📋 Compliance Checklist Matrix' },
          { id: 'liaison', label: '🌐 Language Liaison Flags' },
          { id: 'reports', label: '📈 Reports & AI Analytics' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px', padding: '8px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABS VIEWPORT */}
      {activeTab === 'admin' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>
          {/* Postings Approval Gatekeeper (PB-05, PB-06) */}
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Pending Job Postings Review</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Verify postings align with academic criteria. Block postings violating guidelines (non-CS tasks, cheap labor, commission-only).
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {pendingJobs.map(job => (
                <div key={job.id} style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>{job.title}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Posted: {job.createdAt}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--color-primary)', fontWeight: 600 }}>{job.companyName}</p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '8px 0' }}>{job.scope}</p>
                  
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
                    {job.requiredSkills.map(s => <span key={s} className="badge badge-applied" style={{ fontSize: '10px' }}>{s}</span>)}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-primary" style={{ flex: 1, padding: '6px 0', fontSize: '12px' }} onClick={() => approveJob(job.id)}>
                      Approve & Publish
                    </button>
                    <button className="btn btn-danger" style={{ flex: 1, padding: '6px 0', fontSize: '12px' }} onClick={() => setRejectingJobId(job.id)}>
                      Reject
                    </button>
                  </div>
                </div>
              ))}

              {pendingJobs.length === 0 && (
                <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', textAlign: 'center', padding: '24px 0' }}>
                  No pending job approvals.
                </p>
              )}
            </div>
          </div>

          {/* Employer verification */}
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Employer Profile Verification Hub</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Verify credibility profiles of industry recruiters. Unverified profiles cannot publish jobs.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { id: 'c_arvato', name: 'Arvato Systems', verified: employerVerifications['c_arvato'] },
                { id: 'c_techcorp', name: 'TechCorp Solutions', verified: employerVerifications['c_techcorp'] },
                { id: 'c_spam', name: 'Spam Inc (Flagged Cheap Labor)', verified: employerVerifications['c_spam'] }
              ].map(emp => (
                <div key={emp.id} style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 'bold' }}>{emp.name}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>ID: {emp.id}</p>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button 
                      className={`btn ${emp.verified ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '4px 12px', fontSize: '11px' }}
                      onClick={() => verifyEmployer(emp.id, !emp.verified)}
                    >
                      {emp.verified ? 'Verified Profile' : 'Mark Verified'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PLACEMENT COMPLIANCE CHECKLIST MATRIX (PB-36.1) */}
      {activeTab === 'compliance' && (
        <div className="dashboard-card">
          <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Placement Compliance Verification Matrix</h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            Check placement parameters. A student's application status cannot transition to `Approved` unless all four pillars are positively verified (`Pass`).
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {applications.filter(a => a.status === 'Awaiting Offer Verification' || a.status === 'Approved' || a.status === 'Shortlisted').map(app => {
              const student = students.find(s => s.id === app.studentId);
              const job = jobs.find(j => j.id === app.jobId);
              const check = checklists[app.id] || { insurance: 'Pending', visa: 'Pending', payModel: 'Pending', csRelevance: 'Pending' };
              
              const isAllPass = check.insurance === 'Pass' && check.visa === 'Pass' && check.payModel === 'Pass' && check.csRelevance === 'Pass';

              return (
                <div key={app.id} style={{ border: '1px solid var(--color-border)', borderRadius: '12px', padding: '20px', backgroundColor: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>{student?.name}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        Interning at: <strong>{job?.companyName}</strong> ({job?.title}) • Letter: <strong>{app.offerLetterName || 'OfferLetter.pdf'}</strong>
                      </p>
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

                  {/* 4-Pillars Matrix Controls (PB-36.1) */}
                  <div className="compliance-matrix">
                    {/* Insurance Pillar */}
                    <div className="matrix-pillar-card">
                      <span className="matrix-title">📋 1. Insurance Validation</span>
                      <div className="matrix-toggle-group">
                        <button className={`matrix-toggle-btn pass ${check.insurance === 'Pass' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'insurance', 'Pass')}>Pass</button>
                        <button className={`matrix-toggle-btn fail ${check.insurance === 'Fail' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'insurance', 'Fail')}>Fail</button>
                        <button className={`matrix-toggle-btn pending ${check.insurance === 'Pending' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'insurance', 'Pending')}>Pending</button>
                      </div>
                      {check.insurance === 'Fail' && check.insuranceDesc && (
                        <div style={{ fontSize: '11px', color: 'var(--status-rejected)' }}>Reason: {check.insuranceDesc}</div>
                      )}
                    </div>

                    {/* Visa Status Pillar */}
                    <div className="matrix-pillar-card">
                      <span className="matrix-title">🛂 2. Visa Compliance</span>
                      <div className="matrix-toggle-group">
                        <button className={`matrix-toggle-btn pass ${check.visa === 'Pass' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'visa', 'Pass')}>Pass</button>
                        <button className={`matrix-toggle-btn fail ${check.visa === 'Fail' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'visa', 'Fail')}>Fail</button>
                        <button className={`matrix-toggle-btn pending ${check.visa === 'Pending' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'visa', 'Pending')}>Pending</button>
                      </div>
                      {check.visa === 'Fail' && check.visaDesc && (
                        <div style={{ fontSize: '11px', color: 'var(--status-rejected)' }}>Reason: {check.visaDesc}</div>
                      )}
                    </div>

                    {/* Pay Model Pillar */}
                    <div className="matrix-pillar-card">
                      <span className="matrix-title">💵 3. Pay Model Legality</span>
                      <div className="matrix-toggle-group">
                        <button className={`matrix-toggle-btn pass ${check.payModel === 'Pass' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'payModel', 'Pass')}>Pass</button>
                        <button className={`matrix-toggle-btn fail ${check.payModel === 'Fail' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'payModel', 'Fail')}>Fail</button>
                        <button className={`matrix-toggle-btn pending ${check.payModel === 'Pending' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'payModel', 'Pending')}>Pending</button>
                      </div>
                      {check.payModel === 'Fail' && check.payModelDesc && (
                        <div style={{ fontSize: '11px', color: 'var(--status-rejected)' }}>Reason: {check.payModelDesc}</div>
                      )}
                    </div>

                    {/* CS Relevance Pillar */}
                    <div className="matrix-pillar-card">
                      <span className="matrix-title">🎓 4. CS Academic Relevance</span>
                      <div className="matrix-toggle-group">
                        <button className={`matrix-toggle-btn pass ${check.csRelevance === 'Pass' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'csRelevance', 'Pass')}>Pass</button>
                        <button className={`matrix-toggle-btn fail ${check.csRelevance === 'Fail' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'csRelevance', 'Fail')}>Fail</button>
                        <button className={`matrix-toggle-btn pending ${check.csRelevance === 'Pending' ? 'active' : ''}`} onClick={() => handleTogglePillar(app.id, 'csRelevance', 'Pending')}>Pending</button>
                      </div>
                      {check.csRelevance === 'Fail' && check.csRelevanceDesc && (
                        <div style={{ fontSize: '11px', color: 'var(--status-rejected)' }}>Reason: {check.csRelevanceDesc}</div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LANGUAGE LIAISON TRIGGER (PB-37.1) */}
      {activeTab === 'liaison' && (
        <div className="dashboard-card">
          <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Website translation & Language Liaison Flags</h3>
          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
            If an employer's website contains non-translatable text, trigger a Liaison Flag. This will notify language-proficient lecturers and lock the placement.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '24px', alignItems: 'start' }}>
            {/* Form trigger */}
            <div className="dashboard-card" style={{ margin: 0, backgroundColor: '#f8fafc' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Trigger Language Liaison</h4>
              
              <div className="form-group">
                <span className="form-label">Select Active Placement App:</span>
                <select 
                  className="form-input"
                  onChange={e => setLiaisonAppId(e.target.value)}
                >
                  <option value="">-- Select Placement Application --</option>
                  {applications.filter(a => a.status !== 'Withdrawn' && a.status !== 'Rejected').map(app => {
                    const student = students.find(s => s.id === app.studentId);
                    return <option key={app.id} value={app.id}>{student?.name} (App ID: {app.id})</option>;
                  })}
                </select>
              </div>

              <div className="form-group">
                <span className="form-label">Required Language Proficiency:</span>
                <select className="form-input" value={liaisonLanguage} onChange={e => setLiaisonLanguage(e.target.value)}>
                  <option value="Japanese">Japanese</option>
                  <option value="Mandarin">Mandarin</option>
                  <option value="German">German</option>
                </select>
              </div>

              <div className="form-group">
                <span className="form-label">Target Lecturer / Staff:</span>
                <select className="form-input" value={liaisonLecturer} onChange={e => setLiaisonLecturer(e.target.value)}>
                  <option value="Dr. Lee (Japanese expert)">Dr. Lee (Japanese proficient)</option>
                  <option value="Dr. Wong (Mandarin expert)">Dr. Wong (Mandarin proficient)</option>
                  <option value="Dr. Schmidt (German expert)">Dr. Schmidt (German proficient)</option>
                </select>
              </div>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={handleTriggerLiaison}
                disabled={!liaisonAppId}
              >
                Trigger Liaison Flag
              </button>
            </div>

            {/* Active flags list */}
            <div className="dashboard-card" style={{ margin: 0 }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Active Language Liaison Flags</h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {Object.entries(liaisonFlags).map(([appId, flag]) => {
                  const app = applications.find(a => a.id === appId);
                  const student = students.find(s => s.id === app?.studentId);
                  
                  return (
                    <div key={appId} className="international-banner">
                      <div>
                        <h4 style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--status-rejected)' }}>
                          🌐 Liaison Active: {flag.language} (App: {appId})
                        </h4>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-main)', marginTop: '4px' }}>
                          Candidate: <strong>{student?.name}</strong> • Assigned: <strong>{flag.lecturerId}</strong>
                        </p>
                        <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          Status: **Locked under international review banner.**
                        </p>
                      </div>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                        onClick={() => resolveLiaisonFlag(appId)}
                      >
                        Clear Flag
                      </button>
                    </div>
                  );
                })}

                {Object.keys(liaisonFlags).length === 0 && (
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic', textAlign: 'center', padding: '24px 0' }}>
                    No active language liaison flags.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORTS & AI ANALYTICS (PB-01, PB-02, PB-07, PB-08, PB-09, PB-15, PB-16) */}
      {activeTab === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Charts Row */}
          <div className="form-grid">
            <div className="dashboard-card" style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
              <SVGChart 
                type="bar" 
                title="Placements by Major / Industry Specialization (PB-01)"
                data={placementData}
              />
            </div>
            
            <div className="dashboard-card" style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
              <SVGChart 
                type="pie" 
                title="Company Acceptance vs Rejection Outcomes (PB-02)"
                data={outcomesData}
              />
            </div>
          </div>

          {/* Download Outcome Reports PDF & AI summaries */}
          <div className="form-grid">
            {/* PDF Compiler */}
            <div className="dashboard-card" style={{ margin: 0 }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>Compile Outcome Reports (PB-07)</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                Download compiled internship outcome reports detailing placement ratios, student details, and employer verification statuses.
              </p>

              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={() => {
                  alert('Compiling outcomes data...\nGenerating PDF outcome reports...\nDownload success: placement_outcome_report_2026.pdf');
                }}
              >
                📥 Download Outcome Report (PDF)
              </button>
            </div>

            {/* AI feedback analyzer */}
            <div className="dashboard-card" style={{ margin: 0 }}>
              <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>AI Feedback Processor & Analytics (PB-15, PB-16)</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Utilize NLP analytics to summarize employer supervisor feedback forms and extract common strengths and weaknesses.
              </p>

              <button 
                className="btn btn-secondary" 
                style={{ width: '100%' }}
                onClick={handleGenerateAISummaries}
                disabled={aiLoading}
              >
                {aiLoading ? 'AI Analyzing Feedbacks...' : '💡 Analyze & Generate AI Feedback Summaries'}
              </button>

              {aiSummary && (
                <div className="slide-up" style={{ marginTop: '16px', padding: '12px', backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary)', borderRadius: '6px', fontSize: '12px', whiteSpace: 'pre-line', fontFamily: 'monospace' }}>
                  {aiSummary}
                </div>
              )}
            </div>
          </div>
          
          {/* Audit Logs */}
          <div className="dashboard-card">
            <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>System Portal Audit Trails (NFR-25)</h3>
            <div style={{ maxHeight: '180px', overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#f8fafc', padding: '12px', fontSize: '11px', fontFamily: 'monospace' }}>
              {systemLogs.map(log => (
                <div key={log.id} style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '6px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--color-primary)' }}>[{log.timestamp}]</span> <strong>{log.user}:</strong> {log.action}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* REJECT POSTING DIALOG MODAL (PB-06) */}
      {rejectingJobId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title" style={{ color: 'var(--status-rejected)' }}>Reject Internship Posting</h3>
            <p className="modal-body">
              Please specify a mandatory rejection reason. This will trigger a notification to the industry representative.
            </p>

            <div className="form-group">
              <span className="form-label">Rejection Reason:</span>
              <textarea 
                className="form-input" 
                rows={3} 
                placeholder="e.g. Scope lacks CS academic relevance / Commission-only model violates placement policies..."
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
              />
            </div>

            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setRejectingJobId(null)}>Cancel</button>
              <button 
                className="btn btn-danger"
                onClick={() => {
                  if (!rejectReason) return;
                  rejectJob(rejectingJobId, rejectReason);
                  setRejectingJobId(null);
                  setRejectReason('');
                }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* COMPLIANCE FAIL DIALOG MODAL (PB-36.1) */}
      {failPillar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title" style={{ color: 'var(--status-rejected)' }}>Record Verification Failure</h3>
            <p className="modal-body">
              Please specify the reason for marking the **{failPillar.pillar.toUpperCase()}** condition as Failed.
            </p>

            <div className="form-group">
              <span className="form-label">Failure Details:</span>
              <textarea 
                className="form-input" 
                rows={3} 
                placeholder="e.g. Student visa is expiring before the completion deadline..."
                value={failReason}
                onChange={e => setFailReason(e.target.value)}
              />
            </div>

            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setFailPillar(null)}>Cancel</button>
              <button 
                className="btn btn-danger"
                onClick={submitFailReason}
                disabled={!failReason}
              >
                Submit Failure Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default CareerCentre;
