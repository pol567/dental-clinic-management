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


export function TaxComputationPanel() {
  const { procedures, bills, createBill, finalizeBill, activeVisitId, patients, updatePatient, currentUser } = useClinic();
  const { activePatientId } = useActivePatient();

  const [discountType, setDiscountType] = useState<'none' | 'senior' | 'pwd' | 'promotional' | 'custom'>('none');
  const [customPct, setCustomPct] = useState(0);

  const activeVisitProcedures = procedures.filter(p => p.visitId === activeVisitId && p.isBillable);
  const patient = patients.find(p => p.id === activePatientId);
  const activeBill = bills.find(b => b.visitId === activeVisitId);

  useEffect(() => {
    if (patient) {
      if (patient.isSenior) setDiscountType('senior');
      else if (patient.isPwd) setDiscountType('pwd');
      else setDiscountType('none');
    }
  }, [patient]);

  if (!activePatientId || !patient) return null;

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

  const isLocked = activeBill && activeBill.status !== 'draft';

  return (
    <div className="flex flex-col h-full bg-surface border border-border text-left">
      <div className="px-4 py-2.5 bg-background border-b border-border flex items-center justify-between">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-text-secondary" />
          PH Tax Audits
        </h4>
      </div>

      <div className="p-4 space-y-4 text-xs flex-1 overflow-y-auto">
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase text-text-muted tracking-wider block">Discount Category</label>
          <div className="flex flex-col gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-border/50">
            {([
              { id: 'none', label: 'Standard Revenue (No Exemption)' },
              { id: 'senior', label: 'Senior Citizen (VAT Exempt + 20%)' },
              { id: 'pwd', label: 'PWD Exemption (VAT Exempt + 20%)' },
              { id: 'promotional', label: 'Promotional Rebate (10%)' },
              { id: 'custom', label: 'Custom Discount' }
            ] as const).map(item => {
              const isActive = discountType === item.id;
              return (
                <button
                  key={item.id}
                  disabled={isLocked}
                  type="button"
                  onClick={() => setDiscountType(item.id)}
                  className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg capitalize select-none min-h-[38px] cursor-pointer disabled:opacity-60 ${
                    isActive
                      ? 'bg-surface text-[#0E7490]  font-bold border border-border/50'
                      : 'text-[#64748B] hover:text-[#1F2933]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {discountType === 'custom' && (
            <div className="space-y-1 mt-2">
              <label className="text-[9px] font-bold text-text-secondary uppercase">Percent (%)</label>
              <input
                type="number"
                disabled={isLocked}
                value={customPct}
                onChange={e => setCustomPct(Math.max(0, Math.min(100, Number(e.target.value))))}
                className="w-full border border-border rounded-xl px-2.5 py-1 text-xs font-semibold bg-surface"
                min={0}
                max={100}
              />
            </div>
          )}
        </div>

        {(discountType === 'senior' || discountType === 'pwd') && (
          <div className="p-3.5 bg-cyan-50/50 border border-cyan-200 rounded-xl space-y-3">
            <span className="text-[10px] font-bold text-primary uppercase block tracking-wider">Statutory Verification Proof</span>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[9px] text-primary font-bold block uppercase">SC/PWD Card ID</label>
                <input
                  type="text"
                  disabled={isLocked}
                  value={patient.scPwdIdNumber || ''}
                  onChange={(e) => updatePatient({ ...patient, scPwdIdNumber: e.target.value })}
                  placeholder="Card ID required"
                  className={`w-full bg-surface border rounded-xl px-2.5 py-1.5 text-xs font-mono font-medium ${
                    !patient.scPwdIdNumber?.trim() ? 'border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50/30' : 'border-border'
                  }`}
                />
                {!patient.scPwdIdNumber?.trim() && (
                  <div className="text-[10px] text-red-700 font-bold mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 text-red-600 shrink-0" />
                    <span>Government ID is required.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-border space-y-2.5">
          {!activeBill ? (
            <button
              disabled={activeVisitProcedures.length === 0}
              onClick={handleCreateBillDraft}
              className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              Generate Draft Invoice
            </button>
          ) : activeBill.status === 'draft' ? (
            <button
              onClick={handleFinalizeAndLock}
              disabled={(discountType === 'senior' || discountType === 'pwd') && !patient.scPwdIdNumber?.trim()}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px] disabled:opacity-50"
            >
              <Lock className="h-3.5 w-3.5" />
              Lock Revenue Record
            </button>
          ) : (
            <div className="p-3 bg-background border border-border rounded-xl flex items-center justify-center gap-2 font-bold text-slate-600 uppercase text-[10px]">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              <span>Bill Record Locked</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
