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
    updateJob,
    employerVerifications,
    employerFeedbacks,
    submitFeedback,
    programRequirements,
    setProgramRequirements,
    setCollaborationLogs,
    employerProfiles,
    loggedInUser,
    facultyStatements,
    blueprintCommits,
    addBlueprintCommit,
    addFacultyStatement
  } = usePortal();

  // Active Company HR representative resolved dynamically
  const employerProfile = employerProfiles.find(p => p.name === loggedInUser?.details?.company) || employerProfiles.find(p => p.id === 'c_arvato');
  const companyId = employerProfile?.id || 'c_arvato';
  const companyName = employerProfile?.name || 'Arvato Systems';

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
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [jobModalMode, setJobModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const [jobTitle, setJobTitle] = useState('');
  const [jobDuration, setJobDuration] = useState('3 months');
  const [jobScope, setJobScope] = useState('');
  const [jobSkills, setJobSkills] = useState('');
  const [jobTags, setJobTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [deadline, setDeadline] = useState('2026-06-30');
  const [screeningQuestions, setScreeningQuestions] = useState<string[]>([]);
  const [newQuestionInput, setNewQuestionInput] = useState('');
  const [videoLimit, setVideoLimit] = useState<number>(60);
  const [jobToast, setJobToast] = useState(false);
  const [isFypCollaboration, setIsFypCollaboration] = useState(false);
  const [fypMilestone1, setFypMilestone1] = useState('');
  const [fypMilestone2, setFypMilestone2] = useState('');
  const [fypMilestone3, setFypMilestone3] = useState('');
  const [clonedIdCode, setClonedIdCode] = useState<string | null>(null);
  const [submitType, setSubmitType] = useState<'draft' | 'publish'>('publish');

  // Clear job form helper
  const clearJobForm = () => {
    setJobTitle('');
    setJobDuration('3 months');
    setJobScope('');
    setJobSkills('');
    setJobTags([]);
    setTagInput('');
    setDeadline('2026-06-30');
    setScreeningQuestions([]);
    setNewQuestionInput('');
    setVideoLimit(60);
    setEditingJobId(null);
    setIsFypCollaboration(false);
    setFypMilestone1('');
    setFypMilestone2('');
    setFypMilestone3('');
    setClonedIdCode(null);
  };

  // Populate job form helper
  const populateJobForm = (job: any) => {
    setJobTitle(job.title);
    setJobDuration(job.duration);
    setJobScope(job.scope);
    setJobSkills(job.requiredSkills.join(', '));
    setJobTags(job.specializationTags);
    setDeadline(job.deadline);
    setScreeningQuestions(job.screeningQuestions || []);
    setVideoLimit(job.videoDurationLimit || 60);
    setEditingJobId(job.id);
    setIsFypCollaboration(!!job.isFypCollaboration);
    setFypMilestone1(job.fypMilestones?.[0] || '');
    setFypMilestone2(job.fypMilestones?.[1] || '');
    setFypMilestone3(job.fypMilestones?.[2] || '');
  };

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

  // Collaboration subpage states (Screen 2.6 / PB-13 / PB-14)
  const [feedbackScore, setFeedbackScore] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');

  // New Collaboration Workspace States
  const [collabStudentId, setCollabStudentId] = useState<string>('');
  const [isBlueprintModalOpen, setIsBlueprintModalOpen] = useState(false);
  const [blueprintFileName, setBlueprintFileName] = useState('WIA3001_Syllabus_v2.pdf');
  const [blueprintDesc, setBlueprintDesc] = useState('');
  const [editReqsText, setEditReqsText] = useState('');
  const [isEditingReqs, setIsEditingReqs] = useState(false);
  const [reqsToast, setReqsToast] = useState(false);
  const [collabStatementText, setCollabStatementText] = useState('');
  const [collabStatementToast, setCollabStatementToast] = useState(false);

  // Settings States
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [autoRemind, setAutoRemind] = useState(true); // Weekly Recruiter Report
  const [calendarSync, setCalendarSync] = useState(true);
  const [settingsToast, setSettingsToast] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    
    const isDraft = submitType === 'draft';
    
    if (!isDraft && !employerVerifications[companyId]) {
      alert("⚠️ Verification Blocked: Your company profile is currently Unverified. Job postings are restricted. Please contact Career Center.");
      return;
    }

    const skillsArray = jobSkills.split(',').map(s => s.trim());
    const fypMilestones = isFypCollaboration ? [fypMilestone1, fypMilestone2, fypMilestone3].filter(Boolean) : [];
    
    if (jobModalMode === 'create') {
      addJob({
        title: jobTitle,
        companyName,
        companyId,
        duration: jobDuration,
        scope: jobScope,
        requiredSkills: skillsArray,
        specializationTags: jobTags,
        deadline,
        screeningQuestions: screeningQuestions,
        videoDurationLimit: videoLimit,
        isFypCollaboration,
        fypMilestones,
        isDraft
      });
      if (isDraft) {
        alert('✓ Job draft saved successfully.');
      } else {
        setJobToast(true);
        setTimeout(() => setJobToast(false), 3000);
      }
    } else if (jobModalMode === 'edit' && editingJobId) {
      updateJob(editingJobId, {
        title: jobTitle,
        duration: jobDuration,
        scope: jobScope,
        requiredSkills: skillsArray,
        specializationTags: jobTags,
        deadline,
        screeningQuestions: screeningQuestions,
        videoDurationLimit: videoLimit,
        isFypCollaboration,
        fypMilestones,
        isDraft
      });
      alert(isDraft ? '✓ Job draft updated successfully.' : '✓ Job posting updated and published successfully.');
    }
    
    setIsJobModalOpen(false);
    clearJobForm();
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
      {(() => {
        const currentProfile = employerProfiles?.find(p => p.id === companyId);
        const statusText = employerVerifications[companyId]
          ? `✓ Company Credibility Status: Verified (${companyName})`
          : currentProfile?.rejectionReason
            ? `⚠️ Company Credibility Status: Rejected (Reason: "${currentProfile.rejectionReason}")`
            : `⚠️ Company Credibility Status: Unverified / Pending Audit (${companyName})`;
        const badgeText = employerVerifications[companyId]
          ? 'Active Recruiter'
          : currentProfile?.rejectionReason
            ? 'Verification Rejected'
            : 'Postings Blocked';

        return (
          <div className="dashboard-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', backgroundColor: employerVerifications[companyId] ? 'hsl(142, 76%, 95%)' : 'hsl(0, 84%, 95%)', border: '1px solid ' + (employerVerifications[companyId] ? 'var(--status-offered)' : 'var(--status-rejected)'), borderRadius: '8px', marginBottom: '24px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>
              {statusText}
            </span>
            <span className={`badge ${employerVerifications[companyId] ? 'badge-offered' : 'badge-rejected'}`}>
              {badgeText}
            </span>
          </div>
        );
      })()}

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
                <button onClick={() => setActiveSubpage('candidates')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '10px', fontWeight: 600 }}>View all →</button>
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
                            <strong>AI Analysis:</strong> {reason}
                          </p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Priority Override:</span>
                            <input 
                              type="number" 
                              placeholder="e.g. 1" 
                              value={manualRanks[app.id] !== undefined ? manualRanks[app.id] : ''}
                              onChange={e => {
                                const val = e.target.value === '' ? undefined : Number(e.target.value);
                                setManualRanks(prev => {
                                  const copy = { ...prev };
                                  if (val === undefined) {
                                    delete copy[app.id];
                                  } else {
                                    copy[app.id] = val;
                                  }
                                  return copy;
                                });
                              }}
                              style={{ 
                                width: '55px', 
                                padding: '3px 6px', 
                                fontSize: '11.5px', 
                                border: '1px solid var(--color-border)', 
                                borderRadius: '4px',
                                background: '#f8fafc'
                              }}
                            />
                            {manualRanks[app.id] !== undefined && (
                              <span className="badge badge-shortlisted" style={{ fontSize: '9px', padding: '1px 4px' }}>
                                Custom Priority #{manualRanks[app.id]}
                              </span>
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

                      {job?.isFypCollaboration && (
                        <div className="dashboard-card" style={{ margin: '20px 0 0 0', borderLeft: '4px solid var(--color-primary)', backgroundColor: 'hsl(265, 80%, 98%)' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-primary)' }}>🎓 FYP Collaboration Scope</h4>
                          <p style={{ fontSize: '13px', marginBottom: '8px' }}>
                            <strong>Proposed Thesis Title:</strong><br />
                            <span style={{ fontStyle: app.fypThesisTitle ? 'normal' : 'italic', color: app.fypThesisTitle ? 'inherit' : 'var(--color-text-muted)' }}>
                              {app.fypThesisTitle || 'Not submitted yet'}
                            </span>
                          </p>
                          <p style={{ fontSize: '13px', marginBottom: '8px' }}>
                            <strong>Academic Advisor:</strong><br />
                            <span style={{ fontStyle: app.fypAdvisorName ? 'normal' : 'italic', color: app.fypAdvisorName ? 'inherit' : 'var(--color-text-muted)' }}>
                              {app.fypAdvisorName || 'Not assigned'}
                            </span>
                          </p>
                          <div style={{ marginTop: '12.5px', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Configured Milestones:</span>
                            <ul style={{ margin: '6px 0 0 16px', padding: 0, fontSize: '11.5px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              {job.fypMilestones?.map((m, i) => (
                                <li key={i}><strong>M{i+1}:</strong> {m}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

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
        <div className="dashboard-card" style={{ margin: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>Active Internship Job Postings</h3>
              <p style={{ fontSize: '12.5px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                Manage listings, configure pre-screening questions, set video limits, and duplicate previous templates.
              </p>
            </div>
            <button 
              className="btn btn-primary" 
              onClick={() => {
                clearJobForm();
                setJobModalMode('create');
                setIsJobModalOpen(true);
              }}
            >
              <span>+</span> Create New Job Posting
            </button>
          </div>

          {jobToast && (
            <div style={{ padding: '12px', backgroundColor: 'hsl(142, 76%, 95%)', border: '1px solid var(--status-offered)', borderRadius: '8px', color: '#16a34a', fontSize: '13px', fontWeight: 600, marginBottom: '20px' }}>
              ✓ Job posted successfully! Awaiting verification review from Career Centre.
            </div>
          )}

          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Job Title</th>
                  <th>Required Skills</th>
                  <th>Specialization</th>
                  <th>Applicants</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {companyJobs.map(job => {
                  const jobAppsCount = applications.filter(a => a.jobId === job.id).length;
                  return (
                    <tr key={job.id}>
                      <td style={{ fontWeight: 700 }}>
                        {job.title}
                        {job.isFypCollaboration && (
                          <span className="badge badge-shortlisted" style={{ marginLeft: '8px', fontSize: '9.5px', padding: '1px 4px', backgroundColor: 'hsl(265, 80%, 94%)', color: 'var(--color-primary)', border: '1px solid hsl(265, 80%, 85%)' }}>
                            🎓 FYP
                          </span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {job.requiredSkills.map(s => <span key={s} className="badge badge-applied" style={{ fontSize: '10px', padding: '2px 6px' }}>{s}</span>)}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {job.specializationTags.map(t => <span key={t} className="badge badge-shortlisted" style={{ fontSize: '10px', padding: '2px 6px' }}>{t}</span>)}
                        </div>
                      </td>
                      <td><strong>{jobAppsCount}</strong> applied</td>
                      <td>{job.deadline}</td>
                      <td>
                        {job.isDraft ? (
                          <span className="badge badge-awaiting" style={{ backgroundColor: '#e2e8f0', color: '#475569', border: '1px solid #cbd5e1' }}>⏳ Draft</span>
                        ) : job.isApproved ? (
                          <span className="badge badge-approved">✓ Active</span>
                        ) : job.rejectionReason ? (
                          <span 
                            className="badge badge-rejected" 
                            title={`Rejection Reason: ${job.rejectionReason}`}
                            style={{ cursor: 'pointer' }}
                          >
                            ⚠️ Rejected
                          </span>
                        ) : (
                          <span className="badge badge-awaiting">⏳ Pending Review</span>
                        )}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '4px' }}
                            onClick={() => {
                              populateJobForm(job);
                              setJobModalMode('view');
                              setIsJobModalOpen(true);
                            }}
                          >
                            View
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '4px' }}
                            onClick={() => {
                              populateJobForm(job);
                              setJobModalMode('edit');
                              setIsJobModalOpen(true);
                            }}
                          >
                            Edit
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            style={{ padding: '4px 10px', fontSize: '11px', borderRadius: '4px' }}
                            onClick={() => {
                              populateJobForm(job);
                              setJobModalMode('create'); 
                              setEditingJobId(null);
                              setClonedIdCode('CLONE-' + Math.random().toString(36).substring(2, 7).toUpperCase());
                              setIsJobModalOpen(true);
                            }}
                          >
                            Clone Posting
                          </button>
                          <button 
                            className="btn btn-secondary" 
                            style={{ 
                              padding: '4px 10px', 
                              fontSize: '11px', 
                              borderRadius: '4px', 
                              backgroundColor: 'hsl(142, 76%, 95%)', 
                              color: '#16a34a',
                              border: '1px solid hsl(142, 76%, 85%)'
                            }}
                            onClick={() => {
                              const shareUrl = `${window.location.origin}${window.location.pathname}?jobId=${job.id}&ref=linkedin`;
                              navigator.clipboard.writeText(shareUrl).then(() => {
                                alert(`✓ Unique tracking link copied to clipboard!\nSource: LinkedIn Ref Tracked\nLink: ${shareUrl}`);
                              }).catch(() => {
                                alert(`Share link: ${shareUrl}`);
                              });
                            }}
                          >
                            🔗 Share
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {companyJobs.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontStyle: 'italic', padding: '24px' }}>
                      No job postings configured. Click "+ Create New Job Posting" to list one.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', width: '100%', alignItems: 'start' }}>
          
          {/* Notification and Preferences */}
          <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>⚙️ Portal Preferences & Notifications</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Configure how you receive updates regarding candidate applications, interview bookings, and system logs.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 4px 0' }}>Email Notifications</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Receive email alerts when candidates submit applications or accept interview slots.</p>
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
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Show desktop push notifications for urgent review requests or portal announcements.</p>
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
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 4px 0' }}>Weekly Recruiter Report</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Send weekly recruitment analytics summary reports on Friday afternoons.</p>
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
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Sync booked candidate interviews and matching sessions to Google/Outlook Calendar.</p>
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
                ✓ Recruiter preferences saved successfully.
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

      {/* REQUIREMENT COLLABORATION WORKSPACE (Screen 2.6 / PB-13 / PB-14) */}
      {/* REQUIREMENT COLLABORATION WORKSPACE (Screen 2.6 / PB-13 / PB-14 / PB-32.1) */}
      {activeSubpage === 'collaboration' && (() => {
        // Find students placed at this company (status === 'Approved' and application jobId matches company's job)
        const myCompanyPlacements = applications.filter(a => a.status === 'Approved' && companyJobs.some(j => j.id === a.jobId));

        if (myCompanyPlacements.length === 0) {
          return (
            <div className="dashboard-card slide-up" style={{ textAlign: 'center', padding: '40px 20px', margin: 0 }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔒</div>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-text-main)', marginBottom: '8px' }}>Access Restricted</h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto' }}>
                The collaborative workspace is restricted via Role-Based Access Control (RBAC). It is only visible to faculty advisors and corporate stakeholders matching an active, verified student placement.
              </p>
            </div>
          );
        }

        const activeStudentId = collabStudentId || myCompanyPlacements[0].studentId;
        const activePlacement = myCompanyPlacements.find(p => p.studentId === activeStudentId) || myCompanyPlacements[0];
        const student = students.find(s => s.id === activeStudentId);
        const job = jobs.find(j => j.id === activePlacement.jobId);

        // Filter statements & commits for the active student placement
        const studentStatements = facultyStatements.filter(s => s.studentId === activeStudentId);
        const studentCommits = blueprintCommits.filter(c => c.studentId === activeStudentId);

        // Find submitted feedback for the active student
        const activeFeedbackList = employerFeedbacks.filter(f => f.studentId === activeStudentId && f.companyId === companyId);

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }} className="slide-up">
            
            {/* Top Selector & Placement Header Card */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>🤝 Shared Workspace: University-Corporate Bridge</h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '4px 0 0 0' }}>
                  Select an active placement at {companyName} to coordinate requirements, log statements, and upload blueprints.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600 }}>Active Placement Student:</span>
                <select 
                  className="form-input" 
                  style={{ width: '220px', height: '36px', fontSize: '13px', padding: '6px' }}
                  value={activeStudentId}
                  onChange={e => {
                    setCollabStudentId(e.target.value);
                    setIsEditingReqs(false);
                  }}
                >
                  {myCompanyPlacements.map(p => {
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
                    {!isEditingReqs ? (
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '4px 10px', fontSize: '11px' }}
                        onClick={() => {
                          setEditReqsText(programRequirements);
                          setIsEditingReqs(true);
                        }}
                      >
                        ✏️ Edit Requirements
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button 
                          className="btn btn-secondary" 
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                          onClick={() => setIsEditingReqs(false)}
                        >
                          Cancel
                        </button>
                        <button 
                          className="btn btn-primary" 
                          style={{ padding: '4px 10px', fontSize: '11px' }}
                          onClick={() => {
                            setProgramRequirements(editReqsText);
                            setIsEditingReqs(false);
                            const nowStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                            setCollaborationLogs(prev => [
                              `[${nowStr}] ${loggedInUser?.name} updated internship requirements for ${student?.name}'s placement.`,
                              ...prev
                            ]);
                            addBlueprintCommit(loggedInUser?.name || 'Company HR', `Updated internship requirements.`, activeStudentId);
                            setReqsToast(true);
                            setTimeout(() => setReqsToast(false), 3000);
                          }}
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>

                  {!isEditingReqs ? (
                    <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px dashed var(--color-border)' }}>
                      <pre style={{ margin: 0, fontFamily: 'inherit', fontSize: '13px', whiteSpace: 'pre-line', lineHeight: '1.6' }}>
                        {programRequirements}
                      </pre>
                    </div>
                  ) : (
                    <textarea
                      className="form-input"
                      rows={6}
                      style={{ fontFamily: 'monospace', fontSize: '13px', lineHeight: '1.5' }}
                      value={editReqsText}
                      onChange={e => setEditReqsText(e.target.value)}
                    />
                  )}
                  {reqsToast && <p style={{ color: 'var(--status-offered)', fontSize: '12px', marginTop: '8px', fontWeight: 600 }}>✓ Requirements updated and timeline synchronized.</p>}
                </div>

                {/* Faculty Interview Statements Card */}
                <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>💬 Faculty Interview Statements & Adjustments (PB-32.1)</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                    View adjustment comments appended by academic supervisor Dr. Lim Wei Ming or add comments to coordinate corporate alignment.
                  </p>
                  
                  {/* Append comment */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                    <textarea 
                      className="form-input" 
                      rows={3} 
                      placeholder="Comment on internship adjustments or syllabus requirements..."
                      value={collabStatementText}
                      onChange={e => setCollabStatementText(e.target.value)}
                      style={{ fontSize: '12.5px' }}
                    />
                    <button 
                      className="btn btn-primary" 
                      style={{ alignSelf: 'flex-end', padding: '6px 16px', fontSize: '12px' }}
                      onClick={() => {
                        if (!collabStatementText.trim()) return;
                        addFacultyStatement(activeStudentId, `${loggedInUser?.name || 'Sarah Tan'} (${companyName})`, collabStatementText);
                        addBlueprintCommit(loggedInUser?.name || 'Company HR', `Appended collaboration adjustment note.`, activeStudentId);
                        setCollabStatementText('');
                        setCollabStatementToast(true);
                        setTimeout(() => setCollabStatementToast(false), 3000);
                      }}
                    >
                      Add Comment
                    </button>
                    {collabStatementToast && <p style={{ color: 'var(--status-offered)', fontSize: '12px', fontWeight: 600 }}>✓ Comment appended successfully.</p>}
                  </div>

                  {/* List of statements */}
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
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '8px' }}>✍️ Placement Feedback Hub</h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
                    Submit performance scores and qualitative assessment reviews for **{student?.name}** (PB-14).
                  </p>

                  <div className="form-group">
                    <span className="form-label">Performance Rating Score:</span>
                    <select 
                      className="form-input"
                      value={feedbackScore}
                      onChange={e => setFeedbackScore(Number(e.target.value))}
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                      <option value={3}>⭐⭐⭐ (3 - Satisfactory)</option>
                      <option value={2}>⭐⭐ (2 - Needs Improvement)</option>
                      <option value={1}>⭐ (1 - Unsatisfactory)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <span className="form-label">Assessment Comments:</span>
                    <textarea 
                      className="form-input" 
                      rows={4}
                      placeholder="Provide qualitative feedback regarding technical competence, milestone accomplishments, and general workplace conduct..."
                      value={feedbackText}
                      onChange={e => setFeedbackText(e.target.value)}
                    />
                  </div>

                  <button 
                    className="btn btn-primary"
                    style={{ width: '100%', marginTop: '8px' }}
                    onClick={() => {
                      if (!feedbackText.trim()) {
                        alert('Please enter assessment comments.');
                        return;
                      }
                      submitFeedback(activeStudentId, companyId, feedbackScore, feedbackText);
                      addBlueprintCommit(loggedInUser?.name || 'Company HR', `Submitted student performance feedback rating of ${feedbackScore}/5.`, activeStudentId);
                      setFeedbackText('');
                      alert(`✓ Performance feedback submitted successfully!`);
                    }}
                  >
                    Submit Performance Feedback
                  </button>
                  
                  {/* Reviews List */}
                  <div style={{ marginTop: '24px', borderTop: '1px solid var(--color-border)', paddingTop: '20px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '12px' }}>📝 Submitted Placement Reviews for {student?.name}</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {activeFeedbackList.map((feed) => (
                        <div key={feed.id} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <strong style={{ fontSize: '12.5px' }}>{student?.name}</strong>
                            <span style={{ color: 'gold', fontSize: '12px' }}>
                              {'★'.repeat(feed.performanceScore)}{'☆'.repeat(5 - feed.performanceScore)}
                            </span>
                          </div>
                          <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.4', margin: 0 }}>
                            {feed.feedbackText}
                          </p>
                        </div>
                      ))}
                      {activeFeedbackList.length === 0 && (
                        <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '12px', margin: 0 }}>
                          No performance feedback submitted for {student?.name} yet.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Version Control Timeline & Upload Blueprint */}
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
                    <p>🏢 <strong>Company:</strong> {companyName}</p>
                    <p>🎯 <strong>Position:</strong> {job?.title}</p>
                    <p>⏱️ <strong>Duration:</strong> {job?.duration}</p>
                    <p>🎓 <strong>Supervisor:</strong> Dr. Lim Wei Ming (Lecturer)</p>
                  </div>
                </div>

                {/* Version Control Timeline */}
                <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, margin: 0 }}>⚙️ Version Control Timeline</h4>
                    <button 
                      className="btn btn-secondary" 
                      style={{ padding: '4px 10px', fontSize: '11px' }}
                      onClick={() => setIsBlueprintModalOpen(true)}
                    >
                      📤 Upload Blueprint
                    </button>
                  </div>
                  
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

            {/* Upload Blueprint Modal */}
            {isBlueprintModalOpen && (
              <div className="modal-overlay">
                <div className="modal-content" style={{ maxWidth: '450px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>📤 Upload Shared Program Blueprint</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="form-group">
                      <span className="form-label">Blueprint File Name:</span>
                      <input 
                        type="text" 
                        className="form-input" 
                        value={blueprintFileName} 
                        onChange={e => setBlueprintFileName(e.target.value)} 
                        placeholder="e.g. course_syllabus.pdf"
                        style={{ height: '36px', fontSize: '13px' }}
                      />
                    </div>
                    <div className="form-group">
                      <span className="form-label">Blueprint / Scope Description:</span>
                      <textarea 
                        className="form-input" 
                        rows={3} 
                        value={blueprintDesc} 
                        onChange={e => setBlueprintDesc(e.target.value)} 
                        placeholder="Provide details about the uploaded document scope..."
                        style={{ fontSize: '12.5px' }}
                      />
                    </div>
                  </div>
                  <div className="modal-buttons" style={{ marginTop: '20px' }}>
                    <button className="btn btn-secondary" onClick={() => {
                      setIsBlueprintModalOpen(false);
                      setBlueprintDesc('');
                    }}>Cancel</button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => {
                        if (!blueprintFileName.trim()) return;
                        const actionStr = `Uploaded blueprint "${blueprintFileName}"${blueprintDesc ? ` — ${blueprintDesc}` : ''}`;
                        addBlueprintCommit(loggedInUser?.name || 'Company HR', actionStr, activeStudentId);
                        setIsBlueprintModalOpen(false);
                        setBlueprintDesc('');
                        alert(`✓ Blueprint uploaded successfully! logged to version control.`);
                      }}
                    >
                      Upload & Log Commit
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        );
      })()}

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
                <tr>
                  <td className="comparison-label-col">Achievements</td>
                  {selectedAppIds.map(appId => {
                    const app = applications.find(a => a.id === appId);
                    const student = students.find(s => s.id === app?.studentId);
                    return <td key={appId}>{student?.achievements.join(', ') || 'None listed'}</td>;
                  })}
                </tr>
                <tr>
                  <td className="comparison-label-col">Project Experience</td>
                  {selectedAppIds.map(appId => {
                    const app = applications.find(a => a.id === appId);
                    const student = students.find(s => s.id === app?.studentId);
                    return <td key={appId}>{student?.projects.join(', ') || 'No projects listed'}</td>;
                  })}
                </tr>
                <tr>
                  <td className="comparison-label-col">Screening Responses</td>
                  {selectedAppIds.map(appId => {
                    const app = applications.find(a => a.id === appId);
                    const job = jobs.find(j => j.id === app?.jobId);
                    return (
                      <td key={appId} style={{ fontSize: '11.5px', textAlign: 'left' }}>
                        {app && job?.screeningQuestions && job.screeningQuestions.map((q, idx) => (
                          <div key={idx} style={{ marginBottom: '6px' }}>
                            <strong>Q: {q}</strong><br />
                            <span style={{ color: 'var(--color-text-muted)' }}>A: {app.screeningAnswers[idx] || 'No response.'}</span>
                          </div>
                        ))}
                        {(!job?.screeningQuestions || job.screeningQuestions.length === 0) && 'No screening questions for this listing.'}
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="comparison-label-col">Recruitment Status</td>
                  {selectedAppIds.map(appId => {
                    const app = applications.find(a => a.id === appId);
                    return (
                      <td key={appId}>
                        <span className={`badge badge-${app?.status.toLowerCase().replace(/ /g, '-')}`}>
                          {app?.status}
                        </span>
                      </td>
                    );
                  })}
                </tr>
                <tr>
                  <td className="comparison-label-col">HR Decision Actions</td>
                  {selectedAppIds.map(appId => {
                    const app = applications.find(a => a.id === appId);
                    if (!app) return <td key={appId}>-</td>;
                    return (
                      <td key={appId}>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ padding: '4px 8px', fontSize: '11px' }}
                            onClick={() => {
                              updateApplicationStatus(app.id, 'Shortlisted');
                              alert(`✓ Shortlisted ${students.find(s => s.id === app.studentId)?.name}`);
                            }}
                            disabled={app.status === 'Shortlisted'}
                          >
                            Shortlist
                          </button>
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '4px 8px', fontSize: '11px', backgroundColor: 'var(--status-rejected)', border: 'none' }}
                            onClick={() => {
                              updateApplicationStatus(app.id, 'Rejected');
                              alert(`✕ Rejected ${students.find(s => s.id === app.studentId)?.name}`);
                            }}
                            disabled={app.status === 'Rejected'}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* JOB CONFIGURATION MODAL (FR-15 / PB-44 / PB-45 / FR-04 / PB-17 / FR-21 / PB-32) */}
      {isJobModalOpen && (
        <div className="modal-overlay" style={{ top: '70px', zIndex: 9999 }}>
          <div 
            className="modal-content" 
            style={{ 
              maxWidth: jobModalMode === 'create' ? '850px' : '550px', 
              width: '90%', 
              display: 'flex', 
              flexDirection: 'column', 
              maxHeight: '90vh', 
              overflow: 'hidden',
              padding: '24px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px', marginBottom: '16px' }}>
              <h3 className="modal-title" style={{ margin: 0 }}>
                {jobModalMode === 'create' && 'Create New Internship Listing'}
                {jobModalMode === 'edit' && 'Edit Internship Listing'}
                {jobModalMode === 'view' && 'View Internship Listing Details'}
              </h3>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ padding: '4px 8px', borderRadius: '50%', fontSize: '14px', lineHeight: 1 }}
                onClick={() => { setIsJobModalOpen(false); clearJobForm(); }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', flex: 1, overflow: 'hidden' }}>
              {/* Left Column: Duplicate Past Job Sidebar (Only in Create Mode) */}
              {jobModalMode === 'create' && (
                <div style={{ width: '260px', borderRight: '1px solid var(--color-border)', paddingRight: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, margin: 0, textTransform: 'uppercase', color: 'var(--color-primary)' }}>
                    📋 Past Templates
                  </h4>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>
                    Select a previous listing to prefill all fields and screening questions.
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    {companyJobs.map(pastJob => (
                      <button
                        key={pastJob.id}
                        type="button"
                        className="btn btn-secondary"
                        style={{ justifyContent: 'flex-start', textAlign: 'left', padding: '10px', fontSize: '12px', width: '100%', borderRadius: '6px', whiteSpace: 'normal', height: 'auto', display: 'block' }}
                        onClick={() => {
                          populateJobForm(pastJob);
                          // Keep modal mode as create
                          setJobModalMode('create');
                          setEditingJobId(null);
                          setClonedIdCode('CLONE-' + Math.random().toString(36).substring(2, 7).toUpperCase());
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>{pastJob.title}</div>
                        <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          {pastJob.duration} • {pastJob.requiredSkills.slice(0, 2).join(', ')}
                        </div>
                      </button>
                    ))}
                    {companyJobs.length === 0 && (
                      <p style={{ fontStyle: 'italic', fontSize: '11px', color: 'var(--color-text-muted)' }}>No past postings available.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Right Column: Configuration Form */}
              <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                <form onSubmit={handlePostJob}>
                  {clonedIdCode && (
                    <div className="form-group" style={{ backgroundColor: 'var(--color-primary-light)', padding: '12px', borderRadius: '6px', border: '1px solid var(--color-primary)', marginBottom: '16px' }}>
                      <span className="form-label" style={{ margin: 0, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        🔑 Unique Clone Identifier Code:
                      </span>
                      <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 'bold', color: 'var(--color-primary)', marginLeft: '8px' }}>
                        {clonedIdCode}
                      </span>
                      <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                        This code uniquely tracks templates duplicated from historical postings.
                      </span>
                    </div>
                  )}

                  <div className="form-group">
                    <span className="form-label">Job Title *</span>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={jobTitle} 
                      onChange={e => setJobTitle(e.target.value)} 
                      placeholder="e.g. Software Intern" 
                      required 
                      disabled={jobModalMode === 'view'}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <span className="form-label">Duration *</span>
                      <select 
                        className="form-input" 
                        value={jobDuration} 
                        onChange={e => setJobDuration(e.target.value)}
                        disabled={jobModalMode === 'view'}
                      >
                        <option value="2 months">2 Months</option>
                        <option value="3 months">3 Months</option>
                        <option value="6 months">6 Months</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <span className="form-label">Application Deadline *</span>
                      <input 
                        type="date" 
                        className="form-input" 
                        value={deadline} 
                        onChange={e => setDeadline(e.target.value)}
                        disabled={jobModalMode === 'view'}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <span className="form-label">Job Scope & Technical Duties *</span>
                    <textarea 
                      className="form-input" 
                      rows={3} 
                      value={jobScope} 
                      onChange={e => setJobScope(e.target.value)} 
                      placeholder="Describe internship responsibilities and tech stack expectations..." 
                      required 
                      disabled={jobModalMode === 'view'}
                    />
                  </div>

                  <div className="form-group">
                    <span className="form-label">Required Core Skills (Comma-separated) *</span>
                    <input 
                      type="text" 
                      className="form-input" 
                      value={jobSkills} 
                      onChange={e => setJobSkills(e.target.value)} 
                      placeholder="e.g. React, TypeScript, Node.js" 
                      required 
                      disabled={jobModalMode === 'view'}
                    />
                  </div>

                  <div className="form-group">
                    <span className="form-label">Specialization Tags</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        className="form-input" 
                        style={{ flex: 1 }} 
                        placeholder="e.g. Software Engineering" 
                        value={tagInput} 
                        onChange={e => setTagInput(e.target.value)}
                        disabled={jobModalMode === 'view'}
                      />
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => { if (tagInput) { setJobTags([...jobTags, tagInput]); setTagInput(''); } }}
                        disabled={jobModalMode === 'view'}
                      >
                        Add Tag
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                      {jobTags.map(t => (
                        <span key={t} className="badge badge-shortlisted" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          {t}
                          {jobModalMode !== 'view' && (
                            <span 
                              style={{ cursor: 'pointer', fontWeight: 'bold', fontSize: '10px' }} 
                              onClick={() => setJobTags(jobTags.filter(x => x !== t))}
                            >
                              ✕
                            </span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <span className="form-label">Video Pitch Duration Limit *</span>
                      <select 
                        className="form-input" 
                        value={videoLimit} 
                        onChange={e => setVideoLimit(Number(e.target.value))}
                        disabled={jobModalMode === 'view'}
                      >
                        <option value={60}>60 Seconds</option>
                        <option value={90}>90 Seconds</option>
                        <option value={120}>120 Seconds</option>
                        <option value={180}>180 Seconds</option>
                      </select>
                    </div>
                  </div>

                  {/* Combined FYP Collaboration Section (FR-22 / PB-48) */}
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '16px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        id="fypToggleCheckbox"
                        checked={isFypCollaboration}
                        onChange={e => setIsFypCollaboration(e.target.checked)}
                        disabled={jobModalMode === 'view'}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <label htmlFor="fypToggleCheckbox" style={{ fontWeight: 700, fontSize: '14px', cursor: 'pointer', color: 'var(--color-primary)' }}>
                        🎓 Combined Final Year Project (FYP) Collaboration Opportunity
                      </label>
                    </div>
                    <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '4px', marginLeft: '26px' }}>
                      Link this internship opportunity with academic research milestones for university course validation.
                    </p>

                    {isFypCollaboration && (
                      <div className="slide-down" style={{ marginLeft: '26px', marginTop: '12px', padding: '12px', borderLeft: '3px solid var(--color-primary)', backgroundColor: 'hsl(215, 15%, 97%)', borderRadius: '0 6px 6px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <h5 style={{ margin: 0, fontWeight: 700, fontSize: '12px' }}>Define Research Milestones & Timelines</h5>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <span className="form-label" style={{ fontSize: '11px' }}>Milestone 1 (e.g. Spec & Literature Review Alignment)</span>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Describe Milestone 1..." 
                            value={fypMilestone1}
                            onChange={e => setFypMilestone1(e.target.value)}
                            disabled={jobModalMode === 'view'}
                            required={isFypCollaboration}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <span className="form-label" style={{ fontSize: '11px' }}>Milestone 2 (e.g. Mid-term Prototype Review)</span>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Describe Milestone 2..." 
                            value={fypMilestone2}
                            onChange={e => setFypMilestone2(e.target.value)}
                            disabled={jobModalMode === 'view'}
                            required={isFypCollaboration}
                          />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                          <span className="form-label" style={{ fontSize: '11px' }}>Milestone 3 (e.g. Final Thesis Defense & Handover)</span>
                          <input 
                            type="text" 
                            className="form-input" 
                            placeholder="Describe Milestone 3..." 
                            value={fypMilestone3}
                            onChange={e => setFypMilestone3(e.target.value)}
                            disabled={jobModalMode === 'view'}
                            required={isFypCollaboration}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Screening Questions section (FR-04 / PB-17 / FR-21 / PB-32) */}
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '16px', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '8px', color: 'var(--color-text-main)' }}>
                      ❓ Open-Ended Screening Questions
                    </h4>
                    <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                      Configure custom questions candidates must answer when applying.
                    </p>

                    {jobModalMode !== 'view' && (
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                        <input
                          type="text"
                          className="form-input"
                          style={{ flex: 1 }}
                          placeholder="Type screening question..."
                          value={newQuestionInput}
                          onChange={e => setNewQuestionInput(e.target.value)}
                        />
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => {
                            if (newQuestionInput.trim()) {
                              setScreeningQuestions([...screeningQuestions, newQuestionInput.trim()]);
                              setNewQuestionInput('');
                            }
                          }}
                        >
                          Add Q
                        </button>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {screeningQuestions.map((q, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'flex-start', 
                            padding: '10px 12px', 
                            backgroundColor: '#f8fafc', 
                            border: '1px solid var(--color-border)', 
                            borderRadius: '6px',
                            fontSize: '12.5px'
                          }}
                        >
                          <span style={{ flex: 1, paddingRight: '8px' }}>
                            <strong>Q{idx + 1}:</strong> {q}
                          </span>
                          {jobModalMode !== 'view' && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              style={{ padding: '2px 6px', fontSize: '11px', borderRadius: '4px', height: '24px' }}
                              onClick={() => setScreeningQuestions(screeningQuestions.filter((_, i) => i !== idx))}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))}
                      {screeningQuestions.length === 0 && (
                        <p style={{ fontStyle: 'italic', fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>
                          No screening questions configured. Resumes only.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '20px' }}>
                    <button 
                      type="button" 
                      className="btn btn-secondary" 
                      onClick={() => { setIsJobModalOpen(false); clearJobForm(); }}
                    >
                      {jobModalMode === 'view' ? 'Close' : 'Cancel'}
                    </button>
                    {jobModalMode !== 'view' && (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          type="submit" 
                          className="btn btn-secondary"
                          onClick={() => setSubmitType('draft')}
                        >
                          💾 Save as Draft
                        </button>
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          onClick={() => setSubmitType('publish')}
                        >
                          {jobModalMode === 'create' ? '🚀 Publish Listing' : '✓ Save & Publish'}
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default EmployerPortal;
