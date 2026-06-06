import React, { useState } from 'react';
import { usePortal } from '../context/PortalState';
import Stepper from '../components/Stepper';
import RatingStars from '../components/RatingStars';
import type { Application, Job } from '../types';

export const StudentPortal: React.FC = () => {
  const {
    students,
    jobs,
    applications,
    interviewSlots,
    logbookEntries,
    reviews,
    applyForJob,
    withdrawApplication,
    editApplication,
    bookInterviewSlot,
    addLogbookEntry,
    submitReview,
    uploadOfferLetter
  } = usePortal();

  // For simulation, assume student is Julian (s1)
  const studentId = 's1';
  const currentStudent = students.find(s => s.id === studentId);

  // Tab navigation
  const [activeTab, setActiveTab] = useState<'dashboard' | 'jobs' | 'logbook' | 'interviews' | 'feedback'>('dashboard');

  // Dashboard state
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Modals state
  const [showWithdrawModal, setShowWithdrawModal] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<Application | null>(null);
  const [viewJobModal, setViewJobModal] = useState<Job | null>(null);
  const [applyJobFlow, setApplyJobFlow] = useState<Job | null>(null);

  // Forms state
  const [sop, setSop] = useState('');
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({});
  const [videoUrl, setVideoUrl] = useState('');
  
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

  // Booking state toast
  const [showBookingToast, setShowBookingToast] = useState(false);

  // Offer letter simulation
  const [uploadedFile, setUploadedFile] = useState<string>('');

  const myApps = applications.filter(a => a.studentId === studentId);

  // Filters & Sorting
  const filteredApps = myApps
    .filter(a => statusFilter === 'All' || a.status === statusFilter)
    .sort((a, b) => {
      const dateA = new Date(a.submissionDate).getTime();
      const dateB = new Date(b.submissionDate).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Calculate logbook progress
  const loggedWeeks = logbookEntries.filter(le => le.studentId === studentId);
  const totalHours = loggedWeeks.reduce((sum, entry) => sum + entry.workingHours, 0);
  const progressPercent = Math.min(Math.round((totalHours / 120) * 100), 100); // assume 120 hours needed

  const handleApply = (job: Job) => {
    applyForJob(job.id, studentId, sop, screeningAnswers, videoUrl);
    setApplyJobFlow(null);
    setSop('');
    setScreeningAnswers({});
    setVideoUrl('');
    setActiveTab('dashboard');
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
    setUploadedFile('');
    alert('Offer letter uploaded successfully! Placement status transitioned to "Awaiting Offer Verification".');
  };

  return (
    <div className="slide-up">
      {/* Student Profile Overview Card */}
      <div className="dashboard-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '16px 24px' }}>
        <img src={currentStudent?.avatar} alt={currentStudent?.name} className="user-avatar" style={{ width: '60px', height: '60px' }} />
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Welcome back, {currentStudent?.name}!</h2>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Matric Card: <strong>{currentStudent?.matricNumber}</strong> • CGPA: <strong>{currentStudent?.cgpa}</strong> • Major: <strong>Software Engineering</strong>
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--color-border)', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {[
          { id: 'dashboard', label: '📋 My Dashboard' },
          { id: 'jobs', label: '🔍 Find Internship' },
          { id: 'logbook', label: '📖 Logbook' },
          { id: 'interviews', label: '📅 Book Interviews' },
          { id: 'feedback', label: '⭐ Share Feedback' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); setSelectedAppId(null); }}
            className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ borderRadius: '20px', padding: '8px 16px', fontSize: '13px', whiteSpace: 'nowrap' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABS VIEWPORT */}
      {activeTab === 'dashboard' && (
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>My Applications</h3>
          
          {selectedAppId === null ? (
            <div className="dashboard-card" style={{ padding: '0px', overflow: 'hidden' }}>
              {/* Toolbar */}
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
                    <option value="Screening">Screening</option>
                    <option value="Interview">Interview</option>
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
                  Sort Submission Date: {sortOrder === 'desc' ? '📅 Newest First' : '📅 Oldest First'}
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
                            <button
                              className="btn btn-primary"
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => setSelectedAppId(app.id)}
                            >
                              🔍 Track & Manage
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ) : (
            // App Detail Track & Manage Screen (PB-10.1, PB-29.1, PB-29.2, PB-40.1)
            (() => {
              const app = applications.find(a => a.id === selectedAppId);
              if (!app) return null;
              const job = jobs.find(j => j.id === app.jobId);
              
              // Deadline check
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

                  {/* Horizontal Stepper (PB-10.1) */}
                  <div className="dashboard-card" style={{ backgroundColor: '#f8fafc' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                      Application Progress Tracker
                    </h4>
                    <Stepper status={app.status} />
                  </div>

                  {/* Quick Status Notifications */}
                  {app.status === 'Interview' && (
                    <div className="international-banner" style={{ background: 'hsl(45, 93%, 95%)', borderLeft: '5px solid var(--status-interview)' }}>
                      <span>🎉 You have been selected for an Interview! Please book your slot.</span>
                      <button className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '12px' }} onClick={() => setActiveTab('interviews')}>
                        Book Interview Slot
                      </button>
                    </div>
                  )}

                  {app.status === 'Offered' && (
                    <div className="international-banner" style={{ background: 'hsl(142, 76%, 95%)', borderLeft: '5px solid var(--status-offered)' }}>
                      <span>🥳 **Congratulations!** You have received an internship offer letter. Please upload it to request coordinator clearance.</span>
                    </div>
                  )}

                  <div className="form-grid" style={{ marginTop: '24px' }}>
                    {/* Upload offer letter card */}
                    <div className="dashboard-card" style={{ margin: 0 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>📁 Digital Offer Letter Upload</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                        Restrict formats strictly to PDF, PNG, and JPEG files up to 10MB. (FR-40, PB-40.1)
                      </p>
                      
                      {app.offerLetterName ? (
                        <div style={{ backgroundColor: 'var(--color-primary-light)', padding: '12px', borderRadius: '6px', border: '1px solid var(--color-primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '13px', color: 'var(--color-primary)' }}>📄 {app.offerLetterName}</span>
                          <span className="badge badge-offered">Awaiting Verification</span>
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
                            Upload and Transition Status
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Manage Submission Card */}
                    <div className="dashboard-card" style={{ margin: 0 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>⚙️ Submission Settings</h4>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                        Modify details or retract your application. Edits are locked after deadline hits.
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
                            title={!isBeforeDeadline ? "Cannot withdraw after deadline has passed" : ""}
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

      {/* JOB BOARD VIEW (FR-04, FR-39, PB-03, PB-31, PB-32, PB-35.1) */}
      {activeTab === 'jobs' && (
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Available Internship Postings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {jobs.filter(j => j.isApproved).map(job => {
              // Pinned logic based on student specialization matching tags (PB-35.1)
              const hasMatchingTags = job.specializationTags.some(tag => 
                currentStudent?.skills.some(skill => skill.toLowerCase().includes(tag.toLowerCase()))
              );
              
              return (
                <div 
                  key={job.id} 
                  className={`dashboard-card ${hasMatchingTags ? 'recommend-card-gold' : ''}`}
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', margin: 0 }}
                >
                  {hasMatchingTags && (
                    <span className="recommend-badge">⭐ Recommended Match</span>
                  )}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '28px' }}>{job.logo}</span>
                      <span className="badge badge-applied">{job.duration}</span>
                    </div>
                    <h4 style={{ fontSize: '16px', fontWeight: 'bold' }}>{job.title}</h4>
                    <p style={{ color: 'var(--color-primary)', fontSize: '14px', fontWeight: 600 }}>{job.companyName}</p>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '8px', lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {job.scope}
                    </p>
                    
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '12px' }}>
                      {job.specializationTags.map(tag => (
                        <span key={tag} style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '10px', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '20px' }}>
                    <button className="btn btn-secondary" style={{ flex: 1, padding: '8px 0', fontSize: '12px' }} onClick={() => setViewJobModal(job)}>
                      View Details
                    </button>
                    <button 
                      className="btn btn-primary" 
                      style={{ flex: 1, padding: '8px 0', fontSize: '12px' }}
                      onClick={() => {
                        setApplyJobFlow(job);
                        setSop('');
                        setScreeningAnswers({});
                      }}
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

      {/* LOGBOOK VIEW (FR-31, PB-31.1) */}
      {activeTab === 'logbook' && (
        <div className="form-grid">
          {/* Progression card */}
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Digital Progress Gauge</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              {/* SVG Ring Gauge */}
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
                  <span style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'var(--font-display)' }}>{progressPercent}%</span>
                  <span style={{ display: 'block', fontSize: '9px', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>Hours Logged</span>
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px' }}>Logged <strong>{totalHours}</strong> / 120 required placement hours.</p>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                  Weekly compliance maps directly to academic accreditation guidelines.
                </p>
              </div>
            </div>
            
            {/* Submit progress log form */}
            <div style={{ borderTop: '1px solid var(--color-border)', marginTop: '24px', paddingTop: '20px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>📝 Log Weekly Progress</h4>
              
              <div className="form-group">
                <span className="form-label">Hours Worked this Week:</span>
                <input 
                  type="number" 
                  className="form-input" 
                  value={hours} 
                  onChange={e => setHours(Number(e.target.value))} 
                  min={1} 
                  max={80} 
                />
              </div>

              <div className="form-group">
                <span className="form-label">Completed Tasks & Tasks Accomplished:</span>
                <textarea 
                  className="form-input" 
                  rows={3} 
                  placeholder="Detail what tasks you worked on..."
                  value={tasks}
                  onChange={e => setTasks(e.target.value)}
                />
              </div>

              <div className="form-group">
                <span className="form-label">Self-Evaluation / Milestone Check:</span>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Mastered local state hooks, drafted CSS" 
                  value={milestone}
                  onChange={e => setMilestone(e.target.value)}
                />
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

          {/* Logbook entries list */}
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Digital Logbook Matrix</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {loggedWeeks.map(le => (
                <div 
                  key={le.id} 
                  style={{ border: '1px solid var(--color-border)', borderRadius: '8px', padding: '16px', backgroundColor: le.isLocked ? '#f8fafc' : '#fff' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600 }}>Week {le.weekNumber} Log</h4>
                    {le.isLocked ? (
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }} title="Locks automatically after 7 days to preserve integrity">
                        🔒 Locked (7+ Days Old)
                      </span>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--status-offered)', fontWeight: 600 }}>
                        ✏️ Editable (Recent)
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '8px' }}>Date Submitted: {le.date} | Logged: <strong>{le.workingHours} Hours</strong></p>
                  <div style={{ fontSize: '13px' }}>
                    <p style={{ marginBottom: '4px' }}><strong>Tasks:</strong> {le.tasksCompleted}</p>
                    <p><strong>Milestone:</strong> {le.selfEvaluation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* INTERVIEWS BOOKING VIEW (FR-13, PB-27) */}
      {activeTab === 'interviews' && (
        <div>
          <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Book Interview Timeslots</h3>
          
          <div className="form-grid">
            {/* Available Slots */}
            <div className="dashboard-card" style={{ margin: 0 }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>📅 Available Slots</h4>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
                Select an interview slot below. Once booked, the slot becomes locked and unavailable to other candidates.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {interviewSlots.filter(slot => !slot.bookedBy).map(slot => (
                  <div 
                    key={slot.id} 
                    style={{ border: '1px solid var(--color-border)', padding: '12px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                  >
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
                
                {interviewSlots.filter(slot => !slot.bookedBy).length === 0 && (
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', textAlign: 'center', padding: '24px 0' }}>
                    No available interview slots at the moment.
                  </p>
                )}
              </div>
              
              {showBookingToast && (
                <div style={{ backgroundColor: 'var(--status-offered)', color: 'white', padding: '10px', borderRadius: '4px', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>
                  ✓ Booking Confirmed! Confirmation displayed, calendar details saved.
                </div>
              )}
            </div>

            {/* My Booked Slots */}
            <div className="dashboard-card" style={{ margin: 0 }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '12px' }}>🔒 My Booked Appointments</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {interviewSlots.filter(slot => slot.bookedBy === studentId).map(slot => (
                  <div 
                    key={slot.id} 
                    style={{ border: '1px solid var(--color-primary)', backgroundColor: 'var(--color-primary-light)', padding: '12px', borderRadius: '6px' }}
                  >
                    <h4 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>{slot.companyName}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-main)' }}>Confirmed: <strong>{slot.date} at {slot.time}</strong></p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '4px' }}>✓ Synchronized with university core calendar.</p>
                  </div>
                ))}

                {interviewSlots.filter(slot => slot.bookedBy === studentId).length === 0 && (
                  <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', textAlign: 'center', padding: '24px 0' }}>
                    You have no booked interviews yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK & RATINGS PORTAL (FR-30, PB-30.1) */}
      {activeTab === 'feedback' && (
        <div className="form-grid">
          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '12px' }}>Internship Evaluation & Review</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>
              Submit a rating and milestone review for your completed internship. Reviews are shared on corporate portfolios.
            </p>

            <div className="form-group">
              <span className="form-label">Select Completed Placement Company:</span>
              <select 
                className="form-input"
                onChange={e => {
                  const val = e.target.value;
                  if (val) {
                    const parts = val.split('|');
                    setSelectedCompany({ id: parts[0], name: parts[1] });
                  } else {
                    setSelectedCompany(null);
                  }
                }}
              >
                <option value="">-- Select Completed Internship --</option>
                <option value="c_techcorp|TechCorp Solutions">TechCorp Solutions (Completed May 2026)</option>
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
                    <span className="form-label">Learning Curve & Mentorship:</span>
                    <RatingStars rating={ratingLearning} onChange={setRatingLearning} />
                  </div>
                </div>

                <div className="form-group">
                  <span className="form-label">Detailed Written Review (min 50, max 2000 chars):</span>
                  <textarea 
                    className="form-input" 
                    rows={4} 
                    placeholder="Write a detailed feedback on your work scope, challenges, and support received..."
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '4px' }}>
                    <span style={{ color: reviewText.length >= 50 && reviewText.length <= 2000 ? 'var(--status-offered)' : 'var(--status-rejected)' }}>
                      Characters: {reviewText.length} {reviewText.length < 50 && '(minimum 50 required)'}
                    </span>
                    <span>Max: 2000</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <input 
                    type="checkbox" 
                    id="anon" 
                    checked={anonymize} 
                    onChange={e => setAnonymize(e.target.checked)} 
                  />
                  <label htmlFor="anon" style={{ fontSize: '13px', cursor: 'pointer' }}>Anonymize my review on public profile page</label>
                </div>

                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  disabled={reviewText.length < 50 || reviewText.length > 2000}
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

            {showReviewToast && (
              <div style={{ backgroundColor: 'var(--status-offered)', color: 'white', padding: '10px', borderRadius: '4px', fontSize: '12px', marginTop: '12px', textAlign: 'center' }}>
                ✓ Review submitted successfully! Average company rating recalculated instantly.
              </div>
            )}
          </div>

          <div className="dashboard-card" style={{ margin: 0 }}>
            <h3 style={{ fontSize: '18px', marginBottom: '16px' }}>Public Feedback Portal</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Other students reviews on placement hosts.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reviews.map(rev => (
                <div key={rev.id} style={{ border: '1px solid var(--color-border)', padding: '16px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: 600 }}>{rev.companyName}</h4>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{rev.timestamp}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '8px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    <span>Overall: <strong style={{ color: 'gold' }}>★ {rev.ratingOverall}</strong></span>
                    <span>Culture: <strong style={{ color: 'gold' }}>★ {rev.ratingCulture}</strong></span>
                    <span>Learning: <strong style={{ color: 'gold' }}>★ {rev.ratingLearning}</strong></span>
                  </div>
                  <p style={{ fontSize: '13px', fontStyle: 'italic' }}>"{rev.reviewText}"</p>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '8px', textAlign: 'right' }}>
                    — Submitted by: {rev.anonymize ? 'Anonymous Student' : 'Liam (WIA210112)'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW JOB DETAILS MODAL */}
      {viewJobModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <h3 className="modal-title">{viewJobModal.title}</h3>
            <h4 style={{ color: 'var(--color-primary)', marginBottom: '16px' }}>{viewJobModal.companyName}</h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--color-text-main)', marginBottom: '24px' }}>
              <div><strong>Placement Duration:</strong> {viewJobModal.duration}</div>
              <div><strong>Job Scope & Responsibilities:</strong><p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{viewJobModal.scope}</p></div>
              <div><strong>Required Core Skills:</strong><div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>{viewJobModal.requiredSkills.map(s => <span key={s} className="badge badge-applied" style={{ fontSize: '11px' }}>{s}</span>)}</div></div>
              <div><strong>Application Deadline:</strong> {viewJobModal.deadline}</div>
            </div>

            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setViewJobModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT SUBMISSION MODAL (PB-29.1) */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Edit Application Submission</h3>
            
            <div className="form-group">
              <span className="form-label">Resume CV Name:</span>
              <input type="text" className="form-input" value={editCv} onChange={e => setEditCv(e.target.value)} />
            </div>

            <div className="form-group">
              <span className="form-label">Statement of Purpose:</span>
              <textarea className="form-input" rows={4} value={editSop} onChange={e => setEditSop(e.target.value)} />
            </div>

            <div className="form-group">
              <span className="form-label">Contact Email:</span>
              <input type="email" className="form-input" value={editEmail} onChange={e => setEditEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <span className="form-label">Contact Phone:</span>
              <input type="text" className="form-input" value={editPhone} onChange={e => setEditPhone(e.target.value)} />
            </div>

            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setShowEditModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => {
                if (window.confirm("Are you sure you want to save changes to your submission?")) {
                  handleSaveEdit();
                }
              }}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WITHDRAW WARNING MODAL (PB-29.2) */}
      {showWithdrawModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title" style={{ color: 'var(--status-rejected)' }}>⚠️ Retract Submission</h3>
            <p className="modal-body">
              This action cannot be undone. Are you sure you want to withdraw your application?
            </p>
            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setShowWithdrawModal(null)}>Cancel</button>
              <button 
                className="btn btn-danger" 
                onClick={() => {
                  withdrawApplication(showWithdrawModal);
                  setShowWithdrawModal(null);
                  setSelectedAppId(null);
                }}
              >
                Confirm Withdraw
              </button>
            </div>
          </div>
        </div>
      )}

      {/* APPLY FLOW PANEL (FR-04, PB-31, PB-32) */}
      {applyJobFlow && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 className="modal-title">Apply for {applyJobFlow.title}</h3>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Please complete the screening requirements configured by {applyJobFlow.companyName}.
            </p>

            <div className="form-group">
              <span className="form-label">Statement of Purpose:</span>
              <textarea 
                className="form-input" 
                rows={3} 
                placeholder="Explain why you are a good fit..."
                value={sop}
                onChange={e => setSop(e.target.value)}
              />
            </div>

            {/* Screening Questions (PB-32) */}
            {applyJobFlow.screeningQuestions && applyJobFlow.screeningQuestions.length > 0 && (
              <div style={{ margin: '16px 0', borderTop: '1px solid var(--color-border)', paddingTop: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Screening Questions</h4>
                {applyJobFlow.screeningQuestions.map((q, idx) => (
                  <div className="form-group" key={idx}>
                    <span className="form-label">{idx + 1}. {q}</span>
                    <textarea 
                      className="form-input" 
                      rows={2} 
                      placeholder="Your open-ended text response..."
                      value={screeningAnswers[idx] || ''}
                      onChange={e => setScreeningAnswers({ ...screeningAnswers, [idx]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Video Screening (PB-31) */}
            <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px' }}>🎥 Video Screening response</h4>
              <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '12px' }}>
                Employer duration limit constraint: <strong>{applyJobFlow.videoDurationLimit} seconds maximum</strong>.
              </p>
              <div className="form-group">
                <span className="form-label">Simulated Video Pitch URL (e.g. YouTube/Behance video or type "simulated_pitch.mp4"):</span>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Type simulated_pitch.mp4" 
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-buttons">
              <button className="btn btn-secondary" onClick={() => setApplyJobFlow(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleApply(applyJobFlow)}>Submit Application</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentPortal;
