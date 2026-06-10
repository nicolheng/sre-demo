import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
    liaisonFlags,
    approveJob,
    rejectJob,
    updateChecklistPillar,
    triggerLiaisonFlag,
    resolveLiaisonFlag,
    verifyEmployer,
    verifyPlacement,
    programRequirements,
    setProgramRequirements,
    setCollaborationLogs,
    employerFeedbacks,
    employerProfiles,
    facultyStatements,
    blueprintCommits,
    addBlueprintCommit
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

  // Requirement Collaboration Workspace states
  const [feedbackStudentId, setFeedbackStudentId] = useState('s1');
  const [syncToast, setSyncToast] = useState(false);

  // Employer Details dossier state
  const [viewEmployerId, setViewEmployerId] = useState<string | null>(null);
  const [rejectingEmployerId, setRejectingEmployerId] = useState<string | null>(null);
  const [employerRejectReason, setEmployerRejectReason] = useState('');

  // Reports page state
  const [reportGenerating, setReportGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [showExportToast, setShowExportToast] = useState(false);

  // Settings States
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [autoRemind, setAutoRemind] = useState(true); // Weekly Admin Summary
  const [calendarSync, setCalendarSync] = useState(true);
  const [settingsToast, setSettingsToast] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Placements clearance metric calculations
  const approvedPlacements = applications.filter(a => a.status === 'Approved').length;
  const activePostings = jobs.filter(j => j.isApproved).length;
  const pendingJobs = jobs.filter(j => !j.isApproved && !j.rejectionReason && !j.isDraft);

  // Metrics calculations for Career Centre Dashboard
  const totalStudents = students.length;
  const verifiedEmployers = employerProfiles.filter(e => e.verified).length;
  const totalEmployerProfiles = employerProfiles.length;
  const matchedStudents = students.filter(s => applications.some(a => a.studentId === s.id && a.status === 'Approved')).length;
  const matchingRate = totalStudents > 0 ? ((matchedStudents / totalStudents) * 100).toFixed(1) : '0.0';

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
      {activeSubpage === 'dashboard' && (() => {
        const getAppStatusCount = (status: typeof applications[0]['status']) => 
          applications.filter(a => a.status === status).length;

        return (
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

            {/* Student & Employer Matrices Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
              
              {/* Student Engagement & Participation Matrix */}
              <div className="dashboard-card" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    📊 Student Engagement & Participation Matrix
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                    Track overall academic metrics, supervised students, and internship application engagement.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-primary-light)' }}>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total Supervised Students</span>
                    <strong style={{ fontSize: '24px', color: 'var(--color-text-main)' }}>{totalStudents}</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Registered in University Portal</span>
                  </div>
                  <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: 'var(--color-primary-light)' }}>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Placement Matching Rate</span>
                    <strong style={{ fontSize: '24px', color: 'var(--status-offered)' }}>{matchingRate}%</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{matchedStudents} of {totalStudents} students placed</span>
                  </div>
                </div>

                {/* Application Statuses Breakdown */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                  <h4 style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginBottom: '10px', fontWeight: 600 }}>Application Status Breakdown</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
                    <div style={{ padding: '8px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px' }}>
                      <strong style={{ display: 'block', fontSize: '14px', color: 'var(--status-offered)' }}>{getAppStatusCount('Approved')}</strong>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Approved</span>
                    </div>
                    <div style={{ padding: '8px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '6px' }}>
                      <strong style={{ display: 'block', fontSize: '14px', color: 'var(--color-primary)' }}>{getAppStatusCount('Interview')}</strong>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Interview</span>
                    </div>
                    <div style={{ padding: '8px', backgroundColor: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '6px' }}>
                      <strong style={{ display: 'block', fontSize: '14px', color: '#8b5cf6' }}>{getAppStatusCount('Shortlisted')}</strong>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Shortlisted</span>
                    </div>
                    <div style={{ padding: '8px', backgroundColor: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '6px' }}>
                      <strong style={{ display: 'block', fontSize: '14px', color: '#f97316' }}>{getAppStatusCount('Screening')}</strong>
                      <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>Screening</span>
                    </div>
                  </div>
                </div>

                {/* Chart container */}
                <div style={{ display: 'flex', justifyContent: 'center', border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', backgroundColor: '#fafbfc' }}>
                  <SVGChart type="bar" title="Placement & Matching Trends" data={outcomesData} />
                </div>
              </div>

              {/* Employer & Industry Analytics */}
              <div className="dashboard-card" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    🏢 Employer & Industry Analytics
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                    Monitor verified corporate partners, registered hosts, and industry sector coverage.
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Verified Corporate Hosts</span>
                    <strong style={{ fontSize: '24px', color: 'var(--color-primary)' }}>{verifiedEmployers}</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Authorized for postings</span>
                  </div>
                  <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Unverified Profiles</span>
                    <strong style={{ fontSize: '24px', color: 'var(--status-rejected)' }}>{totalEmployerProfiles - verifiedEmployers}</strong>
                    <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Awaiting credential audits</span>
                  </div>
                </div>

                {/* Geographical Coverage */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                  <h4 style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>Geographical Coverage</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {Array.from(new Set(employerProfiles.map(e => e.location))).map(loc => {
                      const count = employerProfiles.filter(e => e.location === loc).length;
                      return (
                        <span key={loc} style={{ fontSize: '10.5px', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#f8fafc', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                          📍 {loc} ({count})
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Industry sector representation */}
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                  <h4 style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 600 }}>Active Sector Distributions</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {Array.from(new Set(employerProfiles.map(e => e.industry))).map((industry) => {
                      const count = employerProfiles.filter(e => e.industry === industry).length;
                      const isVerified = employerProfiles.some(e => e.industry === industry && e.verified);
                      return (
                        <span 
                          key={industry} 
                          style={{ 
                            fontSize: '11px', 
                            padding: '4px 10px', 
                            borderRadius: '12px', 
                            backgroundColor: isVerified ? 'var(--color-primary-light)' : '#f1f5f9',
                            border: `1px solid ${isVerified ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            color: 'var(--color-text-main)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isVerified ? 'var(--color-primary)' : 'var(--color-text-muted)' }} />
                          {industry} ({count})
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

            {/* Section: Internship Postings Oversight */}
            <div className="dashboard-card" style={{ margin: 0, padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  💼 Internship Postings Oversight (PB-04)
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Showing all registered listings</span>
              </div>
              
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>Job Title</th>
                      <th style={{ padding: '8px' }}>Employer</th>
                      <th style={{ padding: '8px' }}>Duration</th>
                      <th style={{ padding: '8px' }}>Specializations</th>
                      <th style={{ padding: '8px', textAlign: 'right' }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(job => (
                      <tr key={job.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                        <td style={{ padding: '10px 8px', fontWeight: 600 }}>{job.title}</td>
                        <td style={{ padding: '10px 8px' }}>{job.companyName}</td>
                        <td style={{ padding: '10px 8px', color: 'var(--color-text-muted)' }}>{job.duration}</td>
                        <td style={{ padding: '10px 8px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {job.specializationTags?.map(tag => (
                              <span key={tag} style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#f1f5f9', border: '1px solid var(--color-border)' }}>{tag}</span>
                            )) || <span style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>General</span>}
                          </div>
                        </td>
                        <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                          {job.isApproved ? (
                            <span className="badge badge-offered" style={{ fontSize: '10px', padding: '2px 6px' }}>✓ Approved</span>
                          ) : job.rejectionReason ? (
                            <span className="badge badge-rejected" style={{ fontSize: '10px', padding: '2px 6px' }}>✕ Rejected</span>
                          ) : (
                            <span className="badge badge-applied" style={{ fontSize: '10px', padding: '2px 6px' }}>⏳ Pending Approval</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
        );
      })()}

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

      {/* 3. EMPLOYER PROFILES & VERIFICATION SUBPAGE */}
      {activeSubpage === 'verification' && (() => {
        const pendingRequests = employerProfiles.filter(p => !p.verified);
        const verifiedDirectory = employerProfiles.filter(p => p.verified);
        const selectedEmployer = employerProfiles.find(p => p.id === viewEmployerId);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Top Section: Pending Verification Requests */}
            <div className="dashboard-card" style={{ margin: 0 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>⚠️ Pending Verification Requests</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Review incoming corporate credentials and verify business licenses before allowing job postings to publish.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                {pendingRequests.map(emp => (
                  <div 
                    key={emp.id} 
                    style={{ 
                      border: '1px solid var(--status-rejected)', 
                      borderRadius: '8px', 
                      padding: '16px', 
                      backgroundColor: 'hsl(0, 84%, 99%)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: 0 }}>{emp.name}</h4>
                        <span className="badge badge-rejected" style={{ fontSize: '9px', padding: '1px 4px' }}>Awaiting Audit</span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0' }}>
                        <strong>Industry:</strong> {emp.industry}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0' }}>
                        <strong>Contact:</strong> {emp.contactPerson}
                      </p>
                      {emp.rejectionReason && (
                        <p style={{ fontSize: '11.5px', color: 'var(--status-rejected)', margin: '4px 0 0 0', fontWeight: 600 }}>
                          ⚠️ Rejected: "{emp.rejectionReason}"
                        </p>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ flex: 1, padding: '6px 0', fontSize: '11px', borderRadius: '6px', minWidth: '80px' }}
                        onClick={() => setViewEmployerId(emp.id)}
                      >
                        🔍 Details
                      </button>
                      <button 
                        className="btn btn-primary" 
                        style={{ flex: 1, padding: '6px 0', fontSize: '11px', borderRadius: '6px', backgroundColor: 'var(--color-primary)', minWidth: '70px' }}
                        onClick={() => verifyEmployer(emp.id, true)}
                      >
                        ✓ Verify
                      </button>
                      <button 
                        className="btn btn-danger" 
                        style={{ flex: 1, padding: '6px 0', fontSize: '11px', borderRadius: '6px', backgroundColor: 'var(--status-rejected)', border: 'none', minWidth: '70px' }}
                        onClick={() => setRejectingEmployerId(emp.id)}
                      >
                        ✕ Reject
                      </button>
                    </div>
                  </div>
                ))}
                {pendingRequests.length === 0 && (
                  <div style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center', backgroundColor: '#f8fafc', border: '1px dashed var(--color-border)', borderRadius: '8px' }}>
                    <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0, fontStyle: 'italic' }}>
                      🎉 Zero pending verification requests. All registered hosts are verified!
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Section: Verified Corporate Partners Directory */}
            <div className="dashboard-card" style={{ margin: 0 }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>🏢 Verified Corporate Partners Directory</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Directory of verified employers authorized to publish internship listings and recruit students.
              </p>

              <div style={{ overflowX: 'auto' }}>
                <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'left', fontSize: '12.5px' }}>
                      <th style={{ padding: '10px 8px' }}>Company Name</th>
                      <th style={{ padding: '10px 8px' }}>Industry Sector</th>
                      <th style={{ padding: '10px 8px' }}>Office Location</th>
                      <th style={{ padding: '10px 8px' }}>Primary Contact</th>
                      <th style={{ padding: '10px 8px' }}>Status</th>
                      <th style={{ padding: '10px 8px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {verifiedDirectory.map(emp => (
                      <tr key={emp.id} style={{ borderBottom: '1px solid var(--color-border)', fontSize: '13px' }}>
                        <td style={{ padding: '12px 8px', fontWeight: 700 }}>{emp.name}</td>
                        <td style={{ padding: '12px 8px' }}>{emp.industry}</td>
                        <td style={{ padding: '12px 8px', color: 'var(--color-text-muted)' }}>{emp.location}</td>
                        <td style={{ padding: '12px 8px' }}>
                          <span style={{ display: 'block', fontWeight: 600 }}>{emp.contactPerson}</span>
                          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>{emp.email}</span>
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <span className="badge badge-offered" style={{ fontSize: '10.5px' }}>✓ Verified Partner</span>
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '4px 10px', fontSize: '11.5px', borderRadius: '4px' }}
                              onClick={() => setViewEmployerId(emp.id)}
                            >
                              Details
                            </button>
                            <button 
                              className="btn btn-danger" 
                              style={{ padding: '4px 10px', fontSize: '11.5px', borderRadius: '4px', backgroundColor: 'var(--status-rejected)', border: 'none' }}
                              onClick={() => setRejectingEmployerId(emp.id)}
                            >
                              Revoke
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {verifiedDirectory.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                          No verified corporate partners. Add/Verify hosts to populate list.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Employer Details Dossier Modal */}
            {selectedEmployer && createPortal(
              <div className="modal-overlay" style={{ zIndex: 9999 }}>
                <div 
                  className="modal-content" 
                  style={{ 
                    maxWidth: '650px', 
                    width: '90%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    maxHeight: '85vh', 
                    overflowY: 'auto',
                    padding: '24px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '20px' }}>
                    <div>
                      <h3 className="modal-title" style={{ margin: 0, fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🏢 {selectedEmployer.name} Dossier
                      </h3>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Company ID: {selectedEmployer.id}</span>
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      style={{ padding: '4px 8px', borderRadius: '50%', fontSize: '14px', lineHeight: 1 }}
                      onClick={() => setViewEmployerId(null)}
                    >
                      ✕
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* General Company Badges */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <span className="badge badge-shortlisted">Sector: {selectedEmployer.industry}</span>
                      <span className="badge badge-applied">📍 {selectedEmployer.location}</span>
                      <span className={`badge ${selectedEmployer.verified ? 'badge-offered' : 'badge-rejected'}`}>
                        {selectedEmployer.verified ? '✓ Verified Partner' : '⏳ Pending Verification'}
                      </span>
                    </div>

                    {selectedEmployer.rejectionReason && !selectedEmployer.verified && (
                      <div className="dashboard-card" style={{ margin: 0, padding: '12px', borderLeft: '4px solid var(--status-rejected)', backgroundColor: 'hsl(0, 84%, 99%)' }}>
                        <strong style={{ fontSize: '13px', color: 'var(--status-rejected)' }}>⚠️ Verification Rejection Audit Note:</strong>
                        <p style={{ fontSize: '12.5px', margin: '4px 0 0 0', color: 'var(--color-text-main)' }}>
                          "{selectedEmployer.rejectionReason}"
                        </p>
                      </div>
                    )}

                    {/* Company Description */}
                    <div>
                      <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 6px 0', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                        Company Description
                      </h4>
                      <p style={{ fontSize: '13px', lineHeight: '1.5', margin: 0, color: 'var(--color-text-main)' }}>
                        {selectedEmployer.description}
                      </p>
                    </div>

                    {/* Contact Information */}
                    <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                      <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 10px 0', textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                        Primary Representative Contacts
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
                        <div>
                          <strong>Contact Person:</strong><br />
                          <span style={{ color: 'var(--color-text-muted)' }}>{selectedEmployer.contactPerson}</span>
                        </div>
                        <div>
                          <strong>Official Website:</strong><br />
                          <a href={selectedEmployer.website} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none', fontWeight: 600 }}>
                            {selectedEmployer.website.replace('https://', '').replace('http://', '')} 🔗
                          </a>
                        </div>
                        <div>
                          <strong>Contact Email:</strong><br />
                          <span style={{ color: 'var(--color-text-muted)' }}>{selectedEmployer.email}</span>
                        </div>
                        <div>
                          <strong>Contact Phone:</strong><br />
                          <span style={{ color: 'var(--color-text-muted)' }}>{selectedEmployer.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* SSM License Attachment Card */}
                    {selectedEmployer.documentName && (
                      <div 
                        style={{ 
                          border: '1px dashed var(--color-border)', 
                          borderRadius: '8px', 
                          padding: '16px', 
                          backgroundColor: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '28px' }}>📄</span>
                          <div>
                            <strong style={{ fontSize: '13px', display: 'block' }}>SSM Business Registration Certificate</strong>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{selectedEmployer.documentName}</span>
                          </div>
                        </div>
                        <button 
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '11.5px', borderRadius: '6px' }}
                          onClick={() => alert(`Simulated Download: Certificate file "${selectedEmployer.documentName}" downloaded successfully to your downloads folder.`)}
                        >
                          📥 Download
                        </button>
                      </div>
                    )}

                    {/* Verification Audit Action Panel */}
                    <div 
                      style={{ 
                        borderTop: '1px solid var(--color-border)', 
                        paddingTop: '20px', 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginTop: '8px'
                      }}
                    >
                      <div>
                        <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block' }}>Audited Credibility Status:</span>
                        <strong style={{ fontSize: '14px', color: selectedEmployer.verified ? 'green' : 'var(--status-rejected)' }}>
                          {selectedEmployer.verified ? '✓ APPROVED PARTNER' : '⏳ PENDING AUDIT REVIEW'}
                        </strong>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => setViewEmployerId(null)}
                        >
                          Close Dossier
                        </button>
                        {selectedEmployer.verified ? (
                          <button 
                            className="btn btn-danger" 
                            style={{ backgroundColor: 'var(--status-rejected)', border: 'none' }}
                            onClick={() => {
                              setRejectingEmployerId(selectedEmployer.id);
                            }}
                          >
                            Revoke & Reject Verification
                          </button>
                        ) : (
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                              className="btn btn-danger" 
                              style={{ backgroundColor: 'var(--status-rejected)', border: 'none' }}
                              onClick={() => setRejectingEmployerId(selectedEmployer.id)}
                            >
                              Reject Verification
                            </button>
                            <button 
                              className="btn btn-primary"
                              onClick={() => {
                                verifyEmployer(selectedEmployer.id, true);
                                alert(`✓ Verified ${selectedEmployer.name} successfully! authorized to publish jobs.`);
                              }}
                            >
                              Verify Employer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              </div>,
              document.body
            )}

          </div>
        );
      })()}

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
      {activeSubpage === 'reports' && (() => {
        // Dynamic calculations for placement report dossier
        const placedStudentsList = students.filter(s => 
          applications.some(a => a.studentId === s.id && a.status === 'Approved')
        );
        
        const approvedApplicationsList = applications.filter(a => a.status === 'Approved');
        
        const participatingCompanyIdsList = Array.from(new Set(approvedApplicationsList.map(a => {
          const job = jobs.find(j => j.id === a.jobId);
          return job?.companyId;
        }).filter(Boolean)));
        
        const participatingCompaniesList = employerProfiles.filter(e => participatingCompanyIdsList.includes(e.id));
        const participatingIndustriesList = Array.from(new Set(participatingCompaniesList.map(e => e.industry)));

        const getCompanyPlacedCount = (companyId: string) => {
          return approvedApplicationsList.filter(a => {
            const job = jobs.find(j => j.id === a.jobId);
            return job?.companyId === companyId;
          }).length;
        };

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Loading Spinner overlay */}
            {reportGenerating && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(4px)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 99999,
                color: '#fff',
                gap: '16px'
              }}>
                <svg width="50" height="50" viewBox="0 0 50 50" style={{ animation: 'spin 1.2s linear infinite' }}>
                  <circle cx="25" cy="25" r="20" fill="none" stroke="var(--color-primary)" strokeWidth="4" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                </svg>
                <div style={{ fontSize: '16px', fontWeight: 600 }}>Compiling Student Placement Statistics...</div>
                <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Aggregating university matrices & corporate registries</div>
              </div>
            )}

            {/* Spinner Keyframes */}
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>

            <div className="form-grid">
              <div className="dashboard-card" style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
                <SVGChart type="bar" title="Placements by Major (PB-01)" data={placementData} />
              </div>
              <div className="dashboard-card" style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
                <SVGChart type="pie" title="Company Acceptance Outcomes (PB-02)" data={outcomesData} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', alignItems: 'start' }}>
              
              {/* Statistical Report Generator Panel */}
              <div className="dashboard-card" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-primary)' }}>
                      ⚡ Statistical Report Generator (PB-01)
                    </h3>
                    <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>
                      Generate student placement statistics, host details, and industry maps.
                    </p>
                  </div>
                  {!reportGenerated ? (
                    <button 
                      className="btn btn-primary"
                      onClick={() => {
                        setReportGenerating(true);
                        setTimeout(() => {
                          setReportGenerating(false);
                          setReportGenerated(true);
                        }, 1200);
                      }}
                      disabled={reportGenerating}
                      style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600 }}
                    >
                      ⚡ Generate Report
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-secondary"
                        onClick={() => setReportGenerated(false)}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Clear
                      </button>
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          setShowExportToast(true);
                          setTimeout(() => setShowExportToast(false), 3000);
                        }}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        🖨️ Export PDF
                      </button>
                    </div>
                  )}
                </div>

                {/* Generated Dossier Output */}
                {reportGenerated ? (
                  <div 
                    className="slide-up"
                    style={{ 
                      border: '1px solid var(--color-border)', 
                      borderRadius: '8px', 
                      padding: '16px', 
                      backgroundColor: '#fff',
                      fontSize: '12.5px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px'
                    }}
                  >
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed var(--color-border)', paddingBottom: '8px' }}>
                      <strong style={{ textTransform: 'uppercase', color: 'var(--color-primary)' }}>PLACEMENT AUDIT REPORT</strong>
                      <span className="badge badge-offered" style={{ fontSize: '9px', padding: '2px 6px' }}>Certified</span>
                    </div>

                    {/* Stat boxes */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      <div style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                        <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-text-muted)' }}>Students Placed</span>
                        <strong style={{ fontSize: '18px', color: 'var(--color-primary)' }}>{placedStudentsList.length}</strong>
                      </div>
                      <div style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                        <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-text-muted)' }}>Corporate Hosts</span>
                        <strong style={{ fontSize: '18px', color: 'var(--color-primary)' }}>{participatingCompaniesList.length}</strong>
                      </div>
                      <div style={{ padding: '8px', border: '1px solid var(--color-border)', borderRadius: '6px', backgroundColor: '#f8fafc', textAlign: 'center' }}>
                        <span style={{ display: 'block', fontSize: '10px', color: 'var(--color-text-muted)' }}>Industries</span>
                        <strong style={{ fontSize: '18px', color: 'var(--color-primary)' }}>{participatingIndustriesList.length}</strong>
                      </div>
                    </div>

                    {/* Placed Ledger */}
                    <div>
                      <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--color-text-main)' }}>Placed Students Ledger</strong>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11.5px' }}>
                        <thead>
                          <tr style={{ borderBottom: '1.5px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                            <th style={{ padding: '6px 4px' }}>Student</th>
                            <th style={{ padding: '6px 4px' }}>Matric</th>
                            <th style={{ padding: '6px 4px' }}>Host</th>
                            <th style={{ padding: '6px 4px' }}>Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {placedStudentsList.map(s => {
                            const app = applications.find(a => a.studentId === s.id && a.status === 'Approved');
                            const job = jobs.find(j => j.id === app?.jobId);
                            return (
                              <tr key={s.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '6px 4px', fontWeight: 600 }}>{s.name}</td>
                                <td style={{ padding: '6px 4px', fontFamily: 'monospace' }}>{s.matricNumber}</td>
                                <td style={{ padding: '6px 4px' }}>{job?.companyName || 'N/A'}</td>
                                <td style={{ padding: '6px 4px' }}>{job?.title || 'N/A'}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Host Breakdown */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '16px' }}>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--color-text-main)' }}>Corporate Hosts</strong>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1.5px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                              <th style={{ padding: '4px' }}>Company</th>
                              <th style={{ padding: '4px', textAlign: 'right' }}>Placed</th>
                            </tr>
                          </thead>
                          <tbody>
                            {participatingCompaniesList.map(c => (
                              <tr key={c.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '4px', fontWeight: 600 }}>{c.name}</td>
                                <td style={{ padding: '4px', textAlign: 'right', fontWeight: 700 }}>{getCompanyPlacedCount(c.id)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div>
                        <strong style={{ display: 'block', marginBottom: '6px', color: 'var(--color-text-main)' }}>Industries Covered</strong>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                          <thead>
                            <tr style={{ borderBottom: '1.5px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                              <th style={{ padding: '4px' }}>Industry</th>
                              <th style={{ padding: '4px', textAlign: 'right' }}>Hosts</th>
                            </tr>
                          </thead>
                          <tbody>
                            {participatingIndustriesList.map(ind => (
                              <tr key={ind} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '4px', fontWeight: 600 }}>{ind}</td>
                                <td style={{ padding: '4px', textAlign: 'right', fontWeight: 700 }}>
                                  {participatingCompaniesList.filter(c => c.industry === ind).length}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                  </div>
                ) : (
                  <div 
                    style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      padding: '36px 16px', 
                      backgroundColor: '#f8fafc', 
                      border: '1px dashed var(--color-border)', 
                      borderRadius: '8px', 
                      textAlign: 'center',
                      gap: '8px'
                    }}
                  >
                    <span style={{ fontSize: '32px' }}>📄</span>
                    <strong style={{ fontSize: '13px', color: 'var(--color-text-main)' }}>No Report Generated</strong>
                    <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', maxWidth: '300px' }}>
                      Compile live metrics and placement distributions.
                    </span>
                  </div>
                )}
              </div>

              {/* AI Feedback Processor Card */}
              <div className="dashboard-card" style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: 'var(--color-primary)' }}>
                  🧠 AI Feedback Processor
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
                  Analyze employer feedback on students to extract preparing strategies and preparations updates.
                </p>
                <button 
                  className="btn btn-secondary" 
                  style={{ width: '100%', padding: '10px 0', fontSize: '12.5px', fontWeight: 600 }} 
                  onClick={handleGenerateAISummaries} 
                  disabled={aiLoading}
                >
                  {aiLoading ? 'Analyzing Feedback...' : 'Generate AI Feedbacks Summary'}
                </button>
                {aiSummary && (
                  <div 
                    className="slide-up"
                    style={{ 
                      marginTop: '8px', 
                      padding: '12px', 
                      borderRadius: '6px',
                      border: '1px solid var(--color-primary)',
                      backgroundColor: 'var(--color-primary-light)', 
                      fontSize: '12px', 
                      lineHeight: '1.5',
                      whiteSpace: 'pre-line',
                      color: 'var(--color-text-main)'
                    }}
                  >
                    {aiSummary}
                  </div>
                )}
              </div>

            </div>

            {/* Export Success Toast Notification */}
            {showExportToast && (
              <div 
                style={{
                  position: 'fixed',
                  bottom: '24px',
                  right: '24px',
                  backgroundColor: 'var(--color-text-main)',
                  color: '#fff',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  zIndex: 9999,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  animation: 'slideIn 0.3s ease-out'
                }}
              >
                <span style={{ fontSize: '16px' }}>✓</span>
                <span>PDF Report Compiled & Exported Successfully!</span>
              </div>
            )}
          </div>
        );
      })()}
      {/* REQUIREMENT COLLABORATION WORKSPACE (Screen 2.6 / PB-13 / PB-14 / PB-32.1) */}
      {activeSubpage === 'collaboration' && (() => {
        // Find all approved student placements
        const approvedPlacementsList = applications.filter(a => a.status === 'Approved');

        if (approvedPlacementsList.length === 0) {
          return (
            <div className="dashboard-card slide-up" style={{ textAlign: 'center', padding: '40px 20px', margin: 0 }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '8px' }}>No Active Placements</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                There are currently no verified and approved student internship placements to audit or monitor.
              </p>
            </div>
          );
        }

        const activeStudentId = feedbackStudentId || approvedPlacementsList[0].studentId;
        const activePlacement = approvedPlacementsList.find(p => p.studentId === activeStudentId) || approvedPlacementsList[0];
        const student = students.find(s => s.id === activeStudentId);
        const job = jobs.find(j => j.id === activePlacement.jobId);

        // Filter statements & commits for the active student placement
        const studentStatements = facultyStatements.filter(s => s.studentId === activeStudentId);
        const studentCommits = blueprintCommits.filter(c => c.studentId === activeStudentId);

        // Filter feedback for the active student
        const activeFeedbackList = employerFeedbacks.filter(f => f.studentId === activeStudentId);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="slide-up">
            
            {/* Top Selector Card */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>🤝 Shared Collaboration Audits</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                  Auditing real-time university-industry collaboration, requirements, and performance feedback logs.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Audit Placement Student:</span>
                <select 
                  className="form-input" 
                  style={{ width: '220px', height: '36px', fontSize: '13px', padding: '6px' }}
                  value={activeStudentId}
                  onChange={e => {
                    setFeedbackStudentId(e.target.value);
                  }}
                >
                  {approvedPlacementsList.map(p => {
                    const s = students.find(st => st.id === p.studentId);
                    return (
                      <option key={p.studentId} value={p.studentId}>
                        {s?.name} ({s?.matricNumber})
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Workspace Main Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
              
              {/* Left Column: Requirements editor & Faculty adjustments */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Requirements Editor Card */}
                <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>🏢 Internship Requirements & Alignments (PB-13)</h4>
                    <span className="badge badge-offered" style={{ fontSize: '10px' }}>Career Centre Oversight</span>
                  </div>

                  <div className="form-group">
                    <span className="form-label" style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>You have authority to adjust the active requirements draft:</span>
                    <textarea 
                      className="form-input" 
                      rows={6}
                      style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5', padding: '12px' }}
                      value={programRequirements}
                      onChange={e => setProgramRequirements(e.target.value)}
                    />
                  </div>

                  <button 
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '4px' }}
                    onClick={() => {
                      const nowStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                      setCollaborationLogs(prev => [
                        `[${nowStr}] Career Centre Coordinator Puan Siti updated and synchronized internship program requirements.`,
                        ...prev
                      ]);
                      addBlueprintCommit('Career Centre Staff', `Admin modified program requirements draft.`, activeStudentId);
                      setSyncToast(true);
                      setTimeout(() => setSyncToast(false), 3000);
                    }}
                  >
                    Sync & Commit Requirements
                  </button>

                  {syncToast && (
                    <p style={{ color: 'var(--status-offered)', fontSize: '12px', marginTop: '12px', textAlign: 'center', fontWeight: 600 }}>
                      ✓ Requirements synchronized and logged to collaboration history.
                    </p>
                  )}
                </div>

                {/* Faculty Interview Statements Card */}
                <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>💬 Faculty Interview Statements & Adjustments (PB-32.1)</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                    View and audit the adjustment comments appended by academic supervisor Dr. Lim Wei Ming or corporate supervisors.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {studentStatements.map(stmt => (
                      <div key={stmt.id} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px 16px', backgroundColor: 'var(--color-bg-light, #ffffff)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                          <strong style={{ color: 'var(--color-primary)' }}>{stmt.author}</strong>
                          <span style={{ color: 'var(--color-text-muted)' }}>{stmt.timestamp}</span>
                        </div>
                        <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.4' }}>{stmt.statement}</p>
                      </div>
                    ))}
                    {studentStatements.length === 0 && (
                      <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '12.5px', margin: 0 }}>No statements recorded yet.</p>
                    )}
                  </div>
                </div>

                {/* Placement Feedback Form (PB-14) */}
                <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>✍️ Submitted Placement Reviews (PB-14)</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                    Audit the performance feedback submitted by the corporate employer and academic supervisor.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {activeFeedbackList.map((feed) => {
                      const submitter = feed.companyId === 'career_centre' ? 'Career Centre Staff' : (jobs.find(j => j.companyId === feed.companyId)?.companyName || feed.companyId);
                      return (
                        <div key={feed.id} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <strong style={{ fontSize: '12.5px' }}>{student?.name} <span style={{ fontWeight: 'normal', color: 'var(--color-text-muted)' }}>({submitter})</span></strong>
                            <span style={{ color: 'gold', fontSize: '12px' }}>
                              {'★'.repeat(feed.performanceScore)}{'☆'.repeat(5 - feed.performanceScore)}
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.4', margin: 0 }}>
                            {feed.feedbackText}
                          </p>
                        </div>
                      );
                    })}
                    {activeFeedbackList.length === 0 && (
                      <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '12px', margin: 0 }}>
                        No placement feedback records submitted for {student?.name} yet.
                      </p>
                    )}
                  </div>
                </div>

              </div>

              {/* Right Column: Version Control Timeline & Placement Meta */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                {/* Placement Details Card */}
                <div className="dashboard-card" style={{ margin: 0, padding: '20px' }}>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '12px' }}>📋 Placement Overview</h4>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', marginBottom: '16px' }}>
                    <img src={student?.avatar} alt={student?.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <h5 style={{ fontSize: '14px', fontWeight: 700, margin: 0 }}>{student?.name}</h5>
                      <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: '2px 0 0 0' }}>Matric Card: {student?.matricNumber} | CGPA: {student?.cgpa}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                    <p>🏢 <strong>Company:</strong> {job?.companyName}</p>
                    <p>🎯 <strong>Position:</strong> {job?.title}</p>
                    <p>⏱️ <strong>Duration:</strong> {job?.duration}</p>
                    <p>🎓 <strong>Supervisor:</strong> Dr. Lim Wei Ming (Lecturer)</p>
                  </div>
                </div>

                {/* Version Control Timeline */}
                <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
                  <h4 style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '16px' }}>⚙️ Version Control Timeline</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', borderLeft: '2px solid var(--color-border)', paddingLeft: '16px', marginLeft: '6px' }}>
                    {studentCommits.map(commit => (
                      <div key={commit.id} style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '-21px', top: '4px', backgroundColor: 'var(--color-primary)', width: '8px', height: '8px', borderRadius: '50%' }}></span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '3px' }}>
                          <strong>{commit.author}</strong>
                          <span>{commit.timestamp}</span>
                        </div>
                        <p style={{ fontSize: '12px', margin: 0, lineHeight: '1.4' }}>{commit.action}</p>
                      </div>
                    ))}
                    {studentCommits.length === 0 && (
                      <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '12px', marginLeft: '-16px' }}>No timeline logs yet.</p>
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        );
      })()}

      {/* 7. SETTINGS SUBPAGE */}
      {activeSubpage === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', width: '100%', alignItems: 'start' }}>
          
          {/* Notification and Preferences */}
          <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>⚙️ Portal Preferences & Notifications</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Configure how you receive governance alerts, employer audit updates, and administrative logs.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 4px 0' }}>Email Notifications</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Receive email alerts when employers submit new jobs or international clearance flags are raised.</p>
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
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Show desktop push notifications for urgent governance tasks or portal system overrides.</p>
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
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 4px 0' }}>Weekly Admin Summary</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Email a weekly administrative report tracking placement statistics and compliance logs.</p>
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
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Sync scheduled governance panel meetings and compliance reviews to external calendar.</p>
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
                ✓ Governance preferences saved successfully.
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

      {/* REJECT POSTING MODAL */}
      {rejectingJobId && createPortal(
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content">
            <h3 className="modal-title" style={{ color: 'var(--status-rejected)' }}>Reject Internship Posting</h3>
            <textarea className="form-input" rows={3} placeholder="Provide mandatory rejection reason..." value={rejectReason} onChange={e => setRejectReason(e.target.value)} />
            <div className="modal-buttons" style={{ marginTop: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setRejectingJobId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { if (rejectReason) { rejectJob(rejectingJobId, rejectReason); setRejectingJobId(null); setRejectReason(''); } }}>Confirm Rejection</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {failPillar && createPortal(
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content">
            <h3 className="modal-title" style={{ color: 'var(--status-rejected)' }}>Verification Failure Reason</h3>
            <textarea className="form-input" rows={3} placeholder="Specify failure reason..." value={failReason} onChange={e => setFailReason(e.target.value)} />
            <div className="modal-buttons" style={{ marginTop: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setFailPillar(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={submitFailReason} disabled={!failReason}>Confirm Failure</button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* REJECT EMPLOYER VERIFICATION MODAL */}
      {rejectingEmployerId && createPortal(
        <div className="modal-overlay" style={{ zIndex: 9999 }}>
          <div className="modal-content">
            <h3 className="modal-title" style={{ color: 'var(--status-rejected)' }}>Reject Employer Verification</h3>
            <textarea 
              className="form-input" 
              rows={3} 
              placeholder="Provide mandatory rejection reason..." 
              value={employerRejectReason} 
              onChange={e => setEmployerRejectReason(e.target.value)} 
            />
            <div className="modal-buttons" style={{ marginTop: '12px' }}>
              <button className="btn btn-secondary" onClick={() => { setRejectingEmployerId(null); setEmployerRejectReason(''); }}>Cancel</button>
              <button 
                className="btn btn-danger" 
                disabled={!employerRejectReason.trim()}
                onClick={() => {
                  verifyEmployer(rejectingEmployerId, false, employerRejectReason);
                  setRejectingEmployerId(null);
                  setEmployerRejectReason('');
                  setViewEmployerId(null);
                }}
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
export default CareerCentre;
