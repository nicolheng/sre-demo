import React, { useState } from 'react';
import { usePortal } from '../context/PortalState';

export const EmployerPortal: React.FC = () => {
  const {
    students,
    jobs,
    applications,
    interviewSlots,
    updateApplicationStatus,
    addEvaluationNote,
    createInterviewSlot,
    addJob,
    submitFeedback,
    employerVerifications
  } = usePortal();

  // For simulation, assume the active HR representative is Puan Aisyah representing Arvato Systems
  const companyId = 'c_arvato';
  const companyName = 'Arvato Systems';

  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'applicants' | 'comparison' | 'interviews' | 'jobs' | 'collaboration'>('applicants');

  // Candidate Hub filter states
  const [filterSkill, setFilterSkill] = useState<string>('All');
  const [filterCgpa, setFilterCgpa] = useState<number>(0); // 0 means no filter
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [viewAppId, setViewAppId] = useState<string | null>(null);

  // Note logs state
  const [noteText, setNoteText] = useState('');
  const [noteToast, setNoteToast] = useState(false);
  const [forwardManager, setForwardManager] = useState('');
  const [forwardHistory, setForwardHistory] = useState<Record<string, string[]>>({});

  // Interview config states
  const [slotDate, setSlotDate] = useState('2026-06-15');
  const [slotTime, setSlotTime] = useState('10:00 AM');
  const [slotToast, setSlotToast] = useState(false);

  // Job config states
  const [jobTitle, setJobTitle] = useState('');
  const [jobDuration, setJobDuration] = useState('3 months');
  const [jobScope, setJobScope] = useState('');
  const [jobSkills, setJobSkills] = useState('');
  const [jobTags, setJobTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [deadline, setDeadline] = useState('2026-06-30');
  const [screeningQ1, setScreeningQ1] = useState('');
  const [screeningQ2, setScreeningQ2] = useState('');
  const [videoLimit, setVideoLimit] = useState(60);
  const [jobToast, setJobToast] = useState(false);

  // Collaboration feedback state
  const [evalStudentId, setEvalStudentId] = useState('');
  const [evalScore, setEvalScore] = useState(5);
  const [evalText, setEvalText] = useState('');
  const [evalToast, setEvalToast] = useState(false);

  // Manual override ranking state
  const [manualRanks, setManualRanks] = useState<Record<string, number>>({});

  // Fetch applications for this company's jobs
  const companyJobs = jobs.filter(j => j.companyId === companyId);
  const companyAppList = applications.filter(a => companyJobs.some(j => j.id === a.jobId) && a.status !== 'Withdrawn');

  // Compute scoring and automated rankings (PB-29, PB-30)
  const getScoredApplicants = () => {
    return companyAppList.map(app => {
      const student = students.find(s => s.id === app.studentId);
      const job = jobs.find(j => j.id === app.jobId);
      if (!student || !job) return { app, student, score: 0, reason: '' };

      // Matching criteria logic
      const matchedSkills = student.skills.filter(s => job.requiredSkills.includes(s));
      const skillScore = (matchedSkills.length / job.requiredSkills.length) * 50;
      const cgpaScore = (student.cgpa / 4.0) * 30;
      const projectScore = student.projects.length * 5; // 5 pts per project
      
      const totalScore = Math.round(skillScore + cgpaScore + projectScore);
      
      // Recommendation explanation
      let reason = `Skills match: ${matchedSkills.length}/${job.requiredSkills.length} required.`;
      if (student.cgpa >= 3.5) reason += ' Outstanding CGPA (>= 3.5).';
      if (student.projects.length >= 2) reason += ' Rich project experience.';

      return {
        app,
        student,
        score: totalScore,
        reason
      };
    });
  };

  const scoredApplicants = getScoredApplicants();

  // Apply filters
  const filteredApplicants = scoredApplicants.filter(item => {
    if (!item.student) return false;
    const skillMatch = filterSkill === 'All' || item.student.skills.includes(filterSkill);
    const cgpaMatch = filterCgpa === 0 || item.student.cgpa >= filterCgpa;
    return skillMatch && cgpaMatch;
  });

  // Apply manual override ranking if exists, otherwise sort by score descending
  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    const rankA = manualRanks[a.app.id] !== undefined ? manualRanks[a.app.id] : 1000 - a.score;
    const rankB = manualRanks[b.app.id] !== undefined ? manualRanks[b.app.id] : 1000 - b.score;
    return rankA - rankB;
  });

  // Unique list of skills for filter dropdown
  const allSkills = Array.from(new Set(students.flatMap(s => s.skills)));

  const handleSelectApp = (id: string) => {
    setSelectedAppIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleForward = (appId: string) => {
    if (!forwardManager) return;
    const currentHist = forwardHistory[appId] || [];
    setForwardHistory({
      ...forwardHistory,
      [appId]: [...currentHist, `${forwardManager} (Forwarded on ${new Date().toLocaleDateString()})`]
    });
    addEvaluationNote(appId, 'Company HR', `Forwarded candidate profile to hiring manager: ${forwardManager}`);
    setForwardManager('');
    alert(`Candidate forwarded to ${forwardManager} successfully.`);
  };

  const handleManualRankChange = (appId: string, value: number) => {
    setManualRanks(prev => ({
      ...prev,
      [appId]: value
    }));
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobScope || !jobSkills) return;
    
    // Check employer credibility
    if (!employerVerifications[companyId]) {
      alert("⚠️ Verification Blocked: Your company profile is currently Unverified. Unverified employers are restricted from publishing internship postings. Please coordinate with the Career Centre.");
      return;
    }

    const skillsArray = jobSkills.split(',').map(s => s.trim());
    const screeningArray = [];
    if (screeningQ1) screeningArray.push(screeningQ1);
    if (screeningQ2) screeningArray.push(screeningQ2);

    addJob({
      title: jobTitle,
      companyName,
      companyId,
      duration: jobDuration,
      scope: jobScope,
      requiredSkills: skillsArray,
      specializationTags: jobTags,
      deadline,
      screeningQuestions: screeningArray,
      videoDurationLimit: videoLimit
    });

    setJobTitle('');
    setJobScope('');
    setJobSkills('');
    setJobTags([]);
    setScreeningQ1('');
    setScreeningQ2('');
    setJobToast(true);
    setTimeout(() => setJobToast(false), 3000);
  };

  const addSpecializationTag = () => {
    if (tagInput && !jobTags.includes(tagInput)) {
      setJobTags([...jobTags, tagInput]);
      setTagInput('');
    }
  };

  return (
    <div className="slide-up">
      {/* Credibility Status Bar */}
      <div className="dashboard-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', backgroundColor: employerVerifications[companyId] ? 'hsl(142, 76%, 95%)' : 'hsl(0, 84%, 95%)', border: '1px solid ' + (employerVerifications[companyId] ? 'var(--status-offered)' : 'var(--status-rejected)'), borderRadius: '8px', marginBottom: '24px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600 }}>
          {employerVerifications[companyId] ? '✓ Company Credibility Status: Verified (Arvato Systems)' : '⚠️ Company Credibility Status: Unverified / Pending Audit (Arvato Systems)'}
        </span>
        <span className={`badge ${employerVerifications[companyId] ? 'badge-offered' : 'badge-rejected'}`}>
          {employerVerifications[companyId] ? 'Active Recruiter' : 'Postings Blocked'}
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'applicants', label: '👥 Applicant Hub' },
          { id: 'comparison', label: '📊 Side-by-Side Comparison' },
          { id: 'interviews', label: '📆 Interview Planner' },
          { id: 'jobs', label: '📝 Post Internship' },
          { id: 'collaboration', label: '🤝 Program Collaboration' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setViewAppId(null); }}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px', padding: '8px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABS VIEWPORT */}
      {activeTab === 'applicants' && (
        <div>
          {viewAppId === null ? (
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
              {/* Filter Sidebar (PB-20) */}
              <div className="dashboard-card" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>Smart Filters</h4>
                
                <div className="form-group">
                  <span className="form-label">Filter Skills:</span>
                  <select className="form-input" style={{ width: '100%' }} value={filterSkill} onChange={e => setFilterSkill(e.target.value)}>
                    <option value="All">All Skills</option>
                    {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <span className="form-label">CGPA Floor: {filterCgpa > 0 ? filterCgpa.toFixed(2) : 'No Minimum'}</span>
                  <input 
                    type="range" 
                    min="0" 
                    max="4.0" 
                    step="0.1" 
                    value={filterCgpa} 
                    onChange={e => setFilterCgpa(Number(e.target.value))} 
                    style={{ width: '100%' }}
                  />
                  <button className="btn btn-secondary" style={{ marginTop: '8px', fontSize: '11px', padding: '4px 8px' }} onClick={() => setFilterCgpa(0)}>Reset CGPA</button>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '16px' }}>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', fontSize: '12px' }}
                    onClick={() => {
                      if (selectedAppIds.length < 2) {
                        alert("Please select at least 2 candidates using the checkboxes to compare.");
                        return;
                      }
                      setActiveTab('comparison');
                    }}
                  >
                    Compare Selected ({selectedAppIds.length})
                  </button>
                </div>
              </div>

              {/* Main Applicants list (PB-29, PB-30) */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px' }}>Applicants to {companyName}</h3>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Showing {sortedApplicants.length} applicants</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {sortedApplicants.map(({ app, student, score, reason }) => {
                    const isRecommended = score >= 75;
                    const job = jobs.find(j => j.id === app.jobId);
                    
                    return (
                      <div 
                        key={app.id} 
                        className={`dashboard-card ${isRecommended ? 'recommend-card-gold' : ''}`}
                        style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '20px', alignItems: 'center', margin: 0, padding: '16px 20px' }}
                      >
                        {isRecommended && <span className="recommend-badge" style={{ top: '8px', right: '8px' }}>⭐ Top Match ({score} pts)</span>}
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input 
                            type="checkbox" 
                            checked={selectedAppIds.includes(app.id)}
                            onChange={() => handleSelectApp(app.id)}
                          />
                          <img src={student?.avatar} alt={student?.name} className="user-avatar" style={{ width: '50px', height: '50px' }} />
                        </div>

                        <div>
                          <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>{student?.name}</h4>
                          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                            Applying for: <strong>{job?.title}</strong> • CGPA: <strong>{student?.cgpa}</strong>
                          </p>
                          <p style={{ fontSize: '11px', color: 'var(--color-primary)', marginTop: '4px' }}>
                            <strong>Analysis:</strong> {reason}
                          </p>
                          
                          {/* Manual Rank Input (NFR-30 override) */}
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '8px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Priority Rank Override:</span>
                            <input 
                              type="number" 
                              value={manualRanks[app.id] || ''} 
                              placeholder="e.g. 1" 
                              style={{ width: '50px', fontSize: '11px', padding: '2px 4px', border: '1px solid var(--color-border)', borderRadius: '3px' }}
                              onChange={(e) => handleManualRankChange(app.id, Number(e.target.value))}
                            />
                            {manualRanks[app.id] !== undefined && (
                              <button 
                                className="btn btn-secondary" 
                                style={{ fontSize: '9px', padding: '2px 6px' }}
                                onClick={() => {
                                  const copy = { ...manualRanks };
                                  delete copy[app.id];
                                  setManualRanks(copy);
                                }}
                              >
                                Clear Override
                              </button>
                            )}
                          </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                          <span className={`badge badge-${app.status.toLowerCase().replace(/ /g, '-')}`}>{app.status}</span>
                          <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setViewAppId(app.id)}>
                            Review Dossier
                          </button>
                        </div>
                      </div>
                    );
                  })}

                  {sortedApplicants.length === 0 && (
                    <div className="dashboard-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No applicants found. Try resetting the filters.
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // REVIEW DOSSIER VIEW (PB-18, PB-19, PB-22, PB-23, PB-24, PB-25, PB-31)
            (() => {
              const app = applications.find(a => a.id === viewAppId);
              if (!app) return null;
              const student = students.find(s => s.id === app.studentId);
              const job = jobs.find(j => j.id === app.jobId);
              
              return (
                <div className="dashboard-card slide-up">
                  <button className="btn btn-secondary" style={{ marginBottom: '16px' }} onClick={() => setViewAppId(null)}>
                    ← Back to Applicant List
                  </button>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <img src={student?.avatar} alt={student?.name} className="user-avatar" style={{ width: '60px', height: '60px' }} />
                      <div>
                        <h2 style={{ fontSize: '22px', fontWeight: 'bold' }}>{student?.name}</h2>
                        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                          Matric: <strong>{student?.matricNumber}</strong> • CGPA: <strong>{student?.cgpa}</strong>
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="form-label" style={{ margin: 0 }}>Recruitment Status (PB-22):</span>
                      <select 
                        className="form-input"
                        value={app.status}
                        onChange={e => updateApplicationStatus(app.id, e.target.value as any)}
                      >
                        <option value="Applied">Applied</option>
                        <option value="Screening">Screening</option>
                        <option value="Interview">Interview</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Offered">Offered</option>
                        <option value="Rejected">Rejected</option>
                        <option value="KIV">KIV</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div>
                      {/* Personal Info & Skills */}
                      <div className="dashboard-card" style={{ margin: 0, marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Student Profile Details</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                          <p><strong>Email:</strong> {student?.email}</p>
                          <p><strong>Phone:</strong> {student?.phone}</p>
                          <p><strong>Achievements:</strong></p>
                          <ul style={{ paddingLeft: '20px' }}>
                            {student?.achievements.map((ac, i) => <li key={i}>{ac}</li>)}
                          </ul>
                          <p><strong>Projects:</strong></p>
                          <ul style={{ paddingLeft: '20px' }}>
                            {student?.projects.map((pr, i) => <li key={i}>{pr}</li>)}
                          </ul>
                        </div>
                      </div>

                      {/* Video Screening Pitch (PB-31) */}
                      <div className="dashboard-card" style={{ margin: 0 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>🎥 Video Screening response</h4>
                        {app.videoResponseUrl ? (
                          <div style={{ border: '1px solid var(--color-border)', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'black', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {/* Mock video player */}
                            <div style={{ color: 'white', textAlign: 'center' }}>
                              <p style={{ fontSize: '24px' }}>▶️</p>
                              <p style={{ fontSize: '12px', marginTop: '6px', color: '#cbd5e1' }}>Simulated Pitch Response Playback</p>
                              <span style={{ fontSize: '10px', color: '#94a3b8' }}>Length: 48s / Limit: {job?.videoDurationLimit}s</span>
                            </div>
                          </div>
                        ) : (
                          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>
                            No video response submitted for this applicant.
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      {/* Screening Answers (PB-19) */}
                      <div className="dashboard-card" style={{ margin: 0, marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Screening Questionnaire Answers</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
                          {job?.screeningQuestions.map((q, idx) => (
                            <div key={idx}>
                              <p style={{ fontWeight: 600 }}>Q: {q}</p>
                              <p style={{ color: 'var(--color-text-muted)', marginTop: '4px', paddingLeft: '8px', borderLeft: '3px solid var(--color-primary)' }}>
                                A: {app.screeningAnswers[idx] || 'No response provided.'}
                              </p>
                            </div>
                          ))}
                          {(!job?.screeningQuestions || job.screeningQuestions.length === 0) && (
                            <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>No screening questions configured.</p>
                          )}
                        </div>
                      </div>

                      {/* Evaluation Logger (PB-23) */}
                      <div className="dashboard-card" style={{ margin: 0 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>📝 HR Evaluation Notes</h4>
                        <div className="form-group">
                          <textarea 
                            className="form-input" 
                            rows={3} 
                            placeholder="Enter evaluation remarks, technical assessment results, or notes..."
                            value={noteText}
                            onChange={e => setNoteText(e.target.value)}
                          />
                        </div>
                        <button 
                          className="btn btn-secondary" 
                          style={{ width: '100%', marginBottom: '12px' }}
                          onClick={() => {
                            if (!noteText) return;
                            addEvaluationNote(app.id, 'Company HR', noteText);
                            setNoteText('');
                            setNoteToast(true);
                            setTimeout(() => setNoteToast(false), 3000);
                          }}
                        >
                          Save Notes to Dossier Log
                        </button>

                        {noteToast && (
                          <div style={{ backgroundColor: 'var(--status-offered)', color: 'white', padding: '6px', borderRadius: '4px', fontSize: '11px', textAlign: 'center', marginBottom: '12px' }}>
                            ✓ Evaluation logs recorded securely.
                          </div>
                        )}

                        {/* Actions (PB-24, PB-25) */}
                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>Shortlist status (PB-24):</span>
                            <button 
                              className={`btn ${app.status === 'Shortlisted' ? 'btn-primary' : 'btn-secondary'}`}
                              style={{ padding: '6px 16px', fontSize: '12px' }}
                              onClick={() => {
                                const newStatus = app.status === 'Shortlisted' ? 'Applied' : 'Shortlisted';
                                updateApplicationStatus(app.id, newStatus);
                              }}
                            >
                              {app.status === 'Shortlisted' ? '✓ Shortlisted' : 'Mark as Shortlist'}
                            </button>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', borderTop: '1px solid var(--color-border)', paddingTop: '10px' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>Forward to Hiring Manager (PB-25):</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <input 
                                type="text" 
                                className="form-input" 
                                style={{ flex: 1, padding: '6px 12px', fontSize: '12px' }}
                                placeholder="Manager's Name (e.g. Mr. Tan)" 
                                value={forwardManager}
                                onChange={e => setForwardManager(e.target.value)}
                              />
                              <button 
                                className="btn btn-primary" 
                                style={{ padding: '6px 16px', fontSize: '12px' }}
                                onClick={() => handleForward(app.id)}
                                disabled={app.status !== 'Shortlisted'}
                                title={app.status !== 'Shortlisted' ? "Only shortlisted candidates can be forwarded." : ""}
                              >
                                Forward
                              </button>
                            </div>
                            {forwardHistory[app.id] && (
                              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                                <strong>Forward history:</strong> {forwardHistory[app.id].join(', ')}
                              </div>
                            )}
                          </div>
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

      {/* SIDE-BY-SIDE COMPARISON (FR-08, PB-21) */}
      {activeTab === 'comparison' && (
        <div className="dashboard-card">
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Side-by-Side Candidate Comparison</h3>
          
          {selectedAppIds.length < 2 ? (
            <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
              No candidates selected. Please return to the Applicant Hub and check the selection boxes for at least 2 candidates.
            </p>
          ) : (
            <div className="comparison-table-wrapper">
              <table className="comparison-table">
                <thead>
                  <tr>
                    <th className="comparison-label-col">Candidate Detail</th>
                    {selectedAppIds.map(appId => {
                      const app = applications.find(a => a.id === appId);
                      const student = students.find(s => s.id === app?.studentId);
                      return <th key={appId}>{student?.name}</th>;
                    })}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="comparison-label-col">Matric ID</td>
                    {selectedAppIds.map(appId => {
                      const app = applications.find(a => a.id === appId);
                      const student = students.find(s => s.id === app?.studentId);
                      return <td key={appId}><strong>{student?.matricNumber}</strong></td>;
                    })}
                  </tr>
                  <tr>
                    <td className="comparison-label-col">CGPA Academic</td>
                    {selectedAppIds.map(appId => {
                      const app = applications.find(a => a.id === appId);
                      const student = students.find(s => s.id === app?.studentId);
                      return <td key={appId} style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>{student?.cgpa}</td>;
                    })}
                  </tr>
                  <tr>
                    <td className="comparison-label-col">Skills Attributes</td>
                    {selectedAppIds.map(appId => {
                      const app = applications.find(a => a.id === appId);
                      const student = students.find(s => s.id === app?.studentId);
                      return (
                        <td key={appId}>
                          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                            {student?.skills.map(s => <span key={s} className="badge badge-applied" style={{ fontSize: '10px' }}>{s}</span>)}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="comparison-label-col">Achievements</td>
                    {selectedAppIds.map(appId => {
                      const app = applications.find(a => a.id === appId);
                      const student = students.find(s => s.id === app?.studentId);
                      return (
                        <td key={appId}>
                          <ul style={{ paddingLeft: '16px', fontSize: '12px' }}>
                            {student?.achievements.map((ac, idx) => <li key={idx}>{ac}</li>)}
                          </ul>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="comparison-label-col">Projects Portfolio</td>
                    {selectedAppIds.map(appId => {
                      const app = applications.find(a => a.id === appId);
                      const student = students.find(s => s.id === app?.studentId);
                      return (
                        <td key={appId}>
                          <ul style={{ paddingLeft: '16px', fontSize: '12px' }}>
                            {student?.projects.map((pr, idx) => <li key={idx}>{pr}</li>)}
                          </ul>
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="comparison-label-col">Screening Answers</td>
                    {selectedAppIds.map(appId => {
                      const app = applications.find(a => a.id === appId);
                      return (
                        <td key={appId} style={{ fontSize: '12px', fontStyle: 'italic', color: 'var(--color-text-muted)' }}>
                          {Object.entries(app?.screeningAnswers || {}).map(([key, val]) => (
                            <div key={key} style={{ marginBottom: '6px' }}>
                              <strong>Q{Number(key)+1}:</strong> "{val}"
                            </div>
                          ))}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* INTERVIEWS SLOTS VIEW (FR-13, FR-14, PB-26, PB-28) */}
      {activeTab === 'interviews' && (
        <div className="form-grid">
          {/* Create slots */}
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Schedule Interview Slots</h3>
            
            <div className="form-group">
              <span className="form-label">Interview Date:</span>
              <input type="date" className="form-input" value={slotDate} onChange={e => setSlotDate(e.target.value)} />
            </div>

            <div className="form-group">
              <span className="form-label">Time Selection:</span>
              <input type="text" className="form-input" placeholder="e.g. 10:00 AM" value={slotTime} onChange={e => setSlotTime(e.target.value)} />
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={() => {
                createInterviewSlot('j1', companyName, slotDate, slotTime);
                setSlotToast(true);
                setTimeout(() => setSlotToast(false), 3000);
              }}
            >
              Publish Interview Slot
            </button>

            {slotToast && (
              <div style={{ backgroundColor: 'var(--status-offered)', color: 'white', padding: '10px', borderRadius: '4px', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>
                ✓ Slot created! External calendars synchronized instantly.
              </div>
            )}
            
            {/* Sync Status Log */}
            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '24px', paddingTop: '16px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
              <p>🔄 **External Calendar Sync (FR-14):** Status: <strong>Synced 15 seconds ago</strong></p>
              <p style={{ marginTop: '4px' }}>Accuracy rate: **99.9%** (No dropping packets detected).</p>
            </div>
          </div>

          {/* Slots list */}
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Active Slots & Conflicts</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {interviewSlots.filter(s => s.companyName === companyName).map(slot => {
                const booker = slot.bookedBy ? students.find(st => st.id === slot.bookedBy) : null;
                return (
                  <div 
                    key={slot.id} 
                    style={{ border: slot.conflictDetected ? '1px solid var(--status-rejected)' : '1px solid var(--color-border)', backgroundColor: slot.conflictDetected ? 'hsl(0, 100%, 98%)' : '#fff', padding: '12px', borderRadius: '6px' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '14px', fontWeight: 'bold' }}>Slot ID: {slot.id}</span>
                      {slot.conflictDetected ? (
                        <span className="badge badge-rejected" style={{ fontSize: '10px' }}>⚠️ Calendar Conflict Detected</span>
                      ) : slot.bookedBy ? (
                        <span className="badge badge-offered" style={{ fontSize: '10px' }}>Booked</span>
                      ) : (
                        <span className="badge badge-applied" style={{ fontSize: '10px' }}>Available</span>
                      )}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>Scheduled: {slot.date} at {slot.time}</p>
                    {booker && (
                      <p style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 600, marginTop: '4px' }}>
                        Candidate: {booker.name} ({booker.matricNumber})
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* POST JOB (PB-17, PB-32, PB-35.1) */}
      {activeTab === 'jobs' && (
        <div className="dashboard-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Configure New Job Posting</h3>
          
          <form onSubmit={handlePostJob}>
            <div className="form-group">
              <span className="form-label">Job Title:</span>
              <input type="text" className="form-input" placeholder="e.g. Frontend developer Intern" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required />
            </div>

            <div className="form-group">
              <span className="form-label">Duration:</span>
              <select className="form-input" value={jobDuration} onChange={e => setJobDuration(e.target.value)}>
                <option value="3 months">3 Months</option>
                <option value="6 months">6 Months</option>
              </select>
            </div>

            <div className="form-group">
              <span className="form-label">Job Scope & Responsibilities:</span>
              <textarea className="form-input" rows={3} placeholder="Describe the internship duties..." value={jobScope} onChange={e => setJobScope(e.target.value)} required />
            </div>

            <div className="form-group">
              <span className="form-label">Required Skills (Comma separated):</span>
              <input type="text" className="form-input" placeholder="e.g. React, TypeScript, Git" value={jobSkills} onChange={e => setJobSkills(e.target.value)} required />
            </div>

            {/* Specialization Tags (PB-35.1) */}
            <div className="form-group">
              <span className="form-label">Specialization Tags (Autocomplete):</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  className="form-input" 
                  style={{ flex: 1 }}
                  placeholder="e.g. Software Engineering, AI" 
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                />
                <button type="button" className="btn btn-secondary" onClick={addSpecializationTag}>Add Tag</button>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                {jobTags.map(tag => (
                  <span key={tag} className="badge badge-shortlisted" style={{ fontSize: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {tag}
                    <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--status-shortlisted)', fontWeight: 'bold' }} onClick={() => setJobTags(jobTags.filter(t => t !== tag))}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <div className="form-group">
              <span className="form-label">Application Deadline:</span>
              <input type="date" className="form-input" value={deadline} onChange={e => setDeadline(e.target.value)} />
            </div>

            {/* Screening Questions Configurator (PB-17, PB-32) */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Screening Questions Configuration</h4>
              <div className="form-group">
                <span className="form-label">Open-Ended Question 1:</span>
                <input type="text" className="form-input" placeholder="e.g. Tell us about your web coding experience." value={screeningQ1} onChange={e => setScreeningQ1(e.target.value)} />
              </div>
              <div className="form-group">
                <span className="form-label">Open-Ended Question 2:</span>
                <input type="text" className="form-input" placeholder="e.g. Detail your experience with TypeScript compiler options." value={screeningQ2} onChange={e => setScreeningQ2(e.target.value)} />
              </div>
            </div>

            {/* Video Screening Config (PB-31) */}
            <div className="form-group">
              <span className="form-label">Video response duration limit (seconds):</span>
              <input type="number" className="form-input" min="30" max="300" value={videoLimit} onChange={e => setVideoLimit(Number(e.target.value))} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
              Submit Job for Coordinator Review
            </button>
          </form>

          {jobToast && (
            <div style={{ backgroundColor: 'var(--status-offered)', color: 'white', padding: '10px', borderRadius: '4px', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>
              ✓ Job draft submitted to Career Centre. Awaiting verification.
            </div>
          )}
        </div>
      )}

      {/* COLLABORATION WORKSPACE & FEEDBACK SUBMISSION (PB-14) */}
      {activeTab === 'collaboration' && (
        <div className="form-grid">
          {/* Submit performance feedback */}
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Submit Student Performance Feedback</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Record supervisor feedback logs for completed internship placements (PB-14).
            </p>

            <div className="form-group">
              <span className="form-label">Select Student Candidate:</span>
              <select className="form-input" value={evalStudentId} onChange={e => setEvalStudentId(e.target.value)}>
                <option value="">-- Select Student placement --</option>
                <option value="s1">Julian (Matric: WIA210045)</option>
                <option value="s2">Maya (Matric: WIA220098)</option>
              </select>
            </div>

            {evalStudentId && (
              <div className="slide-up">
                <div className="form-group">
                  <span className="form-label">Performance Rating Score (1-5):</span>
                  <select className="form-input" value={evalScore} onChange={e => setEvalScore(Number(e.target.value))}>
                    <option value="5">5 - Excellent (Outstanding)</option>
                    <option value="4">4 - Good</option>
                    <option value="3">3 - Satisfactory</option>
                    <option value="2">2 - Needs Improvement</option>
                    <option value="1">1 - Unsatisfactory</option>
                  </select>
                </div>

                <div className="form-group">
                  <span className="form-label">Detailed Comments & Achievements:</span>
                  <textarea 
                    className="form-input" 
                    rows={4} 
                    placeholder="Provide detailed feedback on technical proficiency, punctuality, and outcomes..."
                    value={evalText}
                    onChange={e => setEvalText(e.target.value)}
                  />
                </div>

                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => {
                    if (!evalText) return;
                    submitFeedback(evalStudentId, companyId, evalScore, evalText);
                    setEvalText('');
                    setEvalStudentId('');
                    setEvalToast(true);
                    setTimeout(() => setEvalToast(false), 3000);
                  }}
                >
                  Submit Feedback Form
                </button>
              </div>
            )}

            {evalToast && (
              <div style={{ backgroundColor: 'var(--status-offered)', color: 'white', padding: '10px', borderRadius: '4px', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>
                ✓ Performance feedback stored securely. AI Summaries will recalculate.
              </div>
            )}
          </div>

          {/* Collaborative requirements */}
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Shared Program Blueprints</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Collaborate on requirements and syllabus adjustments (PB-13).
            </p>
            
            <div style={{ padding: '16px', border: '1px solid var(--color-border)', borderRadius: '8px', backgroundColor: '#f8fafc', fontSize: '13px' }}>
              <p style={{ fontWeight: 600, color: 'var(--color-primary)' }}>WIA3001 Software Engineering Placement Blueprint</p>
              <p style={{ marginTop: '8px' }}>Scope: 12 weeks of technical exposure in Agile coding, database schemas, and unit testing environments.</p>
              
              <div style={{ marginTop: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '12px' }}>
                <strong>Revision History:</strong>
                <ul style={{ paddingLeft: '20px', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '6px' }}>
                  <li>Puan Aisyah: Added React/Typescript scope (June 02)</li>
                  <li>Dr. Aris: Setup blueprint mapping (June 01)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EmployerPortal;
