# Echevaria Dental Clinic Operations System
## Comprehensive UI/UX Architecture & Handoff Document

This document serves as an exhaustive, technical handoff guide outlining the UI/UX architecture, design system, component specifications, state machinery, and `shadcn/ui` migration blueprint for the **Echevaria Dental Clinic Operations System**. 

It is designed to give any successor AI coding model or professional frontend developer immediate operational clarity to continue development, refactor components, or execute migrations with zero context decay.

---

## 1. Executive Summary & Core Philosophy

### Clinical Workspace First (Clinical Workstation Directive)
Unlike typical SaaS dashboard applications, this platform is a **professional chairside clinical workstation** used by dentists, dental assistants, and front desk staff continuously for 8–12 hours a day. 

The user experience architecture must actively reduce cognitive fatigue, maximize scanning density, optimize touch-targets for chairside tablets, and maintain a quiet, predictable workspace.

### Core Architectural Laws
1. **The Odontogram Is the Product**: The 32-tooth interactive chart is the primary focal point of the charting workspace. It occupies the largest visual canvas and must never be cramped by sidebars or superfluous widgets.
2. **Flat Clinical Architecture (No Glassmorphism/Neumorphism)**: Visual hierarchy is defined strictly by border separators, high-contrast typography, and density, mimicking professional desktop software like Epic, AutoCAD, or Dentrix. Arbitrary shadows, decorative gradients, and floating panels are **strictly forbidden**.
3. **color-not-only Directive**: No clinical condition or status is conveyed by color alone. Every condition is supplemented with a text label, status code, or structural pattern to ensure accessible scanning.
4. **Asymmetric Information Architecture (Gated IA)**: Role-based gating is deeply integrated. Dentists have complete operations access. Staff have front-desk lookup access and a restricted, compliance-safe minimal card view.

---

## 2. Global UI Architecture & State Machine

The interface operates on a hierarchical state machine driven by three nested React contexts and one centralized in-memory database hook.

```
[ RootLayout ]
     └── [ Providers ]
              ├── [ ClinicProvider (lib/clinic-state.tsx) ]  <-- In-memory DB
              └── [ WorkspaceProvider (design-system/workspace.tsx) ] <-- Panel Engine
                       ├── [ PatientProvider (design-system/patient-context.tsx) ]
                       └── [ EncounterProvider (design-system/patient-context.tsx) ]
```

### State Layer 1: Central In-Memory DB (`lib/clinic-state.tsx`)
The `ClinicProvider` maintains state arrays that mimic a relational clinical database:
- `patients`: List of registered patient entities.
- `allergies`: Drug and substance hypersensitivities linked to `patientId`.
- `medicalAnswers`: Systemic questionnaire records with true/false states and descriptive notes.
- `visits`: Completed and active visit encounters.
- `procedures`: Performed treatments containing reference to tooth numbers and billing codes.
- `plannedTreatments`: Charted treatments carrying planned (`P`), active, or completed status.
- `bills` & `billItems`: Invoice records containing statutory tax calculations and line items.
- `ledgerEntries`: Double-entry accounting list calculating outstanding balances.
- `currentUser`: Gated role authorization (`dentist` | `staff`).

### State Layer 2: Workspace Panel Engine (`design-system/workspace.tsx`)
The layout utilizes a dynamic **Panel Registry Pattern** to organize the multi-pane dentist interface. Rather than hardcoding sections, the workspace dynamically mounts panels based on the selected mode:

- **Supported Workspace Modes (`LayoutMode`)**:
  - `INTAKE`: Patient demographics and legal consent tracking.
  - `CHARTING`: Interactive 32-tooth odontogram plotting and inspection.
  - `BILLING`: Draft invoices, statutory concessions, and government documentation tracking.
  - `LEDGER`: Patient financial history, double-entry statement ledger, and receipts.
  - `HISTORY`: Historical visit timelines and system audit logs.

- **Dynamic Layout Configurator**:
  The workspace maps each mode to a customized two-column panel layout:
  ```typescript
  const LAYOUTS: Record<LayoutMode, { primary: string[]; sidebar: string[] }> = {
    INTAKE: {
      primary: ['patient-demographics', 'medical-intake-summary'],
      sidebar: ['medical-history', 'legal-consent']
    },
    CHARTING: {
      primary: ['odontogram-chart', 'completed-procedures'],
      sidebar: ['tooth-inspector', 'patient-details-card']
    },
    BILLING: {
      primary: ['draft-invoice', 'tax-computation'],
      sidebar: ['payment-terminal', 'patient-details-card']
    },
    LEDGER: {
      primary: ['bills-and-payments', 'double-entry-statement'],
      sidebar: ['patient-details-card']
    },
    HISTORY: {
      primary: ['encounter-timeline'],
      sidebar: ['audit-logs', 'patient-details-card']
    }
  };
  ```

---

## 3. Screen, Flow & Component Inventory

### A. Login Portal (`components/login-form.tsx`)
- **Purpose**: Authenticate credentials and establish secure session boundaries.
- **Props**: `onLoginSuccess: () => void`.
- **Interactions**:
  - Segmented role switcher: Sets the `currentUser` to Dentist (Dr. Elena Reyes) or Staff (Marco Santos).
  - Simulates authentication delay (600ms) with a CSS spinner inside a minimum 44px touch target button.
  - Explains asymmetric authorization rules transparently in an alert box.

### B. Patient Search Directory (`components/patient-search-list.tsx`)
- **Purpose**: Direct patient search indexing name and telephone contact.
- **Props**: `onSelectPatient: (id: string) => void`, `onOpenIntake: () => void`.
- **Interactions**:
  - Real-time search filter matched against input.
  - **Dentist Behavior**: Clicking a row loads the patient into the core workspace layout, mounting the charting dashboard.
  - **Staff Behavior**: Clicking a row opens a slide-in **Minimal Patient Card Drawer**. Under RA 10173 compliance, clinical charts, balances, and diagnoses are hidden from staff; only demographic and last-visit info is rendered.

### C. Patient Onboarding (`components/new-patient-intake.tsx`)
- **Purpose**: Interactive, step-by-step wizard to register new patients.
- **Flow**:
  1. **Demographics**: Form fields enforcing visible labels. Triggers minor/guardian input fields automatically if the patient's age (derived from Date of Birth) is under 18 years.
  2. **Medical Background & Allergies**: Interactive drug allergy tagger (highlighting Lidocaine alerts in red). Toggles for systemic questionnaires with conditional notes.
  3. **Data Consents**: Checkboxes requiring explicit agreement for PH Data Privacy Act (RA 10173) and General Treatment Consents.
- **Interactions**: Validation errors are displayed immediately below inputs; step forward/back triggers are mapped to generous 44px buttons.

### D. Active Encounter Flow (`components/active-visit-flow.tsx`)
- **Purpose**: Core 5-step clinical workflow for active, chairside encounters.
- **Encounter Wizard Stages**:
  - **Step 1: Open Visit**: Log chief symptoms, link multi-visit treatment plans, and write clinical observations.
  - **Step 2: Chart & Diagnose**: Renders the odontogram chart inside an interactive diagnostic suite with rapid pathology loggers.
  - **Step 3: Perform Procedures**: Pulls candidate procedures from teeth plotted as planned (`P`) on the chart. Features quick-log buttons to complete treatments or add custom ones.
  - **Step 4: Billing Draft**: Calculates itemized prices, captures OSCA/PWD ID numbers, and applies statutory concession rules.
  - **Step 5: Settlement**: Records payment under Cash, Card, GCash, or Bank Transfer, logging balances into the ledger.
- **Critical Warning Trigger**: If a patient has a Lidocaine allergy on file, a persistent, pulsating red warning banner is injected into the header and procedure panels.

### E. Interactive Charting Canvas (`components/odontogram-chart.tsx`)
- **Purpose**: Visual 32-tooth odontogram mapping dental conditions.
- **Props**: `patientId: string`, `interactive?: boolean`, `activeVisitId?: string`.
- **State Integration**:
  - Dynamically renders adult teeth (11–18, 21–28, 31–38, 41–48) and primary pediatric teeth (51–55, 61–65, 71–75, 81–85).
  - Tapping a tooth opens a floating, non-obtrusive **Tooth Inspector Panel** in the workspace, letting dentists change conditions (e.g., sound, decay, missing, crown, bridge, filled) or log planned treatments.
  - Implements SVG tooth shapes with responsive, tactile hit states (min 44px area bounds).

### F. Dynamic Panels Workspace (`components/workspace-panels.tsx`)
A registry of 16 modular components managing specific clinical or financial perspectives:
1. `PatientDemographicsPanel`: Displays contact data, addresses, and guardian fields.
2. `PatientOverviewPanel`: Clinical summary page displaying active alerts, last procedures, and planned care.
3. `MedicalHistoryPanel`: Summarizes systemic questionnaires and drug allergies.
4. `LegalConsentPanel`: Renders signed consent agreements with date-stamps.
5. `MedicalIntakeSummaryPanel`: Summarizes intake answers for quick reading.
6. `OdontogramChartPanel`: Houses the Odontogram Chart wrapper.
7. `ToothInspectorPanel`: Interactive panel to alter condition states for selected teeth.
8. `CompletedProceduresPanel`: Lists historically completed treatments with clinical notes.
9. `DraftInvoicePanel`: Real-time invoice adjustment table with live item price modifications.
10. `TaxComputationPanel`: Displays the official BIR Audit Computation Dock.
11. `BillsAndPaymentsPanel`: Detailed accounting view of historically posted bills.
12. `DoubleEntryStatementPanel`: Displays a clean, double-entry statement log.
13. `PaymentTerminalPanel`: Interactive terminal to settle accounts and log payments.
14. `PatientDetailsCardPanel`: Small sticky summary of patient information.
15. `EncounterTimelinePanel`: Historical record of past visit clinical notes.
16. `AuditLogsPanel`: Technical log tracking administrative user adjustments.

---

## 4. Reverse-Engineered Design System

The current design system is declared via individual token modules inside `/design-system/` and a global configuration wrapper (`/design-system/index.ts`).

### Color Tokens (`/design-system/colors.ts`)
The color palette represents a highly clinical, low-fatigue slate-neutral look:
```typescript
export const colors = {
  background: '#F8F7F5',       // Warm clinical linen background
  surface: '#FFFFFF',          // Clean pristine flat card surface
  border: '#E2E8F0',           // Hairline boundary separators
  text: {
    primary: '#1F2933',        // High contrast charcoal for readability
    secondary: '#4A5568',      // Slate gray for labels and metadata
    muted: '#94A3B8'           // Light slate for inactive helper text
  },
  brand: {
    primary: '#0E7490',        // Deep Clinical Teal (Reserved for single primary CTA)
    primaryHover: '#155E75'
  },
  status: {
    sound: '#10B981',          // Emerald (Healthy/Completed Treatment)
    decay: '#EF4444',          // Red (Active Pathology/Urgent Decay)
    planned: '#F59E0B',        // Amber (Planned Treatment 'P')
    missing: '#64748B',        // Slate Gray (Extracted/Unerupted Tooth)
    crown: '#8B5CF6'           // Purple (Crown/Prosthesis)
  }
};
```

### Typography (`/design-system/typography.ts`)
- **Core Font Pairing**:
  - `Sans`: Inter (for highly legible, low-fatigue UI labels).
  - `Display`: Space Grotesk (for structural titles, clean and tech-forward).
  - `Mono`: JetBrains Mono (for tooth numbers, currency, dates, and audit keys).
- **Tabular Figures Rules**: Every table cell displaying currency, counts, or dates uses `font-mono tracking-tight tabular-nums` to eliminate layout shift.

### Spacing Scale (`/design-system/spacing.ts`)
The spacing scale is an 8px-based incremental grid:
- `XS` (4px), `SM` (8px), `MD` (16px), `LG` (24px), `XL` (32px), `XXL` (40px).

### Interaction Rules
- **Tablet Touch Boundaries**: Minimum 44px clickable height on buttons, selectors, tabs, and checkboxes.
- **Focus Indicators**: All focusable inputs apply explicit `focus:ring-2 focus:ring-cyan-600 focus:outline-none` behaviors.
- **Elevation Rules**: Flat layouts are prioritized. Modals, drop-down menus, and dialogs are allowed a subtle shadow boundary (`box-shadow: 0 1px 3px rgba(0,0,0,0.05)`). Card surfaces must use hairline borders instead of deep drop shadows.

---

## 5. Current Technical Debt, Drift, & Inconsistencies

### 1. Hardcoded Classname Drift
- **Issue**: Multiple feature files, especially `/components/workspace-panels.tsx`, contain hardcoded Tailwind color names (`bg-cyan-700`, `text-slate-800`, `border-slate-200`) and arbitrary paddings instead of strictly importing and wrapping their output with the design system primitives (e.g., `Button`, `Input`, `useDesignSystem` hook).
- **Impact**: Changing central tokens in `/design-system/colors.ts` will not cascade fully across all feature panels, causing visual drift.

### 2. Large File Monoliths
- **Issue**: `/components/workspace-panels.tsx` contains 16 highly distinct components packed inside a single 1,849-line file.
- **Impact**: Makes code maintenance, type isolation, and modular unit-testing highly complex. Refactoring this monolith into individual files in a sub-folder is a top priority.

### 3. Redundant Components & Icons
- **Issue**: Multiple components implement custom SVG icons manually (e.g., `XIcon` inside `PatientSearchList`) instead of consistently importing from `lucide-react`.

### 4. Client-Only Local Mock Persistence
- **Issue**: All state transitions reside inside an ephemeral React state layer in `/lib/clinic-state.tsx`.
- **Impact**: State is lost upon manual browser refresh. While suitable for prototypes, moving toward durable local storage sync (`localStorage`) or robust Firestore persistence is required for production operations.

---

## 6. Official BIR Audit & Statutory Discount Formula

The billing system implements strict statutory logic corresponding to Philippine tax guidelines for Senior Citizens and PWDs. This logic is a critical clinical system prerequisite and must be protected during any refactoring.

```
                  [ Gross Subtotal (VAT-Inclusive Base) ]
                                    │
                         Is Patient Senior or PWD?
                        /                         \
                     [YES]                        [NO]
                      /                             \
     1. Remove 12% VAT:                          Standard subtotal
        VatExBase = Subtotal / 1.12              with promotional or 
     2. Deduct 20% Discount:                     custom discounts applied.
        GrandTotal = VatExBase - (VatExBase * 0.20)
```

### Statutory Computation Rules
1. **Double-Discounting Restriction**: Stacking discounts is strictly illegal under PH law. Only the single highest qualifying concession (e.g., statutory 20% OR promotional 10%) can apply.
2. **Exemption Document Capture**: Tax concession computations can **only** be unlocked once the patient's official OSCA/PWD ID number is verified and recorded in the database.

---

## 7. Migration to `shadcn/ui` Roadmap

Migrating the UI layer to `shadcn/ui` is planned to enforce pristine styling, elevate type-safety, and eliminate hardcoded classname drift. To prevent breaking active workstation features, follow this step-by-step phase map.

### Phase 1: Foundation Setup (Theme & Config)
1. Initialize `shadcn/ui` in the project.
2. Map current `/design-system/colors.ts` tokens to CSS variables inside `/app/globals.css` using the tailwind variable configuration syntax:
   ```css
   @theme {
     --color-background: #F8F7F5;
     --color-surface: #FFFFFF;
     --color-border: #E2E8F0;
     --color-primary: #0E7490;
     --color-primary-hover: #155E75;
     --color-status-sound: #10B981;
     --color-status-decay: #EF4444;
     --color-status-planned: #F59E0B;
   }
   ```
3. Install the standard components into `@/components/ui`:
   - `button`, `input`, `dialog`, `select`, `table`, `tabs`, `badge`, `card`, `tooltip`, `scroll-area`.

### Phase 2: Primitives Replacement (Bottom-Up)
1. Refactor `/design-system/primitives.tsx` to wrap and proxy `shadcn/ui` primitives. For instance:
   - Our primitive `Button` should wrap `@/components/ui/button`.
   - Our primitive `Input` should wrap `@/components/ui/input`.
2. This approach ensures existing layouts do not break immediately upon swapping, providing a smooth backward-compatible interface layer.

### Phase 3: Monolith Decomposition & Panel Migration (Top-Down)
1. Decompose `/components/workspace-panels.tsx` into clean, isolated single-component files inside a new `/components/workspace/` folder:
   - `/components/workspace/demographics-panel.tsx`
   - `/components/workspace/odontogram-panel.tsx`
   - `/components/workspace/invoice-panel.tsx`
2. Incrementally rewrite each panel's core layout structures:
   - Replace manually built tables with `@/components/ui/table`.
   - Replace complex accordion details with `@/components/ui/accordion`.
   - Replace custom segmented toggles with `@/components/ui/tabs`.

### Phase 4: Verification & Integration Testing
1. Ensure all touch target constraints (minimum 44px for interactive elements) are maintained on the newly mounted shadcn components. Override default shadcn pad-sizes where necessary.
2. Run linter and typescript compilation checks continuously.

---

## 8. Summary Checklist for Successive AI Models

Before executing any edits on this codebase, verify:
- [ ] You have read the visual workstation constraints in `/AGENTS.md`.
- [ ] No gradient background, floating card shadow, or glassmorphism has been added.
- [ ] All cash totals and tabular numeric displays use monospaced fonts (`font-mono tabular-nums`).
- [ ] All interactive elements maintain a comfortable 44px minimum touch-target.
- [ ] Any modifications to the billing, invoice, or tax panel respect the PH statutory discount formulas and double-discount restrictions.
- [ ] State mutations in panels correctly dispatch procedures and planned treatments through the `/lib/clinic-state.tsx` context.

---
**Document Status**: *Production-Ready / Handed Over*  
**Authorized Role Context**: *Clinical Operations Director & Senior Architect*
