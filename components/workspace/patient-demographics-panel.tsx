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


export function PatientDemographicsPanel() {
  const { patients } = useClinic();
  const { activePatientId } = useActivePatient();
  const patient = patients.find(p => p.id === activePatientId);

  if (!patient) return null;

  return (
    <div className="flex flex-col h-full bg-surface border border-border text-left">
      <div className="px-4 py-2.5 bg-background border-b border-border">
        <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">Demographics</h4>
      </div>
      <div className="p-4 space-y-2 text-xs text-text-primary flex-1 overflow-y-auto">
        <div><span className="font-bold text-text-muted w-24 inline-block">Record ID:</span> {patient.id}</div>
        <div><span className="font-bold text-text-muted w-24 inline-block">Full Name:</span> {patient.name}</div>
        <div><span className="font-bold text-text-muted w-24 inline-block">Birth Date:</span> {patient.dateOfBirth}</div>
        <div><span className="font-bold text-text-muted w-24 inline-block">Gender:</span> {patient.sex}</div>
        <div><span className="font-bold text-text-muted w-24 inline-block">Contact:</span> {patient.contact}</div>
        <div><span className="font-bold text-text-muted w-24 inline-block">Address:</span> {patient.address}</div>
      </div>
    </div>
  );
}
