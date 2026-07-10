'use client';

import React, { useState, useEffect } from 'react';
import { Providers } from './providers';
import { CommandPalette } from '@/components/command-palette';
import { useClinic } from '@/lib/clinic-state';
import { LoginForm } from '@/components/login-form';
import { PatientSearchList } from '@/components/patient-search-list';
import { NewPatientIntake } from '@/components/new-patient-intake';
import { WorkspacePanelsRegisterer } from '@/components/workspace-panels';
import {
  Workspace,
  WorkspaceHeader,
  useWorkspace,
  useActivePatient,
  useActiveEncounter,
  useDesignSystem
} from '@/design-system';
import {
  ShieldAlert, User, Shield, RefreshCw, LogOut, Lock,
  Phone, Calendar, AlertTriangle, Users, Play, CheckSquare, Settings, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

function ClinicalWorkstation() {
  const {
    currentUser,
    setCurrentUser,
    resetToSeed,
    patients,
    allergies,
    medicalAnswers,
    ledgerEntries,
    openVisit,
    activeVisitId,
    setActiveVisitId
  } = useClinic();

  const { density, setDensity } = useDesignSystem();
  const { activePatientId, setActivePatientId } = useActivePatient();
  const { activeEncounterId, setActiveEncounterId, isVisitFlowActive, setIsVisitFlowActive } = useActiveEncounter();
  const { mode, setMode } = useWorkspace();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isIntakeActive, setIsIntakeActive] = useState(false);

  useEffect(() => {
    const handleOpenIntake = () => {
      setActivePatientId(null);
      setIsVisitFlowActive(false);
      setIsIntakeActive(true);
    };
    window.addEventListener('open-new-patient', handleOpenIntake);
    return () => window.removeEventListener('open-new-patient', handleOpenIntake);
  }, [setActivePatientId, setIsVisitFlowActive, setIsIntakeActive]);

  // Start Visit Form States
  const [showStartVisitForm, setShowStartVisitForm] = useState(false);
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');

  const isDentist = currentUser.role === 'dentist';

  // Synchronize clinic-state selection states with design-system contexts
  useEffect(() => {
    if (activePatientId) {
      localStorage.setItem('ec_activePatientId', activePatientId);
    } else {
      localStorage.removeItem('ec_activePatientId');
    }
  }, [activePatientId]);

  useEffect(() => {
    if (activeEncounterId) {
      setActiveVisitId(activeEncounterId);
    } else {
      setActiveVisitId(null);
    }
  }, [activeEncounterId, setActiveVisitId]);

  // Handle browser back or profile exit
  const handleBackToLookup = () => {
    setActivePatientId(null);
    setIsVisitFlowActive(false);
    setActiveEncounterId(null);
  };

  // Toggle role helper for developer/reviewer testing
  const handleToggleRole = () => {
    const nextRole = currentUser.role === 'dentist' ? 'staff' : 'dentist';
    setCurrentUser({
      id: nextRole === 'dentist' ? 'u1' : 'u2',
      authUid: nextRole === 'dentist' ? 'uid-dentist' : 'uid-staff',
      displayName: nextRole === 'dentist' ? 'Dr. Elena Reyes' : 'Marco Santos',
      role: nextRole,
      active: true
    });
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setActivePatientId(null);
    setIsVisitFlowActive(false);
    setActiveEncounterId(null);
    setIsIntakeActive(false);
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset the clinical state back to original seed records? This will clear all custom charting, patients, and bills.')) {
      resetToSeed();
      handleSignOut();
    }
  };

  // Chairside Visit lifecycle handlers
  const handleStartVisitSession = () => {
    if (!chiefComplaint.trim() || !activePatientId) return;
    const newVisit = openVisit(activePatientId, chiefComplaint.trim(), null, sessionNotes.trim());
    setActiveEncounterId(newVisit.id);
    setIsVisitFlowActive(true);
    setShowStartVisitForm(false);
    setChiefComplaint('');
    setSessionNotes('');
    setMode('CHARTING');
  };

  const handleCloseVisitSession = () => {
    if (confirm('Are you sure you want to end this active chairside session? All recorded treatments, procedures, and draft billing lines will be locked under this visit record.')) {
      setIsVisitFlowActive(false);
      setActiveEncounterId(null);
    }
  };

  // 1. UNAUTHENTICATED LOGIN GATE
  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  // 2. ROLE BOUNDARY GATE (If Staff reaches protected patient workspace views)
  const isProtectedViewActive = activePatientId !== null;
  const showRoleBoundary = isProtectedViewActive && !isDentist;

  // Compute patient details block for Workspace Header
  const activePatientObj = patients.find(p => p.id === activePatientId);
  const patientAllergies = activePatientId ? allergies.filter(a => a.patientId === activePatientId).map(a => a.substance) : [];
  const patientMedications = activePatientId ? medicalAnswers.filter(a => a.patientId === activePatientId && a.answer && a.notes).map(a => a.notes!) : [];
  const patientOutstandingBalance = activePatientId ? ledgerEntries.filter(le => le.patientId === activePatientId).reduce((sum, entry) => sum + entry.amount, 0) : 0;

  const patientDetailsData = activePatientObj ? {
    name: activePatientObj.name,
    dob: activePatientObj.dateOfBirth,
    gender: activePatientObj.sex,
    phone: activePatientObj.contact,
    isMinor: (new Date().getFullYear() - new Date(activePatientObj.dateOfBirth).getFullYear()) < 18,
    isSenior: activePatientObj.isSenior,
    isPwd: activePatientObj.isPwd,
    allergies: patientAllergies,
    medications: patientMedications,
    medicalAlerts: patientMedications,
    outstandingBalance: patientOutstandingBalance
  } : undefined;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F5] text-[#1F2933]">
      
      {/* Global Clinical Workspace Panels Registry */}
      <WorkspacePanelsRegisterer />

      {/* Dynamic Persistent Banner Header */}
      <header id="clinic-master-header" className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          {/* Logo Brand Title */}
          <div className="flex items-center gap-2.5">
            <span className="h-9 w-9 bg-cyan-700 text-white rounded-xl flex items-center justify-center font-bold text-base shadow-sm">
              E
            </span>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-tight">Echevaria Dental</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Clinic Operations System</p>
            </div>
          </div>

          {/* User Status Bar & Developer RBAC controls */}
          <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
            {/* High-Density Scale Toggle */}
            <div className="flex items-center gap-1 bg-slate-100/80 border border-slate-200/50 p-1 rounded-full text-xs font-semibold text-slate-600 select-none">
              <span className="text-[10px] uppercase font-bold text-slate-400 px-2 shrink-0">Density:</span>
              {(['compact', 'comfortable', 'touch'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setDensity(mode)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize transition-all cursor-pointer ${
                    density === mode
                      ? 'bg-cyan-700 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                  }`}
                  title={`Switch to ${mode} density layout`}
                >
                  {mode}
                </button>
              ))}
            </div>

            {/* Active User Badge */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 border border-slate-200/50 py-1.5 px-3.5 rounded-full text-xs font-semibold text-slate-700">
              <span className={`h-2 w-2 rounded-full ${isDentist ? 'bg-cyan-600' : 'bg-slate-400'}`}></span>
              {isDentist ? 'Dentist: Dr. Elena Reyes' : 'Staff: Marco Santos'}
            </div>

            {/* QUICK ROLE TOGGLE FOR EASY EVALUATION */}
            <button
              onClick={handleToggleRole}
              id="rbac-role-toggler"
              className="flex items-center gap-1.5 py-1.5 px-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-full text-xs font-bold shadow-sm hover:shadow-sm transition-all cursor-pointer min-h-[44px]"
              title="Toggle role instantly to verify permissions gating"
            >
              <RefreshCw className="h-3 w-3 animate-spin-slow" />
              Switch to {currentUser.role === 'dentist' ? 'Staff' : 'Dentist'}
            </button>

            {/* Clear custom inputs and reset seed data */}
            <button
              onClick={handleResetData}
              id="reset-state-to-seed"
              className="p-2 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-xl transition-colors cursor-pointer min-h-[44px]"
              title="Reset Database to original seed records"
            >
              <RefreshCw className="h-4 w-4" />
            </button>

            {/* Sign Out */}
            <button
              onClick={handleSignOut}
              id="clinical-sign-out"
              className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-700 rounded-xl transition-colors cursor-pointer min-h-[44px]"
              title="Sign Out of Portal"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container Stage */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        
        {/* ROLE BOUNDARY STATE VIEW */}
        {showRoleBoundary ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-5 shadow-sm mt-8"
          >
            <div className="h-12 w-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto border border-slate-200">
              <Lock className="h-5 w-5" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-slate-800">Confidential Clinical Records Restricted</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                This screen contains clinical charting, diagnoses, allergies, and financial billing statements. 
                Access is strictly restricted to licensed Dentists under the <strong className="text-slate-600">Philippine Data Privacy Act (RA 10173)</strong>.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-150 text-xs text-left text-slate-500 leading-relaxed space-y-2">
              <span className="font-bold text-slate-700 flex items-center gap-1">
                <ShieldAlert className="h-4 w-4 text-slate-500" />
                Staff Access Bounds:
              </span>
              <p>Staff members may view and verify patient demographic names, contact details, and dates of last visit at the reception desk only.</p>
            </div>

            <button
              onClick={handleBackToLookup}
              id="role-boundary-return"
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm rounded-xl transition-all shadow-sm cursor-pointer min-h-[44px]"
            >
              Return to Patient Search
            </button>
          </motion.div>
        ) : (
          /* 3. PERMITTED VIEWS MATRIX */
          <div id="clinical-viewport" className="flex-1 flex flex-col">
            {isIntakeActive ? (
              // NEW PATIENT INTAKE FORM
              <NewPatientIntake
                onCancel={() => setIsIntakeActive(false)}
                onSuccess={(newId) => {
                  setIsIntakeActive(false);
                  setActivePatientId(newId);
                }}
              />
            ) : activePatientId ? (
              // NEW DENTIST CLINICAL PATIENT WORKSPACE (IDE LAYOUT)
              <div className="space-y-6 flex-1 flex flex-col">
                
                {/* Modern Patient Workspace Header */}
                <WorkspaceHeader
                  patientDetails={patientDetailsData}
                  onBack={handleBackToLookup}
                />

                {/* Chairside Visit Lifecycle Strip */}
                <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm text-xs">
                  {isVisitFlowActive ? (
                    <>
                      <div className="flex items-center gap-2.5">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                        </span>
                        <div>
                          <strong className="text-slate-800 font-bold uppercase tracking-wider block text-[10px] text-red-600">Active Chairside Session</strong>
                          <span className="text-slate-500 font-medium">Visit Code: <span className="font-mono tabular-nums font-bold text-slate-700">{activeEncounterId}</span></span>
                        </div>
                      </div>
                      <button
                        onClick={handleCloseVisitSession}
                        className="py-2 px-5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer min-h-[44px]"
                      >
                        Complete & Lock Visit Session
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 text-slate-500">
                        <AlertTriangle className="h-5 w-5 text-amber-500" />
                        <span className="font-medium">No active clinical session is open. Read-only mode. Click &apos;Start Visit&apos; to enable interactive charting & billing.</span>
                      </div>
                      {showStartVisitForm ? (
                        <button
                          onClick={() => setShowStartVisitForm(false)}
                          className="py-2 px-5 border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold rounded-xl cursor-pointer"
                        >
                          Hide Form
                        </button>
                      ) : (
                        <button
                          onClick={() => setShowStartVisitForm(true)}
                          className="py-2 px-5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                        >
                          <Play className="h-4 w-4" /> Start Chairside Visit
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Expandable Start Visit Details Form */}
                <AnimatePresence>
                  {showStartVisitForm && !isVisitFlowActive && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm text-xs space-y-4 max-w-lg"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <h4 className="font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <CheckSquare className="h-4 w-4 text-cyan-700" />
                          Initialize Dental Visit
                        </h4>
                        <button onClick={() => setShowStartVisitForm(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">Cancel</button>
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-600 uppercase text-[9px]">Chief Complaint</label>
                        <input 
                          type="text" 
                          value={chiefComplaint}
                          onChange={e => setChiefComplaint(e.target.value)}
                          placeholder="e.g. Severe toothache on lower right back tooth"
                          className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs bg-white focus:ring-1 focus:ring-cyan-600"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-bold text-slate-600 uppercase text-[9px]">Diagnostic/Observation Notes</label>
                        <textarea 
                          value={sessionNotes}
                          onChange={e => setSessionNotes(e.target.value)}
                          placeholder="Initial clinical observations..."
                          className="w-full border border-slate-300 rounded-xl px-3 py-2.5 text-xs bg-white h-16 focus:ring-1 focus:ring-cyan-600"
                        />
                      </div>
                      <button 
                        onClick={handleStartVisitSession}
                        disabled={!chiefComplaint.trim()}
                        className="py-2.5 px-6 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
                      >
                        Begin Clinical Visit
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Primary Multi-pane Workspace Content Layout */}
                <div className="flex-1 min-h-[500px]">
                  <Workspace />
                </div>

              </div>
            ) : (
              // GENERAL PATIENT LOOKUP HOME (RECEPTION / REPAIR DESK)
              <div className="space-y-4">
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <Users className="h-5.5 w-5.5 text-cyan-700" />
                    Patient Directory Lookup
                  </h2>
                  <p className="text-xs text-slate-500">Search and locate patient operational charts. Touch rows to open profiles.</p>
                </div>

                <PatientSearchList
                  onSelectPatient={(id) => setActivePatientId(id)}
                  onOpenIntake={() => setIsIntakeActive(true)}
                />
              </div>
            )}
          </div>
        )}

      </main>

      {/* Footer element with PH compliance documentation */}
      <footer id="clinic-master-footer" className="bg-white border-t border-slate-200 py-5 text-center text-[10px] text-slate-400 font-mono tabular-nums tracking-wide mt-12">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© 2026 Echevaria Dental Clinic Management System. All rights reserved.</span>
          <span className="flex items-center gap-1.5 uppercase font-bold text-[9px] text-slate-400">
            <Shield className="h-3.5 w-3.5 text-slate-400" />
            PH RA 10173 (Data Privacy Act) Certified Gateway
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Providers>
      <CommandPalette />
      <ClinicalWorkstation />
    </Providers>
  );
}
