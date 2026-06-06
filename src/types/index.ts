export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  cgpa: number;
  skills: string[];
  achievements: string[];
  projects: string[];
  matricNumber: string;
  avatar: string;
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyId: string;
  duration: string; // e.g. "3 months"
  scope: string;
  requiredSkills: string[];
  specializationTags: string[];
  deadline: string; // ISO date string
  screeningQuestions: string[];
  videoDurationLimit: number; // in seconds
  isApproved: boolean;
  rejectionReason?: string;
  createdAt: string;
  logo: string;
}

export interface Application {
  id: string;
  jobId: string;
  studentId: string;
  submissionDate: string;
  status: 'Applied' | 'Shortlisted' | 'Screening' | 'Interview' | 'Offered' | 'Rejected' | 'KIV' | 'Withdrawn' | 'Awaiting Offer Verification' | 'Approved';
  cvName: string;
  cvUrl?: string;
  statementOfPurpose: string;
  contactEmail: string;
  contactPhone: string;
  screeningAnswers: Record<string, string>; // question index -> answer
  videoResponseUrl?: string; // mock video URL
  offerLetterName?: string;
  offerLetterUrl?: string;
  feedbackSubmitted?: boolean;
}

export interface InterviewSlot {
  id: string;
  jobId: string;
  companyName: string;
  date: string; // e.g. "2026-06-15"
  time: string; // e.g. "10:00 AM"
  bookedBy?: string; // studentId
  conflictDetected?: boolean;
}

export interface LogbookEntry {
  id: string;
  studentId: string;
  weekNumber: number;
  date: string;
  workingHours: number;
  tasksCompleted: string;
  selfEvaluation: string; // milestone
  isLocked: boolean; // locked if older than 7 days
}

export interface PlacementChecklist {
  applicationId: string;
  insurance: 'Pass' | 'Fail' | 'Pending';
  insuranceDesc?: string;
  visa: 'Pass' | 'Fail' | 'Pending';
  visaDesc?: string;
  payModel: 'Pass' | 'Fail' | 'Pending';
  payModelDesc?: string;
  csRelevance: 'Pass' | 'Fail' | 'Pending';
  csRelevanceDesc?: string;
}

export interface FacultyStatement {
  id: string;
  studentId: string;
  author: string;
  statement: string;
  timestamp: string;
}

export interface BlueprintCommit {
  id: string;
  author: string;
  action: string; // e.g. "Uploaded blueprint.pdf"
  timestamp: string;
}

export interface SystemLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
}

export interface StudentReview {
  id: string;
  studentId: string;
  companyId: string;
  companyName: string;
  ratingOverall: number;
  ratingCulture: number;
  ratingLearning: number;
  reviewText: string;
  anonymize: boolean;
  timestamp: string;
}

export interface EmployerFeedback {
  id: string;
  studentId: string;
  companyId: string;
  performanceScore: number; // 1-5
  feedbackText: string;
  timestamp: string;
}
