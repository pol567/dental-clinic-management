/**
 * Echevaria Dental Clinic Operations System
 * Design System - Z-Index Layers
 * 
 * Rationale: Standardizes layer stacking to prevent UI collisions during complex workspace states.
 */
export const zIndex = {
  base: 'z-0',
  pane: 'z-10',
  sticky: 'z-20', // Table headers, sub-navigation rows
  header: 'z-30', // Master clinic header
  drawer: 'z-40', // Sliding drawers
  modal: 'z-50',  // Command palettes, alert dialogs
  toast: 'z-[60]',  // Urgent global notification overlays
};
