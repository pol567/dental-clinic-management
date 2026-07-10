/**
 * Echevaria Dental Clinic Operations System
 * Design System - Color Tokens
 * 
 * Rationale: High-contrast slate combined with surgical cyan for premium, sterile clinical aesthetics.
 * Uses eye-safe tints (warm white canvas) to prevent clinician eye-fatigue during 8-hour shifts.
 */
export const colors = {
  // Surface Base
  surface: 'bg-white',
  surfaceSecondary: 'bg-[#F8F7F5]', // Warm off-white canvas base to reduce screen glare
  surfaceTertiary: 'bg-[#F1F3F5]',  // Neutral shaded backgrounds
  surfaceHover: 'hover:bg-slate-50',
  surfaceActive: 'active:bg-slate-100',
  
  // Border Elements
  border: 'border-slate-200/80', // Crisp, low-fatigue layout dividers
  borderMuted: 'border-slate-100',
  borderFocus: 'focus:border-cyan-700 focus:ring-1 focus:ring-cyan-700/50 focus:outline-none',
  
  // Brand / Primary Interactive
  primary: 'bg-cyan-700 hover:bg-cyan-800 active:bg-cyan-900 text-white', // Clinical teal
  primaryText: 'text-cyan-700',
  
  // Brand Secondary
  secondary: 'bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white', // Dark slate contrast
  secondaryText: 'text-slate-950',
  
  // Semantic Status Tiers
  success: 'bg-emerald-600 hover:bg-emerald-700 text-white',
  successText: 'text-emerald-600',
  successBg: 'bg-emerald-50',
  successBorder: 'border-emerald-200',
  
  warning: 'bg-amber-600 hover:bg-amber-700 text-white',
  warningText: 'text-amber-600',
  warningBg: 'bg-amber-50',
  warningBorder: 'border-amber-200',
  
  critical: 'bg-rose-600 hover:bg-rose-700 text-white',
  criticalText: 'text-rose-600',
  criticalBg: 'bg-rose-50',
  criticalBorder: 'border-rose-200',
  
  info: 'bg-sky-600 hover:bg-sky-700 text-white',
  infoText: 'text-sky-600',
  infoBg: 'bg-sky-50',
  infoBorder: 'border-sky-200',
  
  // Body Typographic Hierarchy
  textPrimary: 'text-slate-800', // Custom dense slate
  textSecondary: 'text-slate-500',
  textTertiary: 'text-slate-400',
  textLight: 'text-white',
  
  // Interactive Overlays & Disabled Muted States
  disabled: 'bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200',
  overlay: 'bg-slate-900/60 backdrop-blur-xs',
};
