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


export function BillsAndPaymentsPanel() {
  const { bills, visits } = useClinic();
  const { activePatientId } = useActivePatient();

  const patientBills = bills.filter(bill => {
    const visitObj = visits.find(v => v.id === bill.visitId);
    return visitObj && visitObj.patientId === activePatientId;
  });

  if (!activePatientId) return null;

  return (
    <div className="flex flex-col h-full bg-surface border border-border text-left">
      <div className="px-4 py-2.5 bg-background border-b border-border flex items-center justify-between">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <Receipt className="h-3.5 w-3.5 text-text-secondary" />
          Issued Patient Invoices
        </h4>
        <span className="text-[10px] font-bold font-mono bg-slate-200 px-2 py-0.5 rounded-xl text-slate-600">
          {patientBills.length} Bills
        </span>
      </div>

      <div className="p-3 space-y-2 text-xs flex-1 overflow-y-auto">
        {patientBills.length === 0 ? (
          <div className="p-4 text-center text-text-muted">No invoices generated yet.</div>
        ) : (
          patientBills.map(bill => (
            <div key={bill.id} className="p-3 border border-border rounded-xl flex flex-col gap-1.5 bg-background/50">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-text-primary">Invoice #{bill.id}</span>
                <span className={`px-2 py-0.5 rounded-xl text-[8px] font-bold uppercase ${
                  bill.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-text-primary'
                }`}>
                  {bill.status}
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-border text-[11px]">
                <div>
                  <span className="text-[9px] text-text-muted font-bold uppercase tracking-wider block">Total</span>
                  <strong className="font-mono font-bold text-text-primary">₱{bill.grandTotal.toLocaleString()}</strong>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
