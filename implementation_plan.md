# Implementation Plan - Employer Profile Sourcing & Verification (FR-47 / PB-10)

Enhance the Career Centre's Employer Verification tab to act as an Employer Profile Management workspace, allowing staff to review detailed corporate credentials, download business certificates, and verify credibility.

## User Review Required

> [!IMPORTANT]
> To support employer profile management and verification audit logs:
> 
> * **New Employer Profile Model:**
>   * Add an `EmployerProfile` interface in `types/index.ts` with contact, description, and business certificate document metadata.
>   * Seed rich mock details for Arvato Systems, TechCorp, Datum Technology, IJM Corporation, and Spam Inc in `PortalState.tsx`.
> * **Sidebar Relabeling:**
>   * Relabel the Career Centre's sidebar tab from "Employer Verification" to **"Employer Profiles"** (icon: `🏢`, ID: `verification`).
> * **Profile & Verification Layout:**
>   * Split the page into two clear sections:
>     * **Pending Verification Requests** (Unverified employers, displayed prominently at the top).
>     * **Verified Corporate Partners Directory** (Verified employers, listed below).
> * **Dossier Detail Modal:**
>   * Clicking **"View Details"** on any employer card opens a professional details dossier overlay showing:
>     * Industry & location badges.
>     * Detailed description and website link.
>     * Primary contact person name, email, and phone.
>     * SSM Business Registration Certificate attachment (with simulated download action).
>     * Verification action buttons to audit and toggle credibility status.

## Proposed Changes

### Data Models

#### [MODIFY] [types/index.ts](file:///c:/Users/user/Desktop/My%20Files/code/SRE/src/types/index.ts)
* Add `EmployerProfile` export interface.

### Portal Context

#### [MODIFY] [context/PortalState.tsx](file:///c:/Users/user/Desktop/My%20Files/code/SRE/src/context/PortalState.tsx)
* Add `employerProfiles` to context types and values.
* Initialize `employerProfiles` with mock data.
* Update `verifyEmployer` action to toggle verification in the `employerProfiles` array and `employerVerifications` map simultaneously.

### Career Centre Portal

#### [MODIFY] [roles/CareerCentre.tsx](file:///c:/Users/user/Desktop/My%20Files/code/SRE/src/roles/CareerCentre.tsx)
* Retrieve `employerProfiles` from context instead of hardcoding employer IDs.
* Add local state `viewEmployerId` to track the profile selected for the details modal.
* Refactor `activeSubpage === 'verification'` view:
  * Filter and display unverified profiles in a top card group.
  * Filter and display verified profiles in a bottom catalog table/grid.
  * Implement the Dossier details modal.

### App Shell Router

#### [MODIFY] [App.tsx](file:///c:/Users/user/Desktop/My%20Files/code/SRE/src/App.tsx)
* Change `'verification'` sidebar link label to `'Employer Profiles'`.

---

## Verification Plan

### Automated Tests
* Run `npm run build` to verify clean compilation.

### Manual Verification
1. **Login as Career Centre (`siti@university.edu.my` / CareerCentre):**
   * Navigate to **"Employer Profiles"**.
   * Verify that **Spam Inc** is shown under **"Pending Verification Requests"** at the top.
   * Verify that **Arvato Systems**, **IJM Corp**, etc. are listed under **"Verified Corporate Partners Directory"**.
   * Click **"View Details"** on **Spam Inc**. Verify the modal opens and lists its registration certificate (`Fake_SSM_License.png`), contact person, and description.
   * Click **"Mark Verified"** in the modal. Verify Spam Inc instantly moves to the Verified Partners list.
   * Click **"View Details"** on **Datum Technology**, click **"Revoke Verification"**, and verify it moves back to the Pending Verification section.
