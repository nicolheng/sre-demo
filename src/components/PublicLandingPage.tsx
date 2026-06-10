import React, { useState } from 'react';
import { usePortal } from '../context/PortalState';

export const PublicLandingPage: React.FC = () => {
  const { jobs, applyExternal, publicJobId, setPublicJobId } = usePortal();

  // Find the active job
  const job = jobs.find(j => j.id === publicJobId);

  // Form states
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [cvName, setCvName] = useState('');
  const [sop, setSop] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [screeningAnswers, setScreeningAnswers] = useState<Record<string, string>>({});
  const [fypThesisTitle, setFypThesisTitle] = useState('');
  const [fypAdvisorName, setFypAdvisorName] = useState('');
  const [fypAgree, setFypAgree] = useState(false);

  // Success state
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!job) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '20px' }}>
        <div className="dashboard-card" style={{ maxWidth: '480px', textAlign: 'center', padding: '40px' }}>
          <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>⚠️</span>
          <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>Job Posting Not Found</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '14px', marginBottom: '24px' }}>
            The job listing link you followed is invalid, expired, or has been retracted.
          </p>
          <button className="btn btn-primary" onClick={() => setPublicJobId(null)}>
            Return to Login Portal
          </button>
        </div>
      </div>
    );
  }

  const handleExternalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (job.isFypCollaboration && (!fypThesisTitle || !fypAdvisorName || !fypAgree)) {
      alert('Please fill in both Proposed Thesis Title and Academic Advisor, and agree to the milestone alignment.');
      return;
    }

    applyExternal(
      job.id,
      candidateName,
      candidateEmail,
      candidatePhone,
      cvName || 'External_Candidate_Resume.pdf',
      sop,
      screeningAnswers,
      videoUrl,
      fypThesisTitle,
      fypAdvisorName
    );

    setIsSubmitted(true);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Public Header */}
      <header className="app-header" style={{ position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div className="logo-section">
          <div className="logo-icon">🎓</div>
          <div className="logo-text">
            <h1>Internship Portal</h1>
            <span>External Sourcing Platform</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', fontWeight: 600 }}>Ref: LinkedIn Tracked</span>
          <button 
            className="btn btn-secondary" 
            style={{ fontSize: '12.5px', borderRadius: '8px', padding: '6px 14px' }}
            onClick={() => setPublicJobId(null)}
          >
            ← Return to Login
          </button>
        </div>
      </header>

      {/* Main content grid */}
      <div style={{ flex: 1, maxWidth: '1100px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        {isSubmitted ? (
          <div className="dashboard-card slide-up" style={{ maxWidth: '600px', margin: '40px auto', textAlign: 'center', padding: '48px 32px' }}>
            <span style={{ fontSize: '56px', display: 'block', marginBottom: '20px' }}>🎉</span>
            <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', color: 'var(--color-primary)' }}>Application Submitted Natively!</h2>
            <p style={{ fontSize: '14.5px', color: 'var(--color-text-muted)', lineHeight: '1.6', marginBottom: '32px' }}>
              Thank you, <strong>{candidateName}</strong>! Your application for the <strong>{job.title}</strong> position at <strong>{job.companyName}</strong> has been successfully received. 
              We have bypassed authentication friction to submit your materials directly to the recruiter's candidate hub.
            </p>

            <div style={{ backgroundColor: '#f1f5f9', borderRadius: '8px', padding: '16px', textAlign: 'left', marginBottom: '32px', fontSize: '13.5px' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '8px' }}>Submission Summary:</h4>
              <p>• <strong>Applicant Name:</strong> {candidateName}</p>
              <p>• <strong>Contact Email:</strong> {candidateEmail}</p>
              {job.isFypCollaboration && <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>• 🎓 Mapped under Combined FYP Collaboration</p>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '12px 0', fontSize: '13px', fontWeight: 600 }}
                onClick={() => setPublicJobId(null)}
              >
                Sign In or Register Account
              </button>
              <button
                className="btn btn-secondary"
                style={{ width: '100%', padding: '12px 0', fontSize: '13px' }}
                onClick={() => {
                  setIsSubmitted(false);
                  setCandidateName('');
                  setCandidateEmail('');
                  setCandidatePhone('');
                  setCvName('');
                  setSop('');
                  setVideoUrl('');
                  setScreeningAnswers({});
                  setFypThesisTitle('');
                  setFypAdvisorName('');
                  setFypAgree(false);
                }}
              >
                Submit Another Application
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'start' }} className="slide-up">
            {/* Left Column: Job Details */}
            <div className="dashboard-card" style={{ margin: 0, padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--color-border)', paddingBottom: '20px', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: 800, margin: 0 }}>{job.title}</h2>
                  <h3 style={{ color: 'var(--color-primary)', fontSize: '16px', fontWeight: 600, marginTop: '6px' }}>{job.companyName}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
                  <span className="badge badge-applied" style={{ fontSize: '11px', padding: '4px 10px' }}>{job.duration}</span>
                  {job.isFypCollaboration && (
                    <span className="badge" style={{ backgroundColor: 'hsl(265, 80%, 94%)', color: 'var(--color-primary)', border: '1px solid hsl(265, 80%, 85%)', fontSize: '11px', padding: '3px 8px' }}>
                      🎓 Combined FYP
                    </span>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '14px' }}>
                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '13.5px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Required Skills</h4>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {job.requiredSkills.map(s => <span key={s} className="badge badge-applied" style={{ padding: '3px 10px' }}>{s}</span>)}
                  </div>
                </div>

                {job.specializationTags.length > 0 && (
                  <div>
                    <h4 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '13.5px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Specialization</h4>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      {job.specializationTags.map(t => <span key={t} className="badge badge-shortlisted" style={{ padding: '3px 10px' }}>{t}</span>)}
                    </div>
                  </div>
                )}

                <div>
                  <h4 style={{ fontWeight: 700, marginBottom: '6px', fontSize: '13.5px', textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>Job Scope & Technical Duties</h4>
                  <p style={{ color: 'var(--color-text-main)', lineHeight: '1.6', fontSize: '13.5px' }}>{job.scope}</p>
                </div>

                <div>
                  <p><strong>Application Deadline:</strong> {job.deadline}</p>
                </div>

                {job.isFypCollaboration && job.fypMilestones && (
                  <div style={{ borderLeft: '4px solid var(--color-primary)', backgroundColor: 'hsl(265, 80%, 98%)', padding: '16px', borderRadius: '0 8px 8px 0', marginTop: '12px' }}>
                    <h4 style={{ fontSize: '14.5px', fontWeight: 700, marginBottom: '10px', color: 'var(--color-primary)' }}>🎓 Integrated Academic Milestones:</h4>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '12px', lineHeight: '1.4' }}>
                      This placement coordinates directly with university research timelines under supervisor vetting.
                    </p>
                    <ul style={{ margin: '0 0 0 16px', padding: 0, fontSize: '12.5px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {job.fypMilestones.map((milestone, idx) => (
                        <li key={idx}><strong>Milestone {idx + 1}:</strong> {milestone}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Direct Apply Form */}
            <div className="dashboard-card" style={{ margin: 0, padding: '28px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Direct Native Application</h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '24px' }}>
                Apply natively to this company without creating a login credential first.
              </p>

              <form onSubmit={handleExternalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-label">Full Name *</span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={candidateName}
                    onChange={e => setCandidateName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-label">Email Address *</span>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email address"
                    value={candidateEmail}
                    onChange={e => setCandidateEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-label">Phone Contact *</span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. +60 12-345 6789"
                    value={candidatePhone}
                    onChange={e => setCandidatePhone(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-label">Upload CV (Simulated File Name) *</span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. MyResume_Alex.pdf"
                    value={cvName}
                    onChange={e => setCvName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-label">Statement of Purpose</span>
                  <textarea
                    className="form-input"
                    rows={3}
                    placeholder="Describe why you are interested in this internship..."
                    value={sop}
                    onChange={e => setSop(e.target.value)}
                  />
                </div>

                {/* Screening Questions (FR-04 / PB-17 / FR-21 / PB-32) */}
                {job.screeningQuestions && job.screeningQuestions.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '8px' }}>
                    <h4 style={{ fontSize: '13.5px', fontWeight: 700, marginBottom: '12px' }}>Company Screening Questions</h4>
                    {job.screeningQuestions.map((q, idx) => (
                      <div className="form-group" key={idx} style={{ marginBottom: '12px' }}>
                        <span className="form-label" style={{ fontSize: '12px' }}>{idx + 1}. {q} *</span>
                        <textarea
                          className="form-input"
                          rows={2}
                          placeholder="Your answer..."
                          value={screeningAnswers[idx] || ''}
                          onChange={e => setScreeningAnswers({ ...screeningAnswers, [idx]: e.target.value })}
                          required
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Combined FYP fields (FR-22 / PB-48) */}
                {job.isFypCollaboration && (
                  <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '16px', marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <h4 style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--color-primary)' }}>🎓 Combined FYP Requirements</h4>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <span className="form-label" style={{ fontSize: '12px' }}>Proposed Thesis / Project Title *</span>
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
                      <span className="form-label" style={{ fontSize: '12px' }}>Academic Advisor / Faculty Supervisor *</span>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Dr. Lim Wei Ming"
                        value={fypAdvisorName}
                        onChange={e => setFypAdvisorName(e.target.value)}
                        required
                      />
                    </div>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '11px', marginTop: '4px', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        required 
                        checked={fypAgree}
                        onChange={e => setFypAgree(e.target.checked)}
                        style={{ marginTop: '2px' }} 
                      />
                      <span>I agree to align the corporate milestones (Literature Review, Mid-term Prototype, Final Defense) with my academic timeline under supervisor validation.</span>
                    </label>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <span className="form-label">Video Pitch URL (Optional)</span>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. https://youtube.com/my-intro-pitch"
                    value={videoUrl}
                    onChange={e => setVideoUrl(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px 0', fontSize: '13px', fontWeight: 600, marginTop: '8px' }}>
                  Submit Native Application
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicLandingPage;
