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


export function LegalConsentPanel() {
  const { consents } = useClinic();
  const { activePatientId } = useActivePatient();
  const patientConsents = consents.filter(c => c.patientId === activePatientId);

  if (!activePatientId) return null;

  return (
    <div className="flex flex-col h-full bg-surface border border-border text-left">
      <div className="px-4 py-2.5 bg-background border-b border-border">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Legal Consents</h4>
      </div>
      <div className="p-4 space-y-3 flex-1 overflow-y-auto text-xs">
        {patientConsents.map(c => (
          <div key={c.type} className="flex items-center gap-2 text-emerald-700 font-medium bg-emerald-50 p-2 rounded">
            <CheckCircle className="h-4 w-4" /> {c.type.replace('_', ' ')}
          </div>
        ))}
      </div>
    </div>
  );
}
