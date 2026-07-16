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


export function EncounterHistoryPanel() {
  const { visits, diagnoses, procedures, bills } = useClinic();
  const { activePatientId } = useActivePatient();

  const patientVisits = visits.filter(v => v.patientId === activePatientId);
  if (!activePatientId) return null;

  return (
    <div className="flex flex-col h-full bg-surface border border-border">
      <div className="px-4 py-2.5 bg-background border-b border-border flex items-center justify-between">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <History className="h-3.5 w-3.5 text-text-secondary" />
          Clinical Visits Timeline
        </h4>
        <span className="text-[10px] font-bold font-mono bg-slate-200/60 px-2 py-0.5 rounded-xl text-slate-600">
          {patientVisits.length} Records
        </span>
      </div>

      <div className="p-5 space-y-5 flex-1 overflow-y-auto">
        {patientVisits.length === 0 ? (
          <div className="p-4 text-center text-text-muted font-medium">No historical visits logged.</div>
        ) : (
          <div className="space-y-6">
            {patientVisits.map(visit => {
              const visitDiagnoses = diagnoses.filter(d => d.visitId === visit.id);
              const visitProcedures = procedures.filter(p => p.visitId === visit.id);
              const visitBill = bills.find(b => b.visitId === visit.id);

              return (
                <div key={visit.id} className="border border-border rounded-2xl overflow-hidden bg-background/20 text-xs">
                  <div className="bg-background border-b border-border px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                    <div>
                      <span className="font-mono font-bold text-text-secondary text-[9px] tracking-wide uppercase">Encounter Date</span>
                      <h5 className="font-bold text-text-primary text-xs mt-0.5">{new Date(visit.visitDate).toLocaleDateString()}</h5>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-200 text-slate-600 font-bold px-2 py-0.5 rounded font-mono">
                        REF: {visit.id}
                      </span>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 font-bold px-2 py-0.5 rounded uppercase">
                        COMPLETED ✓
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-surface p-3 border border-border rounded-xl space-y-1">
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Chief Complaint</span>
                        <p className="font-semibold text-text-primary text-[11px]">{visit.chiefComplaint}</p>
                      </div>
                      <div className="bg-surface p-3 border border-border rounded-xl space-y-1">
                        <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Clinical Notes</span>
                        <p className="text-[11px] text-slate-600 font-medium">{visit.notes || 'No clinical notes recorded.'}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 border-t border-border pt-3">
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Recorded Pathologies & Diagnoses</span>
                      {visitDiagnoses.length === 0 ? (
                        <p className="text-text-muted italic text-[11px]">No diagnostic entries recorded during this visit.</p>
                      ) : (
                        <div className="space-y-1">
                          {visitDiagnoses.map(diag => (
                            <div key={diag.id} className="bg-surface px-3 py-2 border border-border rounded-xl flex items-center justify-between">
                              <span className="text-text-primary font-semibold">{diag.description}</span>
                              {diag.toothRef && (
                                <span className="bg-cyan-50 border border-cyan-150 text-primary text-[9px] font-bold px-1.5 py-0.5 rounded">
                                  Tooth {diag.toothRef}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 border-t border-border pt-3">
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Completed Clinical Treatments</span>
                      {visitProcedures.length === 0 ? (
                        <p className="text-text-muted italic text-[11px]">No procedures completed during this visit.</p>
                      ) : (
                        <div className="space-y-1">
                          {visitProcedures.map(proc => (
                            <div key={proc.id} className="bg-surface px-3 py-2 border border-border rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="bg-emerald-600 text-white font-bold h-5 w-5 rounded-md flex items-center justify-center font-mono text-[10px]">
                                  {proc.toothRef}
                                </span>
                                <span className="font-semibold text-text-primary">{proc.type}</span>
                              </div>
                              <span className="font-mono font-bold text-text-primary">₱{proc.basePrice.toLocaleString()}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 border-t border-border pt-3">
                      <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Billing Stamp</span>
                      {visitBill ? (
                        <div className="bg-surface px-3.5 py-2.5 border border-border rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 text-[11px]">
                          <span className="font-mono font-bold text-text-primary">Invoice #{visitBill.id} ({visitBill.status.toUpperCase()})</span>
                          <span className="font-mono font-bold text-emerald-700">Total: ₱{visitBill.grandTotal.toLocaleString()}</span>
                        </div>
                      ) : (
                        <p className="text-text-muted italic text-[11px]">No invoice generated for this visit yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
