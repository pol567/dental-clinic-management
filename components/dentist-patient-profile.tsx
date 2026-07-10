'use client';

import React, { useState } from 'react';
import { useClinic } from '@/lib/clinic-state';
import { Patient, Visit, Bill, LedgerEntry, TreatmentPlan } from '@/lib/types';
import { OdontogramChart } from './odontogram-chart';
import {
  User, Calendar, MapPin, Phone, AlertTriangle, ShieldCheck, ClipboardList, Clock,
  FileSpreadsheet, PlusCircle, CreditCard, ChevronRight, CheckCircle, FileText, ArrowLeft, History
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DentistPatientProfileProps {
  patientId: string;
  onBack: () => void;
  onStartVisit: (patientId: string) => void;
}

export const DentistPatientProfile: React.FC<DentistPatientProfileProps> = ({
  patientId,
  onBack,
  onStartVisit
}) => {
  const {
    patients,
    allergies,
    consents,
    medicalAnswers,
    visits,
    diagnoses,
    procedures,
    bills,
    ledgerEntries,
    treatmentPlans,
    currentUser
  } = useClinic();

  const [activeTab, setActiveTab] = useState<'overview' | 'chart' | 'timeline' | 'plans' | 'ledger'>('overview');
  const [selectedVisitId, setSelectedVisitId] = useState<string | null>(null);

  const patient = patients.find(p => p.id === patientId);

  if (!patient) return <div className="p-12 text-center text-slate-500">Patient records not found.</div>;

  const patientAllergies = allergies.filter(a => a.patientId === patientId);
  const patientConsents = consents.filter(c => c.patientId === patientId);
  const patientAnswers = medicalAnswers.filter(ma => ma.patientId === patientId);
  const patientVisits = visits.filter(v => v.patientId === patientId)
    .sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
  const patientPlans = treatmentPlans.filter(tp => tp.patientId === patientId);
  const patientLedger = ledgerEntries.filter(le => le.patientId === patientId)
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
  const patientBills = bills.filter(b => {
    // find if bill corresponds to a visit of this patient
    const visitObj = visits.find(v => v.id === b.visitId);
    return visitObj?.patientId === patientId;
  });

  // Calculate dynamic outstanding balance
  const outstandingBalance = patientLedger.reduce((sum, e) => sum + e.amount, 0);

  // Calculate age
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

  const hasLidocaineAllergy = patientAllergies.some(a => a.substance.toLowerCase() === 'lidocaine');

  return (
    <div id="dentist-patient-profile-wrapper" className="space-y-6">
      {/* Back navigation & Top pinned Patient identity bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            id="back-to-patients-list"
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-colors cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-xl font-bold text-slate-800 leading-tight">{patient.name}</h2>
              <span className="text-[11px] font-mono tabular-nums font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full uppercase">
                {patient.sex} · {getAge(patient.dateOfBirth)} yrs
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-mono tabular-nums">
              Patient Ref: {patient.id} · Registered At: {new Date(patient.registeredAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Start New Visit Action */}
        <button
          onClick={() => onStartVisit(patient.id)}
          id="launcher-start-visit-btn"
          className="flex items-center justify-center gap-2 py-2.5 px-6 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow-sm transition-all"
        >
          <PlusCircle className="h-4.5 w-4.5" />
          Start New Visit
        </button>
      </div>

      {/* CRITICAL ALLERGY ALERT BANNER */}
      {patientAllergies.length > 0 && (
        <div
          id="allergy-warning-banner"
          className="bg-red-50 border-2 border-red-300 rounded-2xl p-4 flex items-start gap-3.5 shadow-sm animate-pulse"
        >
          <div className="bg-red-200 p-2.5 rounded-xl text-red-800 mt-0.5">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="space-y-1.5 flex-1">
            <h4 className="text-sm font-bold text-red-950 uppercase tracking-wider flex items-center gap-1.5">
              Critical Allergies / Contraindications Detected
            </h4>
            <div className="flex flex-wrap gap-2">
              {patientAllergies.map(allergy => (
                <div key={allergy.id} className="text-xs font-bold bg-red-100 text-red-800 border border-red-300 px-3 py-1 rounded-full flex items-center gap-1">
                  ⚠ {allergy.substance} ({allergy.severity} Severity)
                  {allergy.note && <span className="text-red-950 font-normal"> - {allergy.note}</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Profile Sections Tab Selector */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-1">
        {[
          { id: 'overview', label: 'Patient Overview', icon: User },
          { id: 'chart', label: 'Dental Chart (Odontogram)', icon: ClipboardList },
          { id: 'timeline', label: 'Visit History Timeline', icon: Clock },
          { id: 'plans', label: 'Treatment Plans', icon: FileSpreadsheet },
          { id: 'ledger', label: 'Billing Ledger', icon: CreditCard }
        ].map(tab => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              id={`profile-tab-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer
                ${isActive
                  ? 'border-cyan-700 text-cyan-800 bg-white'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {tab.id === 'ledger' && outstandingBalance > 0 && (
                <span className="h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT AREAS */}
      <div className="space-y-6">

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Demographics Column */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <User className="h-4.5 w-4.5 text-cyan-700" />
                Demographic Profiles
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Biological Sex</span>
                  <span className="font-semibold text-slate-700">{patient.sex}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Birth</span>
                  <span className="font-semibold text-slate-700">{new Date(patient.dateOfBirth).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <Phone className="h-3 w-3 text-slate-400" /> Contact Number
                  </span>
                  <span className="font-semibold text-slate-700">{patient.contact}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-slate-400" /> Residential Address
                  </span>
                  <span className="font-semibold text-slate-700 leading-tight block">{patient.address}</span>
                </div>

                {/* Minors legal parent info */}
                {patient.guardianName && (
                  <div className="sm:col-span-2 bg-amber-50/30 p-3 rounded-xl border border-amber-100">
                    <span className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider">Minor Legal Guardian Details</span>
                    <span className="font-semibold text-slate-800 block text-xs">{patient.guardianName} ({patient.guardianContact})</span>
                  </div>
                )}

                {/* Senior citizen identifiers */}
                {(patient.isSenior || patient.isPwd) && (
                  <div className="sm:col-span-2 bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-2">
                    <span className="block text-xs font-bold text-slate-700">Philippine Statutory Discount Details</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">OSCA / PWD ID Number</span>
                        <span className="font-semibold text-slate-800">{patient.scPwdIdNumber || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">TIN</span>
                        <span className="font-semibold text-slate-800">{patient.tin || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Signed Documents & Consents Panel */}
            <div className="space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <ShieldCheck className="h-4.5 w-4.5 text-emerald-600" />
                Signed Legal Consents
              </h3>

              {patientConsents.length === 0 ? (
                <p className="text-xs text-slate-400">No digital consents signed yet.</p>
              ) : (
                <div className="space-y-3">
                  {patientConsents.map(consent => (
                    <div key={consent.id} className="p-3 bg-emerald-50/20 border border-emerald-100 rounded-xl space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-800 capitalize leading-none">{consent.type.replace('_', ' ')}</span>
                        <span className="text-[9px] font-bold text-slate-400">{new Date(consent.acknowledgedAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">Witnessed: {consent.acknowledgedBy}</p>
                      <span className="block text-[9px] text-slate-400 font-mono tabular-nums mt-0.5 uppercase">Doc Ref: {consent.textVersion}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Systemic Questionnaire Answers Checklist */}
            <div className="border-b border-slate-200 pb-8 md:col-span-3 space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <ClipboardList className="h-4.5 w-4.5 text-cyan-700" />
                Systemic Medical Answers Checklist
              </h3>

              {patientAnswers.length === 0 ? (
                <p className="text-xs text-slate-400">No medical questionnaire recorded on intake.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {patientAnswers.map(ans => {
                    const qText = ans.questionId === 'q1' ? 'Currently under care of a physician?' :
                      ans.questionId === 'q2' ? 'Had major surgeries or hospitalizations?' :
                      ans.questionId === 'q3' ? 'Excessive bleeding after cuts/extractions?' :
                      ans.questionId === 'q4' ? 'Pregnant, nursing, or taking birth control?' :
                      ans.questionId === 'q5' ? 'High blood pressure or heart problems?' :
                      'Taking blood thinners, aspirin, or bone drugs?';

                    return (
                      <div key={ans.questionId} className="flex items-start gap-2.5 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                        <span className={`h-5 w-5 mt-0.5 rounded-full flex items-center justify-center text-[10px] font-bold text-white
                          ${ans.answer ? 'bg-red-500' : 'bg-slate-300'}
                        `}>
                          {ans.answer ? 'Yes' : 'No'}
                        </span>
                        <div>
                          <span className="text-xs font-bold text-slate-800 leading-tight block">{qText}</span>
                          {ans.notes && <span className="text-[11px] text-slate-500 font-semibold mt-1 block">Notes: {ans.notes}</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. DENTAL CHART TAB - Non-Visit Read-only Mode */}
        {activeTab === 'chart' && (
          <OdontogramChart patientId={patient.id} interactive={false} />
        )}

        {/* 3. VISITS HISTORY TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Timeline Left Column */}
            <div className="border-b border-slate-200 pb-8 md:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <Clock className="h-4.5 w-4.5 text-cyan-700" />
                Chronological Visits Timeline
              </h3>

              {patientVisits.length === 0 ? (
                <div className="text-center py-12 text-slate-400 space-y-1">
                  <Clock className="h-8 w-8 text-slate-300 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-700">No Past Visits Recorded</h4>
                  <p className="text-xs">This patient has newly completed intake with no historical encounters.</p>
                </div>
              ) : (
                <div className="space-y-4 pl-4 border-l-2 border-slate-200">
                  {patientVisits.map(visit => {
                    const isSelected = selectedVisitId === visit.id;
                    return (
                      <div
                        key={visit.id}
                        id={`timeline-visit-${visit.id}`}
                        onClick={() => setSelectedVisitId(visit.id)}
                        className={`relative p-4 rounded-xl border transition-all cursor-pointer hover:bg-slate-50
                          ${isSelected
                            ? 'bg-cyan-50/20 border-cyan-500 ring-1 ring-cyan-500 shadow-sm'
                            : 'bg-white border-slate-100'
                          }
                        `}
                      >
                        {/* Timeline circular dot marker */}
                        <span className={`absolute -left-[23px] top-5 h-2.5 w-2.5 rounded-full ring-4 ring-white
                          ${isSelected ? 'bg-cyan-600' : 'bg-slate-300'}
                        `}></span>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-800">
                            {new Date(visit.visitDate).toLocaleDateString(undefined, {
                              year: 'numeric', month: 'long', day: 'numeric'
                            })}
                          </span>
                          <span className="text-[10px] font-mono tabular-nums font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-xl uppercase">
                            Enc ID: {visit.id}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 font-semibold">Chief Complaint: &quot;{visit.chiefComplaint}&quot;</p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Timeline Right Column: Visit Detailed Insights */}
            <div className="border-b border-slate-200 pb-8 space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-cyan-700" />
                Encounter Insights Panel
              </h3>

              {selectedVisitId ? (() => {
                const visitObj = visits.find(v => v.id === selectedVisitId);
                if (!visitObj) return null;

                const visitDiagnoses = diagnoses.filter(d => d.visitId === selectedVisitId);
                const visitProcedures = procedures.filter(p => p.visitId === selectedVisitId);
                const visitBill = bills.find(b => b.visitId === selectedVisitId);

                return (
                  <div className="space-y-4 text-xs leading-relaxed">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date of Visit</span>
                      <span className="text-sm font-bold text-slate-700">
                        {new Date(visitObj.visitDate).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </span>
                    </div>

                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Clinical Observations & Notes</span>
                      <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1 font-semibold">
                        {visitObj.notes || 'No general notes entered.'}
                      </p>
                    </div>

                    {/* Diagnoses */}
                    <div className="space-y-1.5">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recorded Diagnoses</span>
                      {visitDiagnoses.length === 0 ? (
                        <p className="text-slate-400 italic">No diagnoses entered during this encounter.</p>
                      ) : (
                        <div className="space-y-1">
                          {visitDiagnoses.map(diag => (
                            <div key={diag.id} className="p-2 bg-red-50/40 border border-red-100 rounded-xl">
                              <span className="font-bold text-red-950 block">
                                {diag.toothRef ? `Tooth ${diag.toothRef}:` : 'General Case:'}
                              </span>
                              <p className="text-red-900 font-medium">{diag.description}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Procedures completed */}
                    <div className="space-y-1.5">
                      <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Procedures</span>
                      {visitProcedures.length === 0 ? (
                        <p className="text-slate-400 italic">No clinical procedures logged.</p>
                      ) : (
                        <div className="space-y-1">
                          {visitProcedures.map(proc => (
                            <div key={proc.id} className="p-2 bg-blue-50/40 border border-blue-100 rounded-xl flex justify-between items-start">
                              <div>
                                <span className="font-bold text-slate-800 block">Tooth {proc.toothRef} - {proc.type}</span>
                                {proc.notes && <p className="text-slate-500 text-[10px]">{proc.notes}</p>}
                              </div>
                              <span className="font-mono tabular-nums font-bold text-slate-700">₱{proc.basePrice.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Associated Bill */}
                    {visitBill && (
                      <div className="border-t border-slate-100 pt-3">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Associated Bill Summary</span>
                        <div className="flex items-center justify-between mt-1 p-2 bg-slate-50 rounded-xl">
                          <div>
                            <span className="font-bold text-slate-800">Grand Total: ₱{visitBill.grandTotal.toLocaleString()}</span>
                            <span className="block text-[10px] text-slate-400 capitalize">Type: {visitBill.discountType} discount</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-xl text-[10px] font-bold uppercase tracking-wider
                            ${visitBill.status === 'paid' ? 'bg-green-100 text-green-800' :
                              visitBill.status === 'partially_paid' ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-600'}
                          `}>
                            {visitBill.status}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })() : (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-xs">Select any past visit card from the timeline to reveal complete diagnosis, observations, procedures, and billing details.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. TREATMENT PLANS TAB */}
        {activeTab === 'plans' && (
          <div className="border-b border-slate-200 pb-8 space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
              <FileSpreadsheet className="h-4.5 w-4.5 text-cyan-700" />
              Multi-Visit Treatment Plans (Cases)
            </h3>

            {patientPlans.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <FileSpreadsheet className="h-10 w-10 text-slate-300 mx-auto" />
                <h4 className="text-sm font-bold text-slate-700">No Multi-Visit Cases</h4>
                <p className="text-xs">This patient has standalone visits only. Treatment plans help bundle major surgical cases.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {patientPlans.map(plan => (
                  <div key={plan.id} className="p-4 bg-slate-50/50 border border-slate-150 rounded-xl space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{plan.title}</h4>
                        <span className="text-[10px] font-mono tabular-nums font-bold text-slate-400 uppercase">Plan ID: {plan.id}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-xl text-[9px] font-bold uppercase tracking-widest
                        ${plan.status === 'active' ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-200 text-slate-600'}
                      `}>
                        {plan.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Opened: {new Date(plan.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. BILLING & LEDGER TAB */}
        {activeTab === 'ledger' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Outstanding Balance Summary Card */}
            <div className="border-b border-slate-200 pb-8 md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="space-y-1 sm:col-span-2">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Dynamic Account Balance</h3>
                <span className={`text-3xl font-mono tabular-nums font-bold block
                  ${outstandingBalance > 0 ? 'text-red-700' : 'text-green-700'}
                `}>
                  ₱{outstandingBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <p className="text-xs text-slate-400">Derived in real-time from cumulative charges minus payments / credit notes.</p>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 border border-slate-150 p-4 rounded-xl">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                <div>
                  <span className="block text-xs font-bold text-slate-700">Financial Integrity Audit</span>
                  <p className="text-[10px] text-slate-400 leading-normal">Tamper-proof double ledger records. silent overwrites are blocked.</p>
                </div>
              </div>
            </div>

            {/* Bill List */}
            <div className="border-b border-slate-200 pb-8 md:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-cyan-700" />
                Past Issued Bills
              </h3>

              {patientBills.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No past bills on file.</p>
              ) : (
                <div className="space-y-3">
                  {patientBills.map(bill => (
                    <div key={bill.id} className="p-3.5 bg-slate-50/50 border border-slate-150 rounded-2xl flex items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-mono tabular-nums font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-xl uppercase">
                          Bill Ref: {bill.id}
                        </span>
                        <div className="text-sm font-bold text-slate-800">₱{bill.grandTotal.toLocaleString()}</div>
                        <p className="text-[10px] text-slate-400">Exempts: {bill.vatExempt ? 'Senior/PWD Tax Exempt' : 'Standard 12% VAT Applied'}</p>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border
                          ${bill.status === 'paid' ? 'bg-green-100 text-green-800 border-green-200' :
                            bill.status === 'partially_paid' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                            'bg-slate-100 text-slate-600 border-slate-200'}
                        `}>
                          {bill.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ledger Transactions Entries List */}
            <div className="border-b border-slate-200 pb-8 space-y-4">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5">
                <History className="h-4.5 w-4.5 text-cyan-700" />
                Ledger History
              </h3>

              {patientLedger.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No transactions listed in historical ledger.</p>
              ) : (
                <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                  {patientLedger.map(entry => {
                    const isPayment = entry.type === 'payment';
                    return (
                      <div key={entry.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className={`px-1.5 py-0.5 rounded-xl text-[9px] font-bold uppercase tracking-wider
                            ${isPayment ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                          `}>
                            {entry.type}
                          </span>
                          <span className="text-[9px] text-slate-400">{new Date(entry.recordedAt).toLocaleDateString()}</span>
                        </div>
                        <p className="font-semibold text-slate-700">{entry.notes}</p>
                        <div className={`font-mono tabular-nums font-bold ${isPayment ? 'text-green-700' : 'text-red-700'}`}>
                          {isPayment ? '-' : '+'}₱{Math.abs(entry.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
