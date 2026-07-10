'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User, Patient, Allergy, Consent, MedicalAnswer, TreatmentPlan, Visit, Diagnosis,
  ToothConditionEvent, PlannedTreatment, Procedure, Bill, BillItem, LedgerEntry, Payment,
  SEED_USERS, SEED_PATIENTS, SEED_ALLERGIES, SEED_CONSENTS, SEED_MEDICAL_ANSWERS,
  SEED_TREATMENT_PLANS, SEED_VISITS, SEED_DIAGNOSES, SEED_TOOTH_EVENTS, SEED_PLANNED_TREATMENTS,
  SEED_PROCEDURES, SEED_BILLS, SEED_BILL_ITEMS, SEED_LEDGER_ENTRIES, SEED_PAYMENTS
} from './types';

interface ClinicContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  patients: Patient[];
  allergies: Allergy[];
  consents: Consent[];
  medicalAnswers: MedicalAnswer[];
  treatmentPlans: TreatmentPlan[];
  visits: Visit[];
  diagnoses: Diagnosis[];
  toothEvents: ToothConditionEvent[];
  plannedTreatments: PlannedTreatment[];
  procedures: Procedure[];
  bills: Bill[];
  billItems: BillItem[];
  ledgerEntries: LedgerEntry[];
  payments: Payment[];

  // Selection states
  activePatientId: string | null;
  setActivePatientId: (id: string | null) => void;
  activeVisitId: string | null;
  setActiveVisitId: (id: string | null) => void;

  // Actions
  addPatient: (patient: Omit<Patient, 'id' | 'registeredAt'>, allergiesList: string[], answers: { [qId: string]: { answer: boolean; notes?: string } }, consentsList: Array<{ type: 'treatment' | 'radiograph' | 'extraction' | 'data_privacy', textVersion: string }>) => Patient;
  updatePatient: (patient: Patient) => void;
  openVisit: (patientId: string, chiefComplaint: string, treatmentPlanId: string | null, notes: string) => Visit;
  addDiagnosis: (visitId: string, toothRef: string | null, description: string) => void;
  addToothEvent: (patientId: string, toothNumber: string, conditionCode: 'H' | 'D' | 'F' | 'X' | 'C' | 'I', note?: string) => void;
  togglePlannedTreatment: (patientId: string, toothNumber: string | null, description: string, toggleOn: boolean) => void;
  performProcedure: (visitId: string, plannedTreatmentId: string | null, type: string, toothRef: string, basePrice: number, isBillable: boolean, notes?: string) => Procedure;
  createBill: (visitId: string, discountType: 'none' | 'senior' | 'pwd' | 'promotional' | 'custom', items: Omit<BillItem, 'id' | 'billId'>[]) => Bill;
  finalizeBill: (billId: string, discountType: 'none' | 'senior' | 'pwd' | 'promotional' | 'custom', customDiscountPct?: number) => void;
  recordPayment: (billId: string, amount: number, method: 'cash' | 'card' | 'gcash' | 'bank') => void;
  resetToSeed: () => void;
}

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

// Pure helper function defined outside React component to prevent purity rules alerts
function generateUniqueId(prefix: string): string {
  const randomStr = Math.floor(Math.random() * 100000000).toString(36);
  return `${prefix}-${randomStr}`;
}

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try loading from localStorage first, otherwise default to seed data
  const [currentUser, setCurrentUser] = useState<User>(SEED_USERS[0]); // Default to Dentist
  const [patients, setPatients] = useState<Patient[]>([]);
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [consents, setConsents] = useState<Consent[]>([]);
  const [medicalAnswers, setMedicalAnswers] = useState<MedicalAnswer[]>([]);
  const [treatmentPlans, setTreatmentPlans] = useState<TreatmentPlan[]>([]);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [toothEvents, setToothEvents] = useState<ToothConditionEvent[]>([]);
  const [plannedTreatments, setPlannedTreatments] = useState<PlannedTreatment[]>([]);
  const [procedures, setProcedures] = useState<Procedure[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const [activePatientId, setActivePatientId] = useState<string | null>(null);
  const [activeVisitId, setActiveVisitId] = useState<string | null>(null);

  const [loaded, setLoaded] = useState(false);

  // Load from LocalStorage once on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('ec_currentUser');
      const storedPatients = localStorage.getItem('ec_patients');
      const storedAllergies = localStorage.getItem('ec_allergies');
      const storedConsents = localStorage.getItem('ec_consents');
      const storedAnswers = localStorage.getItem('ec_medicalAnswers');
      const storedPlans = localStorage.getItem('ec_treatmentPlans');
      const storedVisits = localStorage.getItem('ec_visits');
      const storedDiag = localStorage.getItem('ec_diagnoses');
      const storedEvents = localStorage.getItem('ec_toothEvents');
      const storedPlanned = localStorage.getItem('ec_plannedTreatments');
      const storedProcs = localStorage.getItem('ec_procedures');
      const storedBills = localStorage.getItem('ec_bills');
      const storedItems = localStorage.getItem('ec_billItems');
      const storedLedger = localStorage.getItem('ec_ledgerEntries');
      const storedPayments = localStorage.getItem('ec_payments');
      const storedActivePatient = localStorage.getItem('ec_activePatientId');
      const storedActiveVisit = localStorage.getItem('ec_activeVisitId');

      // Update states asynchronously in next microtask tick
      setTimeout(() => {
        if (storedUser) setCurrentUser(JSON.parse(storedUser));
        setPatients(storedPatients ? JSON.parse(storedPatients) : SEED_PATIENTS);
        setAllergies(storedAllergies ? JSON.parse(storedAllergies) : SEED_ALLERGIES);
        setConsents(storedConsents ? JSON.parse(storedConsents) : SEED_CONSENTS);
        setMedicalAnswers(storedAnswers ? JSON.parse(storedAnswers) : SEED_MEDICAL_ANSWERS);
        setTreatmentPlans(storedPlans ? JSON.parse(storedPlans) : SEED_TREATMENT_PLANS);
        setVisits(storedVisits ? JSON.parse(storedVisits) : SEED_VISITS);
        setDiagnoses(storedDiag ? JSON.parse(storedDiag) : SEED_DIAGNOSES);
        setToothEvents(storedEvents ? JSON.parse(storedEvents) : SEED_TOOTH_EVENTS);
        setPlannedTreatments(storedPlanned ? JSON.parse(storedPlanned) : SEED_PLANNED_TREATMENTS);
        setProcedures(storedProcs ? JSON.parse(storedProcs) : SEED_PROCEDURES);
        setBills(storedBills ? JSON.parse(storedBills) : SEED_BILLS);
        setBillItems(storedItems ? JSON.parse(storedItems) : SEED_BILL_ITEMS);
        setLedgerEntries(storedLedger ? JSON.parse(storedLedger) : SEED_LEDGER_ENTRIES);
        setPayments(storedPayments ? JSON.parse(storedPayments) : SEED_PAYMENTS);

        if (storedActivePatient) setActivePatientId(storedActivePatient);
        if (storedActiveVisit) setActiveVisitId(storedActiveVisit);

        setLoaded(true);
      }, 0);

    } catch (e) {
      console.error('Failed to load clinic state', e);
      setTimeout(() => {
        setLoaded(true);
      }, 0);
    }
  }, []);

  // Save to LocalStorage when states change
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem('ec_currentUser', JSON.stringify(currentUser));
      localStorage.setItem('ec_patients', JSON.stringify(patients));
      localStorage.setItem('ec_allergies', JSON.stringify(allergies));
      localStorage.setItem('ec_consents', JSON.stringify(consents));
      localStorage.setItem('ec_medicalAnswers', JSON.stringify(medicalAnswers));
      localStorage.setItem('ec_treatmentPlans', JSON.stringify(treatmentPlans));
      localStorage.setItem('ec_visits', JSON.stringify(visits));
      localStorage.setItem('ec_diagnoses', JSON.stringify(diagnoses));
      localStorage.setItem('ec_toothEvents', JSON.stringify(toothEvents));
      localStorage.setItem('ec_plannedTreatments', JSON.stringify(plannedTreatments));
      localStorage.setItem('ec_procedures', JSON.stringify(procedures));
      localStorage.setItem('ec_bills', JSON.stringify(bills));
      localStorage.setItem('ec_billItems', JSON.stringify(billItems));
      localStorage.setItem('ec_ledgerEntries', JSON.stringify(ledgerEntries));
      localStorage.setItem('ec_payments', JSON.stringify(payments));
      if (activePatientId) localStorage.setItem('ec_activePatientId', activePatientId);
      else localStorage.removeItem('ec_activePatientId');
      if (activeVisitId) localStorage.setItem('ec_activeVisitId', activeVisitId);
      else localStorage.removeItem('ec_activeVisitId');
    } catch (e) {
      console.error('Failed to save state to localStorage', e);
    }
  }, [
    loaded, currentUser, patients, allergies, consents, medicalAnswers, treatmentPlans,
    visits, diagnoses, toothEvents, plannedTreatments, procedures, bills, billItems,
    ledgerEntries, payments, activePatientId, activeVisitId
  ]);

  const resetToSeed = () => {
    setCurrentUser(SEED_USERS[0]);
    setPatients(SEED_PATIENTS);
    setAllergies(SEED_ALLERGIES);
    setConsents(SEED_CONSENTS);
    setMedicalAnswers(SEED_MEDICAL_ANSWERS);
    setTreatmentPlans(SEED_TREATMENT_PLANS);
    setVisits(SEED_VISITS);
    setDiagnoses(SEED_DIAGNOSES);
    setToothEvents(SEED_TOOTH_EVENTS);
    setPlannedTreatments(SEED_PLANNED_TREATMENTS);
    setProcedures(SEED_PROCEDURES);
    setBills(SEED_BILLS);
    setBillItems(SEED_BILL_ITEMS);
    setLedgerEntries(SEED_LEDGER_ENTRIES);
    setPayments(SEED_PAYMENTS);
    setActivePatientId(null);
    setActiveVisitId(null);
  };

  // ACTIONS IMPLEMENTATION

  // Create Patient (structured intake)
  const addPatient = (
    patientData: Omit<Patient, 'id' | 'registeredAt'>,
    allergiesList: string[],
    answers: { [qId: string]: { answer: boolean; notes?: string } },
    consentsList: Array<{ type: 'treatment' | 'radiograph' | 'extraction' | 'data_privacy', textVersion: string }>
  ) => {
    const patientId = 'p-' + Math.random().toString(36).substr(2, 9);
    const newPatient: Patient = {
      ...patientData,
      id: patientId,
      registeredAt: new Date().toISOString()
    };

    // Allergies
    const newAllergies = allergiesList.map(item => ({
      id: 'a-' + Math.random().toString(36).substr(2, 9),
      patientId,
      substance: item,
      severity: 'Severe' as const, // default for intake alerts
      note: 'Added during patient intake'
    }));

    // Medical history answers
    const newAnswers = Object.entries(answers).map(([qId, val]) => ({
      questionId: qId,
      patientId,
      answer: val.answer,
      notes: val.notes
    }));

    // Consents
    const newConsents = consentsList.map(c => ({
      id: 'c-' + Math.random().toString(36).substr(2, 9),
      patientId,
      type: c.type,
      acknowledgedAt: new Date().toISOString(),
      acknowledgedBy: currentUser.displayName,
      textVersion: c.textVersion
    }));

    setPatients(prev => [newPatient, ...prev]);
    setAllergies(prev => [...prev, ...newAllergies]);
    setMedicalAnswers(prev => [...prev, ...newAnswers]);
    setConsents(prev => [...prev, ...newConsents]);

    // Also populate default healthy conditions (H) for all 52 teeth
    const defaultEvents: ToothConditionEvent[] = [];
    const FDI_TEETH = [
      // Permanent
      '18','17','16','15','14','13','12','11','21','22','23','24','25','26','27','28',
      '48','47','46','45','44','43','42','41','31','32','33','34','35','36','37','38',
      // Deciduous
      '55','54','53','52','51','61','62','63','64','65',
      '85','84','83','82','81','71','72','73','74','75'
    ];
    FDI_TEETH.forEach(tooth => {
      defaultEvents.push({
        id: 'te-' + Math.random().toString(36).substr(2, 9),
        patientId,
        toothNumber: tooth,
        conditionCode: 'H',
        note: 'Healthy (Initial state on intake)',
        recordedAt: new Date().toISOString(),
        recordedBy: currentUser.id
      });
    });
    setToothEvents(prev => [...prev, ...defaultEvents]);

    return newPatient;
  };

  const updatePatient = (updated: Patient) => {
    setPatients(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  // Open Visit (standalone or linked to a treatment plan)
  const openVisit = (patientId: string, chiefComplaint: string, treatmentPlanId: string | null, notes: string) => {
    const visitId = 'v-' + Math.random().toString(36).substr(2, 9);
    const newVisit: Visit = {
      id: visitId,
      patientId,
      treatmentPlanId,
      visitDate: new Date().toISOString().split('T')[0],
      chiefComplaint,
      notes,
      createdBy: currentUser.id
    };
    setVisits(prev => [newVisit, ...prev]);
    setActiveVisitId(visitId);
    return newVisit;
  };

  // Add Diagnosis
  const addDiagnosis = (visitId: string, toothRef: string | null, description: string) => {
    const newDiag: Diagnosis = {
      id: 'd-' + Math.random().toString(36).substr(2, 9),
      visitId,
      toothRef,
      description,
      createdAt: new Date().toISOString(),
      createdBy: currentUser.id
    };
    setDiagnoses(prev => [newDiag, ...prev]);
  };

  // Add Tooth Condition Event
  const addToothEvent = (patientId: string, toothNumber: string, conditionCode: 'H' | 'D' | 'F' | 'X' | 'C' | 'I', note?: string) => {
    const newEvent: ToothConditionEvent = {
      id: 'te-' + Math.random().toString(36).substr(2, 9),
      patientId,
      toothNumber,
      conditionCode,
      note,
      recordedAt: new Date().toISOString(),
      recordedBy: currentUser.id
    };
    setToothEvents(prev => [...prev, newEvent]);
  };

  // Toggle Planned Treatment (P)
  const togglePlannedTreatment = (patientId: string, toothNumber: string | null, description: string, toggleOn: boolean) => {
    if (toggleOn) {
      const newPlan: PlannedTreatment = {
        id: 'pt-' + Math.random().toString(36).substr(2, 9),
        patientId,
        toothNumber,
        description,
        status: 'planned',
        linkedProcedureId: null,
        createdAt: new Date().toISOString()
      };
      setPlannedTreatments(prev => [...prev, newPlan]);
    } else {
      setPlannedTreatments(prev => prev.filter(pt => !(pt.patientId === patientId && pt.toothNumber === toothNumber && pt.status === 'planned')));
    }
  };

  // Perform Procedure (bridges the planned treatments, updates chart if completed)
  const performProcedure = (
    visitId: string,
    plannedTreatmentId: string | null,
    type: string,
    toothRef: string,
    basePrice: number,
    isBillable: boolean,
    notes?: string
  ) => {
    const procedureId = 'pr-' + Math.random().toString(36).substr(2, 9);
    const newProc: Procedure = {
      id: procedureId,
      visitId,
      plannedTreatmentId,
      type,
      toothRef,
      basePrice,
      isBillable,
      notes,
      performedBy: currentUser.id
    };

    // Update the planned treatment status to done
    if (plannedTreatmentId) {
      setPlannedTreatments(prev => prev.map(pt => pt.id === plannedTreatmentId ? { ...pt, status: 'done', linkedProcedureId: procedureId } : pt));
    }

    setProcedures(prev => [...prev, newProc]);

    // Automatically update chart condition when appropriate
    // E.g., if extracting -> tooth becomes X
    // If placing crown -> tooth becomes C
    // If pulpectomy/filling -> tooth becomes F
    let matchedCode: 'H' | 'D' | 'F' | 'X' | 'C' | 'I' | null = null;
    const lowerType = type.toLowerCase();
    if (lowerType.includes('extraction') || lowerType.includes('extract')) {
      matchedCode = 'X';
    } else if (lowerType.includes('crown')) {
      matchedCode = 'C';
    } else if (lowerType.includes('implant')) {
      matchedCode = 'I';
    } else if (lowerType.includes('filling') || lowerType.includes('sealant') || lowerType.includes('composite') || lowerType.includes('rct') || lowerType.includes('canal')) {
      matchedCode = 'F';
    }

    if (matchedCode) {
      const activeVisitObj = visits.find(v => v.id === visitId);
      if (activeVisitObj) {
        addToothEvent(activeVisitObj.patientId, toothRef, matchedCode, `Completed procedure: ${type}`);
      }
    }

    return newProc;
  };

  // Generate Draft Bill
  const createBill = (visitId: string, discountType: 'none' | 'senior' | 'pwd' | 'promotional' | 'custom', items: Omit<BillItem, 'id' | 'billId'>[]) => {
    const billId = generateUniqueId('b');
    const visitObj = visits.find(v => v.id === visitId);
    const patientId = visitObj ? visitObj.patientId : '';
    const patientObj = patients.find(p => p.id === patientId);

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);

    // Initial tax and discount calculations (12% VAT in Philippines)
    // Detailed math is run in finalizeBill; here we provide standard drafts
    const billItemsList: BillItem[] = items.map((item, index) => ({
      ...item,
      id: `bi-${billId}-${index}`,
      billId
    }));

    const newBill: Bill = {
      id: billId,
      visitId,
      treatmentPlanId: visitObj?.treatmentPlanId || null,
      status: 'draft',
      discountType,
      discountPct: discountType === 'senior' || discountType === 'pwd' ? 20 : 0,
      vatExempt: discountType === 'senior' || discountType === 'pwd',
      vatRate: 0.12,
      scPwdIdSnapshot: patientObj?.scPwdIdNumber,
      tinSnapshot: patientObj?.tin,
      subtotal,
      discountAmount: 0,
      vatAmount: discountType === 'senior' || discountType === 'pwd' ? 0 : subtotal * 0.12, // simple draft placeholder
      grandTotal: subtotal
    };

    // Calculate actual math
    const finalizedDetails = calculateBillTotals(subtotal, discountType, 0);
    newBill.discountAmount = finalizedDetails.discountAmount;
    newBill.vatAmount = finalizedDetails.vatAmount;
    newBill.grandTotal = finalizedDetails.grandTotal;

    setBills(prev => [newBill, ...prev]);
    setBillItems(prev => [...prev, ...billItemsList]);

    return newBill;
  };

  // Helper formula to compute PH discount and VAT correctly
  const calculateBillTotals = (subtotal: number, discountType: string, customPct: number) => {
    let vatAmount = 0;
    let discountAmount = 0;
    let grandTotal = subtotal;

    if (discountType === 'senior' || discountType === 'pwd') {
      // VAT is 12% in the Philippines.
      // Posted prices are usually VAT-inclusive. Let's extract the VAT-exclusive base:
      // Base = subtotal / 1.12
      const vatExBase = subtotal / 1.12;
      // Senior/PWD are VAT Exempt (so actual VAT is 0, but they save the 12% tax)
      // They also get a 20% discount on the VAT-exclusive base:
      const discount = vatExBase * 0.20;

      vatAmount = 0; // Exempt!
      discountAmount = discount;
      grandTotal = vatExBase - discount;
    } else if (discountType === 'promotional') {
      // 10% promo as example, standard VAT applies
      const discount = subtotal * 0.10;
      discountAmount = discount;
      const baseWithDiscount = subtotal - discount;
      vatAmount = baseWithDiscount - (baseWithDiscount / 1.12); // VAT embedded
      grandTotal = baseWithDiscount;
    } else if (discountType === 'custom') {
      const pct = customPct / 100;
      const discount = subtotal * pct;
      discountAmount = discount;
      const baseWithDiscount = subtotal - discount;
      vatAmount = baseWithDiscount - (baseWithDiscount / 1.12);
      grandTotal = baseWithDiscount;
    } else {
      // None - 12% VAT is standard and embedded in the subtotal
      vatAmount = subtotal - (subtotal / 1.12);
      discountAmount = 0;
      grandTotal = subtotal;
    }

    return {
      vatAmount: Math.round((vatAmount + Number.EPSILON) * 100) / 100,
      discountAmount: Math.round((discountAmount + Number.EPSILON) * 100) / 100,
      grandTotal: Math.round((grandTotal + Number.EPSILON) * 100) / 100
    };
  };

  // Finalize Bill (locks the prices, adds a ledger entry)
  const finalizeBill = (billId: string, discountType: 'none' | 'senior' | 'pwd' | 'promotional' | 'custom', customDiscountPct = 0) => {
    setBills(prev => prev.map(bill => {
      if (bill.id !== billId) return bill;

      const pct = discountType === 'senior' || discountType === 'pwd' ? 20 : customDiscountPct;
      const computed = calculateBillTotals(bill.subtotal, discountType, pct);

      const finalizedBill: Bill = {
        ...bill,
        status: 'finalized',
        discountType,
        discountPct: pct,
        vatExempt: discountType === 'senior' || discountType === 'pwd',
        discountAmount: computed.discountAmount,
        vatAmount: computed.vatAmount,
        grandTotal: computed.grandTotal
      };

      // Create ledger entry for the charge
      const visitObj = visits.find(v => v.id === bill.visitId);
      const patientId = visitObj ? visitObj.patientId : '';

      const newLedgerEntry: LedgerEntry = {
        id: 'le-' + Math.random().toString(36).substr(2, 9),
        patientId,
        type: 'charge',
        amount: computed.grandTotal,
        billId,
        recordedAt: new Date().toISOString(),
        recordedBy: currentUser.id,
        notes: `Charge for Finalized Bill #${billId}`
      };

      setLedgerEntries(le => [...le, newLedgerEntry]);

      return finalizedBill;
    }));
  };

  // Record Payment (supports cash/card/gcash/bank, full/partial payment, updates ledger)
  const recordPayment = (billId: string, amount: number, method: 'cash' | 'card' | 'gcash' | 'bank') => {
    const billObj = bills.find(b => b.id === billId);
    if (!billObj) return;

    const visitObj = visits.find(v => v.id === billObj.visitId);
    const patientId = visitObj ? visitObj.patientId : '';

    const newPayment: Payment = {
      id: 'py-' + Math.random().toString(36).substr(2, 9),
      patientId,
      billId,
      amount,
      method,
      paidAt: new Date().toISOString(),
      recordedBy: currentUser.id
    };

    setPayments(prev => [...prev, newPayment]);

    // Ledger entry for payment (amount should be negative as it reduces balance)
    const newLedgerEntry: LedgerEntry = {
      id: 'le-' + Math.random().toString(36).substr(2, 9),
      patientId,
      type: 'payment',
      amount: -amount,
      billId,
      recordedAt: new Date().toISOString(),
      recordedBy: currentUser.id,
      notes: `Settle Bill #${billId} via ${method.toUpperCase()}`
    };

    setLedgerEntries(prev => [...prev, newLedgerEntry]);

    // Update bill status (draft/finalized/partially_paid/paid)
    // Check total payments on this bill
    const billPayments = [...payments, newPayment]
      .filter(p => p.billId === billId)
      .reduce((sum, p) => sum + p.amount, 0);

    let newStatus: 'partially_paid' | 'paid' = 'partially_paid';
    if (billPayments >= billObj.grandTotal) {
      newStatus = 'paid';
    }

    setBills(prev => prev.map(b => b.id === billId ? { ...b, status: newStatus } : b));
  };

  return (
    <ClinicContext.Provider value={{
      currentUser, setCurrentUser,
      patients, allergies, consents, medicalAnswers, treatmentPlans, visits, diagnoses,
      toothEvents, plannedTreatments, procedures, bills, billItems, ledgerEntries, payments,
      activePatientId, setActivePatientId,
      activeVisitId, setActiveVisitId,
      addPatient, updatePatient, openVisit, addDiagnosis, addToothEvent,
      togglePlannedTreatment, performProcedure, createBill, finalizeBill, recordPayment,
      resetToSeed
    }}>
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) throw new Error('useClinic must be used within a ClinicProvider');
  return context;
};
