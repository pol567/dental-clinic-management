'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ClinicProvider } from '@/lib/clinic-state';
import { DesignSystemProvider } from '@/design-system/context';
import { PatientProvider, EncounterProvider } from '@/design-system/patient-context';
import { WorkspaceProvider } from '@/design-system/workspace';
import { ShieldAlert } from 'lucide-react';

interface ErrorBoundaryProps {
  children?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Clinical Workstation Uncaught Error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div id="system-error-fallback" className="min-h-screen bg-[#F8F7F5] flex items-center justify-center p-6 text-text-primary">
          <div className="max-w-2xl w-full bg-surface border border-rose-300 rounded-xl p-8 space-y-6 ">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <span className="bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-600 animate-pulse" />
                Security & Integrity Halt
              </span>
              <h2 className="text-base font-bold text-text-primary font-sans tracking-tight">Clinical Workstation Error</h2>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              An unexpected runtime error occurred inside the clinical workspace. The system has safely halted to prevent memory corruption or illegal ledger state.
            </p>

            <div className="bg-background p-4 rounded-xl border border-border space-y-2">
              <div className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Error Details</div>
              <pre className="text-xs font-mono text-rose-700 whitespace-pre-wrap break-all bg-rose-50/40 p-3 rounded-lg border border-rose-100 max-h-60 overflow-y-auto">
                {this.state.error?.stack || this.state.error?.message || String(this.state.error)}
              </pre>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  try {
                    localStorage.clear();
                    window.location.reload();
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="py-2 px-4 bg-rose-700 hover:bg-rose-800 text-white rounded-lg font-bold text-xs cursor-pointer transition-colors"
              >
                Clear Cache & Reload
              </button>
              <button
                onClick={() => {
                  try {
                    window.location.reload();
                  } catch (e) {
                    console.error(e);
                  }
                }}
                className="py-2 px-4 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold text-xs cursor-pointer transition-colors"
              >
                Reload Session
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <DesignSystemProvider>
        <PatientProvider>
          <EncounterProvider>
            <WorkspaceProvider>
              <ClinicProvider>
                {children}
              </ClinicProvider>
            </WorkspaceProvider>
          </EncounterProvider>
        </PatientProvider>
      </DesignSystemProvider>
    </ErrorBoundary>
  );
}
