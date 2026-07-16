'use client';
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { useClinic } from '@/lib/clinic-state';
import { useWorkspace, useActivePatient, useActiveEncounter } from '@/design-system';
import { OdontogramChart } from '../odontogram-chart';
import { DEFAULT_MEDICAL_QUESTIONS } from '@/lib/types';
import {
  User, Phone, Calendar, MapPin, Award, ShieldAlert, Check, AlertCircle, FileText,
  ShieldCheck, Plus, DollarSign, CreditCard, Receipt, TrendingUp, History,
  Lock, CheckCircle, Clock, ClipboardList, ChevronRight, MoreVertical
} from 'lucide-react';


export function ToothInspectorPanel() {
  const { toothEvents, plannedTreatments, addDiagnosis, addToothEvent, togglePlannedTreatment, activeVisitId } = useClinic();
  const { activePatientId } = useActivePatient();
  const { selectedTooth, setSelectedTooth, isVisitFlowActive } = useActiveEncounter();

  const [diagnosisInput, setDiagnosisInput] = useState('');
  const [customPlanned, setCustomPlanned] = useState('Prophylaxis Cleaning');

  if (!activePatientId) return null;

  if (!selectedTooth) {
    return (
      <div className="p-6 text-center text-xs text-text-muted font-medium flex flex-col items-center justify-center h-full min-h-[140px] gap-2">
        <ClipboardList className="h-5 w-5 text-slate-300" />
        <span>Select any tooth on the Odontogram Chart canvas to inspect details or log diagnoses.</span>
      </div>
    );
  }

  const activeEvents = toothEvents
    .filter(e => e.patientId === activePatientId && e.toothNumber === selectedTooth)
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());

  const currentCondition = activeEvents.length > 0 ? activeEvents[0].conditionCode : 'H';
  const currentNote = activeEvents.length > 0 ? activeEvents[0].note : '';
  const planned = plannedTreatments.find(pt => pt.patientId === activePatientId && pt.toothNumber === selectedTooth && pt.status === 'planned');

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
    <div className="flex flex-col h-full">
      <div className="px-4 py-2.5 bg-background border-b border-border flex items-center justify-between">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <ClipboardList className="h-3.5 w-3.5 text-text-secondary" />
          Tooth Inspector
        </h4>
        <button onClick={() => setSelectedTooth(null)} className="text-[10px] font-bold text-text-muted hover:text-text-primary cursor-pointer">
          Clear
        </button>
      </div>

      <div className="p-4 space-y-4 text-xs flex-1 overflow-y-auto text-left">
        <div className="flex items-center gap-2">
          <span className="h-11 w-11 bg-primary text-white flex items-center justify-center rounded-xl font-mono tabular-nums font-bold text-base ">
            {selectedTooth}
          </span>
          <div>
            <h5 className="font-bold text-text-primary">Tooth #{selectedTooth}</h5>
            <p className="text-[10px] text-text-muted font-medium">
              Quadrant: {Number(selectedTooth) >= 50 ? 'Deciduous (Primary)' : 'Permanent'}
            </p>
          </div>
        </div>

        <div className="space-y-1.5">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Clinical Condition</span>
          <div className="grid grid-cols-3 gap-1 bg-background p-1 rounded-xl font-bold text-center text-[10px]">
            {([
              { code: 'H', label: 'Healthy', bg: 'bg-emerald-600 text-white', inactive: 'bg-surface text-text-primary hover:bg-slate-200' },
              { code: 'D', label: 'Decay', bg: 'bg-red-500 text-white', inactive: 'bg-surface text-text-primary hover:bg-slate-200' },
              { code: 'F', label: 'Filled', bg: 'bg-blue-600 text-white', inactive: 'bg-surface text-text-primary hover:bg-slate-200' },
              { code: 'X', label: 'Extract', bg: 'bg-background0 text-white', inactive: 'bg-surface text-text-primary hover:bg-slate-200' },
              { code: 'C', label: 'Crown', bg: 'bg-purple-600 text-white', inactive: 'bg-surface text-text-primary hover:bg-slate-200' },
              { code: 'I', label: 'Implant', bg: 'bg-teal-600 text-white', inactive: 'bg-surface text-text-primary hover:bg-slate-200' }
            ] as const).map(opt => {
              const isActive = currentCondition === opt.code;
              return (
                <button
                  key={opt.code}
                  disabled={!isVisitFlowActive}
                  onClick={() => handleConditionChange(opt.code)}
                  className={`py-1 rounded-xl transition-all cursor-pointer select-none font-bold text-[9px] min-h-[32px] ${
                    isActive ? opt.bg : opt.inactive
                  } ${!isVisitFlowActive ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {opt.code}
                </button>
              );
            })}
          </div>
          {currentNote && <p className="text-[10px] text-text-secondary italic mt-1 font-medium">{currentNote}</p>}
        </div>

        <div className="border-t border-border pt-3.5 space-y-2">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Treatment Plan</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              disabled={!isVisitFlowActive}
              value={customPlanned}
              onChange={e => setCustomPlanned(e.target.value)}
              className="flex-1 border border-border rounded-xl px-2 py-1 text-[11px] font-medium bg-surface"
              placeholder="Treatment details..."
            />
            {planned ? (
              <button
                disabled={!isVisitFlowActive}
                onClick={() => handleTogglePlanned(false)}
                className="bg-amber-500 text-white hover:bg-amber-600 font-bold px-2 py-1 rounded-xl text-[10px] shrink-0 cursor-pointer min-h-[32px] disabled:opacity-50"
              >
                Clear
              </button>
            ) : (
              <button
                disabled={!isVisitFlowActive}
                onClick={() => handleTogglePlanned(true)}
                className="bg-slate-800 text-white hover:bg-slate-900 font-bold px-2 py-1 rounded-xl text-[10px] shrink-0 cursor-pointer min-h-[32px] disabled:opacity-50"
              >
                Plan
              </button>
            )}
          </div>
          {planned && (
            <div className="p-2 bg-amber-50 text-amber-950 border border-amber-200 rounded-xl font-medium text-[10px]">
              Planned: <strong className="font-bold">{planned.description}</strong>
            </div>
          )}
        </div>

        {isVisitFlowActive && activeVisitId && (
          <div className="border-t border-border pt-3.5 space-y-2">
            <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Log Tooth Diagnosis</span>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={diagnosisInput}
                onChange={e => setDiagnosisInput(e.target.value)}
                placeholder="Log pathology..."
                className="flex-1 border border-border rounded-xl px-2 py-1 text-[11px] bg-surface"
              />
              <button
                onClick={handleAddDiagnosis}
                className="bg-primary text-white hover:bg-primary-hover px-2 py-1 rounded-xl text-[10px] font-bold shrink-0 cursor-pointer min-h-[44px]"
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
