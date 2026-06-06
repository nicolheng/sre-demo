import React, { useState } from 'react';
import { usePortal } from '../context/PortalState';
import SVGChart from '../components/SVGChart';

export const EmployerPortal: React.FC = () => {
  const {
    activeSubpage,
    setActiveSubpage,
    students,
    jobs,
    applications,
    interviewSlots,
    updateApplicationStatus,
    addEvaluationNote,
    createInterviewSlot,
    addJob,
    employerVerifications
  } = usePortal();

  // Active Company HR representative (Sarah Tan)
  const companyId = 'c_arvato';
  const companyName = 'Arvato Systems';

  // Smart Filters
  const [filterSkill, setFilterSkill] = useState<string>('All');
  const [filterCgpa, setFilterCgpa] = useState<number>(0); 
  const [selectedAppIds, setSelectedAppIds] = useState<string[]>([]);
  const [viewAppId, setViewAppId] = useState<string | null>(null);

  // Evaluation logger
  const [noteText, setNoteText] = useState('');
  const [noteToast, setNoteToast] = useState(false);
  const [forwardManager, setForwardManager] = useState('');
  const [forwardHistory, setForwardHistory] = useState<Record<string, string[]>>({});

  // Slots planner
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
  const videoLimit = 60;
  const [jobToast, setJobToast] = useState(false);

  // Manual rank priorities
  const [manualRanks, setManualRanks] = useState<Record<string, number>>({});

  // Chat
  const [chatRecipient, setChatRecipient] = useState('John Lim');
  const [messageInput, setMessageInput] = useState('');
  const [mockChats, setMockChats] = useState<Record<string, { sender: string; text: string; time: string }[]>>({
    'John Lim': [
      { sender: 'John Lim', text: 'Hi Sarah, I would like to check my interview schedule.', time: '1 hour ago' },
      { sender: 'You', text: 'Sure, please book a slot in the Interview booking page.', time: '30 mins ago' }
    ],
    'Career Center': [
      { sender: 'Career Center', text: 'Please ensure all job postings contain standard pay structures.', time: '1 day ago' }
    ]
  });

  const companyJobs = jobs.filter(j => j.companyId === companyId);
  const companyAppList = applications.filter(a => companyJobs.some(j => j.id === a.jobId) && a.status !== 'Withdrawn');

  // Candidate scoring
  const getScoredApplicants = () => {
    return companyAppList.map(app => {
      const student = students.find(s => s.id === app.studentId);
      const job = jobs.find(j => j.id === app.jobId);
      if (!student || !job) return { app, student, score: 0, reason: '' };

      const matchedSkills = student.skills.filter(s => job.requiredSkills.includes(s));
      const skillScore = (matchedSkills.length / Math.max(job.requiredSkills.length, 1)) * 50;
      const cgpaScore = (student.cgpa / 4.0) * 30;
      const projectScore = student.projects.length * 5; 
      
      const totalScore = Math.round(skillScore + cgpaScore + projectScore);
      
      let reason = `Skills match: ${matchedSkills.length}/${job.requiredSkills.length} required.`;
      if (student.cgpa >= 3.5) reason += ' Outstanding CGPA (>= 3.5).';
      if (student.projects.length >= 2) reason += ' Rich project experience.';

      return { app, student, score: totalScore, reason };
    });
  };

  const scoredApplicants = getScoredApplicants();

  const filteredApplicants = scoredApplicants.filter(item => {
    if (!item.student) return false;
    const skillMatch = filterSkill === 'All' || item.student.skills.includes(filterSkill);
    const cgpaMatch = filterCgpa === 0 || item.student.cgpa >= filterCgpa;
    return skillMatch && cgpaMatch;
  });

  const sortedApplicants = [...filteredApplicants].sort((a, b) => {
    const rankA = manualRanks[a.app.id] !== undefined ? manualRanks[a.app.id] : 1000 - a.score;
    const rankB = manualRanks[b.app.id] !== undefined ? manualRanks[b.app.id] : 1000 - b.score;
    return rankA - rankB;
  });

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

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle || !jobScope || !jobSkills) return;
    
    if (!employerVerifications[companyId]) {
      alert("⚠️ Verification Blocked: Your company profile is currently Unverified. Job postings are restricted. Please contact Career Center.");
      return;
    }

    const skillsArray = jobSkills.split(',').map(s => s.trim());
    addJob({
      title: jobTitle,
      companyName,
      companyId,
      duration: jobDuration,
      scope: jobScope,
      requiredSkills: skillsArray,
      specializationTags: jobTags,
      deadline,
      screeningQuestions: screeningQ1 || screeningQ2 ? [screeningQ1, screeningQ2].filter(Boolean) : [],
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
      {/* Credibility Status Bar */}
      <div className="dashboard-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', backgroundColor: employerVerifications[companyId] ? 'hsl(142, 76%, 95%)' : 'hsl(0, 84%, 95%)', border: '1px solid ' + (employerVerifications[companyId] ? 'var(--status-offered)' : 'var(--status-rejected)'), borderRadius: '8px', marginBottom: '24px' }}>
        <span style={{ fontSize: '14px', fontWeight: 600 }}>
          {employerVerifications[companyId] ? '✓ Company Credibility Status: Verified (Arvato Systems)' : '⚠️ Company Credibility Status: Unverified / Pending Audit (Arvato Systems)'}
        </span>
        <span className={`badge ${employerVerifications[companyId] ? 'badge-offered' : 'badge-rejected'}`}>
          {employerVerifications[companyId] ? 'Active Recruiter' : 'Postings Blocked'}
        </span>
      </div>

      {/* 1. HR DASHBOARD SUBPAGE (Matches Screenshot 3 precisely!) */}
      {activeSubpage === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Top Stats Cards (4 items) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <div className="dashboard-card" style={{ margin: 0, padding: '16px 20px' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Active Jobs</p>
              <h3 style={{ fontSize: '28px', color: 'var(--color-primary)' }}>8</h3>
              <button onClick={() => setActiveSubpage('jobs')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', marginTop: '6px' }}>View all jobs →</button>
            </div>
            <div className="dashboard-card" style={{ margin: 0, padding: '16px 20px' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Total Applicants</p>
              <h3 style={{ fontSize: '28px', color: 'var(--status-offered)' }}>156</h3>
              <span style={{ fontSize: '11px', color: 'var(--status-offered)' }}>+18 this week</span>
            </div>
            <div className="dashboard-card" style={{ margin: 0, padding: '16px 20px' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Interviews Scheduled</p>
              <h3 style={{ fontSize: '28px', color: 'var(--status-interview)' }}>12</h3>
              <button onClick={() => setActiveSubpage('interviews')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', marginTop: '6px' }}>View schedule →</button>
            </div>
            <div className="dashboard-card" style={{ margin: 0, padding: '16px 20px' }}>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Offers Sent</p>
              <h3 style={{ fontSize: '28px', color: 'var(--status-kiv)' }}>5</h3>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>View all offers →</span>
            </div>
          </div>

          {/* Candidate Pipeline Kanban + Filter Candidates */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
            {/* Candidate Pipeline Kanban */}
            <div className="dashboard-card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Candidate Pipeline</h4>
                <button onClick={() => setActiveSubpage('candidates')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>View full pipeline →</button>
              </div>

              {/* Kanban Column Rows */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                  <h5 style={{ fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>Applied (56)</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ backgroundColor: '#fff', padding: '6px', borderRadius: '4px', fontSize: '10px', border: '1px solid #e2e8f0' }}>John Lim</div>
                    <div style={{ backgroundColor: '#fff', padding: '6px', borderRadius: '4px', fontSize: '10px', border: '1px solid #e2e8f0' }}>Mei Chen</div>
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                  <h5 style={{ fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>Screening (38)</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ backgroundColor: '#fff', padding: '6px', borderRadius: '4px', fontSize: '10px', border: '1px solid #e2e8f0' }}>Alice Wong</div>
                    <div style={{ backgroundColor: '#fff', padding: '6px', borderRadius: '4px', fontSize: '10px', border: '1px solid #e2e8f0' }}>Jason Yap</div>
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                  <h5 style={{ fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>Interview (12)</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ backgroundColor: '#fff', padding: '6px', borderRadius: '4px', fontSize: '10px', border: '1px solid #e2e8f0' }}>Kevin Lee</div>
                    <div style={{ backgroundColor: '#fff', padding: '6px', borderRadius: '4px', fontSize: '10px', border: '1px solid #e2e8f0' }}>Chloe Lim</div>
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                  <h5 style={{ fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>Offered (5)</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ backgroundColor: '#fff', padding: '6px', borderRadius: '4px', fontSize: '10px', border: '1px solid #e2e8f0' }}>Sarah Ng</div>
                  </div>
                </div>
                <div style={{ backgroundColor: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                  <h5 style={{ fontSize: '11px', fontWeight: 700, marginBottom: '8px' }}>Rejected (23)</h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ backgroundColor: '#fff', padding: '6px', borderRadius: '4px', fontSize: '10px', border: '1px solid #e2e8f0' }}>Adam Tan</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Candidates Card */}
            <div className="dashboard-card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Filter Candidates</h4>
                <button onClick={() => { setFilterSkill('All'); setFilterCgpa(0); }} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>Reset</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-label" style={{ fontSize: '11px' }}>Position</span>
                  <select className="form-input" style={{ padding: '6px' }}><option>All Positions</option></select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-label" style={{ fontSize: '11px' }}>Skills</span>
                  <select className="form-input" style={{ padding: '6px' }} value={filterSkill} onChange={e => setFilterSkill(e.target.value)}>
                    <option value="All">Select skills</option>
                    {allSkills.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-label" style={{ fontSize: '11px' }}>Minimum CGPA</span>
                  <input type="number" step="0.1" max="4.0" min="0" className="form-input" style={{ padding: '6px' }} placeholder="All" value={filterCgpa || ''} onChange={e => setFilterCgpa(Number(e.target.value))} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px', marginTop: '6px' }}>
                  <label><input type="checkbox" /> Has Portfolio</label>
                  <label><input type="checkbox" /> Video Submitted</label>
                  <label><input type="checkbox" /> Available for Interview</label>
                </div>
                <button className="btn btn-primary" style={{ width: '100%', padding: '8px 0', fontSize: '12px', marginTop: '8px' }} onClick={() => setActiveSubpage('candidates')}>Apply Filters</button>
              </div>
            </div>
          </div>

          {/* Recent Applications + AI Recommendations + Upcoming Interviews */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {/* Recent Applications */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h5 style={{ fontSize: '13px', fontWeight: 700 }}>Recent Applications</h5>
                <button onClick={() => setActiveSubpage('candidates')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '10px', fontWeight: 600 }}>View all →</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
                    <th style={{ textAlign: 'left', paddingBottom: '6px' }}>Candidate</th>
                    <th style={{ textAlign: 'left', paddingBottom: '6px' }}>Position</th>
                    <th style={{ textAlign: 'left', paddingBottom: '6px' }}>Applied</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '8px 0', fontWeight: 700 }}>John Lim</td>
                    <td style={{ padding: '8px 0' }}>Software Intern</td>
                    <td style={{ padding: '8px 0', color: 'var(--color-text-muted)' }}>Today</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', fontWeight: 700 }}>Maya</td>
                    <td style={{ padding: '8px 0' }}>UI/UX Intern</td>
                    <td style={{ padding: '8px 0', color: 'var(--color-text-muted)' }}>2 hrs ago</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* AI Recommended Candidates */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h5 style={{ fontSize: '13px', fontWeight: 700 }}>AI Recommended Candidates</h5>
                <button onClick={() => setActiveSubpage('ai-recs')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '10px', fontWeight: 600 }}>View all →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>John Lim (Software Intern)</span>
                  <span style={{ color: 'var(--status-offered)', fontWeight: 700 }}>94%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>Maya (UI/UX Intern)</span>
                  <span style={{ color: 'var(--status-offered)', fontWeight: 700 }}>91%</span>
                </div>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '6px 0', fontSize: '11px' }} onClick={() => setActiveSubpage('comparison')}>Compare Candidates</button>
            </div>

            {/* Upcoming Interviews */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h5 style={{ fontSize: '13px', fontWeight: 700 }}>Upcoming Interviews</h5>
                <button onClick={() => setActiveSubpage('interviews')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '10px', fontWeight: 600 }}>View calendar →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px', marginBottom: '12px' }}>
                <div style={{ borderLeft: '3px solid var(--color-primary)', paddingLeft: '8px' }}>
                  <p style={{ fontWeight: 700 }}>John Lim (Software Intern)</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '10px' }}>15 Jun 2026, 10:00 AM (Google Meet)</p>
                </div>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '6px 0', fontSize: '11px' }} onClick={() => setActiveSubpage('interviews')}>Manage Interviews</button>
            </div>
          </div>

          {/* Active Job Postings + Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '24px' }}>
            {/* Active Job Postings */}
            <div className="dashboard-card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Active Job Postings</h4>
                <button onClick={() => setActiveSubpage('jobs')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>View all jobs →</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-border)', color: 'var(--color-text-muted)', textAlign: 'left' }}>
                    <th style={{ paddingBottom: '8px' }}>Job Title</th>
                    <th style={{ paddingBottom: '8px' }}>Applications</th>
                    <th style={{ paddingBottom: '8px' }}>Status</th>
                    <th style={{ paddingBottom: '8px' }}>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {companyJobs.slice(0, 2).map(job => (
                    <tr key={job.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <td style={{ padding: '10px 0', fontWeight: 700 }}>{job.title}</td>
                      <td style={{ padding: '10px 0' }}>{applications.filter(a => a.jobId === job.id).length}</td>
                      <td style={{ padding: '10px 0' }}><span className="badge badge-offered">Active</span></td>
                      <td style={{ padding: '10px 0', color: 'var(--color-text-muted)' }}>{job.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* HR Quick Actions */}
            <div className="dashboard-card" style={{ margin: 0 }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Quick Actions</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button className="btn btn-secondary" style={{ padding: '10px 0', fontSize: '11px' }} onClick={() => setActiveSubpage('jobs')}>Create Job</button>
                <button className="btn btn-secondary" style={{ padding: '10px 0', fontSize: '11px' }} onClick={() => alert('Job board URL link copied.')}>Share Job Link</button>
                <button className="btn btn-secondary" style={{ padding: '10px 0', fontSize: '11px' }} onClick={() => setActiveSubpage('jobs')}>Add Screening Qs</button>
                <button className="btn btn-secondary" style={{ padding: '10px 0', fontSize: '11px' }} onClick={() => alert('Exporting candidate profiles to CSV...')}>Export Candidates</button>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* 2. CANDIDATES / Smart Filters SUBPAGE */}
      {activeSubpage === 'candidates' && (
        <div>
          {viewAppId === null ? (
            <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '24px', alignItems: 'start' }}>
              {/* Filter Sidebar */}
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
                        alert("Please select at least 2 candidates to compare.");
                        return;
                      }
                      setActiveSubpage('comparison');
                    }}
                  >
                    Compare Selected ({selectedAppIds.length})
                  </button>
                </div>
              </div>

              {/* Candidates list */}
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
                </div>
              </div>
            </div>
          ) : (
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
                      <span className="form-label" style={{ margin: 0 }}>Recruitment Status:</span>
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
                      <div className="dashboard-card" style={{ margin: 0, marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Profile Details</h4>
                        <p><strong>Email:</strong> {student?.email}</p>
                        <p><strong>Phone:</strong> {student?.phone}</p>
                        <p><strong>Achievements:</strong></p>
                        <ul>{student?.achievements.map((ac, i) => <li key={i}>{ac}</li>)}</ul>
                      </div>

                      <div className="dashboard-card" style={{ margin: 0 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>🎥 Video Screening response</h4>
                        {app.videoResponseUrl ? (
                          <div style={{ border: '1px solid var(--color-border)', borderRadius: '6px', overflow: 'hidden', backgroundColor: 'black', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ color: 'white', textAlign: 'center' }}>
                              <p style={{ fontSize: '24px' }}>▶️</p>
                              <p style={{ fontSize: '12px', marginTop: '6px', color: '#cbd5e1' }}>Simulated Pitch Response Playback</p>
                              <span style={{ fontSize: '10px', color: '#94a3b8' }}>Length: 48s / Limit: {job?.videoDurationLimit}s</span>
                            </div>
                          </div>
                        ) : (
                          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>No video response submitted.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <div className="dashboard-card" style={{ margin: 0, marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>Screening Answers</h4>
                        {job?.screeningQuestions.map((q, idx) => (
                          <div key={idx} style={{ marginBottom: '12px' }}>
                            <p style={{ fontWeight: 600 }}>Q: {q}</p>
                            <p style={{ color: 'var(--color-text-muted)', paddingLeft: '8px', borderLeft: '3px solid var(--color-primary)' }}>
                              A: {app.screeningAnswers[idx] || 'No response.'}
                            </p>
                          </div>
                        ))}
                      </div>

                      <div className="dashboard-card" style={{ margin: 0 }}>
                        <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>📝 HR Evaluation Notes</h4>
                        <textarea 
                          className="form-input" 
                          rows={3} 
                          placeholder="Enter technical assessment results..."
                          value={noteText}
                          onChange={e => setNoteText(e.target.value)}
                        />
                        <button 
                          className="btn btn-secondary" 
                          style={{ width: '100%', marginTop: '12px' }}
                          onClick={() => {
                            if (!noteText) return;
                            addEvaluationNote(app.id, 'Company HR', noteText);
                            setNoteText('');
                            setNoteToast(true);
                            setTimeout(() => setNoteToast(false), 2000);
                          }}
                        >
                          Save Notes
                        </button>
                        {noteToast && <p style={{ color: 'var(--status-offered)', fontSize: '11px', marginTop: '6px' }}>✓ Saved notes.</p>}
                        
                        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <span style={{ fontSize: '13px', fontWeight: 600 }}>Forward to Hiring Manager:</span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <input type="text" className="form-input" style={{ flex: 1, padding: '6px' }} placeholder="Manager's Name" value={forwardManager} onChange={e => setForwardManager(e.target.value)} />
                            <button className="btn btn-primary" onClick={() => handleForward(app.id)}>Forward</button>
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

      {/* 3. JOB POSTINGS SUBPAGE */}
      {activeSubpage === 'jobs' && (
        <div className="form-grid">
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Configure New Job Posting</h3>
            
            <form onSubmit={handlePostJob}>
              <div className="form-group">
                <span className="form-label">Job Title:</span>
                <input type="text" className="form-input" placeholder="e.g. Mobile Developer Intern" value={jobTitle} onChange={e => setJobTitle(e.target.value)} required />
              </div>

              <div className="form-group">
                <span className="form-label">Duration:</span>
                <select className="form-input" value={jobDuration} onChange={e => setJobDuration(e.target.value)}>
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                </select>
              </div>

              <div className="form-group">
                <span className="form-label">Job Scope:</span>
                <textarea className="form-input" rows={3} placeholder="Describe duties..." value={jobScope} onChange={e => setJobScope(e.target.value)} required />
              </div>

              <div className="form-group">
                <span className="form-label">Required Skills (Comma separated):</span>
                <input type="text" className="form-input" placeholder="React, TypeScript" value={jobSkills} onChange={e => setJobSkills(e.target.value)} required />
              </div>

              <div className="form-group">
                <span className="form-label">Specialization Tags:</span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" className="form-input" style={{ flex: 1 }} placeholder="e.g. Software Engineering" value={tagInput} onChange={e => setTagInput(e.target.value)} />
                  <button type="button" className="btn btn-secondary" onClick={() => { if (tagInput) { setJobTags([...jobTags, tagInput]); setTagInput(''); } }}>Add</button>
                </div>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {jobTags.map(t => <span key={t} className="badge badge-shortlisted">{t}</span>)}
                </div>
              </div>

              <div className="form-group">
                <span className="form-label">Application Deadline:</span>
                <input type="date" className="form-input" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                Submit Job Posting
              </button>
            </form>
            {jobToast && <p style={{ color: 'var(--status-offered)', fontSize: '12px', marginTop: '10px' }}>✓ Job posted. Awaiting verification.</p>}
          </div>

          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Active Job Postings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {companyJobs.map(job => (
                <div key={job.id} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700 }}>{job.title}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Created: {job.createdAt} | Deadline: {job.deadline}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. SHORTLISTED / overrides SUBPAGE */}
      {activeSubpage === 'shortlisted' && (
        <div className="dashboard-card">
          <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Shortlist Candidate Prioritization</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
            Manually override automated AI matching score priorities.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {companyAppList.map(app => {
              const student = students.find(s => s.id === app.studentId);
              return (
                <div key={app.id} style={{ border: '1px solid var(--color-border)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span><strong>{student?.name}</strong> (Matric: {student?.matricNumber})</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px' }}>Override Priority Rank:</span>
                    <input 
                      type="number" 
                      value={manualRanks[app.id] || ''} 
                      placeholder="e.g. 1" 
                      style={{ width: '60px', padding: '4px' }} 
                      onChange={e => setManualRanks({ ...manualRanks, [app.id]: Number(e.target.value) })}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. INTERVIEWS PLANNER SUBPAGE */}
      {activeSubpage === 'interviews' && (
        <div className="form-grid">
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Schedule Interview Slots</h3>
            
            <div className="form-group">
              <span className="form-label">Interview Date:</span>
              <input type="date" className="form-input" value={slotDate} onChange={e => setSlotDate(e.target.value)} />
            </div>

            <div className="form-group">
              <span className="form-label">Time:</span>
              <input type="text" className="form-input" placeholder="e.g. 10:00 AM" value={slotTime} onChange={e => setSlotTime(e.target.value)} />
            </div>

            <button 
              className="btn btn-primary" 
              style={{ width: '100%' }}
              onClick={() => {
                createInterviewSlot('j2', companyName, slotDate, slotTime);
                setSlotToast(true);
                setTimeout(() => setSlotToast(false), 3000);
              }}
            >
              Publish Interview Slot
            </button>
            {slotToast && <p style={{ color: 'var(--status-offered)', fontSize: '12px', marginTop: '10px' }}>✓ Slot created successfully.</p>}
          </div>

          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Active Slots</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {interviewSlots.filter(s => s.companyName === companyName).map(slot => (
                <div key={slot.id} style={{ border: '1px solid var(--color-border)', padding: '12px', borderRadius: '6px' }}>
                  <p><strong>Slot ID: {slot.id}</strong></p>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Date: {slot.date} at {slot.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 6. AI RECOMMENDATIONS SUBPAGE */}
      {activeSubpage === 'ai-recs' && (
        <div className="dashboard-card">
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>AI Recommended Match Breakdown</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {scoredApplicants.map(({ app, student, score, reason }) => (
              <div key={app.id} style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: 700 }}>{student?.name} (Score: {score}%)</h4>
                <p style={{ fontSize: '12px', color: 'var(--color-primary)', marginTop: '4px' }}>Analysis Matrix: {reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. MESSAGES SUBPAGE */}
      {activeSubpage === 'messages' && (
        <div className="dashboard-card" style={{ height: '500px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', padding: 0, overflow: 'hidden' }}>
          <div style={{ borderRight: '1px solid var(--color-border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>Contacts</h4>
            {Object.keys(mockChats).map(contact => (
              <button 
                key={contact} 
                className={`btn ${chatRecipient === contact ? 'btn-primary' : 'btn-secondary'}`}
                style={{ justifyContent: 'flex-start', padding: '10px', borderRadius: '8px', fontSize: '12px' }}
                onClick={() => setChatRecipient(contact)}
              >
                💬 {contact}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', fontWeight: 700 }}>{chatRecipient}</div>
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mockChats[chatRecipient]?.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start', backgroundColor: msg.sender === 'You' ? 'var(--color-primary-light)' : '#f1f5f9', padding: '10px 14px', borderRadius: '12px', maxWidth: '70%' }}>
                  <p style={{ fontSize: '13px' }}>{msg.text}</p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '10px' }}>
              <input type="text" className="form-input" placeholder="Type message..." style={{ flex: 1 }} value={messageInput} onChange={e => setMessageInput(e.target.value)} />
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
          </div>
        </div>
      )}

      {/* 8. REPORTS SUBPAGE */}
      {activeSubpage === 'reports' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="form-grid">
            <div className="dashboard-card" style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
              <SVGChart type="bar" title="Recruitment Metrics" data={[{ label: 'Applicants', value: 12 }, { label: 'Shortlisted', value: 8 }, { label: 'Interviewed', value: 6 }]} />
            </div>
            <div className="dashboard-card" style={{ margin: 0, display: 'flex', justifyContent: 'center' }}>
              <SVGChart type="pie" title="Application funnel breakdown" data={[{ label: 'Applied', value: 8 }, { label: 'Interview', value: 3 }, { label: 'Offered', value: 1 }]} />
            </div>
          </div>
        </div>
      )}

      {/* 9. SETTINGS SUBPAGE */}
      {activeSubpage === 'settings' && (
        <div className="dashboard-card" style={{ maxWidth: '500px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>HR Settings</h3>
          <p>Configure notifications and automatic recruiter settings here.</p>
        </div>
      )}

      {/* COMPARISON PAGE */}
      {activeSubpage === 'comparison' && (
        <div className="dashboard-card">
          <button className="btn btn-secondary" style={{ marginBottom: '16px' }} onClick={() => setActiveSubpage('candidates')}>
            ← Back to candidates
          </button>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Side-by-Side Candidate Comparison</h3>
          
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
                    return <td key={appId}>{student?.cgpa}</td>;
                  })}
                </tr>
                <tr>
                  <td className="comparison-label-col">Skills Attributes</td>
                  {selectedAppIds.map(appId => {
                    const app = applications.find(a => a.id === appId);
                    const student = students.find(s => s.id === app?.studentId);
                    return <td key={appId}>{student?.skills.join(', ')}</td>;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
export default EmployerPortal;
