'use client';

import React, { useState, useEffect } from 'react';
import { useClinic } from '@/lib/clinic-state';
import {
  useWorkspace,
  useActivePatient,
  useActiveEncounter,
  AppShell,
  Workspace,
  WorkspaceHeader
} from '@/design-system';
import { LoginForm } from '@/components/login-form';
import { PatientSearchList } from '@/components/patient-search-list';
import { NewPatientIntake } from '@/components/new-patient-intake';
import { ActiveVisitFlow } from '@/components/active-visit-flow';
import {
  PatientDemographicsPanel,
  MedicalHistoryPanel,
  LegalConsentPanel,
  MedicalIntakeSummaryPanel,
  OdontogramChartPanel,
  ToothInspectorPanel,
  CompletedProceduresPanel,
  DraftInvoicePanel,
  TaxComputationPanel,
  BillsAndPaymentsPanel,
  DoubleEntryStatementPanel,
  PaymentTerminalPanel,
  PatientDetailsCardPanel,
  EncounterTimelinePanel,
  AuditLogsPanel,
  PatientOverviewPanel
} from '@/components/workspace-panels';
import { LogOut, Heart } from 'lucide-react';

export default function Page() {
  const {
    currentUser,
    patients,
    allergies,
    medicalAnswers,
    ledgerEntries,
    setActivePatientId: setClinicActivePatientId
  } = useClinic();

  const { registerPanel } = useWorkspace();
  const { activePatientId, setActivePatientId } = useActivePatient();
  const { isVisitFlowActive, setIsVisitFlowActive } = useActiveEncounter();

  // Onboarding patient page mode
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Synchronize useClinic active patient with useActivePatient
  // When activePatientId changes, make sure we call setClinicActivePatientId
  useEffect(() => {
    setClinicActivePatientId(activePatientId);
  }, [activePatientId, setClinicActivePatientId]);

  // Register all panel components into the dynamic Workspace Registry
  useEffect(() => {
    registerPanel('patient-demographics', PatientDemographicsPanel);
    registerPanel('medical-history', MedicalHistoryPanel);
    registerPanel('legal-consent', LegalConsentPanel);
    registerPanel('medical-intake-summary', MedicalIntakeSummaryPanel);
    registerPanel('odontogram-chart', OdontogramChartPanel);
    registerPanel('tooth-inspector', ToothInspectorPanel);
    registerPanel('completed-procedures', CompletedProceduresPanel);
    registerPanel('draft-invoice', DraftInvoicePanel);
    registerPanel('tax-computation', TaxComputationPanel);
    registerPanel('bills-and-payments', BillsAndPaymentsPanel);
    registerPanel('double-entry-statement', DoubleEntryStatementPanel);
    registerPanel('payment-terminal', PaymentTerminalPanel);
    registerPanel('patient-details-card', PatientDetailsCardPanel);
    registerPanel('encounter-timeline', EncounterTimelinePanel);
    registerPanel('audit-logs', AuditLogsPanel);
    registerPanel('patient-overview', PatientOverviewPanel);
  }, [registerPanel]);

  // Dynamic age calculation for clinical header
  const getAge = (dob: string): number => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Sign out helper
  const handleSignOut = () => {
    setActivePatientId(null);
    setIsVisitFlowActive(false);
    setIsAddingPatient(false);
    setIsLoggedIn(false);
  };

  // If user is not signed in, display secure portal gateway
  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const isDentist = currentUser.role === 'dentist';

  // Format patient metadata for WorkspaceHeader
  const activePatientObj = patients.find(p => p.id === activePatientId);
  const patientDetails = activePatientObj ? {
    name: activePatientObj.name,
    dob: activePatientObj.dateOfBirth,
    gender: activePatientObj.sex === 'Male' ? 'M' : 'F',
    phone: activePatientObj.contact,
    isMinor: getAge(activePatientObj.dateOfBirth) < 18,
    isSenior: activePatientObj.isSenior,
    isPwd: activePatientObj.isPwd,
    allergies: allergies.filter(a => a.patientId === activePatientId).map(a => a.substance),
    medications: [], // Placeholder or extracted from notes
    medicalAlerts: medicalAnswers.filter(a => a.patientId === activePatientId && a.answer).map(a => a.notes || 'Condition noted'),
    outstandingBalance: ledgerEntries.filter(e => e.patientId === activePatientId).reduce((sum, e) => sum + e.amount, 0)
  } : undefined;

  return (
    <AppShell
      headerBrand={
        <div id="clinic-header-brand" className="flex items-center gap-2.5">
          <span className="h-9 w-9 bg-primary text-white flex items-center justify-center font-bold text-base select-none rounded-xl">
            E
          </span>
          <div>
            <h1 className="text-base font-bold text-text-primary leading-tight">Echevaria Dental</h1>
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Clinic Operations System</p>
          </div>
        </div>
      }
      headerActions={
        <div id="clinic-header-actions" className="flex items-center gap-4">
          {/* User information role badge */}
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-xs font-bold text-text-primary">{currentUser.displayName}</span>
            <span className="text-[10px] text-text-muted font-mono tracking-widest font-bold uppercase">{currentUser.role}</span>
          </div>

          {/* Active visit status or launcher */}
          {isDentist && activePatientId && !isVisitFlowActive && (
            <button
              onClick={() => setIsVisitFlowActive(true)}
              id="launcher-visit-btn"
              className="py-1.5 px-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-xs  flex items-center gap-1.5 min-h-[36px] transition-colors cursor-pointer animate-pulse"
            >
              <Heart className="h-3.5 w-3.5 text-cyan-200 fill-cyan-200" />
              Start Active Visit
            </button>
          )}

          {/* Logout Trigger */}
          <button
            onClick={handleSignOut}
            id="header-signout-btn"
            className="p-2 hover:bg-background text-text-muted hover:text-slate-600 rounded-xl transition-colors cursor-pointer"
            title="Secure Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div id="clinical-workspace-stage" className="h-full">
        {/* CASE 1: Dentist is performing a structured patient intake form */}
        {isDentist && isAddingPatient && (
          <NewPatientIntake
            onCancel={() => setIsAddingPatient(false)}
            onSuccess={(newId) => {
              setActivePatientId(newId);
              setIsAddingPatient(false);
            }}
          />
        )}

        {/* CASE 2: No active patient selected — render patient directory search list */}
        {!activePatientId && !isAddingPatient && (
          <PatientSearchList
            onSelectPatient={(id) => setActivePatientId(id)}
            onOpenIntake={() => setIsAddingPatient(true)}
          />
        )}

        {/* CASE 3: Active patient loaded and active visit clinical encounter is running */}
        {isDentist && activePatientId && isVisitFlowActive && (
          <ActiveVisitFlow
            patientId={activePatientId}
            onCloseVisit={() => setIsVisitFlowActive(false)}
          />
        )}

        {/* CASE 4: Active patient loaded and viewing patient file dashboard (clinical workspace) */}
        {activePatientId && !isVisitFlowActive && (
          <div className="space-y-6">
            {/* Clinical navigation modes header */}
            <WorkspaceHeader
              patientDetails={patientDetails}
              onBack={() => setActivePatientId(null)}
            />

            {/* Render dynamic workspace region layouts */}
            <Workspace />
          </div>
        )}
      </div>
    </AppShell>
  );
}
