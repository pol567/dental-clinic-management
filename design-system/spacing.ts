/**
 * Echevaria Dental Clinic Operations System
 * Design System - Spacing and Density Tokens
 * 
 * Rationale: Spacing should scale dynamically with the clinical environment density mode,
 * ensuring high scanability for dense data or high accessibility on gloved tablet touchscreens.
 */

export type DensityMode = 'compact' | 'comfortable' | 'touch';

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

export const densitySpacing: Record<DensityMode, SpacingTokens> = {
  compact: {
    padding: {
      container: 'p-3',
      card: 'p-3',
      cell: 'py-1 px-2.5',
      input: 'py-1 px-2 text-[11px]',
      list: 'py-1 px-2',
    },
    gap: {
      layout: 'space-y-2 gap-2',
      grid: 'gap-2',
      list: 'space-y-1 gap-1',
    },
    height: {
      button: 'h-8 px-3 text-[11px]',
      input: 'h-8 text-[11px]',
      header: 'h-11',
    }
  },
  comfortable: {
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
  },
  touch: {
    padding: {
      container: 'p-8',
      card: 'p-6',
      cell: 'py-3.5 px-5',
      input: 'py-3 px-4 text-sm',
      list: 'py-3.5 px-4',
    },
    gap: {
      layout: 'space-y-6 gap-6',
      grid: 'gap-6',
      list: 'space-y-3 gap-3',
    },
    height: {
      button: 'h-12 px-6 text-sm',
      input: 'h-12 text-sm',
      header: 'h-16',
    }
  }
};

export const spacing = {
  maxWidth: 'max-w-7xl mx-auto',
  sidebarWidth: 'w-80',
  modalWidth: 'max-w-xl',
};
