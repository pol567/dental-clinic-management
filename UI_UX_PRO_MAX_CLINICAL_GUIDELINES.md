# Echevaria Dental Clinic - Applied UI/UX Pro Max Guidelines

This document applies the **UI/UX Pro Max** design intelligence rules specifically to the Echevaria Dental Clinic Operations System. These guidelines supplement the `CLINICAL_UX_SPECIFICATION.md` and enforce the technical standards required for a professional, high-efficiency medical workstation.

## 1. Accessibility (CRITICAL)
- **`color-contrast`**: Maintain minimum 4.5:1 contrast for all text (e.g., tooth condition labels, patient names) against surfaces.
- **`focus-states`**: Implement visible focus rings (2-4px) on all interactive elements (odontogram teeth, form fields) for keyboard navigation.
- **`keyboard-nav`**: Full keyboard support is mandatory for fast data entry. Dentists must be able to navigate forms, charts, and tables without using a mouse.
- **`color-not-only`**: Never convey clinical status (e.g., "decay", "completed") by color alone. Always pair color with a pattern, icon, or clear text label.

## 2. Touch & Interaction (CRITICAL)
- **`touch-target-size`**: Ensure all clickable elements (especially individual teeth on the odontogram) have a minimum 44×44px interactive area for tablet usage during chairside operations.
- **`hover-vs-tap`**: Do not rely on hover states for critical clinical information, as the application will be used on tablets.
- **`loading-buttons`**: Disable buttons and show clear feedback during async operations (e.g., saving a patient record, updating the odontogram) to prevent duplicate entries.
- **`press-feedback`**: Provide instant visual feedback (within 100ms) for all interactions, reducing uncertainty.

## 3. Performance (HIGH)
- **`reduce-reflows`**: The odontogram and treatment timeline must not cause layout thrashing (CLS < 0.1). Pre-allocate space for charts and tables.
- **`virtualize-lists`**: Use virtualization for long patient history or billing lists to maintain 60fps performance on lower-end clinic hardware.
- **`main-thread-budget`**: Keep heavy computations (like complex odontogram rendering or billing calculations) optimized to avoid locking the UI thread.

## 4. Style Selection (HIGH)
- **`style-match`**: Strictly adhere to the "Flat Clinical Architecture" (Epic, Dentrix, Figma style). No glassmorphism, no heavy shadows, no decorative gradients.
- **`no-emoji-icons`**: Use consistent SVG icons (e.g., Lucide) exclusively. Emojis are strictly forbidden as they look unprofessional.
- **`elevation-consistent`**: Use elevation (shadows) *only* for transient overlays (dialogs, dropdown menus). The main workspace must remain flat.
- **`primary-action`**: Each screen/pane must have only one highly prominent primary CTA. Secondary actions should be visually subordinated.

## 5. Layout & Responsive (HIGH)
- **`viewport-meta`**: Ensure `width=device-width, initial-scale=1` and never disable zoom, allowing staff to magnify complex x-rays or charts if needed.
- **`spacing-scale`**: Use a strict 4px/8px incremental spacing system to group related information densely but clearly.
- **`content-priority`**: Always prioritize the primary workspace (e.g., Odontogram). Sidebars and contextual panes must never compress the primary workspace.
- **`z-index-management`**: Maintain a predictable Z-index scale (e.g., 10 for sticky headers, 40 for modals, 100 for toasts).

## 6. Typography & Color (MEDIUM)
- **`number-tabular`**: Use tabular/monospaced figures for all billing data, tooth numbers, dates, and vital signs to prevent layout shift and improve scanning.
- **`color-semantic`**: Use semantic tokens for states (e.g., `success` for completed treatments, `warning` for planned, `destructive` for extractions/alerts). Do not use arbitrary hex values in components.
- **`weight-hierarchy`**: Use font weight (Bold 600-700 for headings, Medium 500 for labels, Regular 400 for body) to establish hierarchy rather than relying purely on size or color.
- **`truncation-strategy`**: In clinical notes, prefer wrapping over truncation. If truncating is necessary, provide a robust tooltip or expand mechanism so critical medical context is not lost.

## 7. Animation (MEDIUM)
- **`duration-timing`**: Keep micro-interactions ultra-fast (150–200ms) to support rapid workflows. 
- **`motion-meaning`**: Motion must express cause-and-effect (e.g., a toast sliding in upon save). No playful or decorative bouncing animations.
- **`fade-crossfade`**: When switching context (e.g., swapping from Odontogram to Treatment Plan), use a subtle crossfade rather than dramatic spatial transitions to maintain clinical calmness.

## 8. Forms & Feedback (MEDIUM)
- **`input-labels`**: Always use visible labels, never placeholder-only labels. Clinical data entry must be explicit.
- **`error-placement`**: Show form validation errors immediately below the field.
- **`form-autosave`**: Auto-save long clinical notes and treatment plans to prevent data loss.
- **`progressive-disclosure`**: For complex dental procedures, reveal advanced configuration options progressively rather than overwhelming the dentist upfront.
- **`inline-validation`**: Validate on blur (not keystroke) to avoid interrupting the dentist's typing flow.

## 9. Navigation Patterns (HIGH)
- **`persistent-nav`**: Keep primary navigation slim and persistent. The dentist should always know where they are within the app.
- **`destructive-nav-separation`**: Visually and spatially separate destructive actions (e.g., deleting a patient record or invalidating an invoice).
- **`state-preservation`**: Navigating between the patient chart, billing, and schedule must preserve scroll position and unsaved states.

## 10. Charts & Data (HIGH for clinical context)
- **`data-density`**: Optimize tables (appointments, billing) for high density scanning.
- **`direct-labeling`**: Label chart/odontogram values directly to reduce eye travel.
- **`sortable-table`**: All clinical tables (treatment history, patient list) must be easily sortable.
