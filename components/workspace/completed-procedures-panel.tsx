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


export function CompletedProceduresPanel() {
  const { procedures, activeVisitId } = useClinic();
  const { activePatientId } = useActivePatient();

  const activeVisitProcedures = procedures.filter(p => p.visitId === activeVisitId);
  if (!activePatientId) return null;

  return (
    <div className="flex flex-col h-full bg-surface border border-border text-left">
      <div className="px-4 py-2.5 bg-background border-b border-border flex items-center justify-between">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <CheckCircle className="h-3.5 w-3.5 text-text-secondary" />
          Procedures Completed
        </h4>
        <span className="text-[10px] font-bold font-mono bg-cyan-100 text-primary px-2 py-0.5 rounded-xl">
          {activeVisitProcedures.length}
        </span>
      </div>

      <div className="p-3 space-y-2 text-xs flex-1 overflow-y-auto">
        {activeVisitProcedures.length === 0 ? (
          <div className="p-4 text-center text-text-muted font-medium">No procedures completed.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border text-[10px] uppercase text-text-secondary font-bold bg-background">
                <th className="py-2 px-3">Tooth</th>
                <th className="py-2 px-3">Procedure</th>
                <th className="py-2 px-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="font-medium text-text-primary">
              {activeVisitProcedures.map(proc => (
                <tr key={proc.id} className="border-b border-border">
                  <td className="py-2 px-3 font-mono font-bold text-text-secondary">{proc.toothRef}</td>
                  <td className="py-2 px-3">{proc.type}</td>
                  <td className="py-2 px-3 font-mono font-bold text-right">₱{proc.basePrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
