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
import { ToothInspectorPanel } from './tooth-inspector-panel';


export function OdontogramChartPanel() {
  const { activePatientId, activeVisitId } = useClinic();
  const { isVisitFlowActive } = useActiveEncounter();

  if (!activePatientId) {
    return (
      <div className="p-8 text-center text-xs text-text-muted font-medium h-full flex items-center justify-center">
        Select a patient from the lookup directories to load the clinical Odontogram canvas.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full divide-y divide-slate-150 overflow-y-auto">
      <div className="p-2 bg-surface">
        <OdontogramChart
          patientId={activePatientId}
          interactive={isVisitFlowActive}
          activeVisitId={activeVisitId}
          noCard={true}
        />
      </div>
      <div className="bg-background/10 flex-1 min-h-[220px]">
        <ToothInspectorPanel />
      </div>
    </div>
  );
}
