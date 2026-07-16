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


import {
  PatientDemographicsPanel,
  MedicalHistoryPanel,
  LegalConsentPanel,
  MedicalIntakeSummaryPanel,
  PatientOverviewPanel,
  EncounterHistoryPanel,
  OdontogramChartPanel,
  ToothInspectorPanel,
  CompletedProceduresPanel,
  DraftInvoicePanel,
  TaxComputationPanel,
  BillsAndPaymentsPanel,
  DoubleEntryStatementPanel,
  PaymentTerminalPanel,
  PatientDetailsCardPanel,
  EncounterTimelinePanel,
  AuditLogsPanel
} from './index';

export function WorkspacePanelsRegisterer() {
  const { registerPanel } = useWorkspace();

  useEffect(() => {
    registerPanel('patient-demographics', PatientDemographicsPanel);
    registerPanel('medical-history', MedicalHistoryPanel);
    registerPanel('legal-consent', LegalConsentPanel);
    registerPanel('medical-intake-summary', MedicalIntakeSummaryPanel);
    registerPanel('patient-overview', PatientOverviewPanel);
    registerPanel('encounter-history', EncounterHistoryPanel);
    registerPanel('odontogram-chart', OdontogramChartPanel);
    registerPanel('tooth-inspector', ToothInspectorPanel);
    registerPanel('completed-procedures', CompletedProceduresPanel);
    registerPanel('draft-invoice', DraftInvoicePanel);
    registerPanel('tax-computation', TaxComputationPanel);
    registerPanel('bills-and-payments', BillsAndPaymentsPanel);
    registerPanel('double-entry-statement', DoubleEntryStatementPanel);
    registerPanel('payment-terminal', PaymentTerminalPanel);
    registerPanel('patient-details-card', PatientDetailsCardPanel);
    registerPanel('encounter-timeline', EncounterTimelinePanel);
    registerPanel('audit-logs', AuditLogsPanel);
  }, [registerPanel]);

  return null;
}
