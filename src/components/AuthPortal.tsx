import React, { useState } from 'react';
import { usePortal } from '../context/PortalState';
import type { UserRole } from '../context/PortalState';

export const AuthPortal: React.FC = () => {
  const { login, register } = usePortal();

  // Mode state: 'login' | 'register'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('john.lim@university.edu.my');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginRole, setLoginRole] = useState<UserRole>('Student');

  // Registration form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Dynamic additional details based on role
  const [studentMajor, setStudentMajor] = useState('Computer Science');
  const [studentYear, setStudentYear] = useState('Year 3');
  const [studentMatric, setStudentMatric] = useState('');

  const [hrCompany, setHrCompany] = useState('');
  const [hrDesignation, setHrDesignation] = useState('');

  const [lecturerFaculty, setLecturerFaculty] = useState('Faculty of Computing');
  const [lecturerSpec, setLecturerSpec] = useState('');

  const [ccDepartment, setCcDepartment] = useState('Career Services');
  const [ccStaffId, setCcStaffId] = useState('');

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail) {
      alert('Please enter an email address.');
      return;
    }
    const success = login(loginEmail, loginRole);
    if (!success) {
      alert('Login failed. Please double check credentials.');
    }
  };

  // Handle Registration Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPhone || !regPassword || !selectedRole) {
      alert('Please fill in all required fields and select a role.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const details: Record<string, string> = {};
    if (selectedRole === 'Student') {
      details.major = studentMajor;
      details.year = studentYear;
      details.matric = studentMatric || `STU-${Math.floor(1000 + Math.random() * 9000)}`;
    } else if (selectedRole === 'Employer') {
      details.company = hrCompany || 'Independent Employer';
      details.designation = hrDesignation || 'HR Officer';
    } else if (selectedRole === 'Lecturer') {
      details.faculty = lecturerFaculty;
      details.specialization = lecturerSpec || 'General Computing';
    } else if (selectedRole === 'CareerCentre') {
      details.department = ccDepartment;
      details.staffId = ccStaffId || `CC-${Math.floor(1000 + Math.random() * 9000)}`;
    }

    register(regName, regEmail, regPhone, selectedRole, details);
  };

  // Quick Login Autofill Helper
  const triggerQuickLogin = (email: string, role: UserRole) => {
    setLoginEmail(email);
    setLoginRole(role);
    setLoginPassword('password123');
    login(email, role);
  };

  return (
    <div className="auth-page-container">
      {/* Dynamic Left Column - Register Form */}
      <div className="auth-left-panel">
        <div className="auth-header-logo">
          <span className="logo-icon-auth">🎓</span>
          <div>
            <h2>Internship Portal</h2>
            <p>Bridging Talent. Building Futures.</p>
          </div>
        </div>

        {authMode === 'register' ? (
          <form className="auth-flow-form" onSubmit={handleRegisterSubmit}>
            <h1 className="auth-form-title">Create Your Account</h1>
            <p className="auth-form-subtitle">
              Join the Internship Portal and take the next step in your career journey.
            </p>

            {/* Stepper Steps UI */}
            <div className="auth-stepper-indicator">
              <div className="auth-indicator-step active">
                <span className="step-num">1</span>
                <span className="step-lbl">Account Details</span>
              </div>
              <div className="auth-indicator-line"></div>
              <div className={`auth-indicator-step ${selectedRole ? 'active' : ''}`}>
                <span className="step-num">2</span>
                <span className="step-lbl">Role Selection</span>
              </div>
              <div className="auth-indicator-line"></div>
              <div className={`auth-indicator-step ${selectedRole ? 'active' : ''}`}>
                <span className="step-num">3</span>
                <span className="step-lbl">Additional Information</span>
              </div>
            </div>

            <div className="auth-scrollable-fields">
              {/* Account Details Block */}
              <h3 className="section-form-title">Account Details</h3>
              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter your full name"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="Enter your email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-group-row">
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-input"
                    placeholder="Enter your phone number"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group password-field-group">
                  <label className="form-label">Password *</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      className="form-input"
                      placeholder="Create a password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle-btn"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                    >
                      {showRegPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ maxWidth: '50%' }}>
                <label className="form-label">Confirm Password *</label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Confirm your password"
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  required
                />
              </div>

              {/* Role Selection Block */}
              <h3 className="section-form-title" style={{ marginTop: '24px' }}>Select Your Role *</h3>
              <div className="role-cards-grid">
                {/* Student Card */}
                <div
                  className={`role-card-select ${selectedRole === 'Student' ? 'selected' : ''}`}
                  onClick={() => setSelectedRole('Student')}
                >
                  <span className="role-card-icon">🎓</span>
                  <span className="role-card-title">Student</span>
                  <div className="role-card-radio">
                    <span className="radio-circle"></span>
                  </div>
                </div>

                {/* HR Card */}
                <div
                  className={`role-card-select ${selectedRole === 'Employer' ? 'selected' : ''}`}
                  onClick={() => setSelectedRole('Employer')}
                >
                  <span className="role-card-icon">🏢</span>
                  <span className="role-card-title">HR / Company Representative</span>
                  <div className="role-card-radio">
                    <span className="radio-circle"></span>
                  </div>
                </div>

                {/* Career Center Card */}
                <div
                  className={`role-card-select ${selectedRole === 'CareerCentre' ? 'selected' : ''}`}
                  onClick={() => setSelectedRole('CareerCentre')}
                >
                  <span className="role-card-icon">👥</span>
                  <span className="role-card-title">Career Center Staff</span>
                  <div className="role-card-radio">
                    <span className="radio-circle"></span>
                  </div>
                </div>

                {/* Lecturer Card */}
                <div
                  className={`role-card-select ${selectedRole === 'Lecturer' ? 'selected' : ''}`}
                  onClick={() => setSelectedRole('Lecturer')}
                >
                  <span className="role-card-icon">👤</span>
                  <span className="role-card-title">Lecturer / Supervisor</span>
                  <div className="role-card-radio">
                    <span className="radio-circle"></span>
                  </div>
                </div>
              </div>

              {/* Additional Information Block */}
              <h3 className="section-form-title" style={{ marginTop: '24px' }}>Additional Information</h3>
              <p className="section-form-desc">Please provide details based on the role you selected.</p>

              <div className="additional-fields-wrapper">
                {!selectedRole ? (
                  <div className="additional-placeholder">
                    <span className="placeholder-icon">📋</span>
                    <p>Select a role to see the additional information fields.</p>
                  </div>
                ) : (
                  <div className="slide-up">
                    {selectedRole === 'Student' && (
                      <div className="form-group-row">
                        <div className="form-group">
                          <label className="form-label">Major/Field of Study *</label>
                          <input
                            type="text"
                            className="form-input"
                            value={studentMajor}
                            onChange={(e) => setStudentMajor(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Year of Study *</label>
                          <select
                            className="form-input"
                            value={studentYear}
                            onChange={(e) => setStudentYear(e.target.value)}
                          >
                            <option value="Year 1">Year 1</option>
                            <option value="Year 2">Year 2</option>
                            <option value="Year 3">Year 3</option>
                            <option value="Year 4">Year 4</option>
                          </select>
                        </div>
                        <div className="form-group">
                          <label className="form-label">Matric/ID Number *</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. 20234567"
                            value={studentMatric}
                            onChange={(e) => setStudentMatric(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {selectedRole === 'Employer' && (
                      <div className="form-group-row">
                        <div className="form-group">
                          <label className="form-label">Company Name *</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Arvato Systems"
                            value={hrCompany}
                            onChange={(e) => setHrCompany(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Designation / Title *</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. HR Manager"
                            value={hrDesignation}
                            onChange={(e) => setHrDesignation(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {selectedRole === 'Lecturer' && (
                      <div className="form-group-row">
                        <div className="form-group">
                          <label className="form-label">Faculty *</label>
                          <input
                            type="text"
                            className="form-input"
                            value={lecturerFaculty}
                            onChange={(e) => setLecturerFaculty(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Specialization / Department *</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. Software Engineering"
                            value={lecturerSpec}
                            onChange={(e) => setLecturerSpec(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}

                    {selectedRole === 'CareerCentre' && (
                      <div className="form-group-row">
                        <div className="form-group">
                          <label className="form-label">Department *</label>
                          <input
                            type="text"
                            className="form-input"
                            value={ccDepartment}
                            onChange={(e) => setCcDepartment(e.target.value)}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Staff ID *</label>
                          <input
                            type="text"
                            className="form-input"
                            placeholder="e.g. CC-9012"
                            value={ccStaffId}
                            onChange={(e) => setCcStaffId(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-auth-submit">
              Next
            </button>

            <p className="auth-mode-switch-text">
              Already have an account?{' '}
              <span className="auth-link-text" onClick={() => setAuthMode('login')}>
                Login
              </span>
            </p>
          </form>
        ) : (
          /* Simplified redirect when in Login Mode: Left side shows promotional banner/image mock */
          <div className="auth-left-promo-block">
            <div className="promo-text-wrapper">
              <h1>Connecting Talents, Enabling Futures</h1>
              <p>
                SRE Match provides a smart framework for matching university students with ideal local and global internship opportunities.
              </p>
              <button className="btn btn-primary" onClick={() => setAuthMode('register')}>
                Get Started & Create Account
              </button>
            </div>
            <div className="promo-mockup-graphic">
              <span className="promo-decor deco-1">🏢</span>
              <span className="promo-decor deco-2">💻</span>
              <span className="promo-decor deco-3">📄</span>
              <span className="promo-decor deco-4">🤝</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Column - Login Form */}
      <div className="auth-right-panel">
        <div className="login-box-container">
          <form onSubmit={handleLoginSubmit} style={{ width: '100%' }}>
            <h1 className="auth-form-title">Welcome Back!</h1>
            <p className="auth-form-subtitle">Login to your account to continue.</p>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                placeholder="Enter your email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Role Profile</label>
              <select
                className="form-input"
                value={loginRole}
                onChange={(e) => setLoginRole(e.target.value as UserRole)}
              >
                <option value="Student">🧑‍🎓 Student</option>
                <option value="Employer">🏢 Employer HR</option>
                <option value="Lecturer">🧑‍🏫 Lecturer Supervisor</option>
                <option value="CareerCentre">🛡️ Career Center Staff</option>
              </select>
            </div>

            <div className="form-group password-field-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <span className="auth-link-text" style={{ fontSize: '12px' }}>
                  Forgot Password?
                </span>
              </div>
              <div className="password-input-wrapper">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Enter your password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-auth-submit" style={{ marginTop: '8px' }}>
              Login
            </button>

            <div className="or-divider">
              <span>or</span>
            </div>

            <button
              type="button"
              className="btn btn-secondary google-btn"
              onClick={() => triggerQuickLogin(loginEmail, loginRole)}
            >
              <span className="google-icon-mock">G</span> Continue with Google
            </button>

            <p className="auth-mode-switch-text" style={{ marginTop: '24px' }}>
              Don't have an account?{' '}
              <span className="auth-link-text" onClick={() => setAuthMode('register')}>
                Register
              </span>
            </p>
          </form>

          {/* Quick Demo Login Autofill profiles (extremely user friendly!) */}
          <div className="quick-login-profiles-box">
            <h4 className="quick-login-title">Quick Demo Login (autofill & sign in)</h4>
            <div className="quick-profile-buttons-row">
              <button
                type="button"
                className="quick-profile-pill student"
                onClick={() => triggerQuickLogin('john.lim@university.edu.my', 'Student')}
              >
                🧑‍🎓 Student (John Lim)
              </button>
              <button
                type="button"
                className="quick-profile-pill employer"
                onClick={() => triggerQuickLogin('sarah.tan@arvato.com', 'Employer')}
              >
                🏢 HR (Sarah Tan)
              </button>
              <button
                type="button"
                className="quick-profile-pill lecturer"
                onClick={() => triggerQuickLogin('lim.weiming@university.edu.my', 'Lecturer')}
              >
                🧑‍🏫 Lecturer (Dr. Lim)
              </button>
              <button
                type="button"
                className="quick-profile-pill career"
                onClick={() => triggerQuickLogin('siti@university.edu.my', 'CareerCentre')}
              >
                🛡️ Career Center
              </button>
            </div>
          </div>
        </div>

        {/* Brand Perks / bottom footer cards */}
        <div className="perks-row-auth">
          <div className="perk-col">
            <span className="perk-icon">💼</span>
            <h5>Find Opportunities</h5>
            <p>Discover internships matching your skills.</p>
          </div>
          <div className="perk-col">
            <span className="perk-icon">📈</span>
            <h5>Track Progress</h5>
            <p>Monitor applications and progress logs.</p>
          </div>
          <div className="perk-col">
            <span className="perk-icon">💬</span>
            <h5>Stay Connected</h5>
            <p>Communicate with university advisors.</p>
          </div>
          <div className="perk-col">
            <span className="perk-icon">🛡️</span>
            <h5>Secure & Reliable</h5>
            <p>Data is protected with university compliance.</p>
          </div>
        </div>

        <div className="about-card-auth">
          <h5>About the Internship Portal</h5>
          <p>
            Our platform connects students, companies, and academic supervisors in a structured environment to create meaningful internship outcomes.
          </p>
        </div>

        <p className="auth-footer-copyright">© 2026 Internship Portal. All rights reserved.</p>
      </div>
    </div>
  );
};
export default AuthPortal;
