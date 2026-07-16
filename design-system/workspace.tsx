'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDesignSystem } from './context';
import { ChevronLeft, Shield, Sparkles, Sliders, AlertOctagon, AlertTriangle } from 'lucide-react';
import { useActivePatient, useActiveEncounter } from './patient-context';

export type WorkspaceMode = 'INTAKE' | 'CHARTING' | 'BILLING' | 'LEDGER' | 'HISTORY';

export interface LayoutConfig {
  template: 'single' | 'split-two' | 'three-pane';
  left?: string;   // Panel registered key
  center: string;  // Panel registered key
  right?: string;  // Panel registered key
  widths?: {
    left?: string;
    center?: string;
    right?: string;
  };
}

// Global layout configuration registry by Mode
export const DEFAULT_LAYOUTS: Record<WorkspaceMode, LayoutConfig> = {
  INTAKE: {
    template: 'single',
    center: 'patient-overview',
    widths: { center: 'w-full' }
  },
  CHARTING: {
    template: 'single',
    center: 'odontogram-chart',
    widths: { center: 'w-full' }
  },
  BILLING: {
    template: 'three-pane',
    left: 'completed-procedures',
    center: 'draft-invoice',
    right: 'tax-computation',
    widths: { left: 'lg:w-[30%] w-full', center: 'lg:w-[40%] w-full', right: 'lg:w-[30%] w-full' }
  },
  LEDGER: {
    template: 'three-pane',
    left: 'bills-and-payments',
    center: 'double-entry-statement',
    right: 'payment-terminal',
    widths: { left: 'lg:w-[35%] w-full', center: 'lg:w-[40%] w-full', right: 'lg:w-[25%] w-full' }
  },
  HISTORY: {
    template: 'single',
    center: 'encounter-history',
    widths: { center: 'w-full' }
  }
};

type PanelComponent = React.ComponentType<{ patientId?: string | null; encounterId?: string | null }>;

interface WorkspaceContextType {
  mode: WorkspaceMode;
  setMode: (mode: WorkspaceMode) => void;
  layouts: Record<WorkspaceMode, LayoutConfig>;
  updateLayout: (mode: WorkspaceMode, config: Partial<LayoutConfig>) => void;
  registerPanel: (name: string, Component: PanelComponent) => void;
  getPanelComponent: (name: string) => PanelComponent | null;
  resetRegistry: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// ============================================================================
// WORKSPACE ENGINE PROVIDER
// ============================================================================
export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<WorkspaceMode>('CHARTING');
  const [layouts, setLayouts] = useState<Record<WorkspaceMode, LayoutConfig>>(DEFAULT_LAYOUTS);
  const [registry, setRegistry] = useState<Record<string, PanelComponent>>({});

  const setMode = React.useCallback((newMode: WorkspaceMode) => {
    setModeState(newMode);
  }, []);

  const updateLayout = React.useCallback((targetMode: WorkspaceMode, config: Partial<LayoutConfig>) => {
    setLayouts(prev => ({
      ...prev,
      [targetMode]: {
        ...prev[targetMode],
        ...config
      }
    }));
  }, []);

  const registerPanel = React.useCallback((name: string, Component: PanelComponent) => {
    setRegistry(prev => {
      if (prev[name] === Component) return prev;
      return {
        ...prev,
        [name]: Component
      };
    });
  }, []);

  const getPanelComponent = React.useCallback((name: string): PanelComponent | null => {
    return registry[name] || null;
  }, [registry]);

  const resetRegistry = React.useCallback(() => {
    setRegistry({});
  }, []);

  const contextValue = React.useMemo(() => ({
    mode,
    setMode,
    layouts,
    updateLayout,
    registerPanel,
    getPanelComponent,
    resetRegistry
  }), [mode, layouts, setMode, updateLayout, registerPanel, getPanelComponent, resetRegistry]);

  return (
    <WorkspaceContext.Provider value={contextValue}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}

// ============================================================================
// PRIMITIVE COMPONENT: APP SHELL
// ============================================================================
interface AppShellProps {
  children: React.ReactNode;
  headerBrand?: React.ReactNode;
  headerActions?: React.ReactNode;
  footerContent?: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  children,
  headerBrand,
  headerActions,
  footerContent
}) => {
  const { colors: c, spacing: s } = useDesignSystem();

  return (
    <div className={`min-h-screen flex flex-col ${c.surfaceSecondary} ${c.textPrimary}`}>
      {/* Dynamic Persistent Master Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-none">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {headerBrand || (
            <div className="flex items-center gap-2.5">
              <span className="h-9 w-9 bg-cyan-700 text-white rounded-none flex items-center justify-center font-bold text-base shadow-none">
                E
              </span>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">Echevaria Dental</h1>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Clinic Operations System</p>
              </div>
            </div>
          )}

          {headerActions}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}
      </main>

      {/* Global Certified Data Privacy Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-[10px] text-slate-400 font-mono tracking-wide mt-12">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          {footerContent || (
            <>
              <span>© 2026 Echevaria Dental Clinic Management System. All rights reserved.</span>
              <span className="flex items-center gap-1.5 uppercase font-bold text-[9px] text-slate-400">
                <Shield className="h-3.5 w-3.5 text-slate-400" />
                PH RA 10173 (Data Privacy Act) Certified Gateway
              </span>
            </>
          )}
        </div>
      </footer>
    </div>
  );
};

// ============================================================================
// PRIMITIVE COMPONENT: WORKSPACE HEADER (IDENTITY, ALERTS, MODES)
// ============================================================================
interface WorkspaceHeaderProps {
  patientDetails?: {
    name: string;
    dob: string;
    gender: string;
    phone: string;
    isMinor?: boolean;
    isSenior?: boolean;
    isPwd?: boolean;
    allergies?: string[];
    medications?: string[];
    medicalAlerts?: string[];
    outstandingBalance?: number;
  };
  onBack?: () => void;
}

export const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  patientDetails,
  onBack
}) => {
  const { colors: c, radius: r, spacing: s, typography: t } = useDesignSystem();
  const { mode, setMode } = useWorkspace();

  if (!patientDetails) return null;

  // Compute tier alerts for Clinical Safety Hierarchy
  const criticalAllergies = patientDetails.allergies?.filter(a =>
    ['lidocaine', 'penicillin', 'latex', 'aspirin'].includes(a.toLowerCase())
  ) || [];
  
  const bleedingDisorders = patientDetails.medicalAlerts?.filter(a =>
    ['hemophilia', 'bleeding', 'coagulation'].some(keyword => a.toLowerCase().includes(keyword))
  ) || [];

  const warnings = patientDetails.medicalAlerts?.filter(a =>
    !['hemophilia', 'bleeding', 'coagulation'].some(keyword => a.toLowerCase().includes(keyword))
  ) || [];

  const outstandingBalance = patientDetails.outstandingBalance || 0;

  // Render tiered safety banners
  const hasCritical = criticalAllergies.length > 0 || bleedingDisorders.length > 0;
  const hasWarning = warnings.length > 0 || (patientDetails.medications && patientDetails.medications.length > 0);
  const hasInfo = outstandingBalance > 0;

  const modeButtons: { key: WorkspaceMode; label: string }[] = [
    { key: 'INTAKE', label: '1. Overview' },
    { key: 'CHARTING', label: '2. Clinical Charting' },
    { key: 'BILLING', label: '3. Invoicing & Billing' },
    { key: 'LEDGER', label: '4. Financial Ledger' },
    { key: 'HISTORY', label: '5. Visits' },
  ];

  return (
    <div className={`space-y-4 text-left border-b ${c.border} pb-4 shrink-0`}>
      {/* Demographics Summary Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
          {/* Patient Identity Badge */}
          <div className="flex items-center gap-3 shrink-0">
            {onBack && (
              <button
                onClick={onBack}
                className="p-1.5 hover:bg-slate-100 rounded-none text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                title="Return to Patient Search"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className={t.display}>{patientDetails.name}</h2>
                {patientDetails.isSenior && <span className="bg-cyan-50 border border-cyan-200 text-cyan-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Senior</span>}
                {patientDetails.isMinor && <span className="bg-blue-50 border border-blue-200 text-blue-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">Minor</span>}
                {patientDetails.isPwd && <span className="bg-purple-50 border border-purple-200 text-purple-800 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">PWD</span>}
              </div>
              <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                DOB: <span className={t.monoData}>{patientDetails.dob}</span> • Gender: {patientDetails.gender} • Phone: <span className={t.monoData}>{patientDetails.phone}</span>
              </p>
            </div>
          </div>

          {/* CLINICAL SAFETY SEVERITY MATRIX (Horizontal Row) */}
          {(hasCritical || hasWarning) && (
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {hasCritical && (
                <div className={`py-1.5 px-3 ${c.criticalBg} border ${c.criticalBorder} border-l-4 border-l-rose-600 text-rose-900 rounded-none flex items-center gap-2.5 shadow-none shrink-0`}>
                  <AlertOctagon className="h-4 w-4 text-rose-600 shrink-0" />
                  <span className="text-[10px] font-bold tracking-wider uppercase text-rose-700 shrink-0">CRITICAL ALERT</span>
                  <div className="text-[10px] font-bold text-rose-900">
                    {criticalAllergies.length > 0 ? `Allergy: ${criticalAllergies.join(', ').toUpperCase()}. ` : ''}
                    {bleedingDisorders.length > 0 ? `Bleeding Risk: ${bleedingDisorders.join(', ').toUpperCase()}.` : ''}
                  </div>
                </div>
              )}
              {hasWarning && (
                <div className={`py-1.5 px-3 ${c.warningBg} border ${c.warningBorder} border-l-4 border-l-amber-500 text-amber-900 rounded-none flex items-center gap-2.5 shadow-none shrink-0`}>
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span className="text-[10px] font-bold tracking-wider uppercase text-amber-700 shrink-0">WARNING</span>
                  <div className="text-[10px] font-semibold text-amber-900">
                    {warnings.length > 0 ? `Conditions: ${warnings.join(', ')}. ` : ''}
                    {patientDetails.medications && patientDetails.medications.length > 0 ? `Meds: ${patientDetails.medications.join(', ')}.` : ''}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Outstanding Balance Info Badge */}
        {outstandingBalance > 0 && (
          <div className="bg-rose-50 border border-rose-100 py-1.5 px-3.5 rounded-none shrink-0 self-start lg:self-center">
            <span className="block text-[9px] text-rose-500 font-bold uppercase tracking-wider">Outstanding Balance</span>
            <span className="font-mono text-xs font-bold text-rose-700">₱{outstandingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        )}
      </div>

      {/* Unified Mode Selector Row */}
      <div className="flex items-center gap-1 bg-slate-100/90 border border-slate-200/50 p-1 rounded-none overflow-x-auto whitespace-nowrap scrollbar-none">
        {modeButtons.map(btn => (
          <button
            key={btn.key}
            onClick={() => setMode(btn.key)}
            className={`
              flex-1 py-2 px-4 rounded-none font-bold text-xs tracking-tight transition-all cursor-pointer
              ${mode === btn.key
                ? 'bg-white text-slate-900 shadow-xs border-slate-200 border-b'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
              }
            `}
          >
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// PRIMITIVE COMPONENT: WORKSPACE (PANE CONTAINER COORDINATOR)
// ============================================================================
interface WorkspaceProps {
  children?: React.ReactNode;
}

export const Workspace: React.FC<WorkspaceProps> = ({ children }) => {
  const { mode, layouts, getPanelComponent } = useWorkspace();
  const { activePatientId } = useActivePatient();
  const { activeEncounterId } = useActiveEncounter();

  const activeLayout = layouts[mode] || DEFAULT_LAYOUTS[mode];

  // If children are passed explicitly (e.g., during migration), render children
  if (children) {
    return <div className="flex flex-col lg:flex-row gap-4 h-full">{children}</div>;
  }

  // Otherwise, use the dynamic panel registry to mount panels based on the config!
  const leftPanel = activeLayout.left ? getPanelComponent(activeLayout.left) : null;
  const centerPanel = getPanelComponent(activeLayout.center);
  const rightPanel = activeLayout.right ? getPanelComponent(activeLayout.right) : null;

  return (
    <div className="flex flex-col lg:flex-row gap-4 h-full items-stretch">
      {/* Left Region */}
      {leftPanel && (
        <WorkspaceRegion
          className={activeLayout.widths?.left || 'lg:w-[30%] w-full'}
          panelName={activeLayout.left!}
        >
          {React.createElement(leftPanel, { patientId: activePatientId, encounterId: activeEncounterId })}
        </WorkspaceRegion>
      )}

      {/* Center Region */}
      {centerPanel ? (
        <WorkspaceRegion
          className={activeLayout.widths?.center || 'flex-1'}
          panelName={activeLayout.center}
        >
          {React.createElement(centerPanel, { patientId: activePatientId, encounterId: activeEncounterId })}
        </WorkspaceRegion>
      ) : (
        <div className="flex-1 bg-white border border-solid border-slate-200 rounded-none flex flex-col items-center justify-center p-12 text-center">
          <Sliders className="h-8 w-8 text-slate-300 animate-pulse mb-3" />
          <h4 className="text-xs font-bold text-slate-700">Workspace Region Pending</h4>
          <p className="text-[11px] text-slate-400 mt-1 max-w-xs font-semibold">
            The &quot;{activeLayout.center}&quot; component is mapped but has not yet registered in the active Workspace registry.
          </p>
        </div>
      )}

      {/* Right Region */}
      {rightPanel && (
        <WorkspaceRegion
          className={activeLayout.widths?.right || 'lg:w-[30%] w-full'}
          panelName={activeLayout.right!}
        >
          {React.createElement(rightPanel, { patientId: activePatientId, encounterId: activeEncounterId })}
        </WorkspaceRegion>
      )}
    </div>
  );
};

// ============================================================================
// PRIMITIVE COMPONENT: WORKSPACE REGION (SINGLE PANE BOX)
// ============================================================================
interface WorkspaceRegionProps {
  children: React.ReactNode;
  className?: string;
  panelName: string;
}

export const WorkspaceRegion: React.FC<WorkspaceRegionProps> = ({
  children,
  className = '',
  panelName
}) => {
  const { radius: r } = useDesignSystem();
  return (
    <div
      id={`workspace-region-${panelName}`}
      className={`
        flex flex-col shrink-0 min-h-0 bg-white border border-slate-200/75 shadow-none overflow-hidden
        ${r.xxxl}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

// ============================================================================
// PRIMITIVE COMPONENT: SCROLLABLE PANEL
// ============================================================================
interface ScrollablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  maxHeight?: string;
}

export const ScrollablePanel: React.FC<ScrollablePanelProps> = ({
  children,
  className = '',
  maxHeight = 'max-h-[560px]',
  ...props
}) => {
  return (
    <div
      className={`
        overflow-y-auto overflow-x-hidden pr-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent
        ${maxHeight}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

// ============================================================================
// PRIMITIVE COMPONENT: RESIZABLE PANEL (RESPONSIVE WRAPPER)
// ============================================================================
interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

export const ResizablePanel: React.FC<ResizablePanelProps> = ({
  children,
  className = '',
  defaultExpanded = true,
  ...props
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const { motion: m, colors: c } = useDesignSystem();

  return (
    <div
      className={`
        relative flex flex-col shrink-0 overflow-hidden ${m.transitionNormal}
        ${isExpanded ? 'w-full opacity-100' : 'w-0 opacity-0 pointer-events-none'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};
