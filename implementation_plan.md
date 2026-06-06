# Implementation Plan: University Micro-Internship Matching Portal (SRE Mockup)

This plan outlines the architecture, layout, design system, and implementation steps for building a premium, interactive web mockup based on **Template 3 (Product Backlog)**, referencing **Template 2 (Requirement List)** and **Template 1 (Vision Document)**.

Based on user feedback, this mockup will be built using **React and TypeScript (Frontend-only)**, styled with a professional **light-theme career portal** aesthetic, and structured to minimize technical debt.

---

## User Review Required

We will initialize a new **Vite + React + TypeScript** project in the workspace. The application will be a client-side mockup containing all business logic, visual components, and state synchronization within the browser.

> [!IMPORTANT]
> **Mobile-Responsive Requirements (NFR-03, NFR-05, C-02):**
> The Student Portal will be built with a **mobile-first responsive design** to accommodate the constraint that students primarily access the platform via mobile phones. We will implement a responsive toggle or viewport container to preview the student screens in mobile layout, while the HR, Lecturer, and Career Centre portals are presented in desktop layouts.

> [!TIP]
> **Modular Architecture (Reducing Tech Debt):**
> We will split the codebase into clean, reusable layers:
> - `src/types/`: TypeScript interfaces mapping database entities (Student, Job, Application, Logbook, Checklist).
> - `src/context/`: A global React Context state provider acting as our reactive client-side database. Changes made in one portal (e.g. HR status changes) update the state immediately, reflecting in the student's status tracker.
> - `src/components/`: Reusable UI elements (StatusStepper, GanttChart, ReviewStars, ComplianceChecklist).
> - `src/roles/`: Modular subfolders for each persona (Student, HR, Lecturer, CareerCentre) to keep the file structure clean and extensible.

---

## Page-by-Page Content Plan

The portal will display a global header switcher allowing the user to select the active role (Student, HR, Lecturer, Career Centre). The main layout changes dynamically.

### 1. Student Portal (Mobile-First / Fully Responsive)

#### Screen 1.1: Consolidated Application Dashboard
- **Main Content:** A list view of all internship applications.
  - Tabular list/cards (stacked for mobile view): Company Name, Position Title, Submission Date, Current Status, and Actions.
  - Interactivity: Filtering dropdown by application status (Applied, Shortlisted, Screening, Interview, Offered, Rejected, Withdrawn) and sorting columns chronologically by date.
- **Quick Analytics Cards:** Summary stats displaying: Active Applications, Booked Interviews, and Weekly Logbook Completion progress.
- **Requirements Covered:** FR-28, PB-28.1, NFR-10.

#### Screen 1.2: Application Detail & Status Tracker
- **Main Content:** Detailed view of an application.
  - **Dynamic Horizontal Progress Tracker (PB-10.1):** Steps representing: `Submitted` ➔ `Under Review` ➔ `Shortlisted` ➔ `Offered` (with visual color-coding: green for current success, red for rejected, grey for upcoming).
  - **Edit Application Widget (PB-29.1):** Input fields for CV, statement of purpose, and contact details. Active only before the job deadline. Prompts confirmation modal upon save: *"Are you sure you want to save changes to your submission?"* Locks with a tooltip after the deadline.
  - **Withdraw Application Button (PB-29.2):** Triggers warning modal: *"This action cannot be undone. Are you sure you want to withdraw your application?"* Sets status to `Withdrawn` and removes student profile from employer's active funnel.
  - **Offer Letter Upload Area (PB-40.1):** File dropzone (PDF, PNG, JPEG up to 10MB). On success, triggers a toast notification and transitions status to `Awaiting Offer Verification`.
- **Requirements Covered:** FR-10, PB-10.1, PB-29.1, PB-29.2, PB-40.1.

#### Screen 1.3: Internship Discovery & Apply (Job Board)
- **Main Content:** A job feed.
  - Postings display custom specialization tags (e.g., Software Engineering, AI, Data Science, Cybersecurity) and automatically pin themselves to matching student profiles.
  - **Detailed Job Description Modal (PB-03):** Displays title, company, duration, job scope, required skills, and deadline.
  - **Apply Flow Panel:**
    - Answer open-ended screening questions configured by the employer (PB-32).
    - Submit video responses with a structured duration timer (e.g., 60-second limit indicator) (PB-31).
- **Requirements Covered:** FR-04, FR-20, FR-39, PB-03, PB-31, PB-32, PB-35.1.

#### Screen 1.4: Interview Booking
- **Main Content:** A scheduling page displaying slots.
  - Available slots show date, time, and company.
  - Interactive booking: Selecting a slot locks it instantly, removing it from other candidate lists, and triggers a success toast.
- **Requirements Covered:** FR-13, PB-27.

#### Screen 1.5: Digital Logbook
- **Main Content:** A daily/weekly hours log.
  - **Progression Gauge:** Visual ring (0% to 100%) tracking logged achievements against university learning outcomes.
  - **Entry Matrix Table:** Rows to input working hours, completed tasks, and self-evaluation milestones.
  - **Security Locking Check:** Entries older than 7 days lock automatically with an explanation tooltip.
- **Requirements Covered:** FR-31, PB-31.1.

#### Screen 1.6: Review & Milestone Rating Portal
- **Main Content:** Rating form for completed internships.
  - **Star Rating Grid:** 5-star selectors for three categories: Overall Experience, Workplace Culture, and Learning Curve.
  - **Written Feedback:** Rich text box enforcing a minimum of 50 characters and maximum of 2,000 characters (displays character count).
  - **Anonymity Toggle:** "Anonymize my review" checkbox to shield student identity on public company profiles.
- **Requirements Covered:** FR-30, PB-30.1.

---

### 2. Employer & HR Portal (Desktop Dashboard)

#### Screen 2.1: Candidate Hub & Smart Filters
- **Main Content:** A grid showing applicants.
  - **Smart Filters Sidebar:** Quick filtering controls for Skills (multi-select), CGPA (range selector, e.g., >= 3.5), Achievements, and Project Experience.
  - **Ranking System Panel:** Ranks candidates dynamically based on matches. Displays recommended profiles separately in a highlighted gold card section with detailed "Recommendation Reasons" (e.g., *"Matched 4/4 skills and >3.8 CGPA"*). Allows HR to manually override rankings.
  - **Selection Checkboxes:** For multi-candidate actions (Compare, Status change).
- **Requirements Covered:** FR-07, FR-18, FR-19, PB-20, PB-29, PB-30.

#### Screen 2.2: Side-by-Side Comparison Dashboard
- **Main Content:** Side-by-side comparison table of selected applicants.
  - Columns represent each selected student.
  - Rows show side-by-side comparisons of: CGPA, Core Skills, Achievements, Project Experience, and Screening Answers.
- **Requirements Covered:** FR-08, PB-21.

#### Screen 2.3: Candidate Evaluation & Detail View
- **Main Content:** Unified candidate dossier profile.
  - Displays personal details, skills, academic records, portfolio links, and screening responses.
  - **Video Reviewer:** Simulated video responses play with a structured evaluation overlay.
  - **Evaluation Logger (PB-23):** HR notes text area and structured scoring matrix. Adds entries to a secure audit log.
  - **Application Status Updater (PB-22):** HR status changer dropdown (Applied, Shortlisted, Screening, Interview, Offered, Rejected, KIV) that saves immediately.
  - **Recruitment Controls:** Toggles to Shortlist (PB-24) and "Forward to Hiring Manager" (PB-25 - tracks forwarding history logs).
- **Requirements Covered:** FR-05, FR-06, FR-09, FR-11, FR-12, PB-18, PB-19, PB-22, PB-23, PB-24, PB-25.

#### Screen 2.4: Interview Slot Configurator
- **Main Content:** A calendar scheduling widget.
  - HR can create interview slots (input date, time, duration).
  - **External Calendar Sync Panel:** Displays simulated status of calendar sync (Google/Outlook) showing "Synced 45 seconds ago" (within 1 min) and list of detected calendar conflicts.
- **Requirements Covered:** FR-13, FR-14, PB-26, PB-28.

#### Screen 2.5: Job & Screening Manager
- **Main Content:** Form to post/configure jobs.
  - Job details, duration, and custom Specialization Autocomplete Tags (Software Engineering, AI, Data Science, etc.).
  - Screening question set creator (link sets to job postings).
  - Video screening configuration (duration limits).
- **Requirements Covered:** PB-17, PB-32, PB-35.1.

#### Screen 2.6: Requirement Collaboration Workspace
- **Main Content:** Collaboration log shared with Career Centre.
  - Editable text fields for internship requirements, review history log, and submit feedback on student placements.
- **Requirements Covered:** PB-13, PB-14.

---

### 3. Lecturer & Academic Monitor Portal (Desktop Dashboard)

#### Screen 3.1: Supervision Dashboard
- **Main Content:** Grid view of assigned students.
  - Indicators display which students have uploaded fresh reports or weekly logbook logs (e.g., orange badge "NEW LOG UPLOADED").
  - **In-App Document Viewer:** Embeds a simulated reader pane to natively review and download reports and logs.
- **Requirements Covered:** FR-33, PB-33.1.

#### Screen 3.2: Project Gantt Timeline
- **Main Content:** Visual interactive timeline/Gantt chart of student tasks.
  - Cross-references actual student task completion dates against baseline target timelines.
  - Visual color highlights: Milestones completed on time are green, delayed milestones (slippages) show in amber (minor delay) or red (critical delay) to indicate required intervention.
- **Requirements Covered:** FR-34, PB-34.1.

#### Screen 3.3: Weekly Compliance & Visit Planner
- **Main Content:** Compliance grid showing continuous weekly logbook submission trends for all assigned students.
  - **Site Visit Planner Button:** Launches an integrated map view that pulls the company's address from the database.
  - **Routing Optimizer:** Groups companies by geographical proximity / postal zones to suggest the most efficient travel route for physical site visits.
- **Requirements Covered:** FR-41, PB-41.1, C-12.

#### Screen 3.4: Collaborative Workspace
- **Main Content:** Shared space with corporate representatives.
  - Restricted via Role-Based Access Control (displays active RBAC constraints).
  - Text editor to input, view, and append "Faculty Interview Statements" detailing internship adjustments.
  - Version control timeline tracker showing edits made to blueprints.
- **Requirements Covered:** PB-32.1.

---

### 4. Career Centre Portal (Desktop Dashboard)

#### Screen 4.1: Administrative Control Dashboard
- **Main Content:** Central hub for portal activity.
  - Active postings, student participation count, and employer stats.
  - **Employer Verification Panel:** Career Centre reviews employer profiles and supporting documents. Toggles to verify credibility (unverified employers are blocked from publishing).
  - **Listing Approval Gatekeeper:** Reviews job drafts and approves them (visible to students) or rejects them (requires providing a mandatory rejection reason, triggers employer notification, and logs action).
- **Requirements Covered:** FR-42, FR-43, FR-47, FR-48, PB-04, PB-05, PB-06, PB-10, PB-11, PB-12.

#### Screen 4.2: Placement Compliance Checklist Matrix
- **Main Content:** Grid tracking all active placements.
  - **4-Pillar Verification Matrix:** For each placement, shows Insurance Validation, Visa Status Compliance, Pay Model Legality, and CS Academic Relevance.
  - Toggles (Pass / Fail / Pending Review) for each pillar. If marked as `Fail`, displays a mandatory text box for reason description.
  - **Approval Lock:** The overall status cannot transition to `Approved` unless all four pillars are positively checked off.
- **Requirements Covered:** FR-36, PB-36.1.

#### Screen 4.3: Language Liaison Controller
- **Main Content:** International website screening panel.
  - Action button to "Trigger Language Liaison" for non-translatable company websites.
  - Dialogue box to select the required language expertise.
  - Platform cross-references the staff directory and notifies lecturers with matching language proficiencies.
  - Appends an "International Review Banner" blocking the placement status until cleared.
- **Requirements Covered:** FR-37, PB-37.1.

#### Screen 4.4: Reports & Analytics Hub
- **Main Content:** Interactive charts (drawn natively via inline SVGs for maximum crispness and performance).
  - **Placement Reports:** Student placements, accepted/rejected trends, participating industries. Filterable by date range.
  - **PDF Generator Card:** Button to compile and download internship outcome reports in PDF format.
  - **AI Analysis Module:** Processes supervisor feedback forms to:
    - Generate concise summaries of major feedback points.
    - Compile trend analytics highlighting common strengths and weaknesses.
- **Requirements Covered:** FR-38, FR-44, FR-45, FR-46, FR-52, PB-01, PB-02, PB-07, PB-08, PB-09, PB-15, PB-16.

---

## Directory and File Structure

To minimize technical debt and ensure ease of development, the project will follow this structure:

```
sre-matching-portal/
├── index.html                  # Entry page loading the React application
├── package.json                # Project dependencies
├── vite.config.ts              # Vite TS configuration
├── src/
│   ├── main.tsx                # App bootstrap
│   ├── App.tsx                 # Core shell (role switcher, sidebar, active views router)
│   ├── index.css               # Shared light-theme CSS variables and global typography
│   ├── types/
│   │   └── index.ts            # Shared TypeScript interfaces for data entities
│   ├── context/
│   │   └── PortalState.tsx     # Reactive state database & action triggers
│   ├── components/             # Reusable UI components
│   │   ├── GanttChart.tsx      # Timeline milestone renderer
│   │   ├── Stepper.tsx         # Horizontal status tracker
│   │   ├── RatingStars.tsx     # Star ratings for internship review
│   │   ├── SVGChart.tsx        # Inline SVG charts for reports
│   │   └── MobileFrame.tsx     # Viewport simulator to preview mobile layout
│   └── roles/                  # Role-based workspace dashboards
│       ├── StudentPortal.tsx   # Dashboard, discovery, logs, booking, ratings
│       ├── EmployerPortal.tsx  # Filtering, comparison, scheduling, configurators
│       ├── LecturerPortal.tsx  # Supervision, compliance matrix, visit planner
│       └── CareerCentre.tsx    # Compliance checklist, verifications, reports hub
```

---

## Verification Plan

We will verify the mockup locally.

### Manual Verification
- Deploy a local web server via `npm run dev` (Vite dev server) and view the mockup in a web browser.
- Verify that status updates, posting approvals, and booking events propagate instantly across role views.
- Test that student views scale gracefully on mobile viewports.
