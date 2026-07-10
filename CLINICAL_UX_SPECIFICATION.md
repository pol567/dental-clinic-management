# Clinical UX Architecture & Design System Specification
**Project:** Echevaria Dental Clinic Operations System  
**Role:** Lead Frontend Architect, Design Engineer, UX Architect, & Senior Product Designer  
**Document Classification:** Architecture Decision Record (ADR) & Product Design Specification  
**Status:** Approved for Phase 1 & 2 Implementation  

---

## 1. Executive Summary

The Echevaria Dental Clinic Operations System is a professional, high-density Dental Electronic Health Record (EHR) and Practice Management platform designed to sustain dentists, dental assistants, and administrative staff through 6–8 hour shifts of continuous, intense clinical operations. 

This document serves as the master **Clinical UX Architecture & Design System Specification**. It defines a shift from typical "dashboard-style" SaaS applications toward a unified, high-performance, single-environment **Patient Workspace**. The Patient Workspace adapts contextually to distinct clinical modes (Intake, Charting, Billing, History Review) while maintaining extreme informational density, zero unnecessary context-switching, and absolute compliance with clinical safety and Philiipine statutory requirements (including the Data Privacy Act RA 10173 and BIR-compliant senior/PWD tax-exempt calculations).

---

## 2. Product Understanding

The product is a highly specialized clinical operating system. It operates at the intersection of medical recording, dental mapping, financial invoicing, and audit compliance.

### Core Domain & Entities:
*   **Patient Profile:** Comprehensive demographic records, historical treatment courses, legal consent logs, and systemic medical health history.
*   **Active Encounter (Visit):** The fundamental stateful context. A patient visit has a strict clinical lifecycle: Chief Complaint recording → Diagnostic Evaluation & Charting → Active Treatment Procedures → Billing Calculation → Payment Settlement & Ledger Sync.
*   **Treatment Plan (Case):** A multi-visit sequential blueprint of planned clinical interventions (e.g., full-mouth rehabilitation, root canal therapy series).
*   **Odontogram (Dental Chart):** A spatial physical grid mapping of 32 adult teeth and 20 primary teeth. It represents the historical, current, and planned (append-only) state of the patient's dentition.
*   **Patient Ledger:** An immutable double-entry ledger tracking patient financial balances (debits from logged procedures, credits from payments or discounts).

### Primary Users & Needs:
1.  **Clinician (Dentist / Dental Surgeon):** Needs immediate visual access to systemic health warnings, high-precision charting with zero-latency tooth selection, rapid procedure logging, and instant review of chronological tooth event histories.
2.  **Reception & Clinical Staff:** Needs rapid patient lookup, automated statutory discount capture (TIN / OSCA / PWD card snapshots), swift intake recording, and clear ledger balances for transaction closing.

---

## 3. Product & Design Principles

### Product Design Principles
1.  **Clinical Safety First:** Systemic medical hazards (allergies, cardiovascular risk, bleeding tendencies) must be visible across all clinical views, prioritized by medical severity.
2.  **Minimize Context Switching:** The clinician must never be forced to navigate to a separate page to complete a sub-action during an active encounter.
3.  **Surface Critical Information:** High-value data fields must be persistent, while secondary actions are progressively disclosed in context.
4.  **Optimize for Repetition:** Reduce click distances, scrolling depths, and form submissions. If a clinical action can be accomplished with a single keyboard stroke or touch gesture, it must be.
5.  **One Source of Truth:** Data must not be duplicated or simulated in parallel states; the local memory must match the permanent database record deterministically.
6.  **Progressive Disclosure:** Keep details hidden until relevant to reduce cognitive load, but keep them accessible within 1-click inside the workspace.
7.  **Keyboard First:** Provide full power-user keyboard operation for tooth selection, condition charting, and command navigation.
8.  **Tablet Friendly:** Touch targets must accommodate gloved hands (minimum 44px for buttons, responsive SVG charts with padded active hitboxes).
9.  **Auditability by Default:** Every diagnosis, procedure completed, payment received, and discount applied must write to an immutable audit record or double ledger.
10. **Performance Before Animation:** Absolute zero-latency feel takes priority over decorative transition animations.

### Clinical Workflow Principles
*   **Every workflow begins with the Patient.** No clinical records are exposed or manipulated outside an active patient context.
*   **The Visit is the primary working context.** All diagnosis and procedure logging are bound to a specific encounter record.
*   **Navigation must never interrupt treatment.** Changing views or panels must preserve state and never discard unsaved clinical data.
*   **The Odontogram is the primary interaction surface during charting.** Selecting a tooth acts as a localized query filter, bringing relevant historical and planned records to the forefront.
*   **Billing is a consequence of procedures, not a separate workflow.** Bills are compiled directly from completed encounter items, minimizing human error.
*   **Historical information should always remain accessible during treatment.** Prior radiographs, diagnostic comments, and old procedures are 1 click away.
*   **Users should never lose unsaved work.** Active drafts (open encounters, active billing lines) are held in memory and persisted against sudden crashes.

---

## 4. Strengths of the Current Architecture

1.  **Unified Global State Engine (`clinic-state.tsx`):** Centralizes all records, transaction registries, and diagnostic logs into a cohesive, atomic state. It prevents desynchronization between different screens.
2.  **Statutory Tax-Exemption Calculations:** Built-in logic correctly strips the 12% Philippine Value-Added Tax (VAT) from the total amount first, then applies the mandatory 20% senior citizen / PWD discount on the resulting net base, fully complying with BIR audit requirements.
3.  **Strict Gating Boundaries (RBAC):** Restricts access to sensitive clinical data (such as dental charts and diagnostic logs) to Dentists only, ensuring adherence to the Philippine Data Privacy Act (RA 10173).
4.  **FDI World Dental Federation Notation:** Uses standard two-digit FDI notation for teeth, aligning perfectly with professional dental practice in the Philippines.

---

## 5. Domain Boundaries

To prevent architectural decay and ensure clear separation of concerns, the application strictly respects five distinct domain boundaries:

```
[Patient Profile] ──> [Active Visit] ──> [Clinical Records] ──> [Billing] ──> [Ledger & Payments]
```

1.  **Patient Domain:** Manages personal identity, contact details, medical history questionnaires, legal consent documents, and statutory identifiers.
2.  **Encounter (Visit) Domain:** Governs the state of the active clinical session, including start time, chief complaint, general visual observations, and overall closure status.
3.  **Clinical Records Domain (Diagnoses, Tooth Events, Procedures):** Handles tooth-specific clinical data. *A Diagnosis represents an observed pathology. A Tooth Event represents a historical or current state. A Procedure represents a completed, billable intervention.*
4.  **Billing Domain:** Computes VAT-inclusive subtotals, statutory discount nets, and custom promotional reductions. Produces immutable finalized invoices.
5.  **Ledger & Payment Domain:** Manages the running financial balance of the patient. Records cash, credit, e-wallet, or bank transfer payments, adjusting the patient's account balance accordingly.

---

## 6. UX Findings & Clinical Safety Hierarchy

### Clinical Alert Severity Matrix:
Critical medical alerts must be permanently surfaced on the top pane of the Patient Workspace when the patient profile is active, split into three clear tiers of clinical severity:

| Severity Level | Trigger Conditions | UI Presentation | Actions Required |
| :--- | :--- | :--- | :--- |
| **Tier 1: Critical Alert** | Severe drug/substance allergies (e.g., Lidocaine, Penicillin), active pregnancy, bleeding disorders. | High-contrast, flashing crimson border, alert icon, bold sans-serif text. | Requires explicit clinician confirmation or acknowledgment when opening the encounter. |
| **Tier 2: Warning Alert** | Chronic conditions (Hypertension, Diabetes, Cardiac Pacemaker), active blood-thinning medications. | High-contrast amber banner, warning sign icon, dark-amber text. | Surfaced next to procedure logging panels to ensure alternative local anesthetics are selected. |
| **Tier 3: Information Alert** | Outstand balances (debt), unacknowledged legal consent sheets, pending treatment plans. | Clean slate-blue badge, standard info icon, neutral slate text. | Informational only; positioned in secondary headers. |

---

## 7. The Unified "Patient Workspace" Concept

We officially define and implement the **Patient Workspace** as the primary operating interface of the application. 

Once a patient is selected, the application behaves as a single-environment screen. The workspace dynamically adapts its visual pane structure based on the active **Work Mode**, while preserving the persistent Patient Context Header and Medical Alert Banner at all times.

### The Four Workspace Modes:
```
┌────────────────────────────────────────────────────────────────────────┐
│                      Persistent Patient Identity                       │
│                        & Severity Alert Banner                         │
├────────────────────────────────────────────────────────────────────────┤
│ Adaptive Pane 1           │ Adaptive Pane 2        │ Adaptive Pane 3   │
│ (Varies by Mode)          │ (Varies by Mode)       │ (Varies by Mode)  │
└────────────────────────────────────────────────────────────────────────┘
```

#### A. Patient Intake Mode (Active when registering or updating records)
*   **Left Pane (30% Width):** Core demographic form fields, OSCA / PWD statutory card input, legal guardian information.
*   **Center Pane (40% Width):** Systemic medical questionnaire checklist with detailed medical annotation inputs.
*   **Right Pane (30% Width):** Digital consent form selection, terms review, and signature acknowledgment panel.

#### B. Clinical Charting Mode (Active during dental examinations and operations)
*   **Left Pane (25% Width):** Chronological historical encounter logs, past diagnoses, and complete clinical audit timeline.
*   **Center Pane (50% Width):** Main interactive Odontogram SVG (toggleable between Adult 32 and Deciduous 20 teeth charts). 
*   **Right Pane (25% Width):** Contextual Tooth Detail Inspector. *Selecting any tooth on the Odontogram automatically updates this pane to show current conditions, previous treatments, and procedure logs for that tooth, along with rapid charting action buttons.*

#### C. Invoicing & Billing Mode (Active when compiling charges)
*   **Left Pane (30% Width):** Summary of all completed procedures inside the active encounter, including base prices and billable checkmarks.
*   **Center Pane (40% Width):** Draft Invoice Line Items, editable unit prices, and statutory/promotional discount toggle options.
*   **Right Pane (30% Width):** BIR-compliant Tax Audit Calculation Dock showing real-time net-of-VAT base computations and final grand totals.

#### D. Ledger & History Mode (Active during financial reviews and payment settlement)
*   **Left Pane (35% Width):** Comprehensive list of past issued bills and payment records with current receipt details.
*   **Center Pane (40% Width):** Chronological, immutable patient double-entry ledger statement showing chronological debit and credit lines.
*   **Right Pane (25% Width):** Payment Settlement Terminal (cash, card, GCash, or bank wire selector) with instant outstanding balance calculation.

---

## 8. Interaction Model & Keyboard Support

### Interaction Model Principles:
*   **Autosave:** All patient intake, dental charting notes, and billing parameters are automatically cached in memory to protect against sudden network disconnects or browser refreshes.
*   **Undo/Redo:** Every condition logged on the dental chart has a 1-click "Undo" capability inside the active tooth inspector.
*   **Dirty State Indicators:** Any unsaved clinical records or active billing draft triggers a persistent warning indicator on the close action.

### Global Keyboard Command Palette:
Pressing **`Ctrl + K`** triggers a global overlay allowing rapid system-wide search and navigation. The following keyboard shortcut mapping is built directly into the patient workspace:

| Shortcut | Context | Target Action |
| :--- | :--- | :--- |
| **`/`** | Global | Focuses the main patient search input bar. |
| **`Ctrl + K`** | Global | Launches the Command Palette (search patients, trigger actions). |
| **`Esc`** | Workspace | Clears active tooth selection, closes modals, or exits active panels. |
| **`T`** | Charting Mode | Focuses keyboard control onto the Odontogram. |
| **`Alt + Left / Right`** | Charting Mode | Moves active selection to the previous / next tooth chronologically. |
| **`D`** | Charting Mode | Quick-logs a condition of "Decayed" (Decay) onto the active tooth. |
| **`F`** | Charting Mode | Quick-logs a condition of "Filled" (Filling) onto the active tooth. |
| **`X`** | Charting Mode | Quick-logs a condition of "Missing" (Extraction) onto the active tooth. |
| **`M`** | Charting Mode | Quick-logs a condition of "Crown" (Crown cementation) onto the active tooth. |
| **`Ctrl + S`** | Billing Mode | Finalizes and locks the draft invoice, advancing to the payment panel. |
| **`?`** | Global | Opens the keyboard shortcut reference panel. |

---

## 9. Design System Proposal (Healthcare-Grade)

This design system is styled using Tailwind CSS tokens, optimizing for high readability, low eye fatigue during 8-hour shifts, and a premium clinical aesthetic.

### Typography Hierarchy (Sans-Serif & Mono):
*   **Display Font:** `Inter` (Sans-Serif) with tight tracking, optimized for clean UI structure.
*   **Code / Audit Font:** `JetBrains Mono` or `Fira Code` (Monospace), reserved for clinical identifiers, transaction logs, tax calculations, and timestamps.

| Token | Class | Utility |
| :--- | :--- | :--- |
| **Display Heading** | `font-sans text-xl font-bold tracking-tight text-slate-900` | Section titles, patient names. |
| **Subheading** | `font-sans text-sm font-semibold tracking-wide text-slate-500 uppercase` | Panel headers, alert labels. |
| **High-Density Body** | `font-sans text-xs font-semibold text-slate-800` | Form labels, table content, clinical notes. |
| **Mono Data** | `font-mono text-xs font-bold text-slate-600` | Reference IDs, financial numbers, time values. |

### Color Tokens:
*   **Canvas Base:** `#F8F7F5` (Warm off-white) — reduces screen brightness glare on tablet screens.
*   **Primary Interactive:** `#0E7490` (`cyan-700`) — clinical blue-green, representing high professionalism and cleanliness.
*   **Primary Hover:** `#155E75` (`cyan-800`).
*   **Secondary Interactive:** `#0F172A` (`slate-900`) — high-contrast slate.
*   **Success state:** `#059669` (`emerald-600`) — safe, paid, completed.
*   **Warning state:** `#D97706` (`amber-600`) | Danger: `#DC2626` (`red-600`).

### Spacing & Borders:
*   **Unified Corner Radius:** `0.75rem` (`rounded-xl`) for small action assets; `1rem` (`rounded-2xl`) for main cards; `1.5rem` (`rounded-3xl`) for primary layout panes. *Avoids cartoonish oversized rounded corners.*
*   **Borders:** `1px` crisp borders styled with `#E2E8F0` (`slate-200/80`) to separate tables and panels without heavy visual partitions.
*   **Elevation (Shadows):** High-density interfaces should use minimal shadow elevations (`shadow-sm`) to avoid muddy visual overlaps. Use deep shadows (`shadow-xl`) only for modal dialogs and command overlays.

---

## 10. Performance Budgets

To ensure the EHR is lightning-fast and responsive during medical operations, the frontend architecture complies with the following performance thresholds:

| Metric | Measurement Area | Budget Limit |
| :--- | :--- | :--- |
| **Initial App Load Time** | Splash screen to fully interactive state | `< 2.0 seconds` |
| **Patient Profile Switch** | Tapping patient row to complete workspace repaint | `< 300 milliseconds` |
| **Tooth Selection Latency** | Tapping tooth SVG to details panel update | `< 50 milliseconds` |
| **Odontogram Redraw** | Dentition toggle (Adult vs Deciduous) repaint | `< 16 milliseconds` (60fps) |
| **Live Database Search** | Keyboard input to matching list results display | `< 150 milliseconds` |
| **Workspace Mode Change** | Transitioning between clinical charting and billing | `< 100 milliseconds` |

*Requirement:* Ensure persistence updates are handled asynchronously and never block the main rendering thread or introduce cascading React state synchronization failures.

---

## 11. Design Review Checklist

Before any workspace UI modification is finalized, the code must be evaluated against this strict quality control checklist:

*   [ ] **Clinical Alert Prominence:** Are critical allergies and drug warnings prominently visible on the active view?
*   [ ] **Zero-Context Switching:** Can a clinician perform charting, diagnosis, and billing without navigating away from the active Patient Workspace?
*   [ ] **No Over-Rounded Corner Slop:** Are border-radius styles kept to precise, professional enterprise scales (`rounded-xl` / `rounded-2xl`)?
*   [ ] **High Density & Readability:** Does the screen density avoid giant, wasteful vertical spacing? Are text labels readable under bright clinical lights?
*   [ ] **Full Keyboard Support:** Can a power-user select a tooth, register a basic decay condition, and close the panel using keyboard shortcuts?
*   [ ] **Touch Targets Compliant:** Are critical interactive buttons at least `44px` in height/width for glove-wearing tablet users?
*   [ ] **BIR Audit Compliance:** Are senior citizen or PWD discount tax exemptions calculated netting out the 12% VAT first?
*   [ ] **No Mock Infrastructure:** Are port numbers, debug lines, network pings, or simulated console logs hidden from the patient workspace?
*   [ ] **Component Reusability:** Does the page construct strictly reuse the primitives declared in the Component Specification?

---

## 12. Prioritized Action Plan

To systematically refactor the existing code toward this unified Clinical UX, the development roadmap is scheduled in five distinct progressive phases:

### Phase 1: Core Design System & Global Shortcut Engine (Current Phase)
1.  Establish the `/CLINICAL_UX_SPECIFICATION.md` as the master architectural baseline.
2.  Refactor typography scales, spacing tokens, and color registries across global stylesheets.
3.  Implement the global `Ctrl + K` Command Palette overlay with unified patient search capabilities.
4.  Inject the global Keyboard Shortcut Listener to handle rapid tooth navigation and condition recording.

### Phase 2: Patient Workspace Layout & Identity Panel
1.  Refactor `app/page.tsx` into a fully adaptive, multi-pane layout context.
2.  Build the persistent top Patient Context Header, integrating the tiered **Clinical Alert Severity Banner** with high-contrast warning elements.
3.  Program the workspace mode controllers (Intake, Charting, Billing, Ledger) to trigger appropriate pane transitions.

### Phase 3: Odontogram Interaction Overhaul & Sidebar Inspector
1.  Re-engineer the interactive tooth selection in `/components/odontogram-chart.tsx`.
2.  Enable seamless 1-click status toggles (Decayed, Filled, Missing, Crown) within the Contextual Tooth Detail Inspector side panel.
3.  Establish contextual clinical summaries showing past treatments specifically when a tooth is clicked.

### Phase 4: Billing Dock & Audit-Friendly Calculations
1.  Refactor `/components/active-visit-flow.tsx` to display line item price modifications dynamically.
2.  Implement required government document validation fields (OSCA ID / PWD card entry) blocking the Senior discount unless values are entered.
3.  Inject the BIR Audit Computation Dock showing precise tax-stripping formulas transparently.

### Phase 5: Verification & Production Compilation
1.  Audit performance latency across tooth interactions and layout repaints to guarantee adherence to the Performance Budgets.
2.  Run strict TypeScript type safety evaluations and ESLint verifications.
3.  Execute full production builds (`npm run build`) to ensure total system integrity before deployment.

---

## 13. Out of Scope (Non-Goals)
The following features are explicitly out of scope for this product version:
*   Multi-clinic global database replication (Single-clinic operation is assumed).
*   Live appointment scheduling and calendar booking grids.
*   Insurance provider claims submissions (all transactions are direct private patient billing).
*   Dynamic radiograph/x-ray image uploads (the system logs diagnostic descriptions and tooth conditions textually).
*   Multi-dentist real-time simultaneous charting on the same patient (assumes single dentist operating workspace concurrently).
