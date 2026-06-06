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

interface PortalContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
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
  
  // Actions
  addJob: (job: Omit<Job, 'id' | 'logo' | 'isApproved' | 'createdAt'>) => void;
  approveJob: (jobId: string) => void;
  rejectJob: (jobId: string, reason: string) => void;
  applyForJob: (
    jobId: string,
    studentId: string,
    sop: string,
    screeningAnswers: Record<string, string>,
    videoUrl?: string
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
  employerVerifications: Record<string, boolean>; // companyId -> verified
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

// Initial Mock Data Seeding
const mockStudents: Student[] = [
  {
    id: 's1',
    name: 'Julian',
    email: 'julian@university.edu.my',
    phone: '+60 12-345 6789',
    cgpa: 3.82,
    skills: ['React', 'TypeScript', 'Node.js', 'Cloud Ops', 'HTML', 'CSS'],
    achievements: ['Dean\'s List Award (Sem 1-5)', '1st Place Hackathon 2025', 'Google cloud cert'],
    projects: ['Distributed Cloud System', 'Academic Planner Web App', 'Vulnerability Scanner'],
    matricNumber: 'WIA210045',
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
    title: 'Software Engineer Intern',
    companyName: 'Arvato Systems',
    companyId: 'c_arvato',
    duration: '3 months',
    scope: 'Develop and maintain web applications using React, TypeScript, and Node.js. Learn and apply cloud deployment methodologies.',
    requiredSkills: ['React', 'TypeScript', 'Node.js', 'HTML', 'CSS'],
    specializationTags: ['Software Engineering', 'Web Development'],
    deadline: '2026-06-30',
    screeningQuestions: [
      'Describe a complex programming project you worked on and the technical hurdles you overcame.',
      'Explain your experience with React state management models.'
    ],
    videoDurationLimit: 60,
    isApproved: true,
    createdAt: '2026-06-01',
    logo: '💼'
  },
  {
    id: 'j2',
    title: 'UI/UX Designer Intern',
    companyName: 'Arvato Systems',
    companyId: 'c_arvato',
    duration: '3 months',
    scope: 'Conduct user research, draft wireframes, and design interactive prototypes in Figma for enterprise portal applications.',
    requiredSkills: ['Figma', 'UI/UX', 'HTML', 'CSS'],
    specializationTags: ['UI/UX', 'Software Engineering'],
    deadline: '2026-06-25',
    screeningQuestions: [
      'Provide a link to your design portfolio and explain the design thinking process behind your favorite project.',
      'How do you hand off designs to front-end developers?'
    ],
    videoDurationLimit: 90,
    isApproved: true,
    createdAt: '2026-06-02',
    logo: '🎨'
  },
  {
    id: 'j3',
    title: 'Data Analyst Intern',
    companyName: 'TechCorp Solutions',
    companyId: 'c_techcorp',
    duration: '6 months',
    scope: 'Extract, clean, and analyze customer usage data using SQL and Python. Build interactive dashboards in Tableau to visualize metrics.',
    requiredSkills: ['SQL', 'Python', 'Tableau', 'Pandas'],
    specializationTags: ['Data Science'],
    deadline: '2026-06-28',
    isApproved: true,
    createdAt: '2026-06-03',
    logo: '📈',
    screeningQuestions: [
      'Describe a time you solved a business problem using data analytics.',
      'What is your experience with database optimization and query writing?'
    ],
    videoDurationLimit: 120
  },
  {
    id: 'j4',
    title: 'Machine Learning Assistant',
    companyName: 'TechCorp Solutions',
    companyId: 'c_techcorp',
    duration: '3 months',
    scope: 'Train and evaluate NLP and computer vision models using PyTorch. Assist with data preprocessing pipelines for machine learning datasets.',
    requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'Machine Learning'],
    specializationTags: ['AI', 'Data Science'],
    deadline: '2026-06-15',
    isApproved: false, // Pending Approval
    createdAt: '2026-06-05',
    logo: '🤖',
    screeningQuestions: [
      'What ML frameworks do you prefer and why?',
      'Detail your project experience implementing deep neural networks.'
    ],
    videoDurationLimit: 180
  },
  {
    id: 'j5',
    title: 'Digital Marketing Support',
    companyName: 'Spam Inc',
    companyId: 'c_spam',
    duration: '2 months',
    scope: 'Spam social media feeds with copy-paste marketing posts. Work is commission-only base ($50 flat per month base). Non-technical role.',
    requiredSkills: ['Copywriting', 'Social Media'],
    specializationTags: ['Marketing'],
    deadline: '2026-06-12',
    isApproved: false, // Pending Approval, violates guidelines (cheap labor, non-CS tasks)
    createdAt: '2026-06-06',
    logo: '⚠️',
    screeningQuestions: ['Are you willing to work on a 100% commission basis?'],
    videoDurationLimit: 60
  }
];

const mockApplications: Application[] = [
  {
    id: 'a1',
    jobId: 'j1',
    studentId: 's1', // Julian applied to Software Eng at Arvato
    submissionDate: '2026-06-02',
    status: 'Interview',
    cvName: 'Julian_CV_WIA210045.pdf',
    statementOfPurpose: 'I wish to expand my full-stack programming capabilities in an enterprise setting, focusing on React and cloud systems.',
    contactEmail: 'julian@university.edu.my',
    contactPhone: '+60 12-345 6789',
    screeningAnswers: {
      '0': 'I built a distributed storage server cluster using Node.js and WebSockets. The primary hurdle was synchronizing file consistency, which I solved using a simplified Raft consensus algorithm.',
      '1': 'I am highly experienced with Redux Toolkit and Context API. I prefer Context API for lightweight state containers and Redux for complex, multi-layered dashboards.'
    },
    videoResponseUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'
  },
  {
    id: 'a2',
    jobId: 'j2',
    studentId: 's2', // Maya applied to UI/UX at Arvato
    submissionDate: '2026-06-03',
    status: 'Screening',
    cvName: 'Maya_UX_Resume.pdf',
    statementOfPurpose: 'Designing beautiful interfaces is my passion. I want to learn how Arvato implements enterprise-grade design systems.',
    contactEmail: 'maya@university.edu.my',
    contactPhone: '+60 17-654 3210',
    screeningAnswers: {
      '0': 'Here is my portfolio link: behance.net/mayadesigns. For my e-commerce project, I conducted user interviews of 10 students, identified navigation friction, and re-designed the layout resulting in 40% faster checkout.',
      '1': 'I use Figma Dev Mode, group styles systematically into variables (tokens), and generate automated CSS classes to make translation simple for devs.'
    }
  },
  {
    id: 'a3',
    jobId: 'j3',
    studentId: 's4', // Sophia applied to Data Analyst at TechCorp
    submissionDate: '2026-06-04',
    status: 'Applied',
    cvName: 'Sophia_Data_Analyst.pdf',
    statementOfPurpose: 'To leverage my statistical analytics training to drive product decisions.',
    contactEmail: 'sophia@university.edu.my',
    contactPhone: '+60 13-987 6543',
    screeningAnswers: {
      '0': 'I analyzed campus library attendance logs and identified that adding seating during peak study hours would reduce overcrowding. The college board implemented this based on my report.',
      '1': 'I write nested subqueries, CTEs, and window functions in SQL Server and Postgres. I also configure index profiles to speed up heavy queries.'
    }
  }
];

const mockInterviewSlots: InterviewSlot[] = [
  { id: 'is1', jobId: 'j1', companyName: 'Arvato Systems', date: '2026-06-15', time: '10:00 AM' },
  { id: 'is2', jobId: 'j1', companyName: 'Arvato Systems', date: '2026-06-15', time: '11:30 AM', bookedBy: 's1' },
  { id: 'is3', jobId: 'j1', companyName: 'Arvato Systems', date: '2026-06-16', time: '02:00 PM' },
  { id: 'is4', jobId: 'j2', companyName: 'Arvato Systems', date: '2026-06-18', time: '10:00 AM' },
  { id: 'is5', jobId: 'j3', companyName: 'TechCorp Solutions', date: '2026-06-20', time: '09:00 AM', conflictDetected: true }
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
  { id: 'f1', studentId: 's1', author: 'Dr. Aris', statement: 'Initial review of Julian\'s task assignments confirms deep software engineering alignment. No adjustments required.', timestamp: '2026-06-03 10:00 AM' },
  { id: 'f2', studentId: 's1', author: 'Puan Aisyah', statement: 'We agree with the academic assessment. Julian is adapting very quickly to our development workflows.', timestamp: '2026-06-04 02:30 PM' }
];

const mockBlueprintCommits: BlueprintCommit[] = [
  { id: 'c1', author: 'Dr. Aris', action: 'Created collaborative workspace & uploaded WIA3001 Syllabus blueprint.', timestamp: '2026-06-01 09:00 AM' },
  { id: 'c2', author: 'Puan Aisyah', action: 'Modified project alignment details - added React/Typescript scope.', timestamp: '2026-06-02 11:15 AM' }
];

const mockSystemLogs: SystemLog[] = [
  { id: 'sl1', user: 'Puan Siti', action: 'Approved Job Posting "Software Engineer Intern" for Arvato Systems.', timestamp: '2026-06-01 10:00 AM' },
  { id: 'sl2', user: 'Puan Siti', action: 'Approved Job Posting "UI/UX Designer Intern" for Arvato Systems.', timestamp: '2026-06-02 11:30 AM' },
  { id: 'sl3', user: 'Puan Siti', action: 'Verified Employer "Arvato Systems" profile status to Credible.', timestamp: '2026-06-01 09:30 AM' }
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
  'c_spam': false
};

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>('Student');
  const [students] = useState<Student[]>(mockStudents);
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

  // Action: Add Job
  const addJob = (newJob: Omit<Job, 'id' | 'logo' | 'isApproved' | 'createdAt'>) => {
    const job: Job = {
      ...newJob,
      id: `j${jobs.length + 1}`,
      logo: '💼',
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
    videoUrl?: string
  ) => {
    const student = students.find(s => s.id === studentId);
    const newApp: Application = {
      id: `a${applications.length + 1}`,
      jobId,
      studentId,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Applied',
      cvName: `${student?.name || 'Student'}_Resume.pdf`,
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

    logAction(student?.name || 'Student', `Submitted application for Job ID "${jobId}".`);
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

  // Automatically sync audit logs for actions
  return (
    <PortalContext.Provider value={{
      currentRole,
      setCurrentRole,
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
