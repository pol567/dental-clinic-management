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


export function MedicalHistoryPanel() {
  const { medicalAnswers, allergies } = useClinic();
  const { activePatientId } = useActivePatient();

  const answers = medicalAnswers.filter(a => a.patientId === activePatientId && a.answer);
  const patientAllergies = allergies.filter(a => a.patientId === activePatientId);

  if (!activePatientId) return null;

  return (
    <div className="flex flex-col h-full bg-surface border border-border text-left">
      <div className="px-4 py-2.5 bg-background border-b border-border">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Medical & Allergies</h4>
      </div>
      <div className="p-4 space-y-4 flex-1 overflow-y-auto text-xs">
        {patientAllergies.length > 0 && (
          <div className="text-red-700 font-bold bg-red-50 p-2 rounded border border-red-100">
            Allergies: {patientAllergies.map(a => a.substance).join(', ')}
          </div>
        )}
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block">History</span>
          {answers.length > 0 ? answers.map(a => (
            <div key={a.questionId}>⚠️ {a.notes || 'Condition noted'}</div>
          )) : "No systemic medical conditions."}
        </div>
      </div>
    </div>
  );
}
