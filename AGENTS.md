# Echevaria Dental Clinic Operations System

## Production UX Architecture & Design System Directive

### Clinical Workspace First
You are **not designing a SaaS dashboard.**
You are designing a **professional clinical workstation** used continuously by dentists and clinic staff for 8–12 hours a day.
Every design decision must reduce cognitive load, improve scanning speed, minimize unnecessary pointer movement, and support rapid patient treatment.
This is **medical productivity software**, not a marketing website, startup dashboard, Dribbble concept, or Tailwind UI showcase.

### 1. Workspace First
Every screen must revolve around a primary workspace. Never design pages as collections of widgets. Each page has exactly one primary task. Everything else supports that task.
Never allow supporting information to compete visually with the primary workspace.

### 2. Clinical Information Hierarchy
Hierarchy should follow how dentists think: Patient -> Chief complaint -> Clinical examination -> Diagnosis -> Treatment planning -> Billing -> Administration.

### 3. Utility over Decoration
Reject decorative UI patterns (floating cards, dashboard widgets, hero statistics, gradients, glassmorphism, heavy shadows).
Prefer sections, dividers, alignment, typography, spacing, density, structured layouts. The interface should feel engineered rather than decorated.

### 4. No Card-Driven Design
Cards should only exist when representing independent objects (Patient list item, Appointment item, Invoice, Uploaded X-ray). Cards must never be used simply to contain layouts. The application should feel like one connected workspace.

### 5. The Odontogram Is the Product
The odontogram is the most important interface. It occupies the largest amount of space. It should never be compressed by unnecessary sidebars. Display it close to real clinical scale.

### 6. Flat Clinical Architecture
The application should resemble Electronic Medical Records, Dental Practice Software, Engineering Applications, or Creative Workstations (Epic, Dentrix, AutoCAD, Figma).
Notice these applications: Very few cards, minimal shadows, clear separators, large workspaces, dense information, excellent scanning.

### Layout & Visual Hierarchy
Instead of Dashboard Widgets use Workspace, Sections, Tools, Context, Timeline, Inspector, Editor, Canvas.
Only three emphasis levels: Primary (active workspace), Secondary (context, plan, history), Tertiary (metadata, buttons, filters).

### Component & Styling Philosophy
- **Navigation:** Slim, clear labels, persistent location. Fast access.
- **Spacing:** Use spacing to organize information, never as empty decoration.
- **Color:** Color communicates meaning (Alerts, tooth conditions, status), never aesthetics. Mostly white, soft neutral grays.
- **Elevation & Borders:** Minimal elevation (only for menus/dialogs). Use hairline borders and subtle separators instead of outlined cards.
- **Typography:** The primary organizational tool.
- **Icons:** Support recognition. Never decoration. Consistent stroke weight.

### Form & Data Display
- **Forms:** Compact, fast, keyboard efficient.
- **Tables & Lists:** Prefer tables over cards. High information density. Clear hierarchy.
- **Motion:** Fast, subtle, purposeful. Only to preserve context.

### AI Design Anti-Patterns (Strictly Forbidden)
Do not generate Tailwind dashboards, Admin templates, Bootstrap layouts, Widget grids, Analytics dashboards, Three-column card layouts, Rounded cards everywhere, Marketing SaaS styling, Large empty hero sections, Excessive padding, Floating panels, Gradient backgrounds, Glassmorphism, Neumorphism.

### Success Criteria
The interface should feel like software that experienced dentists trust every day. It should communicate Precision, Reliability, Calmness, Clinical confidence, Professionalism, Speed. Every interaction should reduce clicks, scrolling, pointer travel, context switching, and memory load.
