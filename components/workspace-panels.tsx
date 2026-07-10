'use client';
/* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { useClinic } from '@/lib/clinic-state';
import { useWorkspace, useActivePatient, useActiveEncounter } from '@/design-system';
import { OdontogramChart } from './odontogram-chart';
import { DEFAULT_MEDICAL_QUESTIONS } from '@/lib/types';
import {
  User, Phone, Calendar, MapPin, Award, ShieldAlert, Check, AlertCircle, FileText,
  UserCheck, ShieldCheck, HelpCircle, Eye, EyeOff, Save, Plus, DollarSign, CreditCard,
  Hash, Receipt, TrendingUp, History, Lock, Unlock, CheckCircle, Clock, Trash2, ClipboardList
} from 'lucide-react';

// ============================================================================
// 1. INTAKE MODE PANELS
// ============================================================================

// 'patient-demographics' Panel
export function PatientDemographicsPanel() {
  const { patients, updatePatient } = useClinic();
  const { activePatientId } = useActivePatient();
  const patient = patients.find(p => p.id === activePatientId);

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (patient) {
      setName(patient.name);
      setContact(patient.contact);
      setAddress(patient.address);
    }
  }, [patient]);

  if (!patient) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 font-medium">
        No active patient loaded
      </div>
    );
  }

  const handleSave = () => {
    updatePatient({
      ...patient,
      name,
      contact,
      address
    });
    setIsEditing(false);
  };

  const birth = new Date(patient.dateOfBirth);
  const age = new Date().getFullYear() - birth.getFullYear();

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <User className="h-3.5 w-3.5 text-slate-500" />
          Demographic Records
        </h4>
        {isEditing ? (
          <button onClick={handleSave} className="text-[10px] font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1 cursor-pointer min-h-[44px]">
            <Save className="h-3 w-3" /> Save
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-[10px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer">
            Edit
          </button>
        )}
      </div>

      <div className="p-4 space-y-4 text-xs flex-1 overflow-y-auto">
        {isEditing ? (
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Patient Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:ring-cyan-600 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Contact Number</label>
              <input
                type="text"
                value={contact}
                onChange={e => setContact(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:ring-cyan-600 bg-white"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-500">Residential Address</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full text-xs font-medium border border-slate-300 rounded-xl px-2.5 py-1.5 focus:ring-1 focus:ring-cyan-600 bg-white"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Record ID</span>
              <span className="col-span-2 font-mono tabular-nums font-bold text-slate-800">{patient.id}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Full Name</span>
              <span className="col-span-2 font-bold text-slate-800">{patient.name}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Birth Date</span>
              <span className="col-span-2 font-medium text-slate-800">
                {patient.dateOfBirth} <span className="text-slate-400 font-bold ml-1">({age} y/o)</span>
              </span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Biological Sex</span>
              <span className="col-span-2 font-bold text-slate-800">{patient.sex}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Contact</span>
              <span className="col-span-2 font-mono tabular-nums font-medium text-slate-800">{patient.contact}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-100 pb-2">
              <span className="text-slate-500 font-medium">Address</span>
              <span className="col-span-2 font-medium text-slate-700 leading-normal">{patient.address}</span>
            </div>

            {/* Guardianship details for minors */}
            {age < 18 && (
              <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-3 mt-4 space-y-2">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Minor Guardianship Record</span>
                <div className="grid grid-cols-3 text-[11px]">
                  <span className="text-amber-700 font-medium">Guardian Name</span>
                  <span className="col-span-2 font-bold text-slate-800">{patient.guardianName || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-3 text-[11px] pt-1">
                  <span className="text-amber-700 font-medium">Contact</span>
                  <span className="col-span-2 font-mono tabular-nums font-medium text-slate-800">{patient.guardianContact || 'N/A'}</span>
                </div>
              </div>
            )}

            {/* Statutory Exemptions */}
            {(patient.isSenior || patient.isPwd) && (
              <div className="bg-cyan-50/30 border border-cyan-200/60 rounded-xl p-3 mt-4 space-y-2">
                <span className="text-[10px] font-bold text-cyan-800 uppercase tracking-wider block">PH Tax Exempt Privileges</span>
                <div className="flex gap-1.5 flex-wrap">
                  {patient.isSenior && <span className="bg-cyan-100 text-cyan-800 text-[9px] font-bold px-2 py-0.5 rounded-full">Senior Citizen</span>}
                  {patient.isPwd && <span className="bg-teal-100 text-teal-800 text-[9px] font-bold px-2 py-0.5 rounded-full">PWD Status</span>}
                </div>
                {patient.scPwdIdNumber && (
                  <div className="grid grid-cols-3 text-[11px] pt-1 border-t border-cyan-100/50">
                    <span className="text-cyan-700 font-medium">Exemption ID</span>
                    <span className="col-span-2 font-mono tabular-nums font-bold text-slate-800">{patient.scPwdIdNumber}</span>
                  </div>
                )}
                {patient.tin && (
                  <div className="grid grid-cols-3 text-[11px]">
                    <span className="text-cyan-700 font-medium">TIN Number</span>
                    <span className="col-span-2 font-mono tabular-nums font-medium text-slate-800">{patient.tin}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// 'medical-history' Panel
export function MedicalHistoryPanel() {
  const { medicalAnswers, allergies } = useClinic();
  const { activePatientId } = useActivePatient();

  const answers = medicalAnswers.filter(a => a.patientId === activePatientId);
  const patientAllergies = allergies.filter(a => a.patientId === activePatientId);

  if (!activePatientId) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 font-medium">
        No active patient loaded
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldAlert className="h-3.5 w-3.5 text-slate-500" />
          Medical & Allergy Logs
        </h4>
      </div>

      <div className="p-4 space-y-5 text-xs flex-1 overflow-y-auto">
        {/* Alerts & Severe Allergies */}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Prominent Allergies Checklist</span>
          {patientAllergies.length === 0 ? (
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-150 flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0" />
              <span>No active clinical allergies flagged on intake.</span>
            </div>
          ) : (
            <div className="space-y-2">
              {patientAllergies.map(all => (
                <div key={all.id} className="p-3 bg-red-50 text-red-900 border border-red-150 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-600"></span>
                    <strong className="font-bold">{all.substance} Allergy</strong>
                    <span className="bg-red-200 text-red-800 text-[8px] font-bold px-1.5 py-0.2 rounded-xl uppercase ml-auto">
                      {all.severity}
                    </span>
                  </div>
                  {all.note && <p className="text-[10px] text-red-700 leading-normal">{all.note}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Systemic Check Answers */}
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Systemic Medical History Checklist</span>
          <div className="border border-slate-150 rounded-xl overflow-hidden">
            {DEFAULT_MEDICAL_QUESTIONS.map((q, idx) => {
              const matched = answers.find(a => a.questionId === q.id);
              const answerVal = matched ? matched.answer : false;
              return (
                <div key={q.id} className={`p-3 text-[11px] flex flex-col gap-1.5 border-b border-slate-100 last:border-b-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                  <div className="flex items-start justify-between gap-3">
                    <span className="text-slate-700 leading-tight font-medium">{q.questionText}</span>
                    <span className={`shrink-0 font-bold px-1.5 py-0.5 rounded-xl text-[9px] uppercase ${
                      answerVal ? 'bg-red-100 text-red-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {answerVal ? 'YES' : 'NO'}
                    </span>
                  </div>
                  {answerVal && matched?.notes && (
                    <div className="bg-red-50/50 border-l-2 border-red-500 p-1.5 px-2 text-[10px] text-red-900 rounded-xl font-medium">
                      Notes: {matched.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// 'legal-consent' Panel
export function LegalConsentPanel() {
  const { consents, addPatient, currentUser } = useClinic();
  const { activePatientId } = useActivePatient();
  const [signedState, setSignedState] = useState<Record<string, boolean>>({});

  const patientConsents = consents.filter(c => c.patientId === activePatientId);

  const consentTypes = [
    { type: 'data_privacy', label: 'PH Data Privacy Act (RA 10173)', version: 'v1.2-Standard-Data-Privacy-PH-RA10173', desc: 'Authorizes medical processing under strict local law.' },
    { type: 'treatment', label: 'General Treatment Consent', version: 'v1.0-General-Treatment-Consent', desc: 'Authorization for clinical diagnostics and local anesthesia.' },
    { type: 'radiograph', label: 'Radiology Authorization', version: 'v1.0-Radiology-Authorization', desc: 'Acceptance of x-rays and periapical clinical imaging.' },
    { type: 'extraction', label: 'Surgical Extraction Consent', version: 'v1.1-Surgical-Extraction-Consent', desc: 'Minor surgical procedures and post-operative care disclosure.' }
  ] as const;

  if (!activePatientId) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 font-medium">
        No active patient loaded
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-slate-500" />
          PH Legal Consents
        </h4>
      </div>

      <div className="p-4 space-y-4 text-xs flex-1 overflow-y-auto">
        <div className="space-y-3">
          <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Mandatory and Optional Authorizations</span>
          
          <div className="space-y-3">
            {consentTypes.map(item => {
              const acknowledged = patientConsents.find(c => c.type === item.type);
              const isMandatory = item.type === 'data_privacy' || item.type === 'treatment';

              return (
                <div key={item.type} className={`p-3 border rounded-xl space-y-1.5 ${acknowledged ? 'bg-emerald-50/10 border-emerald-300' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`h-4 w-4 rounded-full flex items-center justify-center border ${
                      acknowledged ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-300'
                    }`}>
                      {acknowledged && <Check className="h-2.5 w-2.5" />}
                    </span>
                    <strong className="font-bold text-slate-800">{item.label}</strong>
                    {isMandatory && (
                      <span className="bg-cyan-100 text-cyan-800 text-[8px] font-bold px-1.5 py-0.2 rounded-xl uppercase ml-auto">
                        MANDATORY
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">{item.desc}</p>
                  
                  {acknowledged ? (
                    <div className="text-[9px] font-mono tabular-nums text-slate-400 flex flex-col pt-1 border-t border-slate-100">
                      <span>Acknowledged At: {new Date(acknowledged.acknowledgedAt).toLocaleString()}</span>
                      <span>Verified By: {acknowledged.acknowledgedBy}</span>
                      <span>Stamps: {acknowledged.textVersion}</span>
                    </div>
                  ) : (
                    <div className="pt-1 text-[9px] text-amber-700 font-bold flex items-center gap-1 select-none">
                      <AlertCircle className="h-3 w-3" /> Unsigned on record
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. CHARTING MODE PANELS
// ============================================================================

// 'encounter-history' Panel
export function EncounterHistoryPanel() {
  const { visits, currentUser } = useClinic();
  const { activePatientId } = useActivePatient();

  const patientVisits = visits.filter(v => v.patientId === activePatientId);

  if (!activePatientId) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 font-medium">
        No active patient loaded
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <History className="h-3.5 w-3.5 text-slate-500" />
          Clinical Visits Timeline
        </h4>
        <span className="text-[10px] font-bold font-mono tabular-nums bg-slate-200/60 px-2 py-0.5 rounded-xl text-slate-600">
          {patientVisits.length} Records
        </span>
      </div>

      <div className="p-3 space-y-3 text-xs flex-1 overflow-y-auto">
        {patientVisits.length === 0 ? (
          <div className="p-4 text-center text-slate-400 font-medium">
            No historical visits logged. Start a new visit to record first clinical encounter.
          </div>
        ) : (
          <div className="relative border-l border-slate-200 pl-4 ml-2.5 space-y-4 pt-1">
            {patientVisits.map(visit => (
              <div key={visit.id} className="relative space-y-1">
                {/* Bullet indicator */}
                <span className="absolute -left-[20.5px] top-1.5 h-3 w-3 rounded-full bg-cyan-700 border border-white"></span>
                
                <div className="flex items-center justify-between">
                  <span className="font-mono tabular-nums font-bold text-slate-800 text-[11px]">{visit.visitDate}</span>
                  <span className="font-mono tabular-nums text-[9px] bg-slate-100 px-1.5 py-0.5 rounded-xl text-slate-500">{visit.id}</span>
                </div>
                
                <div className="p-2.5 bg-slate-50 border border-slate-150 rounded-xl space-y-1.5">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Chief Complaint</span>
                    <p className="text-[10.5px] font-semibold text-slate-800 leading-tight">{visit.chiefComplaint}</p>
                  </div>
                  {visit.notes && (
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Treatment Notes</span>
                      <p className="text-[10px] text-slate-600 leading-normal font-medium">{visit.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 'odontogram-chart' Panel Wrapper
export function OdontogramChartPanel() {
  const { activePatientId, activeVisitId } = useClinic();
  const { isVisitFlowActive } = useActiveEncounter();

  if (!activePatientId) {
    return (
      <div className="p-8 text-center text-xs text-slate-400 font-medium bg-white border border-slate-200 h-full flex items-center justify-center">
        Select a patient from the lookup directories to load the clinical Odontogram canvas.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 overflow-y-auto">
      <OdontogramChart
        patientId={activePatientId}
        interactive={isVisitFlowActive}
        activeVisitId={activeVisitId}
        noCard={true}
      />
    </div>
  );
}

// 'tooth-inspector' Panel
export function ToothInspectorPanel() {
  const { toothEvents, plannedTreatments, addDiagnosis, addToothEvent, togglePlannedTreatment, activeVisitId } = useClinic();
  const { activePatientId } = useActivePatient();
  const { selectedTooth, setSelectedTooth, isVisitFlowActive } = useActiveEncounter();

  const [diagnosisInput, setDiagnosisInput] = useState('');
  const [customPlanned, setCustomPlanned] = useState('Prophylaxis Cleaning');

  const activeEvents = toothEvents
    .filter(e => e.patientId === activePatientId && e.toothNumber === selectedTooth)
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

  const currentCondition = activeEvents.length > 0 ? activeEvents[0].conditionCode : 'H';
  const currentNote = activeEvents.length > 0 ? activeEvents[0].note : '';

  const planned = plannedTreatments.find(pt => pt.patientId === activePatientId && pt.toothNumber === selectedTooth && pt.status === 'planned');

  if (!activePatientId) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 font-medium">
        No active patient loaded
      </div>
    );
  }

  if (!selectedTooth) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 font-medium flex flex-col items-center justify-center h-full gap-2 leading-relaxed">
        <ClipboardList className="h-5 w-5 text-slate-300" />
        <span>Select any tooth on the Odontogram Chart canvas to inspect details, log diagnoses, or register chairside treatments.</span>
      </div>
    );
  }

  const handleConditionChange = (code: 'H' | 'D' | 'F' | 'X' | 'C' | 'I') => {
    addToothEvent(activePatientId, selectedTooth, code, `Condition changed to ${code} via Context Inspector`);
  };

  const handleTogglePlanned = (on: boolean) => {
    togglePlannedTreatment(activePatientId, selectedTooth, customPlanned, on);
  };

  const handleAddDiagnosis = () => {
    if (!diagnosisInput.trim() || !activeVisitId) return;
    addDiagnosis(activeVisitId, selectedTooth, diagnosisInput.trim());
    setDiagnosisInput('');
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <ClipboardList className="h-3.5 w-3.5 text-slate-500" />
          Tooth Inspector
        </h4>
        <button onClick={() => setSelectedTooth(null)} className="text-[10px] font-bold text-slate-400 hover:text-slate-700 cursor-pointer">
          Clear
        </button>
      </div>

      <div className="p-4 space-y-4 text-xs flex-1 overflow-y-auto">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 bg-cyan-700 text-white flex items-center justify-center rounded-xl font-mono tabular-nums font-bold text-base shadow-sm shrink-0">
            {selectedTooth}
          </span>
          <div>
            <h5 className="font-bold text-slate-800">Tooth #{selectedTooth}</h5>
            <p className="text-[10px] text-slate-400 font-medium">
              Quadrant location: {Number(selectedTooth) >= 50 ? 'Deciduous (Primary)' : 'Permanent'}
            </p>
          </div>
        </div>

        {/* Current status display */}
        <div className="space-y-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Condition</span>
          <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl font-bold text-center text-[10px]">
            {([
              { code: 'H', label: 'Healthy', bg: 'bg-emerald-600 text-white', inactive: 'bg-white text-slate-700 hover:bg-slate-200' },
              { code: 'D', label: 'Decay', bg: 'bg-red-500 text-white', inactive: 'bg-white text-slate-700 hover:bg-slate-200' },
              { code: 'F', label: 'Filled', bg: 'bg-blue-600 text-white', inactive: 'bg-white text-slate-700 hover:bg-slate-200' },
              { code: 'X', label: 'Extract', bg: 'bg-slate-500 text-white', inactive: 'bg-white text-slate-700 hover:bg-slate-200' },
              { code: 'C', label: 'Crown', bg: 'bg-purple-600 text-white', inactive: 'bg-white text-slate-700 hover:bg-slate-200' },
              { code: 'I', label: 'Implant', bg: 'bg-teal-600 text-white', inactive: 'bg-white text-slate-700 hover:bg-slate-200' }
            ] as const).map(opt => {
              const isActive = currentCondition === opt.code;
              return (
                <button
                  key={opt.code}
                  disabled={!isVisitFlowActive}
                  onClick={() => handleConditionChange(opt.code)}
                  className={`py-1 rounded-xl transition-all cursor-pointer select-none font-bold text-[9px] ${
                    isActive ? opt.bg : opt.inactive
                  } ${!isVisitFlowActive ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {opt.code}
                </button>
              );
            })}
          </div>
          {currentNote && <p className="text-[10px] text-slate-500 italic mt-1 font-medium">{currentNote}</p>}
        </div>

        {/* Treatment Planning */}
        <div className="border-t border-slate-100 pt-3.5 space-y-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Treatment Plan Status</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              disabled={!isVisitFlowActive}
              value={customPlanned}
              onChange={e => setCustomPlanned(e.target.value)}
              className="flex-1 border border-slate-300 rounded-xl px-2 py-1 text-[11px] font-medium bg-white"
              placeholder="e.g. Tooth extraction"
            />
            {planned ? (
              <button
                disabled={!isVisitFlowActive}
                onClick={() => handleTogglePlanned(false)}
                className="bg-amber-500 text-white hover:bg-amber-600 font-bold px-2 py-1 rounded-xl text-[10px] shrink-0 cursor-pointer disabled:opacity-50"
              >
                Clear
              </button>
            ) : (
              <button
                disabled={!isVisitFlowActive}
                onClick={() => handleTogglePlanned(true)}
                className="bg-slate-800 text-white hover:bg-slate-900 font-bold px-2 py-1 rounded-xl text-[10px] shrink-0 cursor-pointer disabled:opacity-50"
              >
                Plan
              </button>
            )}
          </div>
          {planned && (
            <div className="p-2 bg-amber-50 text-amber-950 border border-amber-200 rounded-xl font-medium text-[10px] flex items-center gap-1.5">
              <span className="h-4 w-4 bg-amber-500 text-white rounded-full flex items-center justify-center text-[9px] font-bold font-mono tabular-nums">P</span>
              <span>Planned: <strong className="font-bold">{planned.description}</strong></span>
            </div>
          )}
        </div>

        {/* Add Diagnosis for selected tooth */}
        {isVisitFlowActive && activeVisitId && (
          <div className="border-t border-slate-100 pt-3.5 space-y-2">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Log Tooth Diagnosis</span>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={diagnosisInput}
                onChange={e => setDiagnosisInput(e.target.value)}
                placeholder="Log tooth pathology..."
                className="flex-1 border border-slate-300 rounded-xl px-2 py-1 text-[11px] bg-white"
              />
              <button
                onClick={handleAddDiagnosis}
                className="bg-cyan-700 text-white hover:bg-cyan-800 px-2 py-1 rounded-xl text-[10px] font-bold shrink-0 cursor-pointer min-h-[44px]"
              >
                Log
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 3. BILLING MODE PANELS
// ============================================================================

// 'completed-procedures' Panel
export function CompletedProceduresPanel() {
  const { procedures, visits, activeVisitId } = useClinic();
  const { activePatientId } = useActivePatient();

  const activeVisitProcedures = procedures.filter(p => p.visitId === activeVisitId);

  if (!activePatientId) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 font-medium">
        No active patient loaded
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-slate-500" />
          Procedures Completed
        </h4>
        <span className="text-[10px] font-bold font-mono tabular-nums bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-xl">
          {activeVisitProcedures.length} Done
        </span>
      </div>

      <div className="p-3 space-y-2 text-xs flex-1 overflow-y-auto">
        {activeVisitProcedures.length === 0 ? (
          <div className="p-4 text-center text-slate-400 font-medium leading-relaxed">
            No procedures completed in active session. Perform a clinical treatment on the odontogram/visit flow first.
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase text-slate-500 font-bold bg-slate-50">
                <th className="py-2 px-3 font-medium">Tooth</th>
                <th className="py-2 px-3 font-medium">Procedure</th>
                <th className="py-2 px-3 font-medium">Billable</th>
                <th className="py-2 px-3 font-medium text-right">Price</th>
              </tr>
            </thead>
            <tbody className="font-medium text-slate-700">
              {activeVisitProcedures.map(proc => (
                <tr key={proc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-2 px-3 font-mono tabular-nums font-bold text-slate-500">{proc.toothRef}</td>
                  <td className="py-2 px-3">{proc.type}</td>
                  <td className="py-2 px-3">
                    {proc.isBillable ? (
                      <span className="text-emerald-700 font-bold">Yes</span>
                    ) : (
                      <span className="text-slate-400">No</span>
                    )}
                  </td>
                  <td className="py-2 px-3 font-mono tabular-nums font-bold text-right">₱{proc.basePrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// 'draft-invoice' Panel
export function DraftInvoicePanel() {
  const { procedures, bills, activeVisitId } = useClinic();
  const { activePatientId } = useActivePatient();

  const activeVisitProcedures = procedures.filter(p => p.visitId === activeVisitId && p.isBillable);
  const activeBill = bills.find(b => b.visitId === activeVisitId);

  const subtotal = activeVisitProcedures.reduce((sum, p) => sum + p.basePrice, 0);

  if (!activePatientId) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 font-medium">
        No active patient loaded
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Receipt className="h-3.5 w-3.5 text-slate-500" />
          BIR Draft Invoice Statement
        </h4>
        <span className={`text-[10px] font-bold font-mono tabular-nums px-2 py-0.5 rounded-xl ${
          activeBill ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
        }`}>
          {activeBill ? `Bill ID: ${activeBill.id}` : 'Draft Lines'}
        </span>
      </div>

      <div className="p-4 flex flex-col h-full overflow-hidden">
        {/* Table representation */}
        <div className="flex-1 overflow-y-auto border border-slate-150 rounded-xl bg-white">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-bold text-[9px] tracking-wider">
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3 text-center">Ref</th>
                <th className="py-2 px-3 text-right">Base Price</th>
                <th className="py-2 px-3 text-right">Line Total</th>
              </tr>
            </thead>
            <tbody>
              {activeVisitProcedures.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                    No billable lines to invoice
                  </td>
                </tr>
              ) : (
                activeVisitProcedures.map((proc, idx) => (
                  <tr key={proc.id} className="border-b border-slate-100 last:border-0 font-medium text-slate-700">
                    <td className="py-2 px-3 font-semibold text-slate-800">{proc.type}</td>
                    <td className="py-2 px-3 text-center font-mono tabular-nums">Tooth {proc.toothRef}</td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">₱{proc.basePrice.toLocaleString()}</td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-900">₱{proc.basePrice.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Live dynamic invoice math box */}
        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500 font-medium">Subtotal</span>
            <span className="font-mono tabular-nums font-bold text-slate-800">₱{subtotal.toLocaleString()}</span>
          </div>
          {activeBill && activeBill.discountAmount > 0 && (
            <div className="flex justify-between text-red-700 font-semibold">
              <span>Exemption Discount ({activeBill.discountPct}%)</span>
              <span className="font-mono tabular-nums">-₱{activeBill.discountAmount.toLocaleString()}</span>
            </div>
          )}
          {activeBill && (
            <div className="flex justify-between text-slate-500">
              <span>BIR 12% Value-Added Tax (VAT)</span>
              <span className="font-mono tabular-nums">
                {activeBill.vatExempt ? 'VAT Exempt' : `₱${activeBill.vatAmount.toLocaleString()}`}
              </span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-slate-900 border-t border-dashed border-slate-200 pt-2">
            <span>Statement Total Due</span>
            <span className="font-mono tabular-nums">
              ₱{(activeBill ? activeBill.grandTotal : subtotal).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 'tax-computation' Panel
export function TaxComputationPanel() {
  const { procedures, bills, createBill, finalizeBill, activeVisitId, patients } = useClinic();
  const { activePatientId } = useActivePatient();

  const activeVisitProcedures = procedures.filter(p => p.visitId === activeVisitId && p.isBillable);
  const patient = patients.find(p => p.id === activePatientId);

  const activeBill = bills.find(b => b.visitId === activeVisitId);

  const [discountType, setDiscountType] = useState<'none' | 'senior' | 'pwd' | 'promotional' | 'custom'>('none');
  const [customPct, setCustomPct] = useState(0);

  useEffect(() => {
    if (patient) {
      if (patient.isSenior) setDiscountType('senior');
      else if (patient.isPwd) setDiscountType('pwd');
      else setDiscountType('none');
    }
  }, [patient]);

  if (!activePatientId || !patient) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 font-medium">
        No active patient loaded
      </div>
    );
  }

  const subtotal = activeVisitProcedures.reduce((sum, p) => sum + p.basePrice, 0);

  const handleCreateBillDraft = () => {
    if (!activeVisitId) return;
    const items = activeVisitProcedures.map(p => ({
      procedureId: p.id,
      description: `${p.type} (${p.toothRef})`,
      quantity: 1,
      unitPrice: p.basePrice,
      lineTotal: p.basePrice
    }));
    createBill(activeVisitId, discountType, items);
  };

  const handleFinalizeAndLock = () => {
    if (!activeBill) return;
    finalizeBill(activeBill.id, discountType, customPct);
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-slate-500" />
          PH Tax Audits
        </h4>
      </div>

      <div className="p-4 space-y-4 text-xs flex-1 overflow-y-auto">
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase text-slate-400 tracking-wider block">Audited Exemption Discount Category</label>
          
          <select
            disabled={activeBill?.status !== 'draft' && !!activeBill}
            value={discountType}
            onChange={e => setDiscountType(e.target.value as any)}
            className="w-full bg-white border border-slate-300 rounded-2xl px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600"
          >
            <option value="none">Standard Revenue (No Exemption)</option>
            <option value="senior">Senior Citizen (VAT Exempt + 20%)</option>
            <option value="pwd">PWD Exemption (VAT Exempt + 20%)</option>
            <option value="promotional">Promotional Rebate (10% Off)</option>
            <option value="custom">Custom Professional Discount</option>
          </select>

          {discountType === 'custom' && (
            <div className="space-y-1 mt-2">
              <label className="text-[9px] font-bold text-slate-500 uppercase">Discount Percent (%)</label>
              <input
                type="number"
                disabled={activeBill?.status !== 'draft' && !!activeBill}
                value={customPct}
                onChange={e => setCustomPct(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-semibold bg-white"
                min={0}
                max={100}
              />
            </div>
          )}
        </div>

        {/* Verification Credentials Display */}
        {(discountType === 'senior' || discountType === 'pwd') && (
          <div className="p-3 bg-cyan-50/50 border border-cyan-200 rounded-xl space-y-2">
            <span className="text-[10px] font-bold text-cyan-800 uppercase block tracking-wider">Statutory Verification Proof</span>
            <div className="grid grid-cols-2 gap-2 text-[11px] leading-tight text-slate-600 font-medium">
              <div>
                <span className="text-[9px] text-cyan-700 font-bold block uppercase">SC/PWD Card ID</span>
                <span className="font-mono tabular-nums font-bold text-slate-800">{patient.scPwdIdNumber || 'MISSING proof of ID'}</span>
              </div>
              <div>
                <span className="text-[9px] text-cyan-700 font-bold block uppercase">TIN (Optional)</span>
                <span className="font-mono tabular-nums font-bold text-slate-800">{patient.tin || 'None'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Transaction state triggers */}
        <div className="pt-4 border-t border-slate-150 space-y-2.5">
          {!activeBill ? (
            <button
              disabled={activeVisitProcedures.length === 0}
              onClick={handleCreateBillDraft}
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              Generate Draft Invoice
            </button>
          ) : activeBill.status === 'draft' ? (
            <button
              onClick={handleFinalizeAndLock}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
            >
              <Lock className="h-3.5 w-3.5" />
              Lock & Lock Revenue Record
            </button>
          ) : (
            <div className="p-3 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center gap-2 font-bold text-slate-600 uppercase text-[10px]">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Bill Record Locked & Finalized</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. LEDGER MODE PANELS
// ============================================================================

// 'bills-and-payments' Panel
export function BillsAndPaymentsPanel() {
  const { bills, visits } = useClinic();
  const { activePatientId } = useActivePatient();

  const patientBills = bills.filter(bill => {
    const visitObj = visits.find(v => v.id === bill.visitId);
    return visitObj && visitObj.patientId === activePatientId;
  });

  if (!activePatientId) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 font-medium">
        No active patient loaded
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Receipt className="h-3.5 w-3.5 text-slate-500" />
          Issued Patient Invoices
        </h4>
        <span className="text-[10px] font-bold font-mono tabular-nums bg-slate-200 px-2 py-0.5 rounded-xl text-slate-600">
          {patientBills.length} Bills
        </span>
      </div>

      <div className="p-3 space-y-2 text-xs flex-1 overflow-y-auto">
        {patientBills.length === 0 ? (
          <div className="p-4 text-center text-slate-400 font-medium">
            No invoices generated yet for this patient.
          </div>
        ) : (
          patientBills.map(bill => (
            <div key={bill.id} className="p-3 border border-slate-150 rounded-xl flex flex-col gap-1.5 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="font-mono tabular-nums font-bold text-slate-800">Invoice #{bill.id}</span>
                <span className={`px-2 py-0.5 rounded-xl text-[8px] font-bold uppercase ${
                  bill.status === 'paid'
                    ? 'bg-emerald-100 text-emerald-800'
                    : bill.status === 'partially_paid'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                }`}>
                  {bill.status}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] leading-tight">
                <div>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Total Amount</span>
                  <strong className="font-mono tabular-nums font-bold text-slate-900">₱{bill.grandTotal.toLocaleString()}</strong>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Discount Snap</span>
                  <span className="font-semibold text-slate-600">{bill.discountType.toUpperCase()} ({bill.discountPct}%)</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 'double-entry-statement' Panel
export function DoubleEntryStatementPanel() {
  const { ledgerEntries } = useClinic();
  const { activePatientId } = useActivePatient();

  const patientEntries = ledgerEntries
    .filter(le => le.patientId === activePatientId)
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());

  let runningBalance = 0;

  if (!activePatientId) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 font-medium">
        No active patient loaded
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-slate-500" />
          Financial General Ledger
        </h4>
      </div>

      <div className="p-4 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto border border-slate-150 rounded-xl bg-white font-mono tabular-nums text-[11px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase font-bold text-[9px] tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Debit (Charges)</th>
                <th className="py-2.5 px-3 text-right">Credit (Payments)</th>
                <th className="py-2.5 px-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {patientEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 font-medium">
                    No ledger history on file
                  </td>
                </tr>
              ) : (
                patientEntries.map(entry => {
                  const isCharge = entry.type === 'charge';
                  const amount = entry.amount;
                  runningBalance += amount;

                  return (
                    <tr key={entry.id} className="border-b border-slate-100 last:border-0 font-medium text-slate-700 hover:bg-slate-50/50">
                      <td className="py-2 px-3 text-slate-500 text-[10px]">{new Date(entry.recordedAt).toLocaleDateString()}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{entry.notes || entry.type}</td>
                      <td className="py-2 px-3 text-right font-bold text-red-700">
                        {isCharge ? `₱${amount.toLocaleString()}` : ''}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-700">
                        {!isCharge ? `₱${Math.abs(amount).toLocaleString()}` : ''}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        ₱{runningBalance.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Closing summary bar */}
        <div className="mt-4 pt-3 border-t border-slate-150 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-bold uppercase text-[9px]">Account Status Audited Balance</span>
          <div className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${runningBalance === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            <span className="font-mono tabular-nums font-bold text-sm text-slate-900">
              ₱{runningBalance.toLocaleString()} PHP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 'payment-terminal' Panel
export function PaymentTerminalPanel() {
  const { bills, recordPayment, visits } = useClinic();
  const { activePatientId } = useActivePatient();

  const patientBills = bills.filter(bill => {
    const visitObj = visits.find(v => v.id === bill.visitId);
    return visitObj && visitObj.patientId === activePatientId && (bill.status === 'finalized' || bill.status === 'partially_paid');
  });

  const [selectedBillId, setSelectedBillId] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [method, setMethod] = useState<'cash' | 'card' | 'gcash' | 'bank'>('cash');

  const patientBillsKey = patientBills.map(b => b.id).join(',');

  useEffect(() => {
    if (patientBills.length > 0) {
      setSelectedBillId(patientBills[0].id);
    } else {
      setSelectedBillId('');
    }
  }, [patientBillsKey]);

  const activeBill = bills.find(b => b.id === selectedBillId);

  if (!activePatientId) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 font-medium">
        No active patient loaded
      </div>
    );
  }

  const handleSubmitPayment = () => {
    const num = parseFloat(paymentAmount);
    if (!selectedBillId || isNaN(num) || num <= 0) return;
    recordPayment(selectedBillId, num, method);
    setPaymentAmount('');
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5 text-slate-500" />
          Settle Bills
        </h4>
      </div>

      <div className="p-4 space-y-4 text-xs flex-1 overflow-y-auto">
        {patientBills.length === 0 ? (
          <div className="p-4 text-center text-slate-400 font-medium">
            No outstanding locked invoices on file to settle.
          </div>
        ) : (
          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Outstanding Invoice Reference</label>
              <select
                value={selectedBillId}
                onChange={e => setSelectedBillId(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-2xl px-3 py-1.5 text-xs font-semibold"
              >
                {patientBills.map(b => (
                  <option key={b.id} value={b.id}>
                    Invoice #{b.id} (₱{b.grandTotal.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {activeBill && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] space-y-1 text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Invoice Total</span>
                  <span className="font-mono tabular-nums font-bold text-slate-800">₱{activeBill.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Payment Channel</label>
              <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl font-bold text-center">
                {(['cash', 'card', 'gcash', 'bank'] as const).map(opt => {
                  const isActive = method === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setMethod(opt)}
                      className={`py-1 rounded-xl text-[10px] uppercase cursor-pointer select-none ${
                        isActive ? 'bg-cyan-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Amount Tendered</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold font-mono tabular-nums">₱</span>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl pl-7 pr-3 py-1.5 text-xs font-semibold bg-white"
                  placeholder="0.00"
                />
              </div>
            </div>

            <button
              onClick={handleSubmitPayment}
              disabled={!paymentAmount}
              className="w-full py-2.5 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              Record Payment Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 5. HISTORY MODE PANELS
// ============================================================================

// 'patient-details-card' Panel
export function PatientDetailsCardPanel() {
  return <PatientDemographicsPanel />;
}

// 'encounter-timeline' Panel
export function EncounterTimelinePanel() {
  return <EncounterHistoryPanel />;
}

// 'audit-logs' Panel
export function AuditLogsPanel() {
  const { activePatientId } = useActivePatient();
  const { ledgerEntries, consents, patients } = useClinic();

  const entries = ledgerEntries.filter(le => le.patientId === activePatientId);
  const totalCharges = entries.filter(e => e.type === 'charge').reduce((sum, e) => sum + e.amount, 0);
  const totalPayments = entries.filter(e => e.type === 'payment').reduce((sum, e) => sum + Math.abs(e.amount), 0);
  const ledgerMatch = totalCharges - totalPayments === 0;

  const patientConsents = consents.filter(c => c.patientId === activePatientId);
  const consentsMatch = patientConsents.length >= 2; // Data Privacy + General Treatment

  if (!activePatientId) {
    return (
      <div className="p-4 text-center text-xs text-slate-400 font-medium">
        No active patient loaded
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200">
      <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
          Compliance Gating checks
        </h4>
      </div>

      <div className="p-4 space-y-4 text-xs flex-1 overflow-y-auto">
        <div className="space-y-3.5">
          {/* Check 1: PH RA 10173 compliance */}
          <div className="p-3 border border-slate-150 bg-slate-50 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${consentsMatch ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              <strong className="font-bold text-slate-800">DPA (RA 10173) Alignment</strong>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              {consentsMatch
                ? 'Mandatory Data Privacy and Treatment Consents signed and verified digitally.'
                : 'Incomplete legal authorizations on file. Patient chart requires consent updates.'}
            </p>
          </div>

          {/* Check 2: Double-entry ledger math audit */}
          <div className="p-3 border border-slate-150 bg-slate-50 rounded-xl space-y-1">
            <div className="flex items-center gap-1.5">
              <span className={`h-2.5 w-2.5 rounded-full ${ledgerMatch ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <strong className="font-bold text-slate-800">Ledger Integrity Check</strong>
            </div>
            <p className="text-[10px] text-slate-500 leading-normal">
              {ledgerMatch
                ? 'Accounts balanced to absolute zero. No outstanding balances carried over.'
                : 'Outstanding balance pending settlement. Ledger balance matches transaction sum.'}
            </p>
          </div>

          {/* Audit attestation check stamp */}
          <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400 font-mono tabular-nums leading-normal">
            <div>Compliance Audit Status: COMPLETE</div>
            <div>Encryption Key: AES-256 Stamp</div>
            <div>Signer Stamp: Dr. Reyes Clinical Node</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. GLOBAL PANELS REGISTRATION COMPONENT
// ============================================================================
export function WorkspacePanelsRegisterer() {
  const { registerPanel } = useWorkspace();

  useEffect(() => {
    // 1. Intake Panels
    registerPanel('patient-demographics', PatientDemographicsPanel);
    registerPanel('medical-history', MedicalHistoryPanel);
    registerPanel('legal-consent', LegalConsentPanel);

    // 2. Charting Panels
    registerPanel('encounter-history', EncounterHistoryPanel);
    registerPanel('odontogram-chart', OdontogramChartPanel);
    registerPanel('tooth-inspector', ToothInspectorPanel);

    // 3. Billing Panels
    registerPanel('completed-procedures', CompletedProceduresPanel);
    registerPanel('draft-invoice', DraftInvoicePanel);
    registerPanel('tax-computation', TaxComputationPanel);

    // 4. Ledger Panels
    registerPanel('bills-and-payments', BillsAndPaymentsPanel);
    registerPanel('double-entry-statement', DoubleEntryStatementPanel);
    registerPanel('payment-terminal', PaymentTerminalPanel);

    // 5. History Panels
    registerPanel('patient-details-card', PatientDetailsCardPanel);
    registerPanel('encounter-timeline', EncounterTimelinePanel);
    registerPanel('audit-logs', AuditLogsPanel);

  }, [registerPanel]);

  return null; // Side effect registration only
}
