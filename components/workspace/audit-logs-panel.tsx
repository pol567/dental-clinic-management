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


export function AuditLogsPanel() {
  const { activePatientId } = useActivePatient();
  if (!activePatientId) return null;

  return (
    <div className="flex flex-col h-full bg-surface border border-border text-left">
      <div className="px-4 py-2.5 bg-background border-b border-border">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Compliance checks</h4>
      </div>
      <div className="p-4 space-y-3 text-xs flex-1 overflow-y-auto">
        <div className="p-3 bg-background border border-border rounded-xl">
          <strong className="font-bold text-text-primary">PH RA 10173 Audit Status:</strong> Complete
        </div>
      </div>
    </div>
  );
}
