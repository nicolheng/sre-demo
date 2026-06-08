import React, { useState } from 'react';
import { usePortal } from '../context/PortalState';
import Stepper from '../components/Stepper';
import RatingStars from '../components/RatingStars';
import type { Application, Job } from '../types';

export const StudentPortal: React.FC = () => {
  const {
    activeSubpage,
    setActiveSubpage,
    students,
    jobs,
    applications,
    interviewSlots,
    logbookEntries,
    reviews,
    checklists,
    applyForJob,
    withdrawApplication,
    editApplication,
    bookInterviewSlot,
    addLogbookEntry,
    submitReview,
    uploadOfferLetter,
    loggedInUser
  } = usePortal();

  // Active student is loggedInUser (Student)
  const studentId = loggedInUser?.id || 's1';
  const currentStudent = students.find(s => s.id === studentId) || students[0];

  // Detailed Modal states
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals state
  const [showWithdrawModal, setShowWithdrawModal] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<Application | null>(null);
  const [viewJobModal, setViewJobModal] = useState<Job | null>(null);
  const [applyJobFlow, setApplyJobFlow] = useState<Job | null>(null);

  // Apply Form state
  const [sop, setSop] = useState('');
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({});
  const [videoUrl, setVideoUrl] = useState('');
  const [fypThesisTitle, setFypThesisTitle] = useState('');
  const [fypAdvisorName, setFypAdvisorName] = useState('');

  // Logbook form state
  const [hours, setHours] = useState<number>(8);
  const [tasks, setTasks] = useState('');
  const [milestone, setMilestone] = useState('');
  const [showLogToast, setShowLogToast] = useState(false);

  // Edit app form state
  const [editSop, setEditSop] = useState('');
  const [editCv, setEditCv] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');

  // Review form state
  const [selectedCompany, setSelectedCompany] = useState<{ id: string; name: string } | null>(null);
  const [ratingOverall, setRatingOverall] = useState(5);
  const [ratingCulture, setRatingCulture] = useState(5);
  const [ratingLearning, setRatingLearning] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [anonymize, setAnonymize] = useState(false);
  const [showReviewToast, setShowReviewToast] = useState(false);

  // Messages Chat state
  const [chatRecipient, setChatRecipient] = useState<string>('Career Center');
  const [messageInput, setMessageInput] = useState('');
  const [mockChats, setMockChats] = useState<Record<string, { sender: string; text: string; time: string }[]>>({
    'Career Center': [
      { sender: 'Career Center', text: 'Hi John, we have verified your application credentials.', time: '2 hours ago' },
      { sender: 'You', text: 'Thank you! I am booking the interview slot now.', time: '1 hour ago' }
    ],
    'IJM HR': [
      { sender: 'IJM HR', text: 'Please select an interview slot from the schedule.', time: '5 hours ago' }
    ],
    'Supervisor': [
      { sender: 'Supervisor', text: 'Don\'t forget to submit your weekly log by Friday.', time: '1 day ago' }
    ]
  });

  // Booking state toast
  const [showBookingToast, setShowBookingToast] = useState(false);

  // Offer letter simulation
  const [uploadedFile, setUploadedFile] = useState<string>('');

  // Profile Form state
  const [profPhone, setProfPhone] = useState(currentStudent?.phone || '');
  const [profSkills, setProfSkills] = useState(currentStudent?.skills.join(', ') || '');
  const [profAchievements, setProfAchievements] = useState(currentStudent?.achievements.join(', ') || '');
  const [profToast, setProfToast] = useState(false);

  // Settings state
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(true);
  const [autoRemind, setAutoRemind] = useState(false);
  const [calendarSync, setCalendarSync] = useState(false);
  const [settingsToast, setSettingsToast] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Profile Resume & Video Upload simulation states
  const [profileResume, setProfileResume] = useState<string>('John_Lim_CV.pdf');
  const [profileVideo, setProfileVideo] = useState<string>('https://assets.mixkit.co/videos/preview/mixkit-man-holding-a-smartphone-at-his-desk-40090-large.mp4');
  const [recordingStatus, setRecordingStatus] = useState<'idle' | 'counting' | 'recording' | 'finished'>('idle');
  const [countdown, setCountdown] = useState<number>(3);
  const [recordSeconds, setRecordSeconds] = useState<number>(0);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState<number | null>(null);
  const [jobQuery, setJobQuery] = useState('');
  const [showUploadSuccessModal, setShowUploadSuccessModal] = useState<{ fileName: string } | null>(null);

  const startVideoSimulation = () => {
    setRecordingStatus('counting');
    setCountdown(3);

    let count = 3;
    const countInterval = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(countInterval);
        setRecordingStatus('recording');
        setRecordSeconds(0);

        let secs = 0;
        const recInterval = setInterval(() => {
          secs += 1;
          setRecordSeconds(secs);
          if (secs >= 5) {
            clearInterval(recInterval);
            setRecordingStatus('finished');
            setProfileVideo('https://assets.mixkit.co/videos/preview/mixkit-woman-filming-herself-with-a-smartphone-43180-large.mp4');
          }
        }, 1000);
      }
    }, 1000);
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const fileName = e.target.files[0].name;
      setVideoUploadProgress(10);
      let progress = 10;
      const interval = setInterval(() => {
        progress += 30;
        if (progress >= 100) {
          clearInterval(interval);
          setVideoUploadProgress(null);
          setProfileVideo('https://assets.mixkit.co/videos/preview/mixkit-woman-filming-herself-with-a-smartphone-43180-large.mp4');
          alert(`Video "${fileName}" uploaded successfully!`);
        } else {
          setVideoUploadProgress(progress);
        }
      }, 400);
    }
  };

  const myApps = applications.filter(a => a.studentId === studentId);

  // Filters & Sorting
  const filteredApps = myApps
    .filter(a => statusFilter === 'All' || a.status === statusFilter)
    .sort((a, b) => {
      // Withdrawn applications are pushed to the bottom
      if (a.status === 'Withdrawn' && b.status !== 'Withdrawn') return 1;
      if (a.status !== 'Withdrawn' && b.status === 'Withdrawn') return -1;

      const dateA = new Date(a.submissionDate).getTime();
      const dateB = new Date(b.submissionDate).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Calculate logbook progress
  const loggedWeeks = logbookEntries.filter(le => le.studentId === studentId);
  const totalHours = loggedWeeks.reduce((sum, entry) => sum + entry.workingHours, 0);
  const progressPercent = Math.min(Math.round((totalHours / 120) * 100), 100);

  const handleApply = (job: Job) => {
    applyForJob(
      job.id,
      studentId,
      sop,
      screeningAnswers,
      videoUrl,
      job.isFypCollaboration ? fypThesisTitle : undefined,
      job.isFypCollaboration ? fypAdvisorName : undefined
    );
    setApplyJobFlow(null);
    setSop('');
    setScreeningAnswers({});
    setVideoUrl('');
    setFypThesisTitle('');
    setFypAdvisorName('');
    setActiveSubpage('applications');
  };

  const handleSaveEdit = () => {
    if (showEditModal) {
      editApplication(showEditModal.id, editCv, editSop, editEmail, editPhone);
      setShowEditModal(null);
    }
  };

  const handleUploadOfferLetter = (appId: string) => {
    if (!uploadedFile) return;
    uploadOfferLetter(appId, uploadedFile);
    setShowUploadSuccessModal({ fileName: uploadedFile });
    setUploadedFile('');
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    currentStudent.phone = profPhone;
    currentStudent.skills = profSkills.split(',').map(s => s.trim());
    currentStudent.achievements = profAchievements.split(',').map(s => s.trim());
    setProfToast(true);
    setTimeout(() => setProfToast(false), 3000);
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
      {/* 1. DASHBOARD SUBPAGE (Matches Screenshot 2 layout!) */}
      {activeSubpage === 'dashboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Top Row: Welcome Card + Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            {/* Student Profile Card */}
            <div className="dashboard-card" style={{ display: 'flex', gap: '20px', alignItems: 'center', height: '100%', margin: 0 }}>
              <img src={currentStudent?.avatar} alt={currentStudent?.name} className="user-avatar" style={{ width: '80px', height: '80px', border: '3px solid var(--color-primary)' }} />
              <div>
                <span className="badge badge-shortlisted" style={{ marginBottom: '8px' }}>Actively Seeking</span>
                <h3 style={{ fontSize: '22px', fontWeight: 'bold' }}>Welcome back, {currentStudent?.name}! 👋</h3>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  {loggedInUser?.subText || 'Computer Science • Year 3'} • Student ID: {currentStudent?.matricNumber}
                </p>
                <button
                  onClick={() => setActiveSubpage('profile')}
                  style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', marginTop: '12px', padding: 0 }}
                >
                  View Profile →
                </button>
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="dashboard-card" style={{ height: '100%', margin: 0 }}>
              <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '16px' }}>Quick Actions</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <button className="quick-action-btn-dashboard" onClick={() => setActiveSubpage('jobs')}>
                  <span className="qa-icon" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)' }}>🔍</span>
                  <span className="qa-lbl">Apply Internship</span>
                </button>
                <button className="quick-action-btn-dashboard" onClick={() => setActiveSubpage('portfolio')}>
                  <span className="qa-icon" style={{ backgroundColor: 'hsl(142, 76%, 95%)', color: 'var(--status-offered)' }}>📤</span>
                  <span className="qa-lbl">Upload Portfolio</span>
                </button>
                <button className="quick-action-btn-dashboard" onClick={() => setActiveSubpage('interviews')}>
                  <span className="qa-icon" style={{ backgroundColor: 'hsl(45, 93%, 92%)', color: 'var(--status-interview)' }}>📅</span>
                  <span className="qa-lbl">Book Interview</span>
                </button>
                <button className="quick-action-btn-dashboard" onClick={() => setActiveSubpage('messages')}>
                  <span className="qa-icon" style={{ backgroundColor: 'hsl(262, 83%, 95%)', color: 'var(--status-screening)' }}>💬</span>
                  <span className="qa-lbl">Messages</span>
                </button>
              </div>
            </div>
          </div>

          {/* Middle Row: My Internship Applications + Application Screening */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            {/* My Internship Applications Card */}
            <div className="dashboard-card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>My Internship Applications</h4>
                <button onClick={() => setActiveSubpage('applications')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  View All →
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {myApps.slice(0, 2).map(app => {
                  const job = jobs.find(j => j.id === app.jobId);
                  return (
                    <div key={app.id} style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px', backgroundColor: 'var(--bg-app)', padding: '6px', borderRadius: '6px' }}>🏢</span>
                        <div>
                          <h5 style={{ fontSize: '14px', fontWeight: 700 }}>{job?.companyName}</h5>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{job?.title}</span>
                        </div>
                      </div>
                      <span className={`badge badge-${app.status.toLowerCase().replace(/ /g, '-')}`}>
                        {app.status === 'Screening' ? 'Under Review' : app.status === 'Interview' ? 'Interview Scheduled' : app.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Application Screening Card */}
            <div className="dashboard-card" style={{ margin: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '15px', fontWeight: 700 }}>Application Screening</h4>
                <button onClick={() => setActiveSubpage('assessments')} style={{ background: 'none', border: 'none', color: 'var(--color-primary)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}>
                  Continue →
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>
                    <span>Coding Assessment</span>
                    <span>100%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--status-offered)' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>
                    <span>Video Introduction</span>
                    <span>70%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '70%', height: '100%', backgroundColor: 'var(--color-primary)' }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px', fontWeight: 600 }}>
                    <span>Personality Test</span>
                    <span>100%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', backgroundColor: 'var(--status-offered)' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: 4 Dashboard Detail Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {/* Upcoming Interview */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <h5 style={{ fontSize: '13px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>Upcoming Interview</h5>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Company</p>
              <p style={{ fontSize: '13px', fontWeight: 700 }}>IJM Corporation</p>
              <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>
                <p>Date: <strong>15 Jun 2026 (Mon)</strong></p>
                <p>Time: <strong>10:00 AM</strong></p>
                <p>Mode: <strong>Online (Google Meet)</strong></p>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                <button className="btn btn-secondary" style={{ flex: 1, padding: '4px 0', fontSize: '10px' }} onClick={() => setActiveSubpage('interviews')}>View Details</button>
                <button className="btn btn-primary" style={{ flex: 1, padding: '4px 0', fontSize: '10px' }} onClick={() => setActiveSubpage('interviews')}>Reschedule</button>
              </div>
            </div>

            {/* Weekly Progress */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h5 style={{ fontSize: '13px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Weekly Progress</h5>
                <button onClick={() => setActiveSubpage('logbook')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '10px', fontWeight: 600 }}>View All →</button>
              </div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--status-offered)', marginBottom: '8px' }}>Week 3 Progress</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11px' }}>
                <p>✓ Completed Mobile UI Design</p>
                <p>✓ Implemented Login API</p>
                <p>✓ Fixed Notification Module</p>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '6px 0', fontSize: '11px', marginTop: '12px' }} onClick={() => setActiveSubpage('logbook')}>
                Add Weekly Log
              </button>
            </div>

            {/* Offer Letter */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <h5 style={{ fontSize: '13px', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '10px', fontWeight: 700 }}>Offer Letter</h5>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '24px' }}>📄</span>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700 }}>OfferLetter_IJM.pdf</p>
                  <p style={{ fontSize: '9px', color: 'var(--color-text-muted)' }}>Uploaded 16 May 2026</p>
                </div>
              </div>
              <span className="badge badge-kiv" style={{ fontSize: '10px', padding: '2px 8px', marginBottom: '12px' }}>Pending Verification</span>
              <button className="btn btn-secondary" style={{ width: '100%', padding: '6px 0', fontSize: '11px', marginTop: '4px' }} onClick={() => setActiveSubpage('offer-letter')}>
                View Details
              </button>
            </div>

            {/* Messages Card */}
            <div className="dashboard-card" style={{ margin: 0, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <h5 style={{ fontSize: '13px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Messages</h5>
                <button onClick={() => setActiveSubpage('messages')} style={{ border: 'none', background: 'none', color: 'var(--color-primary)', fontSize: '10px', fontWeight: 600 }}>View All →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: '4px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 700 }}>Career Center</p>
                  <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>We verified your application...</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 700 }}>IJM HR</p>
                  <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>Please select an interview slot...</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Banner */}
          <div className="dashboard-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-primary-light)', border: '1px solid var(--color-primary)', margin: 0, padding: '20px 24px' }}>
            <div>
              <h4 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)' }}>Keep Going!</h4>
              <p style={{ fontSize: '13px', color: 'var(--color-text-main)', marginTop: '4px' }}>You're one step closer to your dream internship.</p>
            </div>
            <button className="btn btn-primary" onClick={() => setActiveSubpage('jobs')}>Explore Opportunities</button>
          </div>

        </div>
      )}

      {/* 2. MY APPLICATIONS SUBPAGE */}
      {activeSubpage === 'applications' && (
        <div>
          {selectedAppId === null ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>My Applications</h3>
                <div className="dashboard-card" style={{ padding: '0px', overflow: 'hidden', margin: 0 }}>
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <span className="form-label" style={{ margin: 0 }}>Filter Status:</span>
                      <select
                        className="form-input"
                        style={{ padding: '6px 12px' }}
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Applied">Applied</option>
                        <option value="Screening">Screening / Under Review</option>
                        <option value="Interview">Interview Scheduled</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Offered">Offered</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Withdrawn">Withdrawn</option>
                        <option value="Awaiting Offer Verification">Awaiting Verification</option>
                        <option value="Approved">Approved</option>
                      </select>
                    </div>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '13px' }}
                      onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                    >
                      Sort: {sortOrder === 'desc' ? '📅 Newest First' : '📅 Oldest First'}
                    </button>
                  </div>

                  {filteredApps.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
                      No applications found matching filter.
                    </div>
                  ) : (
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Job Position</th>
                          <th>Company</th>
                          <th>Submitted Date</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredApps.map(app => {
                          const job = jobs.find(j => j.id === app.jobId);
                          return (
                            <tr key={app.id}>
                              <td style={{ fontWeight: 600 }}>{job?.title}</td>
                              <td>{job?.companyName}</td>
                              <td>{app.submissionDate}</td>
                              <td>
                                <span className={`badge badge-${app.status.toLowerCase().replace(/ /g, '-')}`}>
                                  {app.status}
                                </span>
                              </td>
                              <td>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <button
                                    className="btn btn-primary"
                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                    onClick={() => setSelectedAppId(app.id)}
                                  >
                                    🔍 Track & Manage
                                  </button>
                                  {app.status !== 'Withdrawn' && app.status !== 'Rejected' && (
                                    <button
                                      className="btn btn-danger"
                                      style={{ padding: '6px 12px', fontSize: '12px' }}
                                      onClick={() => setShowWithdrawModal(app.id)}
                                    >
                                      🚫 Withdraw
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>

              {/* Job Search & Application Suggestions Section */}
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Search for a Job to Apply</h3>
                <div className="dashboard-card" style={{ margin: 0, padding: '20px' }}>
                  {/* Search Bar */}
                  <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                    <div style={{ position: 'relative', flex: 1 }}>
                      <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)', fontSize: '14px' }}>🔍</span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="Search jobs by position, company, or required skills..."
                        style={{ paddingLeft: '36px', margin: 0 }}
                        value={jobQuery}
                        onChange={e => setJobQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Suggestion list */}
                  {(() => {
                    const filteredSuggestions = jobs
                      .filter(j => j.isApproved)
                      .filter(j => {
                        if (!jobQuery) return true;
                        const query = jobQuery.toLowerCase();
                        return (
                          j.title.toLowerCase().includes(query) ||
                          j.companyName.toLowerCase().includes(query) ||
                          j.scope.toLowerCase().includes(query) ||
                          j.requiredSkills.some(skill => skill.toLowerCase().includes(query))
                        );
                      });

                    if (filteredSuggestions.length === 0) {
                      return (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '13px' }}>
                          No job postings found matching your search.
                        </div>
                      );
                    }

                    return (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                        {filteredSuggestions.map(job => {
                          const hasMatchingTags = job.specializationTags.some(tag =>
                            currentStudent?.skills.some(skill => skill.toLowerCase().includes(tag.toLowerCase()))
                          );
                          const alreadyApplied = myApps.some(a => a.jobId === job.id && a.status !== 'Withdrawn');

                          return (
                            <div key={job.id} className={`dashboard-card ${hasMatchingTags ? 'recommend-card-gold' : ''}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', margin: 0, border: '1px solid var(--color-border)', borderRadius: '12px', padding: '16px', cursor: 'pointer' }} onClick={() => setViewJobModal(job)}>
                              <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '24px' }}>🏢</span>
                                    {job.isFypCollaboration && (
                                      <span className="badge badge-shortlisted" style={{ fontSize: '10px', backgroundColor: 'hsl(265, 80%, 94%)', color: 'var(--color-primary)', border: '1px solid hsl(265, 80%, 85%)' }}>
                                        🎓 Combined FYP
                                      </span>
                                    )}
                                  </div>
                                  <span className="badge badge-applied" style={{ fontSize: '10px' }}>{job.duration}</span>
                                </div>
                                <h4 style={{ fontSize: '15px', fontWeight: 'bold', margin: '0 0 4px 0' }}>{job.title}</h4>
                                <p style={{ color: 'var(--color-primary)', fontSize: '13px', fontWeight: 600, margin: '0 0 8px 0' }}>{job.companyName}</p>
                                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: '1.4', margin: 0 }}>{job.scope.length > 120 ? `${job.scope.slice(0, 120)}...` : job.scope}</p>

                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '10px' }}>
                                  {job.requiredSkills.slice(0, 3).map(skill => (
                                    <span key={skill} style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: 'var(--color-primary-light, #eff6ff)', color: 'var(--color-primary)', borderRadius: '4px' }}>
                                      {skill}
                                    </span>
                                  ))}
                                  {job.requiredSkills.length > 3 && (
                                    <span style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '4px' }}>
                                      +{job.requiredSkills.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                                <button className="btn btn-secondary" style={{ flex: 1, padding: '6px 0', fontSize: '11px' }} onClick={(e) => { e.stopPropagation(); setViewJobModal(job); }}>Details</button>
                                <button
                                  className="btn btn-primary"
                                  style={{ flex: 1, padding: '6px 0', fontSize: '11px' }}
                                  onClick={(e) => { e.stopPropagation(); setApplyJobFlow(job); }}
                                  disabled={alreadyApplied}
                                >
                                  {alreadyApplied ? '✓ Applied' : 'Apply Now'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          ) : (
            (() => {
              const app = applications.find(a => a.id === selectedAppId);
              if (!app) return null;
              const job = jobs.find(j => j.id === app.jobId);
              const isBeforeDeadline = new Date().getTime() < new Date(job?.deadline || '').getTime();

              return (
                <div className="dashboard-card slide-up">
                  <button className="btn btn-secondary" style={{ marginBottom: '16px' }} onClick={() => setSelectedAppId(null)}>
                    ← Back to List
                  </button>

                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>
                    {job?.title} @ {job?.companyName}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '13px', marginBottom: '24px' }}>
                    Application Submitted on <strong>{app.submissionDate}</strong> • Deadline: <strong>{job?.deadline}</strong>
                  </p>

                  <div className="dashboard-card" style={{ backgroundColor: '#f8fafc' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                      Application Progress Tracker
                    </h4>
                    <Stepper status={app.status} />
                  </div>

                  {job?.isFypCollaboration && (
                    <div className="dashboard-card" style={{ borderLeft: '4px solid var(--color-primary)', backgroundColor: 'hsl(265, 80%, 98%)', marginTop: '20px' }}>
                      <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '12px', color: 'var(--color-primary)' }}>🎓 Combined FYP Supervision Details</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <p style={{ fontSize: '13px', marginBottom: '4px' }}><strong>Proposed Thesis Title:</strong></p>
                          <p style={{ fontSize: '13px', color: 'var(--color-text-main)', fontWeight: 600 }}>{app.fypThesisTitle || 'Not specified'}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: '13px', marginBottom: '4px' }}><strong>Academic Advisor:</strong></p>
                          <p style={{ fontSize: '13px', color: 'var(--color-text-main)', fontWeight: 600 }}>{app.fypAdvisorName || 'Not assigned'}</p>
                        </div>
                      </div>
                      <div style={{ marginTop: '12px', borderTop: '1px solid var(--color-border)', paddingTop: '8px' }}>
                        <span style={{ fontSize: '11.5px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Corporate Research Milestones Mapped:</span>
                        <ul style={{ margin: '6px 0 0 16px', padding: 0, fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {job?.fypMilestones?.map((m, idx) => (
                            <li key={idx}><strong>M{idx + 1}:</strong> {m}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {app.status === 'Interview' && (
                    <div className="international-banner" style={{ background: 'hsl(45, 93%, 95%)', borderLeft: '5px solid var(--status-interview)' }}>
                      <span>🎉 You have been selected for an Interview! Please book your slot.</span>
                      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setActiveSubpage('interviews')}>
                        Book Interview Slot
                      </button>
                    </div>
                  )}

                  <div className="form-grid" style={{ marginTop: '24px' }}>
                    <div className="dashboard-card" style={{ margin: 0 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>📁 Digital Offer Letter Upload</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        Restrict formats strictly to PDF, PNG, and JPEG files up to 10MB.
                      </p>

                      {app.offerLetterName ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <div style={{ backgroundColor: 'var(--color-primary-light, #eff6ff)', padding: '12px', borderRadius: '6px', border: '1px solid var(--color-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', color: 'var(--color-primary)' }}>📄 {app.offerLetterName}</span>
                            <span className={`badge ${app.status === 'Approved' ? 'badge-offered' : 'badge-interview'}`} style={{ backgroundColor: app.status === 'Approved' ? 'var(--status-offered)' : '' }}>
                              {app.status === 'Approved' ? 'Verified by Lecturer' : 'Pending Verification'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '11px' }} onClick={() => setActiveSubpage('offer-letter')}>
                              ✉️ View Offer Page →
                            </button>
                            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                              Status: <strong>{app.status === 'Approved' ? '✅ Verified by Lecturer' : '⏳ Pending'}</strong>
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                          <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            style={{ display: 'none' }}
                            id="offer-upload"
                            onChange={(e) => {
                              const files = e.target.files;
                              if (files && files.length > 0) {
                                setUploadedFile(files[0].name);
                              }
                            }}
                          />
                          <label
                            htmlFor="offer-upload"
                            style={{ border: '2px dashed var(--color-border)', borderRadius: '6px', padding: '24px', textAlign: 'center', cursor: 'pointer', display: 'block', backgroundColor: 'var(--bg-app)' }}
                          >
                            {uploadedFile ? `Selected: ${uploadedFile}` : 'Click to Browse (Simulated PDF/PNG/JPEG)'}
                          </label>
                          <button
                            className="btn btn-primary"
                            onClick={() => handleUploadOfferLetter(app.id)}
                            disabled={!uploadedFile}
                          >
                            Upload and Verify Offer
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="dashboard-card" style={{ margin: 0 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>⚙️ Submission Settings</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                        Modify details or retract your application. Edits lock after deadline.
                      </p>

                      <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                        {isBeforeDeadline ? (
                          <button
                            className="btn btn-secondary"
                            onClick={() => {
                              setEditSop(app.statementOfPurpose);
                              setEditCv(app.cvName);
                              setEditEmail(app.contactEmail);
                              setEditPhone(app.contactPhone);
                              setShowEditModal(app);
                            }}
                          >
                            ✏️ Edit Application Details
                          </button>
                        ) : (
                          <div style={{ backgroundColor: 'var(--bg-input)', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            🔒 Edits Locked (Job Deadline Passed)
                          </div>
                        )}

                        {app.status !== 'Withdrawn' && app.status !== 'Rejected' && (
                          <button
                            className="btn btn-danger"
                            onClick={() => setShowWithdrawModal(app.id)}
                            disabled={!isBeforeDeadline}
                          >
                            🚫 Withdraw Application
                          </button>
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

      {/* 3. PORTFOLIO SUBPAGE */}
      {activeSubpage === 'portfolio' && (
        <div className="dashboard-card" style={{ maxWidth: '700px' }}>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>My Interactive Portfolio</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
            Configure your developer profile. These details are used to auto-score matching job listings.
          </p>

          <form onSubmit={handleSaveProfile}>
            <div className="form-group">
              <label className="form-label">Phone Contact:</label>
              <input type="text" className="form-input" value={profPhone} onChange={e => setProfPhone(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Core Technical Skills (comma separated):</label>
              <textarea className="form-input" rows={2} value={profSkills} onChange={e => setProfSkills(e.target.value)} />
            </div>

            <div className="form-group">
              <label className="form-label">Achievements & Certifications (comma separated):</label>
              <textarea className="form-input" rows={2} value={profAchievements} onChange={e => setProfAchievements(e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Save Portfolio Settings
            </button>
          </form>

          {profToast && (
            <div style={{ backgroundColor: 'var(--status-offered)', color: 'white', padding: '10px', borderRadius: '4px', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>
              ✓ Portfolio settings updated! Scores will synchronize.
            </div>
          )}
        </div>
      )}

      {/* 4. ASSESSMENTS SUBPAGE */}
      {activeSubpage === 'assessments' && (
        <div className="dashboard-card">
          <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Student Assessments & Screening Tests</h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
            Complete the tests requested by your applied employers.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '20px' }}>
              <span className="badge badge-offered" style={{ marginBottom: '10px' }}>Completed</span>
              <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Coding Technical Assessment</h4>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '8px 0' }}>Duration: 60 minutes. Basic Data Structures and Algorithm analysis.</p>
              <button className="btn btn-secondary" disabled style={{ width: '100%' }}>Test Completed (Score: 100%)</button>
            </div>

            <div style={{ border: '1px solid var(--color-border)', borderRadius: '10px', padding: '20px' }}>
              <span className="badge badge-interview" style={{ marginBottom: '10px' }}>In Progress</span>
              <h4 style={{ fontSize: '16px', fontWeight: 700 }}>Video Introduction Interview</h4>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '8px 0' }}>Submit a 60-second video explaining your profile strengths.</p>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setActiveSubpage('applications')}>Continue Video Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* 5. INTERVIEWS BOOKING SUBPAGE */}
      {activeSubpage === 'interviews' && (
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Book Interview Timeslots</h3>

          <div className="form-grid">
            <div className="dashboard-card" style={{ margin: 0 }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>📅 Available Slots</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {interviewSlots.filter(slot => !slot.bookedBy).map(slot => (
                  <div key={slot.id} style={{ border: '1px solid var(--color-border)', padding: '12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{slot.companyName}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Date: {slot.date} at {slot.time}</p>
                    </div>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                      onClick={() => {
                        bookInterviewSlot(slot.id, studentId);
                        setShowBookingToast(true);
                        setTimeout(() => setShowBookingToast(false), 3000);
                      }}
                    >
                      Book Slot
                    </button>
                  </div>
                ))}
              </div>
              {showBookingToast && (
                <div style={{ backgroundColor: 'var(--status-offered)', color: 'white', padding: '10px', borderRadius: '4px', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>
                  ✓ Booking Confirmed! Sync complete.
                </div>
              )}
            </div>

            <div className="dashboard-card" style={{ margin: 0 }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>🔒 My Booked Appointments</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {interviewSlots.filter(slot => slot.bookedBy === studentId).map(slot => (
                  <div key={slot.id} style={{ border: '1px solid var(--color-primary)', backgroundColor: 'var(--color-primary-light)', padding: '12px', borderRadius: '6px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>{slot.companyName}</h4>
                    <p style={{ fontSize: '12px' }}>Confirmed: <strong>{slot.date} at {slot.time}</strong></p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>✓ Synchronized with university core calendar.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. WEEKLY PROGRESS LOGBOOK */}
      {activeSubpage === 'logbook' && (
        <div className="form-grid">
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Digital Progress Gauge</h3>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                <svg width="100%" height="100%" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="15.915" fill="transparent" stroke="#f1f5f9" strokeWidth="3" />
                  <circle
                    cx="20"
                    cy="20"
                    r="15.915"
                    fill="transparent"
                    stroke="var(--color-primary)"
                    strokeWidth="3"
                    strokeDasharray={`${progressPercent} ${100 - progressPercent}`}
                    strokeDashoffset="25"
                    strokeLinecap="round"
                    style={{ transition: 'stroke-dasharray 0.5s ease' }}
                  />
                </svg>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                  <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{progressPercent}%</span>
                  <span style={{ display: 'block', fontSize: '9px', color: 'var(--color-text-muted)' }}>Hours Logged</span>
                </div>
              </div>
              <p style={{ fontSize: '14px' }}>Logged <strong>{totalHours}</strong> / 120 required placement hours.</p>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '24px', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>📝 Log Weekly Progress</h4>

              <div className="form-group">
                <span className="form-label">Hours Worked this Week:</span>
                <input type="number" className="form-input" value={hours} onChange={e => setHours(Number(e.target.value))} min={1} max={80} />
              </div>

              <div className="form-group">
                <span className="form-label">Completed Tasks & Tasks Accomplished:</span>
                <textarea className="form-input" rows={3} placeholder="Detail what tasks you worked on..." value={tasks} onChange={e => setTasks(e.target.value)} />
              </div>

              <div className="form-group">
                <span className="form-label">Self-Evaluation / Milestone Check:</span>
                <input type="text" className="form-input" placeholder="e.g. Mastered local state hooks, drafted CSS" value={milestone} onChange={e => setMilestone(e.target.value)} />
              </div>

              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={() => {
                  if (!tasks || !milestone) return;
                  addLogbookEntry(studentId, hours, tasks, milestone);
                  setTasks('');
                  setMilestone('');
                  setShowLogToast(true);
                  setTimeout(() => setShowLogToast(false), 3000);
                }}
              >
                Submit Weekly Entry
              </button>

              {showLogToast && (
                <div style={{ backgroundColor: 'var(--status-offered)', color: 'white', padding: '10px', borderRadius: '4px', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>
                  ✓ Logbook entry saved successfully!
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Digital Logbook Matrix</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {loggedWeeks.map(le => (
                <div key={le.id} style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', backgroundColor: le.isLocked ? '#f8fafc' : '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Week {le.weekNumber} Log</h4>
                    {le.isLocked ? <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>🔒 Locked</span> : <span style={{ fontSize: '11px', color: 'var(--status-offered)', fontWeight: 600 }}>✏️ Editable</span>}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Logged: <strong>{le.workingHours} Hours</strong></p>
                  <p style={{ fontSize: '13px', marginTop: '6px' }}><strong>Tasks:</strong> {le.tasksCompleted}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 7. OFFER LETTER SUBPAGE */}
      {activeSubpage === 'offer-letter' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          <div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, fontFamily: 'var(--font-display)', marginBottom: '4px' }}>Offer Letter & Verification Status</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
              Check your clearance status for academic relevance, insurance validation, visa clearances, and payment models.
            </p>
          </div>

          {myApps.filter(a => a.status === 'Offered' || a.status === 'Awaiting Offer Verification' || a.status === 'Approved').map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            const chk = checklists[app.id] || { insurance: 'Pending', visa: 'Pass', payModel: 'Pending', csRelevance: 'Pending' };
            const isVerified = app.status === 'Approved';

            const getPillarBadgeStyle = (status: 'Pass' | 'Fail' | 'Pending') => {
              if (status === 'Pass') return { border: '1px solid #22c55e', backgroundColor: '#f0fdf4', color: '#16a34a' };
              if (status === 'Fail') return { border: '1px solid #ef4444', backgroundColor: '#fef2f2', color: '#dc2626' };
              return { border: '1px solid #94a3b8', backgroundColor: '#f1f5f9', color: '#475569' };
            };

            return (
              <div key={app.id} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Main Overview Panel */}
                <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '20px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: 'var(--color-primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Corporate Placement Offer</span>
                      <h4 style={{ fontSize: '22px', fontWeight: 800, margin: '4px 0 6px 0' }}>{job?.companyName}</h4>
                      <p style={{ fontSize: '14px', color: 'var(--color-text-muted)' }}>
                        Position: <strong>{job?.title}</strong> • Duration: <strong>{job?.duration}</strong>
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block', marginBottom: '4px' }}>Lecturer Review Status</span>
                      <span
                        className={`badge`}
                        style={{
                          fontSize: '13px',
                          padding: '6px 16px',
                          borderRadius: '20px',
                          fontWeight: 700,
                          backgroundColor: isVerified ? 'var(--status-offered)' : '#fef3c7',
                          color: isVerified ? '#ffffff' : '#b45309',
                          border: isVerified ? 'none' : '1px solid #f59e0b'
                        }}
                      >
                        {isVerified ? '✅ Verified by Lecturer' : '⏳ Pending Vetting'}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '28px' }}>📄</span>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{app.offerLetterName || 'Offer_Letter_Document.pdf'}</p>
                        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>Uploaded on {app.submissionDate}</p>
                      </div>
                    </div>
                    <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '12px' }} onClick={() => setActiveSubpage('applications')}>
                      ⚙️ Manage Document / Re-upload
                    </button>
                  </div>
                </div>

                {/* Checklist Clearance Matrix */}
                <div>
                  <h4 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '14px' }}>Clearance Checklist Pillars</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>

                    {/* CS Academic Relevance */}
                    <div className="dashboard-card" style={{ margin: 0, padding: '16px', border: '1px solid var(--color-border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '24px' }}>🎓</span>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', ...getPillarBadgeStyle(chk.csRelevance) }}>
                            {chk.csRelevance}
                          </span>
                        </div>
                        <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px 0' }}>Academic Core Relevance</h5>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.4', margin: 0 }}>
                          Evaluates if the job scope and daily tech tasks align with the university Computer Science curriculum standards.
                        </p>
                      </div>
                      <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--color-border)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        <strong>Feedback:</strong> {chk.csRelevance === 'Pass' ? 'Software engineering tasks mapped directly.' : 'Awaiting advisor syllabus confirmation review.'}
                      </div>
                    </div>

                    {/* Pay Model Check */}
                    <div className="dashboard-card" style={{ margin: 0, padding: '16px', border: '1px solid var(--color-border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '24px' }}>💵</span>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', ...getPillarBadgeStyle(chk.payModel) }}>
                            {chk.payModel}
                          </span>
                        </div>
                        <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px 0' }}>Stipend & Pay Model Check</h5>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.4', margin: 0 }}>
                          Ensures basic allowance conditions are met and compliant with the university's RM 1,000 minimum stipend guidelines.
                        </p>
                      </div>
                      <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--color-border)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        <strong>Feedback:</strong> {chk.payModel === 'Pass' ? 'Monthly basic stipend verified.' : 'Awaiting confirmation of monthly allowance terms.'}
                      </div>
                    </div>

                    {/* Insurance validation */}
                    <div className="dashboard-card" style={{ margin: 0, padding: '16px', border: '1px solid var(--color-border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '24px' }}>🛡️</span>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', ...getPillarBadgeStyle(chk.insurance) }}>
                            {chk.insurance}
                          </span>
                        </div>
                        <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px 0' }}>Insurance Coverage Validation</h5>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.4', margin: 0 }}>
                          Confirms the student is covered under group medical and workplace hazard liability policies.
                        </p>
                      </div>
                      <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--color-border)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        <strong>Feedback:</strong> {chk.insurance === 'Pass' ? 'Group policy coverage certified.' : 'Awaiting employer insurance verification certificate.'}
                      </div>
                    </div>

                    {/* Visa & Work Clearances */}
                    <div className="dashboard-card" style={{ margin: 0, padding: '16px', border: '1px solid var(--color-border)', borderRadius: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{ fontSize: '24px' }}>🛂</span>
                          <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', ...getPillarBadgeStyle(chk.visa) }}>
                            {chk.visa}
                          </span>
                        </div>
                        <h5 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 6px 0' }}>Visa & Workplace Clearance</h5>
                        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: '1.4', margin: 0 }}>
                          Verifies work permits or visa documentation compliance, essential for international placement permissions.
                        </p>
                      </div>
                      <div style={{ marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--color-border)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        <strong>Feedback:</strong> {chk.visa === 'Pass' ? 'Work permissions cleared.' : 'Awaiting international clearance validation.'}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}

          {myApps.filter(a => a.status === 'Offered' || a.status === 'Awaiting Offer Verification' || a.status === 'Approved').length === 0 && (
            <div className="dashboard-card" style={{ textAlign: 'center', padding: '48px 24px', margin: 0 }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>✉️</span>
              <p style={{ fontStyle: 'italic', color: 'var(--color-text-muted)', fontSize: '14px', margin: '0 0 16px 0' }}>
                No offer letters uploaded or pending yet.
              </p>
              <button className="btn btn-primary" onClick={() => setActiveSubpage('applications')} style={{ fontSize: '12px' }}>
                Go to Applications to Upload
              </button>
            </div>
          )}
        </div>
      )}

      {/* 8. REVIEWS SUBPAGE */}
      {activeSubpage === 'reviews' && (
        <div className="form-grid">
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Share Placement Review</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Submit a rating and milestone review for your completed placement.
            </p>

            <div className="form-group">
              <span className="form-label">Select Placement:</span>
              <select className="form-input" onChange={() => setSelectedCompany({ id: 'c_techcorp', name: 'TechCorp Solutions' })}>
                <option value="">-- Select Completed Placement --</option>
                <option value="c_techcorp">TechCorp Solutions (Completed May 2026)</option>
              </select>
            </div>

            {selectedCompany && (
              <div className="slide-up">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '20px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="form-label">Overall Experience:</span>
                    <RatingStars rating={ratingOverall} onChange={setRatingOverall} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="form-label">Workplace Culture:</span>
                    <RatingStars rating={ratingCulture} onChange={setRatingCulture} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="form-label">Learning Curve:</span>
                    <RatingStars rating={ratingLearning} onChange={setRatingLearning} />
                  </div>
                </div>

                <div className="form-group">
                  <span className="form-label">Detailed Written Review:</span>
                  <textarea className="form-input" rows={4} value={reviewText} onChange={e => setReviewText(e.target.value)} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <input type="checkbox" id="anon" checked={anonymize} onChange={e => setAnonymize(e.target.checked)} />
                  <label htmlFor="anon" style={{ fontSize: '13px', cursor: 'pointer' }}>Anonymize my review</label>
                </div>

                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => {
                    submitReview(studentId, selectedCompany.id, selectedCompany.name, { overall: ratingOverall, culture: ratingCulture, learning: ratingLearning }, reviewText, anonymize);
                    setReviewText('');
                    setSelectedCompany(null);
                    setShowReviewToast(true);
                    setTimeout(() => setShowReviewToast(false), 3000);
                  }}
                >
                  Submit Review
                </button>
              </div>
            )}
            {showReviewToast && <p style={{ color: 'var(--status-offered)', fontSize: '12px', marginTop: '10px' }}>✓ Review submitted successfully!</p>}
          </div>

          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Public Feedback Portal</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reviews.map(rev => (
                <div key={rev.id} style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{rev.companyName}</h4>
                  <p style={{ fontSize: '12px', color: 'gold' }}>★ {rev.ratingOverall} / Culture: ★ {rev.ratingCulture} / Learning: ★ {rev.ratingLearning}</p>
                  <p style={{ fontSize: '13px', fontStyle: 'italic', marginTop: '6px' }}>"{rev.reviewText}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 9. MESSAGES SUBPAGE */}
      {activeSubpage === 'messages' && (
        <div className="dashboard-card" style={{ height: '550px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: '20px', padding: 0, overflow: 'hidden' }}>
          <div style={{ borderRight: '1px solid var(--color-border)', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 700, marginBottom: '10px' }}>Contacts</h4>
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
            {/* Chat Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--color-border)', fontWeight: 700 }}>
              {chatRecipient}
            </div>

            {/* Chat Body */}
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mockChats[chatRecipient]?.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start', backgroundColor: msg.sender === 'You' ? 'var(--color-primary-light)' : '#f1f5f9', padding: '10px 14px', borderRadius: '12px', maxWidth: '70%', border: msg.sender === 'You' ? '1px solid var(--color-primary)' : 'none' }}>
                  <p style={{ fontSize: '13px' }}>{msg.text}</p>
                  <span style={{ fontSize: '9px', color: 'var(--color-text-muted)', display: 'block', textAlign: 'right', marginTop: '4px' }}>{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid var(--color-border)', display: 'flex', gap: '10px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Type your message..."
                style={{ flex: 1 }}
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">Send</button>
            </form>
          </div>
        </div>
      )}

      {/* 10. PROFILE SUBPAGE */}
      {activeSubpage === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%' }}>
          {/* Main Info Card */}
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Student Profile Details</h3>
            <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '20px' }}>
              <img src={currentStudent.avatar} alt="Profile" className="user-avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-primary)' }} />
              <div>
                <h4 style={{ fontSize: '18px', fontWeight: 700 }}>{currentStudent.name}</h4>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>Matric ID: {currentStudent.matricNumber} | Year: Year 3</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Academic Record</p>
                <p style={{ fontSize: '15px', fontWeight: 600 }}>CGPA {currentStudent.cgpa}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Registered Email</p>
                <p style={{ fontSize: '15px', fontWeight: 600 }}>{currentStudent.email}</p>
              </div>
            </div>
          </div>

          {/* Resume Upload Section */}
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📄 Curriculum Vitae (CV) / Resume
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Upload your latest professional resume to share with prospective employers during applications.
            </p>

            {profileResume ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: 'var(--color-bg-alt, #f8fafc)', border: '1px solid var(--color-border)', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '24px' }}>📄</span>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{profileResume}</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>PDF Format • Auto-parsed for skill scoring</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href="#" onClick={(e) => { e.preventDefault(); alert("Simulating document preview for " + profileResume); }} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '12px', textDecoration: 'none' }}>
                    Preview
                  </a>
                  <button className="btn btn-danger" onClick={() => setProfileResume('')} style={{ padding: '6px 12px', fontSize: '12px' }}>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragOver(false);
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    setProfileResume(e.dataTransfer.files[0].name);
                  }
                }}
                style={{
                  border: isDragOver ? '2px dashed var(--color-primary)' : '2px dashed var(--color-border)',
                  backgroundColor: isDragOver ? 'var(--color-primary-light, #eff6ff)' : 'transparent',
                  borderRadius: '8px',
                  padding: '24px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease-in-out'
                }}
                onClick={() => document.getElementById('resume-file-input')?.click()}
              >
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>📤</span>
                <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px 0' }}>Drag & drop your resume here, or <span style={{ color: 'var(--color-primary)', textDecoration: 'underline' }}>browse files</span></p>
                <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: 0 }}>Supports PDF, DOCX (Max 5MB)</p>
                <input
                  type="file"
                  id="resume-file-input"
                  accept=".pdf,.docx,.doc"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setProfileResume(e.target.files[0].name);
                    }
                  }}
                />
              </div>
            )}
          </div>

          {/* Video Self-Introduction Section */}
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              🎥 Video Self-Introduction Pitch
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Record or upload a 1-minute video pitch to impress recruiters. Highlight your background, key strengths, and matching interests.
            </p>

            {recordingStatus !== 'idle' && recordingStatus !== 'finished' ? (
              <div style={{ position: 'relative', width: '100%', height: '240px', backgroundColor: '#0f172a', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                {recordingStatus === 'counting' && (
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 8px 0' }}>Simulating camera startup...</p>
                    <h1 style={{ fontSize: '64px', fontWeight: 800, margin: 0, color: 'var(--color-primary)' }}>{countdown}</h1>
                  </div>
                )}
                {recordingStatus === 'recording' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                      <span className="pulse" style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></span>
                      <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '0.05em' }}>🔴 RECORDING IN PROGRESS</span>
                    </div>
                    <p style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0' }}>Simulated Capture: {recordSeconds}s / 5s</p>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Smile at your camera to simulate pitching!</p>
                  </div>
                )}
              </div>
            ) : profileVideo ? (
              <div>
                <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden', backgroundColor: 'black', marginBottom: '16px' }}>
                  <video
                    src={profileVideo}
                    controls
                    style={{ width: '100%', display: 'block', maxHeight: '280px' }}
                  />
                  {recordingStatus === 'finished' && (
                    <div style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: 'var(--status-offered)', color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', zIndex: 10 }}>
                      ✓ Simulated Intro Recorded
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button className="btn btn-secondary" onClick={startVideoSimulation} style={{ flex: 1, padding: '8px 0', fontSize: '12px' }}>
                    🎥 Simulate Recording Again
                  </button>
                  <label className="btn btn-secondary" style={{ flex: 1, padding: '8px 0', fontSize: '12px', textAlign: 'center', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    📤 Upload Pitch Video
                    <input type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoUpload} />
                  </label>
                  <button className="btn btn-danger" onClick={() => { setProfileVideo(''); setRecordingStatus('idle'); }} style={{ padding: '8px 16px', fontSize: '12px' }}>
                    Remove
                  </button>
                </div>
                {videoUploadProgress !== null && (
                  <div style={{ marginTop: '10px', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                      <span>Uploading video...</span>
                      <span>{videoUploadProgress}%</span>
                    </div>
                    <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--color-border)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${videoUploadProgress}%`, backgroundColor: 'var(--color-primary)', transition: 'width 0.2s ease-in-out' }}></div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ border: '2px dashed var(--color-border)', borderRadius: '8px', padding: '32px', textAlign: 'center' }}>
                <span style={{ fontSize: '32px', display: 'block', marginBottom: '12px' }}>📹</span>
                <p style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 16px 0' }}>No intro video submitted yet</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                  <button className="btn btn-primary" onClick={startVideoSimulation} style={{ fontSize: '13px' }}>
                    🎥 Simulate Cam Recording
                  </button>
                  <label className="btn btn-secondary" style={{ fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    📤 Upload Pitch File
                    <input type="file" accept="video/*" style={{ display: 'none' }} onChange={handleVideoUpload} />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 11. SETTINGS SUBPAGE */}
      {activeSubpage === 'settings' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', width: '100%', alignItems: 'start' }}>
          
          {/* Notification and Preferences */}
          <div className="dashboard-card" style={{ margin: 0, padding: '24px' }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px', fontWeight: 700 }}>⚙️ Portal Preferences & Notifications</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Configure how you receive updates regarding job matching, interview schedules, and weekly logbook submission statuses.
            </p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-border)', paddingBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 4px 0' }}>Email Notifications</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Receive email alerts when employers message you or request interviews.</p>
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
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Show desktop push notifications for urgent application approvals or portal announcements.</p>
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
                  <h4 style={{ fontSize: '13.5px', fontWeight: 700, margin: '0 0 4px 0' }}>Automated Logbook Reminders</h4>
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Send auto-alerts to submit your weekly progress on Fridays if pending.</p>
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
                  <p style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', margin: 0 }}>Sync booked employer interviews and matching sessions to Google Calendar.</p>
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

      {/* 12. JOBS (DISCOVERY BOARD) SUBPAGE */}
      {activeSubpage === 'jobs' && (
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Available Internship Postings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {jobs.filter(j => j.isApproved).map(job => {
              const hasMatchingTags = job.specializationTags.some(tag =>
                currentStudent?.skills.some(skill => skill.toLowerCase().includes(tag.toLowerCase()))
              );

              return (
                <div key={job.id} className={`dashboard-card ${hasMatchingTags ? 'recommend-card-gold' : ''}`} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', margin: 0, cursor: 'pointer' }} onClick={() => setViewJobModal(job)}>
                  {hasMatchingTags && <span className="recommend-badge">⭐ Recommended Match</span>}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '28px' }}>🏢</span>
                        {job.isFypCollaboration && (
                          <span className="badge badge-shortlisted" style={{ fontSize: '10px', backgroundColor: 'hsl(265, 80%, 94%)', color: 'var(--color-primary)', border: '1px solid hsl(265, 80%, 85%)' }}>
                            🎓 Combined FYP
                          </span>
                        )}
                      </div>
                      <span className="badge badge-applied">{job.duration}</span>
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>{job.title}</h4>
                    <p style={{ color: 'var(--color-primary)', fontSize: '14px', fontWeight: 600 }}>{job.companyName}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px' }}>{job.scope}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                    <button className="btn btn-secondary" style={{ flex: 1, padding: '8px 0', fontSize: '12px' }} onClick={(e) => { e.stopPropagation(); setViewJobModal(job); }}>View Details</button>
                    <button
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '8px 0', fontSize: '12px' }}
                      onClick={(e) => { e.stopPropagation(); setApplyJobFlow(job); }}
                      disabled={myApps.some(a => a.jobId === job.id && a.status !== 'Withdrawn')}
                    >
                      {myApps.some(a => a.jobId === job.id && a.status !== 'Withdrawn') ? 'Applied' : 'Apply Now'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODALS WINDOWS */}
      {viewJobModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 className="modal-title">{viewJobModal.title}</h3>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>{viewJobModal.companyName}</h4>
              </div>
              {viewJobModal.isFypCollaboration && (
                <span className="badge" style={{ backgroundColor: 'hsl(265, 80%, 94%)', color: 'var(--color-primary)', border: '1px solid hsl(265, 80%, 85%)', fontSize: '12px', padding: '4px 10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  🎓 FYP Collaboration
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', marginBottom: '24px' }}>
              <div><strong>Duration:</strong> {viewJobModal.duration}</div>
              <div><strong>Scope:</strong><p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>{viewJobModal.scope}</p></div>
              <div><strong>Required Skills:</strong><div style={{ display: 'flex', gap: '6px' }}>{viewJobModal.requiredSkills.map(s => <span key={s} className="badge badge-applied">{s}</span>)}</div></div>
              
              {viewJobModal.isFypCollaboration && viewJobModal.fypMilestones && (
                <div style={{ marginTop: '12px', padding: '12px', borderLeft: '3px solid var(--color-primary)', backgroundColor: 'hsl(265, 80%, 98%)', borderRadius: '0 6px 6px 0' }}>
                  <h5 style={{ margin: '0 0 8px 0', fontWeight: 700, fontSize: '13px', color: 'var(--color-primary)' }}>🎓 Academic Research Milestones Mapped:</h5>
                  <ul style={{ margin: '0 0 0 16px', padding: 0, fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {viewJobModal.fypMilestones.map((milestone, idx) => (
                      <li key={idx}><strong>Milestone {idx + 1}:</strong> {milestone}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setViewJobModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Edit Submission</h3>
            <div className="form-group">
              <span className="form-label">Resume Name:</span>
              <input type="text" className="form-input" value={editCv} onChange={e => setEditCv(e.target.value)} />
            </div>
            <div className="form-group">
              <span className="form-label">Statement of Purpose:</span>
              <textarea className="form-input" rows={4} value={editSop} onChange={e => setEditSop(e.target.value)} />
            </div>
            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { handleSaveEdit(); }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title" style={{ color: 'var(--status-rejected)' }}>⚠️ Retract Submission</h3>
            <p className="modal-body">This action cannot be undone. Confirm retraction?</p>
            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setShowWithdrawModal(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => { withdrawApplication(showWithdrawModal); setShowWithdrawModal(null); setSelectedAppId(null); }}>Confirm Withdraw</button>
            </div>
          </div>
        </div>
      )}

      {applyJobFlow && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="modal-title">Apply for {applyJobFlow.title}</h3>
            <h4 style={{ color: 'var(--color-primary)', fontSize: '13px', margin: '-10px 0 16px 0' }}>{applyJobFlow.companyName}</h4>
            
            {applyJobFlow.isFypCollaboration && (
              <div style={{ padding: '12px 16px', backgroundColor: 'hsl(265, 80%, 97%)', border: '1px solid hsl(265, 80%, 90%)', borderRadius: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: '4px' }}>🎓 Combined FYP Collaboration Opportunity</span>
                <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                  This posting links your industry placement directly with your academic research. Please specify your proposed thesis topic and academic supervisor below. Milestones configured by the employer will align with your course evaluation structure.
                </span>
              </div>
            )}

            <div className="form-group">
              <span className="form-label">Statement of Purpose:</span>
              <textarea className="form-input" rows={3} value={sop} onChange={e => setSop(e.target.value)} />
            </div>
            {applyJobFlow.screeningQuestions?.map((q, idx) => (
              <div className="form-group" key={idx}>
                <span className="form-label">{idx + 1}. {q}</span>
                <textarea className="form-input" rows={2} value={screeningAnswers[idx] || ''} onChange={e => setScreeningAnswers({ ...screeningAnswers, [idx]: e.target.value })} />
              </div>
            ))}

            {applyJobFlow.isFypCollaboration && (
              <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h5 style={{ margin: 0, fontWeight: 700, fontSize: '13px' }}>Academic Supervision Integration</h5>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-label">Proposed Thesis / Project Title *</span>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Distributed Ledger Systems for Smart Supply Chain Logistics"
                    value={fypThesisTitle}
                    onChange={e => setFypThesisTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-label">Assigned Academic Advisor Name *</span>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. Dr. Lim Wei Ming"
                    value={fypAdvisorName}
                    onChange={e => setFypAdvisorName(e.target.value)}
                    required
                  />
                </div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11.5px', marginTop: '4px', cursor: 'pointer' }}>
                  <input type="checkbox" required style={{ marginTop: '2px' }} />
                  <span>I agree to align the corporate milestones (Literature Review, Mid-term Prototype, Final Defense) with my academic timeline under supervisor validation.</span>
                </label>
              </div>
            )}

            <div className="form-group" style={{ marginTop: '16px' }}>
              <span className="form-label">Video Pitch URL (e.g. simulated_pitch.mp4):</span>
              <input type="text" className="form-input" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
            </div>
            
            <div className="modal-buttons" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setApplyJobFlow(null)}>Cancel</button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  if (applyJobFlow.isFypCollaboration && (!fypThesisTitle || !fypAdvisorName)) {
                    alert('Please fill in both Proposed Thesis Title and Academic Advisor Name.');
                    return;
                  }
                  handleApply(applyJobFlow);
                }}
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {showUploadSuccessModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px', textAlign: 'center', padding: '32px 24px' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>🎉</span>
            <h3 className="modal-title" style={{ fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>Offer Submitted Successfully!</h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: '1.5', marginBottom: '24px' }}>
              Your offer letter <strong>{showUploadSuccessModal.fileName}</strong> has been successfully uploaded. The placement status is updated to <strong>"Awaiting Verification"</strong> pending lecturer review.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px 0', fontSize: '12px', fontWeight: 600 }}
                onClick={() => {
                  setShowUploadSuccessModal(null);
                  setActiveSubpage('offer-letter');
                }}
              >
                ✉️ Go to Offer Verification Page
              </button>
              <button
                className="btn btn-secondary"
                style={{ width: '100%', padding: '10px 0', fontSize: '12px' }}
                onClick={() => setShowUploadSuccessModal(null)}
              >
                Keep Tracking Here
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentPortal;