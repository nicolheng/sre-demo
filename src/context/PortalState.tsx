import React, { createContext, useState, useContext } from 'react';
import type {
  Student,
  Job,
  Application,
  InterviewSlot,
  LogbookEntry,
  PlacementChecklist,
  FacultyStatement,
  BlueprintCommit,
  SystemLog,
  StudentReview,
  EmployerFeedback
} from '../types';

export type UserRole = 'Student' | 'Employer' | 'Lecturer' | 'CareerCentre';

export interface LoggedInUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  subText?: string;
  details?: Record<string, string>;
}

interface PortalContextType {
  isAuthenticated: boolean;
  loggedInUser: LoggedInUser | null;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeSubpage: string;
  setActiveSubpage: (subpage: string) => void;
  students: Student[];
  jobs: Job[];
  applications: Application[];
  interviewSlots: InterviewSlot[];
  logbookEntries: LogbookEntry[];
  checklists: Record<string, PlacementChecklist>;
  facultyStatements: FacultyStatement[];
  blueprintCommits: BlueprintCommit[];
  systemLogs: SystemLog[];
  reviews: StudentReview[];
  employerFeedbacks: EmployerFeedback[];
  liaisonFlags: Record<string, { language: string; lecturerId: string; bannerActive: boolean }>;
  employerVerifications: Record<string, boolean>; // companyId -> verified

  // Authentication Actions
  login: (email: string, role: UserRole) => boolean;
  logout: () => void;
  register: (name: string, email: string, phone: string, role: UserRole, details: Record<string, string>) => void;
  
  // App Actions
  addJob: (job: Omit<Job, 'id' | 'logo' | 'isApproved' | 'createdAt'>) => void;
  approveJob: (jobId: string) => void;
  rejectJob: (jobId: string, reason: string) => void;
  applyForJob: (
    jobId: string,
    studentId: string,
    sop: string,
    screeningAnswers: Record<string, string>,
    videoUrl?: string,
    cvName?: string
  ) => void;
  withdrawApplication: (appId: string) => void;
  editApplication: (appId: string, cvName: string, sop: string, email: string, phone: string) => void;
  updateApplicationStatus: (appId: string, status: Application['status']) => void;
  addEvaluationNote: (appId: string, author: string, note: string) => void;
  createInterviewSlot: (jobId: string, companyName: string, date: string, time: string) => void;
  bookInterviewSlot: (slotId: string, studentId: string) => void;
  addLogbookEntry: (studentId: string, workingHours: number, tasks: string, milestone: string) => void;
  submitReview: (studentId: string, companyId: string, companyName: string, rating: { overall: number; culture: number; learning: number }, reviewText: string, anonymize: boolean) => void;
  submitFeedback: (studentId: string, companyId: string, score: number, text: string) => void;
  updateChecklistPillar: (appId: string, pillar: keyof PlacementChecklist, status: 'Pass' | 'Fail' | 'Pending', desc?: string) => void;
  triggerLiaisonFlag: (appId: string, language: string, lecturerId: string) => void;
  resolveLiaisonFlag: (appId: string) => void;
  addFacultyStatement: (studentId: string, author: string, statement: string) => void;
  addBlueprintCommit: (author: string, action: string) => void;
  uploadOfferLetter: (appId: string, fileName: string) => void;
  verifyPlacement: (appId: string) => void;
  verifyEmployer: (companyId: string, verified: boolean) => void;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

// Initial Mock Data Seeding
const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'John Lim',
    email: 'john.lim@university.edu.my',
    phone: '+60 12-345 6789',
    cgpa: 3.82,
    skills: ['React', 'TypeScript', 'Node.js', 'Cloud Ops', 'HTML', 'CSS', 'UI/UX'],
    achievements: ['Dean\'s List Award (Sem 1-5)', '1st Place Hackathon 2025', 'Google cloud cert'],
    projects: ['Distributed Cloud System', 'Academic Planner Web App', 'Vulnerability Scanner'],
    matricNumber: '20234567',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 's2',
    name: 'Maya',
    email: 'maya@university.edu.my',
    phone: '+60 17-654 3210',
    cgpa: 3.45,
    skills: ['HTML', 'CSS', 'JavaScript', 'UI/UX', 'Figma', 'React'],
    achievements: ['IEEE Student Member', 'Best Design Award (Exhibition 2025)'],
    projects: ['Figma E-Commerce Kit', 'Portfolio Website', 'Library Management UI'],
    matricNumber: 'WIA220098',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 's3',
    name: 'Liam',
    email: 'liam@university.edu.my',
    phone: '+60 11-234 5678',
    cgpa: 3.65,
    skills: ['Python', 'Networking', 'Penetration Testing', 'Docker', 'Linux'],
    achievements: ['Certified Ethical Hacker (CEH) trainee', '2nd Place Cybersecurity Capture the Flag'],
    projects: ['Packet Sniffer Tool', 'Secure API Gateway', 'IDS Configuration Scripts'],
    matricNumber: 'WIA210112',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120'
  },
  {
    id: 's4',
    name: 'Sophia',
    email: 'sophia@university.edu.my',
    phone: '+60 13-987 6543',
    cgpa: 3.90,
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Pandas', 'Tableau'],
    achievements: ['Dean\'s List Award (All Semesters)', 'Best Paper Award in Student Analytics Symposium'],
    projects: ['Predictive Housing Model', 'Student Performance Dashboard', 'Sales DB Optimizer'],
    matricNumber: 'WIA210002',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120'
  }
];

const mockJobs: Job[] = [
  {
    id: 'j1',
    title: 'Mobile Developer Intern',
    companyName: 'Datum Technology',
    companyId: 'c_datum',
    duration: '3 months',
    scope: 'Develop and maintain mobile application features using React Native and TypeScript. Collaborate with UI/UX designers.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'HTML', 'CSS'],
    specializationTags: ['Software Engineering', 'Mobile Development'],
    deadline: '2026-06-30',
    screeningQuestions: [
      'Describe a complex programming project you worked on and the technical hurdles you overcame.',
      'Explain your experience with React state management models.'
    ],
    videoDurationLimit: 60,
    isApproved: true,
    createdAt: '2026-06-01',
    logo: 'DT'
  },
  {
    id: 'j2',
    title: 'Software Intern',
    companyName: 'IJM Corporation',
    companyId: 'c_ijm',
    duration: '3 months',
    scope: 'Conduct full-stack software development under senior engineers. Assist in building robust cloud and local APIs.',
    requiredSkills: ['React', 'TypeScript', 'HTML', 'CSS'],
    specializationTags: ['Software Engineering', 'Web Development'],
    deadline: '2026-06-25',
    screeningQuestions: [
      'Provide a link to your design portfolio or GitHub and explain the design thinking process.',
      'How do you write cleaner asynchronous code in JavaScript?'
    ],
    videoDurationLimit: 90,
    isApproved: true,
    createdAt: '2026-06-02',
    logo: 'IJM'
  },
  {
    id: 'j3',
    title: 'UI/UX Designer Intern',
    companyName: 'Arvato Systems',
    companyId: 'c_arvato',
    duration: '3 months',
    scope: 'Draft wireframes, design mockups, and develop front-end HTML/CSS layouts.',
    requiredSkills: ['Figma', 'UI/UX', 'HTML', 'CSS'],
    specializationTags: ['UI/UX'],
    deadline: '2026-06-28',
    isApproved: true,
    createdAt: '2026-06-03',
    logo: '💼',
    screeningQuestions: ['What is your design philosophy?'],
    videoDurationLimit: 120
  },
  {
    id: 'j4',
    title: 'Machine Learning Assistant',
    companyName: 'TechCorp Solutions',
    companyId: 'c_techcorp',
    duration: '3 months',
    scope: 'Train and evaluate NLP models using PyTorch.',
    requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning'],
    specializationTags: ['AI', 'Data Science'],
    deadline: '2026-06-15',
    isApproved: true,
    createdAt: '2026-06-05',
    logo: '🤖',
    screeningQuestions: ['What ML frameworks do you prefer?'],
    videoDurationLimit: 180
  },
  {
    id: 'j5',
    title: 'Digital Marketing Support',
    companyName: 'Spam Inc',
    companyId: 'c_spam',
    duration: '2 months',
    scope: 'Spam social media feeds with copy-paste marketing posts. Commission-only base.',
    requiredSkills: ['Copywriting', 'Social Media'],
    specializationTags: ['Marketing'],
    deadline: '2026-06-12',
    isApproved: false, // Pending Approval, violates guidelines
    createdAt: '2026-06-06',
    logo: '⚠️',
    screeningQuestions: ['Are you willing to work on commission?'],
    videoDurationLimit: 60
  }
];

const mockApplications: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    studentId: 's1', // John Lim applied to Datum Technology
    submissionDate: '2026-06-02',
    status: 'Screening',
    cvName: 'JohnLim_CV_20234567.pdf',
    statementOfPurpose: 'I wish to expand my mobile developer programming capabilities, focusing on React Native and cloud systems.',
    contactEmail: 'john.lim@university.edu.my',
    contactPhone: '+60 12-345 6789',
    screeningAnswers: {
      '0': 'I built a distributed storage server cluster using Node.js and WebSockets.',
      '1': 'I am highly experienced with Redux Toolkit and Context API.'
    },
    videoResponseUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'
  },
  {
    id: 'a2',
    jobId: 'j2',
    studentId: 's1', // John Lim applied to IJM Corporation
    submissionDate: '2026-06-03',
    status: 'Interview',
    cvName: 'JohnLim_CV_20234567.pdf',
    statementOfPurpose: 'I want to build highly functional enterprise web pages using React and TypeScript.',
    contactEmail: 'john.lim@university.edu.my',
    contactPhone: '+60 12-345 6789',
    screeningAnswers: {
      '0': 'Here is my GitHub: github.com/johnlim.',
      '1': 'I prefer async/await structures as it avoids nesting callback hell.'
    }
  },
  {
    id: 'a3',
    jobId: 'j3',
    studentId: 's2', // Maya applied to Arvato UI/UX
    submissionDate: '2026-06-04',
    status: 'Applied',
    cvName: 'Maya_UX_Resume.pdf',
    statementOfPurpose: 'Designing beautiful interfaces is my passion.',
    contactEmail: 'maya@university.edu.my',
    contactPhone: '+60 17-654 3210',
    screeningAnswers: {
      '0': 'My overall design principle is simplicity and ease of use.'
    }
  }
];

const mockInterviewSlots: InterviewSlot[] = [
  { id: 'is1', jobId: 'j2', companyName: 'IJM Corporation', date: '2026-06-15', time: '10:00 AM' },
  { id: 'is2', jobId: 'j2', companyName: 'IJM Corporation', date: '2026-06-15', time: '11:30 AM', bookedBy: 's1' },
  { id: 'is3', jobId: 'j2', companyName: 'IJM Corporation', date: '2026-06-16', time: '02:00 PM' },
  { id: 'is4', jobId: 'j3', companyName: 'Arvato Systems', date: '2026-06-18', time: '10:00 AM' },
  { id: 'is5', jobId: 'j4', companyName: 'TechCorp Solutions', date: '2026-06-20', time: '09:00 AM', conflictDetected: true }
];

const mockLogbookEntries: LogbookEntry[] = [
  { id: 'l1', studentId: 's1', weekNumber: 1, date: '2026-05-15', workingHours: 40, tasksCompleted: 'Completed onboarding. Set up development environment and ran mock build scripts.', selfEvaluation: 'Gained solid understanding of codebase architecture.', isLocked: true },
  { id: 'l2', studentId: 's1', weekNumber: 2, date: '2026-05-22', workingHours: 38, tasksCompleted: 'Implemented standard login validation screens. Refactored state reducer files.', selfEvaluation: 'Improved familiarity with React Context.', isLocked: true },
  { id: 'l3', studentId: 's1', weekNumber: 3, date: '2026-05-29', workingHours: 40, tasksCompleted: 'Fixed CSS layout bugs in the administrator statistics page. Started Gantt chart drafts.', selfEvaluation: 'Integrated SVG chart layout elements successfully.', isLocked: true },
  { id: 'l4', studentId: 's1', weekNumber: 4, date: '2026-06-05', workingHours: 25, tasksCompleted: 'Began writing typescript schemas for placement verification tables.', selfEvaluation: 'Encountered some complex typing challenges in TypeScript.', isLocked: false }
];

const mockChecklists: Record<string, PlacementChecklist> = {
  'a1': { applicationId: 'a1', insurance: 'Pass', visa: 'Pass', payModel: 'Pass', csRelevance: 'Pass' },
  'a2': { applicationId: 'a2', insurance: 'Pending', visa: 'Pass', payModel: 'Pending', csRelevance: 'Pass' },
  'a3': { applicationId: 'a3', insurance: 'Pending', visa: 'Pending', payModel: 'Pending', csRelevance: 'Pending' }
};

const mockFacultyStatements: FacultyStatement[] = [
  { id: 'f1', studentId: 's1', author: 'Dr. Lim Wei Ming', statement: 'Initial review of John\'s task assignments confirms deep software engineering alignment. No adjustments required.', timestamp: '2026-06-03 10:00 AM' },
  { id: 'f2', studentId: 's1', author: 'Puan Aisyah', statement: 'We agree with the academic assessment. John is adapting very quickly to our development workflows.', timestamp: '2026-06-04 02:30 PM' }
];

const mockBlueprintCommits: BlueprintCommit[] = [
  { id: 'c1', author: 'Dr. Lim Wei Ming', action: 'Created collaborative workspace & uploaded WIA3001 Syllabus blueprint.', timestamp: '2026-06-01 09:00 AM' },
  { id: 'c2', author: 'Puan Aisyah', action: 'Modified project alignment details - added React/Typescript scope.', timestamp: '2026-06-02 11:15 AM' }
];

const mockSystemLogs: SystemLog[] = [
  { id: 'sl1', user: 'Puan Siti', action: 'Approved Job Posting "Mobile Developer Intern" for Datum Technology.', timestamp: '2026-06-01 10:00 AM' },
  { id: 'sl2', user: 'Puan Siti', action: 'Approved Job Posting "Software Intern" for IJM Corporation.', timestamp: '2026-06-02 11:30 AM' },
  { id: 'sl3', user: 'Puan Siti', action: 'Verified Employer "Datum Technology" profile status to Credible.', timestamp: '2026-06-01 09:30 AM' }
];

const mockReviews: StudentReview[] = [
  {
    id: 'rev1',
    studentId: 's3',
    companyId: 'c_techcorp',
    companyName: 'TechCorp Solutions',
    ratingOverall: 5,
    ratingCulture: 4,
    ratingLearning: 5,
    reviewText: 'Incredible micro-internship experience! I worked on actual cloud network security blueprints and the mentoring was excellent.',
    anonymize: false,
    timestamp: '2026-05-28'
  }
];

const mockEmployerFeedbacks: EmployerFeedback[] = [
  {
    id: 'ef1',
    studentId: 's3',
    companyId: 'c_techcorp',
    performanceScore: 5,
    feedbackText: 'Liam exhibited excellent focus and deep networking knowledge. He was able to set up standard Linux firewall containers within his first week.',
    timestamp: '2026-05-28 05:00 PM'
  }
];

const mockEmployerVerifications: Record<string, boolean> = {
  'c_arvato': true,
  'c_techcorp': true,
  'c_datum': true,
  'c_ijm': true,
  'c_spam': false
};

// Seed Users for Authentication
const SEED_USERS: Record<string, LoggedInUser> = {
  'john.lim@university.edu.my': {
    id: 's1',
    name: 'John Lim',
    email: 'john.lim@university.edu.my',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=120',
    role: 'Student',
    subText: 'Computer Science • Year 3',
    details: { matric: '20234567', major: 'Computer Science', year: 'Year 3' }
  },
  'sarah.tan@arvato.com': {
    id: 'hr1',
    name: 'Sarah Tan',
    email: 'sarah.tan@arvato.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=120',
    role: 'Employer',
    subText: 'HR Manager • Arvato Systems',
    details: { company: 'Arvato Systems', designation: 'HR Manager' }
  },
  'lim.weiming@university.edu.my': {
    id: 'lec1',
    name: 'Dr. Lim Wei Ming',
    email: 'lim.weiming@university.edu.my',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    role: 'Lecturer',
    subText: 'Faculty of Computing',
    details: { faculty: 'Faculty of Computing', specialization: 'Software Engineering' }
  },
  'siti@university.edu.my': {
    id: 'cc1',
    name: 'Puan Siti',
    email: 'siti@university.edu.my',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=120',
    role: 'CareerCentre',
    subText: 'Lead Coordinator',
    details: { department: 'Career Advancement Dept', staffId: 'CC-9012' }
  }
};

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loggedInUser, setLoggedInUser] = useState<LoggedInUser | null>(null);
  const [currentRole, setCurrentRoleState] = useState<UserRole>('Student');
  const [activeSubpage, setActiveSubpage] = useState<string>('dashboard');

  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [interviewSlots, setInterviewSlots] = useState<InterviewSlot[]>(mockInterviewSlots);
  const [logbookEntries, setLogbookEntries] = useState<LogbookEntry[]>(mockLogbookEntries);
  const [checklists, setChecklists] = useState<Record<string, PlacementChecklist>>(mockChecklists);
  const [facultyStatements, setFacultyStatements] = useState<FacultyStatement[]>(mockFacultyStatements);
  const [blueprintCommits, setBlueprintCommits] = useState<BlueprintCommit[]>(mockBlueprintCommits);
  const [systemLogs, setSystemLogs] = useState<SystemLog[]>(mockSystemLogs);
  const [reviews, setReviews] = useState<StudentReview[]>(mockReviews);
  const [employerFeedbacks, setEmployerFeedbacks] = useState<EmployerFeedback[]>(mockEmployerFeedbacks);
  
  const [employerVerifications, setEmployerVerifications] = useState<Record<string, boolean>>(mockEmployerVerifications);
  const [liaisonFlags, setLiaisonFlags] = useState<Record<string, { language: string; lecturerId: string; bannerActive: boolean }>>({});

  const setCurrentRole = (role: UserRole) => {
    setCurrentRoleState(role);
    setActiveSubpage('dashboard');
  };

  // Auth actions
  const login = (email: string, role: UserRole) => {
    const cleanEmail = email.toLowerCase().trim();
    const matchedUser = SEED_USERS[cleanEmail];
    
    if (matchedUser && matchedUser.role === role) {
      setLoggedInUser(matchedUser);
      setIsAuthenticated(true);
      setCurrentRole(role);
      logAction(matchedUser.name, `Logged into the portal as ${role}.`);
      return true;
    }
    
    // Auto-create dynamically if not seeded
    const newSessionUser: LoggedInUser = {
      id: `u_${Date.now()}`,
      name: email.split('@')[0].replace('.', ' '),
      email: cleanEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      role: role,
      subText: role + ' User'
    };
    
    setLoggedInUser(newSessionUser);
    setIsAuthenticated(true);
    setCurrentRole(role);
    logAction(newSessionUser.name, `Registered & Logged in as ${role}.`);
    return true;
  };

  const logout = () => {
    if (loggedInUser) {
      logAction(loggedInUser.name, 'Logged out of the portal.');
    }
    setIsAuthenticated(false);
    setLoggedInUser(null);
    setActiveSubpage('dashboard');
  };

  const register = (name: string, email: string, phone: string, role: UserRole, details: Record<string, string>) => {
    const cleanEmail = email.toLowerCase().trim();
    const newSessionUser: LoggedInUser = {
      id: role === 'Student' ? `s${students.length + 1}` : `u_${Date.now()}`,
      name,
      email: cleanEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120',
      role,
      subText: role === 'Student' ? `${details.major} • ${details.year}` : role === 'Employer' ? `${details.designation} • ${details.company}` : `${details.faculty}`,
      details
    };

    if (role === 'Student') {
      const newStudent: Student = {
        id: newSessionUser.id,
        name,
        email: cleanEmail,
        phone,
        cgpa: 3.5, // default starting
        skills: ['HTML', 'CSS', 'JavaScript'],
        achievements: ['Portal Registrant'],
        projects: [],
        matricNumber: details.matric || '20230000',
        avatar: newSessionUser.avatar
      };
      setStudents(prev => [...prev, newStudent]);
    }

    setLoggedInUser(newSessionUser);
    setIsAuthenticated(true);
    setCurrentRole(role);
    logAction(name, `Registered new account and logged in as ${role}.`);
  };

  // Action: Add Job
  const addJob = (newJob: Omit<Job, 'id' | 'logo' | 'isApproved' | 'createdAt'>) => {
    const job: Job = {
      ...newJob,
      id: `j${jobs.length + 1}`,
      logo: newJob.companyName === 'Datum Technology' ? 'DT' : newJob.companyName === 'IJM Corporation' ? 'IJM' : '💼',
      isApproved: false, // CC must approve
      createdAt: new Date().toISOString().split('T')[0]
    };
    setJobs(prev => [...prev, job]);
    
    // Log action
    logAction('Company HR', `Created Job Posting "${job.title}" (Pending Approval).`);
  };

  // Action: Approve Job
  const approveJob = (jobId: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, isApproved: true, rejectionReason: undefined } : j));
    const job = jobs.find(j => j.id === jobId);
    logAction('Career Centre Staff', `Approved Job Posting "${job?.title || jobId}".`);
  };

  // Action: Reject Job
  const rejectJob = (jobId: string, reason: string) => {
    setJobs(prev => prev.map(j => j.id === jobId ? { ...j, isApproved: false, rejectionReason: reason } : j));
    const job = jobs.find(j => j.id === jobId);
    logAction('Career Centre Staff', `Rejected Job Posting "${job?.title || jobId}" for reason: "${reason}".`);
  };

  // Action: Apply For Job
  const applyForJob = (
    jobId: string,
    studentId: string,
    sop: string,
    screeningAnswers: Record<string, string>,
    videoUrl?: string,
    cvName?: string
  ) => {
    const student = students.find(s => s.id === studentId);
    const job = jobs.find(j => j.id === jobId);
    const newApp: Application = {
      id: `a${applications.length + 1}`,
      jobId,
      studentId,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      cvName: cvName || `${student?.name || 'Student'}_Resume.pdf`,
      statementOfPurpose: sop,
      contactEmail: student?.email || '',
      contactPhone: student?.phone || '',
      screeningAnswers,
      videoResponseUrl: videoUrl
    };

    setApplications(prev => [...prev, newApp]);

    // Initialize checklist
    setChecklists(prev => ({
      ...prev,
      [newApp.id]: {
        applicationId: newApp.id,
        insurance: 'Pending',
        visa: 'Pending',
        payModel: 'Pending',
        csRelevance: 'Pending'
      }
    }));

    logAction(student?.name || 'Student', `Submitted application for Job "${job?.title || jobId}".`);
  };

  // Action: Withdraw Application
  const withdrawApplication = (appId: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'Withdrawn' } : a));
    const app = applications.find(a => a.id === appId);
    const student = students.find(s => s.id === app?.studentId);
    logAction(student?.name || 'Student', `Withdrew application "${appId}".`);
  };

  // Action: Edit Application
  const editApplication = (appId: string, cvName: string, sop: string, email: string, phone: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? {
      ...a,
      cvName,
      statementOfPurpose: sop,
      contactEmail: email,
      contactPhone: phone
    } : a));
    const app = applications.find(a => a.id === appId);
    const student = students.find(s => s.id === app?.studentId);
    logAction(student?.name || 'Student', `Edited application details for "${appId}".`);
  };

  // Action: Update Application Status
  const updateApplicationStatus = (appId: string, status: Application['status']) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status } : a));
    logAction('Company HR', `Updated Application "${appId}" status to "${status}".`);
  };

  // Action: Add Evaluation Note
  const addEvaluationNote = (appId: string, author: string, note: string) => {
    logAction(author, `Added evaluation notes for Application "${appId}": "${note}"`);
  };

  // Action: Create Interview Slot
  const createInterviewSlot = (jobId: string, companyName: string, date: string, time: string) => {
    const newSlot: InterviewSlot = {
      id: `is${interviewSlots.length + 1}`,
      jobId,
      companyName,
      date,
      time
    };
    setInterviewSlots(prev => [...prev, newSlot]);
    logAction('Company HR', `Created interview slot for Job "${jobId}" on ${date} at ${time}.`);
  };

  // Action: Book Interview Slot
  const bookInterviewSlot = (slotId: string, studentId: string) => {
    setInterviewSlots(prev => prev.map(s => s.id === slotId ? { ...s, bookedBy: studentId } : s));
    const slot = interviewSlots.find(s => s.id === slotId);
    const student = students.find(st => st.id === studentId);
    
    // Auto-update application status to Interview
    const app = applications.find(a => a.studentId === studentId && a.jobId === slot?.jobId);
    if (app) {
      updateApplicationStatus(app.id, 'Interview');
    }

    logAction(student?.name || 'Student', `Booked interview slot "${slotId}" with "${slot?.companyName}".`);
  };

  // Action: Add Logbook Entry
  const addLogbookEntry = (studentId: string, workingHours: number, tasks: string, milestone: string) => {
    const entry: LogbookEntry = {
      id: `l${logbookEntries.length + 1}`,
      studentId,
      weekNumber: logbookEntries.filter(le => le.studentId === studentId).length + 1,
      date: new Date().toISOString().split('T')[0],
      workingHours,
      tasksCompleted: tasks,
      selfEvaluation: milestone,
      isLocked: false
    };
    setLogbookEntries(prev => [...prev, entry]);
    const student = students.find(s => s.id === studentId);
    logAction(student?.name || 'Student', `Logged weekly progress for Week ${entry.weekNumber}.`);
  };

  // Action: Submit Review
  const submitReview = (studentId: string, companyId: string, companyName: string, rating: { overall: number; culture: number; learning: number }, reviewText: string, anonymize: boolean) => {
    const newReview: StudentReview = {
      id: `rev${reviews.length + 1}`,
      studentId,
      companyId,
      companyName,
      ratingOverall: rating.overall,
      ratingCulture: rating.culture,
      ratingLearning: rating.learning,
      reviewText,
      anonymize,
      timestamp: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [...prev, newReview]);
    const student = students.find(s => s.id === studentId);
    logAction(student?.name || 'Student', `Submitted internship review for "${companyName}".`);
  };

  // Action: Submit Employer Feedback
  const submitFeedback = (studentId: string, companyId: string, score: number, text: string) => {
    const newFeedback: EmployerFeedback = {
      id: `ef${employerFeedbacks.length + 1}`,
      studentId,
      companyId,
      performanceScore: score,
      feedbackText: text,
      timestamp: new Date().toISOString()
    };
    setEmployerFeedbacks(prev => [...prev, newFeedback]);
    logAction('Company HR', `Submitted performance feedback for Student ID "${studentId}".`);
  };

  // Action: Update Checklist Pillar
  const updateChecklistPillar = (appId: string, pillar: keyof PlacementChecklist, status: 'Pass' | 'Fail' | 'Pending', desc?: string) => {
    setChecklists(prev => {
      const current = prev[appId];
      if (!current) return prev;
      
      const updated = {
        ...current,
        [pillar]: status,
        [`${pillar}Desc`]: desc
      };
      
      return {
        ...prev,
        [appId]: updated
      };
    });
    logAction('Career Centre Staff', `Updated Compliance Checklist for App "${appId}" - Pillar "${pillar}" to "${status}".`);
  };

  // Action: Trigger Liaison Flag
  const triggerLiaisonFlag = (appId: string, language: string, lecturerId: string) => {
    setLiaisonFlags(prev => ({
      ...prev,
      [appId]: { language, lecturerId, bannerActive: true }
    }));
    logAction('Career Centre Staff', `Triggered Language Liaison Flag for App "${appId}" requesting "${language}" translation.`);
  };

  // Action: Resolve Liaison Flag
  const resolveLiaisonFlag = (appId: string) => {
    setLiaisonFlags(prev => {
      const copy = { ...prev };
      delete copy[appId];
      return copy;
    });
    logAction('Academic Lecturer', `Resolved Language Liaison Flag for App "${appId}".`);
  };

  // Action: Add Faculty Statement
  const addFacultyStatement = (studentId: string, author: string, statement: string) => {
    const newStmt: FacultyStatement = {
      id: `f${facultyStatements.length + 1}`,
      studentId,
      author,
      statement,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setFacultyStatements(prev => [...prev, newStmt]);
    logAction(author, `Appended Faculty Interview Statement for Student ID "${studentId}": "${statement}"`);
  };

  // Action: Add Blueprint Commit
  const addBlueprintCommit = (author: string, action: string) => {
    const commit: BlueprintCommit = {
      id: `c${blueprintCommits.length + 1}`,
      author,
      action,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setBlueprintCommits(prev => [...prev, commit]);
  };

  // Action: Upload Offer Letter
  const uploadOfferLetter = (appId: string, fileName: string) => {
    setApplications(prev => prev.map(a => a.id === appId ? {
      ...a,
      offerLetterName: fileName,
      status: 'Awaiting Offer Verification'
    } : a));
    logAction('Student', `Uploaded digital internship offer letter "${fileName}".`);
  };

  // Action: Verify Placement
  const verifyPlacement = (appId: string) => {
    const checklist = checklists[appId];
    if (
      checklist &&
      checklist.insurance === 'Pass' &&
      checklist.visa === 'Pass' &&
      checklist.payModel === 'Pass' &&
      checklist.csRelevance === 'Pass'
    ) {
      updateApplicationStatus(appId, 'Approved');
      logAction('Career Centre Staff', `Verified and Approved placement for App ID "${appId}".`);
    } else {
      console.warn("Cannot verify placement. All 4 checklist pillars must be marked as Pass.");
    }
  };

  // Action: Verify Employer
  const verifyEmployer = (companyId: string, verified: boolean) => {
    setEmployerVerifications(prev => ({
      ...prev,
      [companyId]: verified
    }));
    logAction('Career Centre Staff', `Updated Employer "${companyId}" credibility status to ${verified ? 'Verified' : 'Unverified'}.`);
  };

  // Helper: Log Action
  const logAction = (user: string, action: string) => {
    const newLog: SystemLog = {
      id: `sl${systemLogs.length + 1}`,
      user,
      action,
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setSystemLogs(prev => [newLog, ...prev]); // Prepend for recency
  };

  return (
    <PortalContext.Provider value={{
      isAuthenticated,
      loggedInUser,
      currentRole,
      setCurrentRole,
      activeSubpage,
      setActiveSubpage,
      students,
      jobs,
      applications,
      interviewSlots,
      logbookEntries,
      checklists,
      facultyStatements,
      blueprintCommits,
      systemLogs,
      reviews,
      employerFeedbacks,
      employerVerifications,
      liaisonFlags,
      
      login,
      logout,
      register,

      addJob,
      approveJob,
      rejectJob,
      applyForJob,
      withdrawApplication,
      editApplication,
      updateApplicationStatus,
      addEvaluationNote,
      createInterviewSlot,
      bookInterviewSlot,
      addLogbookEntry,
      submitReview,
      submitFeedback,
      updateChecklistPillar,
      triggerLiaisonFlag,
      resolveLiaisonFlag,
      addFacultyStatement,
      addBlueprintCommit,
      uploadOfferLetter,
      verifyPlacement,
      verifyEmployer
    }}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
