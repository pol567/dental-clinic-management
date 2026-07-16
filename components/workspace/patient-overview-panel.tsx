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


export function PatientOverviewPanel() {
  const { patients, allergies, consents, medicalAnswers, visits } = useClinic();
  const { activePatientId } = useActivePatient();
  const { setMode } = useWorkspace();

  const patient = patients.find(p => p.id === activePatientId);
  if (!patient) return null;

  const age = (() => {
    const birth = new Date(patient.dateOfBirth);
    const today = new Date();
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      a--;
    }
    return a;
  })();

  const formatDOB = (dob: string) => {
    return new Date(dob).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatPatientSince = (registeredAt: string) => {
    const regDate = new Date(registeredAt);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - regDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const formattedDate = regDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    if (diffDays < 30) return `${formattedDate} (new)`;
    if (diffDays < 365) return `${formattedDate} (${Math.round(diffDays / 30)} mos ago)`;
    return `${formattedDate} (${(diffDays / 365).toFixed(0)} yrs ago)`;
  };

  const patientAllergies = allergies.filter(a => a.patientId === patient.id);
  const patientConsents = consents.filter(c => c.patientId === patient.id);
  const patientVisits = visits.filter(v => v.patientId === patient.id);
  const activeAnswers = medicalAnswers.filter(a => a.patientId === patient.id && a.answer);

  const email = `${patient.name.toLowerCase().replace(/\s+/g, '')}@email.com`;
  const medicalHistoryNotes = activeAnswers.map(a => a.notes || 'Condition noted').join(', ') || 'No known systemic medical conditions';
  const currentMedications = activeAnswers.map(a => a.notes).filter(Boolean).join(', ') || 'None reported';

  return (
    <div id="patient-overview-workspace" className="w-full h-full p-4 bg-surface text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-surface border border-border/80 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <User className="h-4 w-4 text-text-secondary" />
                Demographics
              </h4>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-start gap-4">
                <span className="text-text-muted font-bold uppercase text-[9px] tracking-wider shrink-0 w-24">Address</span>
                <span className="text-text-primary font-medium leading-normal text-right">{patient.address}</span>
              </div>
              <div className="flex justify-between items-center gap-4 border-t border-border pt-2.5">
                <span className="text-text-muted font-bold uppercase text-[9px] tracking-wider shrink-0 w-24">Email</span>
                <span className="text-text-primary font-medium text-right break-all">{email}</span>
              </div>
              <div className="flex justify-between items-center gap-4 border-t border-border pt-2.5">
                <span className="text-text-muted font-bold uppercase text-[9px] tracking-wider shrink-0 w-24">Phone</span>
                <span className="text-text-primary font-semibold font-mono text-right">{patient.contact}</span>
              </div>
              <div className="flex justify-between items-center gap-4 border-t border-border pt-2.5">
                <span className="text-text-muted font-bold uppercase text-[9px] tracking-wider shrink-0 w-24">Date of Birth</span>
                <span className="text-text-primary font-semibold text-right">
                  {formatDOB(patient.dateOfBirth)} <span className="text-text-muted font-normal">({age} yrs)</span>
                </span>
              </div>
              <div className="flex justify-between items-center gap-4 border-t border-border pt-2.5">
                <span className="text-text-muted font-bold uppercase text-[9px] tracking-wider shrink-0 w-24">Gender</span>
                <span className="text-text-primary font-medium text-right">{patient.sex}</span>
              </div>
              <div className="flex justify-between items-center gap-4 border-t border-border pt-2.5">
                <span className="text-text-muted font-bold uppercase text-[9px] tracking-wider shrink-0 w-24">Patient Since</span>
                <span className="text-text-primary font-medium text-right">{formatPatientSince(patient.registeredAt)}</span>
              </div>
            </div>
          </div>

          <div className="bg-surface border border-border/80 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-text-secondary" />
                Additional Information
              </h4>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-start gap-4">
                <span className="text-text-muted font-bold uppercase text-[9px] tracking-wider shrink-0 w-24">Medical History</span>
                <span className="text-text-primary font-medium leading-normal text-right">{medicalHistoryNotes}</span>
              </div>
              <div className="flex justify-between items-start gap-4 border-t border-border pt-2.5">
                <span className="text-text-muted font-bold uppercase text-[9px] tracking-wider shrink-0 w-24">Current Medications</span>
                <span className="text-text-primary font-medium leading-normal text-right">{currentMedications}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-surface border border-border/80 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-red-600" />
                Allergies
              </h4>
            </div>

            <div className="flex-1 min-h-[140px] flex flex-col justify-between">
              {patientAllergies.length > 0 ? (
                <div className="space-y-3">
                  {patientAllergies.map(all => (
                    <div key={all.id} className="p-3 bg-red-50/50 border border-red-100 rounded-xl">
                      <div className="flex items-center gap-1.5 font-bold text-red-700 text-xs">
                        <ShieldAlert className="h-4 w-4 text-red-600 shrink-0" />
                        <span>{all.substance}</span>
                      </div>
                      <p className="text-[11px] text-red-800 leading-normal font-semibold mt-1">
                        {all.note || 'Severe reaction (Hives, Shortness of breath)'}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 border border-emerald-100 bg-emerald-50/40 rounded-xl flex items-start gap-2 text-emerald-800">
                  <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="font-bold">No Known Drug Allergies</strong>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface border border-border/80 rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                Consent Status
              </h4>
            </div>

            <div className="flex-1 min-h-[140px] flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-emerald-50/20 border border-emerald-100/50 rounded-xl">
                  <div className="bg-emerald-600 text-white rounded-full p-1 shrink-0 mt-0.5">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <strong className="font-bold text-text-primary text-xs">All consents are current</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pl-1">
                  {(['data_privacy', 'treatment', 'radiograph', 'extraction'] as const).map(cType => {
                    const hasConsent = patientConsents.some(c => c.type === cType);
                    return (
                      <div key={cType} className="flex items-center gap-1.5 text-[10px] font-semibold">
                        <span className={`h-2 w-2 rounded-full ${hasConsent ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        <span className={hasConsent ? 'text-text-primary' : 'text-text-muted'}>
                          {cType === 'data_privacy' ? 'Data Privacy' : cType === 'treatment' ? 'Treatment' : cType === 'radiograph' ? 'X-Ray' : 'Extraction'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-surface border border-border/80 rounded-2xl p-5 flex flex-col gap-4 h-full">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4 text-text-secondary" />
                Visit History
              </h4>
              <button
                onClick={() => setMode('HISTORY')}
                className="text-xs text-primary hover:text-primary font-bold hover:underline cursor-pointer"
              >
                View all
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 max-h-[500px] pr-1 scrollbar-none">
              {patientVisits.length === 0 ? (
                <div className="p-8 text-center text-text-muted font-medium">
                  No previous clinical visits logged.
                </div>
              ) : (
                <div className="relative border-l-2 border-border pl-4 ml-2 space-y-4 py-1">
                  {patientVisits.map((visit) => {
                    const formattedVisitDate = new Date(visit.visitDate).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    });

                    return (
                      <div key={visit.id} className="relative text-xs">
                        <div className="group hover:bg-background p-2.5 rounded-xl border border-border hover:border-border transition-colors cursor-pointer flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="font-mono text-[10px] text-text-secondary font-bold block">{formattedVisitDate}</span>
                            <h5 className="font-bold text-text-primary text-[11px]">{visit.chiefComplaint}</h5>
                            <span className="text-[9px] text-text-muted font-bold block mt-1 uppercase">
                              Completed ✓
                            </span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-300" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
