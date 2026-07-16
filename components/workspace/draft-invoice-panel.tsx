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


export function DraftInvoicePanel() {
  const { procedures, bills, activeVisitId } = useClinic();
  const { activePatientId } = useActivePatient();

  const activeVisitProcedures = procedures.filter(p => p.visitId === activeVisitId && p.isBillable);
  const activeBill = bills.find(b => b.visitId === activeVisitId);
  const subtotal = activeVisitProcedures.reduce((sum, p) => sum + p.basePrice, 0);

  if (!activePatientId) return null;

  return (
    <div className="flex flex-col h-full bg-surface border border-border text-left">
      <div className="px-4 py-2.5 bg-background border-b border-border flex items-center justify-between">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <Receipt className="h-3.5 w-3.5 text-text-secondary" />
          BIR Draft Invoice
        </h4>
        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-xl bg-background text-text-secondary">
          {activeBill ? `Bill ID: ${activeBill.id}` : 'Draft Lines'}
        </span>
      </div>

      <div className="p-4 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto border border-border rounded-xl bg-surface">
          <table className="w-full text-left border-collapse text-[11px]">
            <thead>
              <tr className="bg-background text-text-secondary border-b border-border uppercase font-bold text-[9px]">
                <th className="py-2 px-3">Description</th>
                <th className="py-2 px-3 text-center">Ref</th>
                <th className="py-2 px-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {activeVisitProcedures.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-8 text-center text-text-muted">No billable lines to invoice</td>
                </tr>
              ) : (
                activeVisitProcedures.map(proc => (
                  <tr key={proc.id} className="border-b border-border font-medium text-text-primary">
                    <td className="py-2 px-3 font-semibold text-text-primary">{proc.type}</td>
                    <td className="py-2 px-3 text-center font-mono">Tooth {proc.toothRef}</td>
                    <td className="py-2 px-3 text-right font-mono">₱{proc.basePrice.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 pt-3 border-t border-border space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal (VAT-Inclusive Base)</span>
            <span className="font-mono font-bold text-text-primary">₱{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
          </div>
          
          {activeBill?.vatExempt && (
            <div className="flex justify-between text-[#15803D] font-bold">
              <span>Less: 12% VAT Exemption</span>
              <span className="font-mono">-₱{(subtotal - subtotal / 1.12).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          )}

          {activeBill && activeBill.discountAmount > 0 && (
            <div className="flex justify-between text-[#15803D] font-bold">
              <span>Less: Exemption Discount ({activeBill.discountPct}%)</span>
              <span className="font-mono">-₱{activeBill.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          )}

          {activeBill && !activeBill.vatExempt && (
            <div className="flex justify-between text-text-secondary font-medium">
              <span>BIR 12% VAT</span>
              <span className="font-mono">₱{activeBill.vatAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          )}

          <div className="flex justify-between text-sm font-bold text-text-primary border-t border-dashed border-border pt-2">
            <span>Statement Total Due</span>
            <span className="font-mono text-primary">
              ₱{(activeBill ? activeBill.grandTotal : subtotal).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
