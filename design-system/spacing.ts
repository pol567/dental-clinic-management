/**
 * Echevaria Dental Clinic Operations System
 * Design System - Spacing and Density Tokens
 * 
 * Rationale: Standard clinical spacing for dental workstation operations.
 * Optimized for both desktop and chairside tablet usage.
 */

export interface SpacingTokens {
  padding: {
    container: string;
    card: string;
    cell: string;
    input: string;
    list: string;
  };
  gap: {
    layout: string;
    grid: string;
    list: string;
  };
  height: {
    button: string;
    input: string;
    header: string;
  };
}

export const densitySpacing: SpacingTokens = {
  padding: {
    container: 'p-6',
    card: 'p-5',
    cell: 'py-2.5 px-4',
    input: 'py-2 px-3 text-xs',
    list: 'py-2 px-3',
  },
  gap: {
    layout: 'space-y-4 gap-4',
    grid: 'gap-4',
    list: 'space-y-2 gap-2',
  },
  height: {
    button: 'h-10 px-4 text-xs',
    input: 'h-10 text-xs',
    header: 'h-14',
  }
};

export const spacing = {
  maxWidth: 'max-w-7xl mx-auto',
  sidebarWidth: 'w-80',
  modalWidth: 'max-w-xl',
};
