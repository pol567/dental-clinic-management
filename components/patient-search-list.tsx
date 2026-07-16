'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/clinic-state';
import { Patient } from '@/lib/types';
import { Search, Plus, UserPlus, Phone, Calendar, ArrowRight, ShieldCheck, Lock, HeartHandshake } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PatientSearchListProps {
  onSelectPatient: (patientId: string) => void;
  onOpenIntake: () => void;
}

export const PatientSearchList: React.FC<PatientSearchListProps> = ({
  onSelectPatient,
  onOpenIntake
}) => {
  const {
    patients,
    currentUser,
    visits,
    ledgerEntries,
    setActivePatientId
  } = useClinic();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStaffPatient, setSelectedStaffPatient] = useState<Patient | null>(null);

  const isDentist = currentUser.role === 'dentist';

  // Real-time filtering based on query matching name or contact number
  const filteredPatients = patients.filter(patient => {
    const q = searchQuery.toLowerCase();
    return (
      patient.name.toLowerCase().includes(q) ||
      patient.contact.includes(q)
    );
  });

  // Calculate dynamic Outstanding Balance for a patient
  const getPatientBalance = (patientId: string): number => {
    const entries = ledgerEntries.filter(e => e.patientId === patientId);
    // charges are positive, payments are negative (e.g. reduction)
    return entries.reduce((sum, e) => sum + e.amount, 0);
  };

  // Calculate Last Visit Date
  const getLastVisitDate = (patientId: string): string => {
    const patientVisits = visits
      .filter(v => v.patientId === patientId)
      .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

    if (patientVisits.length > 0) {
      return patientVisits[0].visitDate;
    }
    return 'None recorded';
  };

  // Dynamic age calculation
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

  const handleRowClick = (patient: Patient) => {
    if (isDentist) {
      setActivePatientId(patient.id);
      onSelectPatient(patient.id);
    } else {
      // Staff opens the minimal profile card drawer
      setSelectedStaffPatient(patient);
    }
  };

  return (
    <div id="patient-search-list-wrapper" className="space-y-6">
      {/* Search Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface p-5 rounded-xl border border-border/80 ">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
          <input
            type="text"
            id="patient-search-input"
            placeholder="Search by patient name or contact number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-primary placeholder-slate-400 focus:bg-surface focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 transition-all font-medium"
          />
        </div>

        {/* New Patient Intake button is Dentist-only */}
        {isDentist ? (
          <button
            onClick={onOpenIntake}
            id="launcher-intake-btn"
            className="flex items-center justify-center gap-2 py-2.5 px-5 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm  hover: transition-all min-h-[44px]"
          >
            <Plus className="h-4 w-4" />
            <UserPlus className="h-4 w-4" />
            New Patient Intake
          </button>
        ) : (
          <div className="flex items-center gap-2 text-xs bg-background border border-border px-4 py-2 rounded-xl text-slate-600 font-semibold self-start">
            <Lock className="h-3.5 w-3.5 text-text-secondary" />
            Intake restricted to Dentist
          </div>
        )}
      </div>

      {/* Patient Listing Stage */}
      <div className="bg-surface rounded-xl border border-border  overflow-hidden">
        {filteredPatients.length === 0 ? (
          <div className="p-12 text-center text-text-secondary space-y-2">
            <Search className="h-10 w-10 text-slate-300 mx-auto" />
            <h4 className="text-sm font-bold text-text-primary">No Patient Found</h4>
            <p className="text-xs text-text-muted">Try checking spelling or enter a new patient profile.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-background/50">
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Patient Name</th>
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Contact Number</th>
                  {isDentist ? (
                    <>
                      <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Age / Sex</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Registered At</th>
                      <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Outstanding Balance</th>
                    </>
                  ) : (
                    <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider">Last Visit Date</th>
                  )}
                  <th className="px-6 py-4 text-xs font-bold text-text-secondary uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPatients.map(patient => {
                  const lastVisit = getLastVisitDate(patient.id);
                  const balance = getPatientBalance(patient.id);
                  const patientAge = getAge(patient.dateOfBirth);

                  return (
                    <tr
                      key={patient.id}
                      id={`patient-row-${patient.id}`}
                      onClick={() => handleRowClick(patient)}
                      className="hover:bg-background/60 transition-colors cursor-pointer group"
                    >
                      {/* Name */}
                      <td className="px-6 py-4.5">
                        <div className="font-bold text-text-primary group-hover:text-primary transition-colors">
                          {patient.name}
                        </div>
                        <div className="text-[11px] text-text-muted font-mono tabular-nums mt-0.5 uppercase tracking-wide">ID: {patient.id}</div>
                      </td>

                      {/* Contact */}
                      <td className="px-6 py-4.5 text-sm font-semibold text-text-primary">
                        {patient.contact}
                      </td>

                      {isDentist ? (
                        <>
                          {/* Age / Sex */}
                          <td className="px-6 py-4.5 text-sm font-semibold text-slate-600">
                            {patientAge} yrs · {patient.sex}
                          </td>

                          {/* Registered At */}
                          <td className="px-6 py-4.5 text-xs font-medium text-text-secondary">
                            {new Date(patient.registeredAt).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })}
                          </td>

                          {/* Outstanding Balance */}
                          <td className="px-6 py-4.5 text-right font-mono tabular-nums font-bold text-sm">
                            {balance > 0 ? (
                              <span className="text-red-700 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full">
                                ₱{balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                              </span>
                            ) : (
                              <span className="text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
                                Settle Account
                              </span>
                            )}
                          </td>
                        </>
                      ) : (
                        /* Last Visit Date for Staff only */
                        <td className="px-6 py-4.5 text-sm font-semibold text-slate-600">
                          {lastVisit === 'None recorded' ? (
                            <span className="text-text-muted">Never visited</span>
                          ) : (
                            new Date(lastVisit).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'short', day: 'numeric'
                            })
                          )}
                        </td>
                      )}

                      {/* Action Cell */}
                      <td className="px-6 py-4.5 text-right">
                        <button
                          className="p-1.5 hover:bg-background rounded-xl text-text-muted group-hover:text-cyan-600 transition-all self-end min-h-[44px]"
                          aria-label="View Details"
                        >
                          <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* STAFF MINIMAL PATIENT CARD DRAWER */}
      <AnimatePresence>
        {selectedStaffPatient && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedStaffPatient(null)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface rounded-2xl border border-border max-w-md w-full p-6  relative"
            >
              <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-11 w-11 bg-background text-slate-600 flex items-center justify-center rounded-xl font-bold text-sm">
                    St
                  </span>
                  <div>
                    <h4 className="text-base font-bold text-text-primary">Minimal Patient Card</h4>
                    <span className="text-[10px] text-text-muted uppercase tracking-wide font-mono tabular-nums">Staff View Mode</span>
                  </div>
                </div>
                <button
                  id="close-staff-card"
                  onClick={() => setSelectedStaffPatient(null)}
                  className="p-1.5 hover:bg-background rounded-full text-text-muted transition-colors"
                >
                  <XIcon className="h-5 w-5" />
                </button>
              </div>

              {/* Patient Fields for Front Desk verification */}
              <div className="space-y-4">
                <div className="bg-background p-4 rounded-xl border border-border space-y-3">
                  <div>
                    <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider">Verified Patient Name</span>
                    <span className="text-lg font-bold text-text-primary leading-snug">{selectedStaffPatient.name}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/50">
                    <div>
                      <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                        <Phone className="h-3 w-3" /> Contact
                      </span>
                      <span className="text-sm font-semibold text-text-primary">{selectedStaffPatient.contact}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-text-muted uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="h-3 w-3" /> Last Visit Date
                      </span>
                      <span className="text-sm font-semibold text-text-primary">
                        {getLastVisitDate(selectedStaffPatient.id) === 'None recorded' ? (
                          <span className="text-text-muted font-medium">None recorded</span>
                        ) : (
                          new Date(getLastVisitDate(selectedStaffPatient.id)).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Restricted State Message */}
                <div className="bg-background border border-border p-4 rounded-xl space-y-2 text-xs text-text-secondary leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-text-primary mb-1">
                    <ShieldCheck className="h-4 w-4 text-cyan-600" />
                    Authorized Access Bounds:
                  </div>
                  <p>
                    Confidential clinical charts, diagnostic records, allergies, treatment summaries, billing details, and patient outstanding balances are restricted under the <strong className="text-text-primary">Philippine Data Privacy Act (RA 10173)</strong>.
                  </p>
                  <p className="text-[11px] text-primary font-semibold flex items-center gap-1 mt-1">
                    <Lock className="h-3.5 w-3.5" /> Clinical records are only readable by licensed Dentists.
                  </p>
                </div>

                <button
                  id="confirm-close-staff-card"
                  onClick={() => setSelectedStaffPatient(null)}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm  transition-all flex items-center justify-center gap-1"
                >
                  <HeartHandshake className="h-4 w-4" />
                  Confirm and Close Card
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Simple XIcon to avoid importing everything if not needed
const XIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);
