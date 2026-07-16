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

  useEffect(() => {
    if (patientBills.length > 0) {
      setSelectedBillId(patientBills[0].id);
    } else {
      setSelectedBillId('');
    }
  }, [patientBills.map(b => b.id).join(',')]);

  const activeBill = bills.find(b => b.id === selectedBillId);
  if (!activePatientId) return null;

  const handleSubmitPayment = () => {
    const num = parseFloat(paymentAmount);
    if (!selectedBillId || isNaN(num) || num <= 0) return;
    recordPayment(selectedBillId, num, method);
    setPaymentAmount('');
  };

  return (
    <div className="flex flex-col h-full bg-surface border border-border text-left">
      <div className="px-4 py-2.5 bg-background border-b border-border flex items-center justify-between">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
          <CreditCard className="h-3.5 w-3.5 text-text-secondary" />
          Settle Bills
        </h4>
      </div>

      <div className="p-4 space-y-4 text-xs flex-1 overflow-y-auto">
        {patientBills.length === 0 ? (
          <div className="p-4 text-center text-text-muted">No outstanding invoices.</div>
        ) : (
          <div className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Outstanding Invoice Reference</label>
              <select
                value={selectedBillId}
                onChange={e => setSelectedBillId(e.target.value)}
                className="w-full bg-surface border border-border rounded-2xl px-3 py-1.5 text-xs font-semibold"
              >
                {patientBills.map(b => (
                  <option key={b.id} value={b.id}>
                    Invoice #{b.id} (₱{b.grandTotal.toLocaleString()})
                  </option>
                ))}
              </select>
            </div>

            {activeBill && (
              <div className="p-3 bg-background border border-border rounded-xl text-[11px] space-y-1 text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Invoice Total</span>
                  <span className="font-mono font-bold text-text-primary">₱{activeBill.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Payment Channel</label>
              <div className="grid grid-cols-2 gap-1 bg-background p-1 rounded-xl font-bold text-center">
                {(['cash', 'card', 'gcash', 'bank'] as const).map(opt => {
                  const isActive = method === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => setMethod(opt)}
                      className={`py-1 rounded-xl text-[10px] uppercase cursor-pointer select-none min-h-[32px] ${
                        isActive ? 'bg-primary text-white ' : 'bg-surface text-text-primary hover:bg-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-text-muted uppercase tracking-wider block">Amount Tendered</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-text-muted font-bold font-mono">₱</span>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={e => setPaymentAmount(e.target.value)}
                  className="w-full border border-border rounded-xl pl-7 pr-3 py-1.5 text-xs font-semibold bg-surface"
                  placeholder="0.00"
                />
              </div>
            </div>

            <button
              onClick={handleSubmitPayment}
              disabled={!paymentAmount}
              className="w-full py-2.5 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              Record Payment Receipt
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Compact minimalist versions for non-active registration-required slots