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


export function DoubleEntryStatementPanel() {
  const { ledgerEntries } = useClinic();
  const { activePatientId } = useActivePatient();

  const patientEntries = ledgerEntries
    .filter(le => le.patientId === activePatientId)
    .sort((a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime());

  let runningBalance = 0;
  if (!activePatientId) return null;

  return (
    <div className="flex flex-col h-full bg-surface border border-border text-left">
      <div className="px-4 py-2.5 bg-background border-b border-border flex items-center justify-between">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-text-secondary" />
          Financial General Ledger
        </h4>
      </div>

      <div className="p-4 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto border border-border rounded-xl bg-surface font-mono text-[11px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-background text-text-secondary border-b border-border uppercase font-bold text-[9px] tracking-wider">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Debit</th>
                <th className="py-2.5 px-3 text-right">Credit</th>
                <th className="py-2.5 px-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {patientEntries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-muted">No ledger history on file</td>
                </tr>
              ) : (
                patientEntries.map(entry => {
                  const isCharge = entry.type === 'charge';
                  const amount = entry.amount;
                  runningBalance += amount;

                  return (
                    <tr key={entry.id} className="border-b border-border last:border-0 font-medium text-text-primary hover:bg-background/50">
                      <td className="py-2 px-3 text-text-secondary text-[10px]">{new Date(entry.recordedAt).toLocaleDateString()}</td>
                      <td className="py-2 px-3 font-semibold text-text-primary">{entry.notes || entry.type}</td>
                      <td className="py-2 px-3 text-right font-bold text-red-700">
                        {isCharge ? `₱${amount.toLocaleString()}` : ''}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-emerald-700">
                        {!isCharge ? `₱${Math.abs(amount).toLocaleString()}` : ''}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-text-primary">
                        ₱{runningBalance.toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
          <span className="text-text-secondary font-bold uppercase text-[9px]">Account Status Audited Balance</span>
          <div className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${runningBalance === 0 ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            <span className="font-mono font-bold text-sm text-text-primary">
              ₱{runningBalance.toLocaleString()} PHP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
