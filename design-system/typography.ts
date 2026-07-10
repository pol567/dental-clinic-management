/**
 * Echevaria Dental Clinic Operations System
 * Design System - Typography Tokens
 * 
 * Rationale: Clean sans-serif headings for high scannability, paired with robust tabular numbers
 * for billing and auditing, and distinct monospaced formatting for reference IDs.
 */
export const typography = {
  // Font Families
  sans: 'font-sans',
  mono: 'font-mono tracking-wide',
  
  // Weights
  weightNormal: 'font-normal',
  weightMedium: 'font-medium',
  weightSemibold: 'font-semibold',
  weightBold: 'font-bold',
  
  // Scaled Styles
  display: 'font-sans text-lg sm:text-xl font-bold tracking-tight text-slate-900', // Primary workspace and patient names
  heading: 'font-sans text-sm sm:text-base font-bold tracking-tight text-slate-800', // Standard card or panel headers
  subheading: 'font-sans text-[10px] sm:text-xs font-bold tracking-wider text-slate-500 uppercase', // Subheadings, table columns
  body: 'font-sans text-[11px] sm:text-xs font-semibold text-slate-700 leading-relaxed', // High-density interactive form labels
  caption: 'font-sans text-[10px] font-semibold text-slate-400', // Footnotes and secondary logs
  monoData: 'font-mono text-xs font-bold text-slate-600', // Reference IDs, Encounter numbers, Tooth codes
  tabularNums: 'font-mono tabular-nums text-xs font-semibold text-slate-800', // Excel-like financial calculation cells
};
