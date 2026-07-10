export interface User {
  id: string;
  authUid: string;
  displayName: string;
  role: 'dentist' | 'staff';
  active: boolean;
}

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  sex: 'Male' | 'Female';
  contact: string;
  address: string;
  guardianName?: string;
  guardianContact?: string;
  isSenior: boolean;
  isPwd: boolean;
  scPwdIdNumber?: string;
  tin?: string;
  registeredAt: string;
}

export interface Allergy {
  id: string;
  patientId: string;
  substance: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  note?: string;
}

export interface Consent {
  id: string;
  patientId: string;
  type: 'treatment' | 'radiograph' | 'extraction' | 'data_privacy';
  acknowledgedAt: string;
  acknowledgedBy: string;
  textVersion: string;
}

export interface MedicalAnswer {
  questionId: string;
  patientId: string;
  answer: boolean;
  notes?: string;
}

export interface MedicalQuestion {
  id: string;
  questionText: string;
}

export interface TreatmentPlan {
  id: string;
  patientId: string;
  title: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Visit {
  id: string;
  patientId: string;
  treatmentPlanId: string | null;
  visitDate: string;
  chiefComplaint: string;
  notes: string;
  createdBy: string;
}

export interface Diagnosis {
  id: string;
  visitId: string;
  toothRef: string | null; // FDI number (e.g. "36")
  description: string;
  createdAt: string;
  createdBy: string;
}

export interface ToothConditionEvent {
  id: string;
  patientId: string;
  toothNumber: string; // FDI string (e.g. "11")
  conditionCode: 'H' | 'D' | 'F' | 'X' | 'C' | 'I';
  note?: string;
  recordedAt: string;
  recordedBy: string;
}

export interface PlannedTreatment {
  id: string;
  patientId: string;
  toothNumber: string | null; // FDI string
  description: string;
  status: 'planned' | 'done' | 'cancelled';
  linkedProcedureId: string | null;
  createdAt: string;
}

export interface Procedure {
  id: string;
  visitId: string;
  plannedTreatmentId: string | null;
  type: string;
  toothRef: string; // FDI string
  basePrice: number;
  notes?: string;
  performedBy: string;
  isBillable: boolean;
}

export interface Bill {
  id: string;
  visitId: string | null;
  treatmentPlanId: string | null;
  status: 'draft' | 'finalized' | 'partially_paid' | 'paid' | 'void';
  discountType: 'none' | 'senior' | 'pwd' | 'promotional' | 'custom';
  discountPct: number;
  vatExempt: boolean;
  vatRate: number; // e.g. 0.12 (12%)
  scPwdIdSnapshot?: string;
  tinSnapshot?: string;
  subtotal: number;
  discountAmount: number;
  vatAmount: number;
  grandTotal: number;
}

export interface BillItem {
  id: string;
  billId: string;
  procedureId: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface LedgerEntry {
  id: string;
  patientId: string;
  type: 'charge' | 'payment' | 'refund' | 'writeoff' | 'adjustment';
  amount: number; // positive for charge, negative for payment/refund/etc.
  billId: string | null;
  recordedAt: string;
  recordedBy: string;
  notes?: string;
}

export interface Payment {
  id: string;
  patientId: string;
  billId: string | null;
  amount: number;
  method: 'cash' | 'card' | 'gcash' | 'bank';
  paidAt: string;
  recordedBy: string;
}

export interface InstallmentSchedule {
  id: string;
  patientId: string;
  dueDate: string;
  amountDue: number;
  status: 'pending' | 'paid' | 'overdue';
}

// Default medical questions as seed data
export const DEFAULT_MEDICAL_QUESTIONS: MedicalQuestion[] = [
  { id: 'q1', questionText: 'Are you currently under the care of a physician?' },
  { id: 'q2', questionText: 'Have you had any major surgeries or hospitalizations?' },
  { id: 'q3', questionText: 'Do you bleed excessively after cuts or extractions?' },
  { id: 'q4', questionText: 'Are you pregnant, nursing, or taking birth control?' },
  { id: 'q5', questionText: 'Do you have high blood pressure or heart problems?' },
  { id: 'q6', questionText: 'Are you taking any blood thinners, aspirin, or bone-density drugs?' }
];

// Core Seed Data
export const SEED_USERS: User[] = [
  { id: 'u1', authUid: 'uid-dentist', displayName: 'Dr. Elena Reyes', role: 'dentist', active: true },
  { id: 'u2', authUid: 'uid-staff', displayName: 'Marco Santos', role: 'staff', active: true }
];

export const SEED_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Estrella Echevaria',
    dateOfBirth: '1958-04-12', // 68 years old
    sex: 'Female',
    contact: '+63 917 555 1234',
    address: '12-A Katipunan Avenue, Quezon City',
    isSenior: true,
    isPwd: false,
    scPwdIdNumber: 'OSCA-12345-XYZ',
    tin: '123-456-789-000',
    registeredAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'p2',
    name: 'Juan dela Cruz',
    dateOfBirth: '1992-09-25', // 34 years old
    sex: 'Male',
    contact: '+63 908 444 5678',
    address: '45 Rizal Street, Barangay Central, Makati City',
    isSenior: false,
    isPwd: false,
    registeredAt: '2026-03-15T14:30:00Z'
  },
  {
    id: 'p3',
    name: 'Liam Santos',
    dateOfBirth: '2018-02-14', // 8 years old
    sex: 'Male',
    contact: '+63 919 333 9876',
    address: '88 Malakas Street, Diliman, Quezon City',
    guardianName: 'Marco Santos',
    guardianContact: '+63 919 333 9876',
    isSenior: false,
    isPwd: true,
    scPwdIdNumber: 'PWD-888-NCDA',
    registeredAt: '2026-05-20T09:15:00Z'
  }
];

export const SEED_ALLERGIES: Allergy[] = [
  { id: 'a1', patientId: 'p1', substance: 'Lidocaine', severity: 'Severe', note: 'Causes anaphylactic reaction. Use alternative anesthetics like Mepivacaine.' },
  { id: 'a2', patientId: 'p2', substance: 'Penicillin', severity: 'Moderate', note: 'Breaks into hives. Alternative: Clindamycin.' }
];

export const SEED_CONSENTS: Consent[] = [
  {
    id: 'c1',
    patientId: 'p1',
    type: 'data_privacy',
    acknowledgedAt: '2026-01-10T10:15:00Z',
    acknowledgedBy: 'Dr. Elena Reyes',
    textVersion: 'v1.2-Standard-Data-Privacy-PH-RA10173'
  },
  {
    id: 'c2',
    patientId: 'p1',
    type: 'treatment',
    acknowledgedAt: '2026-01-10T10:20:00Z',
    acknowledgedBy: 'Dr. Elena Reyes',
    textVersion: 'v1.0-General-Treatment-Consent'
  },
  {
    id: 'c3',
    patientId: 'p2',
    type: 'data_privacy',
    acknowledgedAt: '2026-03-15T14:35:00Z',
    acknowledgedBy: 'Dr. Elena Reyes',
    textVersion: 'v1.2-Standard-Data-Privacy-PH-RA10173'
  }
];

export const SEED_MEDICAL_ANSWERS: MedicalAnswer[] = [
  { questionId: 'q1', patientId: 'p1', answer: true, notes: 'Under hypertension care' },
  { questionId: 'q2', patientId: 'p1', answer: false },
  { questionId: 'q3', patientId: 'p1', answer: false },
  { questionId: 'q4', patientId: 'p1', answer: false },
  { questionId: 'q5', patientId: 'p1', answer: true, notes: 'Takes Amlodipine 5mg daily' },
  { questionId: 'q6', patientId: 'p1', answer: false },

  { questionId: 'q1', patientId: 'p2', answer: false },
  { questionId: 'q2', patientId: 'p2', answer: false },
  { questionId: 'q3', patientId: 'p2', answer: false },
  { questionId: 'q4', patientId: 'p2', answer: false },
  { questionId: 'q5', patientId: 'p2', answer: false },
  { questionId: 'q6', patientId: 'p2', answer: false }
];

export const SEED_TREATMENT_PLANS: TreatmentPlan[] = [
  { id: 'tp1', patientId: 'p2', title: 'Molar Restoration and Root Canal', status: 'active', createdAt: '2026-05-10T08:00:00Z' }
];

export const SEED_VISITS: Visit[] = [
  {
    id: 'v1',
    patientId: 'p2',
    treatmentPlanId: 'tp1',
    visitDate: '2026-05-10',
    chiefComplaint: 'Severe throbbing pain in the lower right back tooth.',
    notes: 'Tooth 46 has deep distal decay, percussion sensitive. Suggested RCT or extraction.',
    createdBy: 'u1'
  },
  {
    id: 'v2',
    patientId: 'p1',
    treatmentPlanId: null,
    visitDate: '2026-06-20',
    chiefComplaint: 'Regular checkup and loose crown.',
    notes: 'Exposed root margins on upper left crown, tooth 24. Cleaned and prepped.',
    createdBy: 'u1'
  }
];

export const SEED_DIAGNOSES: Diagnosis[] = [
  {
    id: 'd1',
    visitId: 'v1',
    toothRef: '46',
    description: 'Irreversible pulpitis secondary to deep dental caries on tooth 46.',
    createdAt: '2026-05-10T08:30:00Z',
    createdBy: 'u1'
  }
];

export const SEED_TOOTH_EVENTS: ToothConditionEvent[] = [
  // Patient 1 - Estrella Echevaria (Adult Permanent, missing 18, decay on 36, filled on 11)
  { id: 'te1_1', patientId: 'p1', toothNumber: '18', conditionCode: 'X', note: 'Extracted long ago', recordedAt: '2026-01-10T10:20:00Z', recordedBy: 'u1' },
  { id: 'te1_2', patientId: 'p1', toothNumber: '11', conditionCode: 'F', note: 'Composite filling, structurally stable', recordedAt: '2026-01-10T10:20:00Z', recordedBy: 'u1' },
  { id: 'te1_3', patientId: 'p1', toothNumber: '36', conditionCode: 'D', note: 'Severe decay, pulp exposure', recordedAt: '2026-06-20T11:00:00Z', recordedBy: 'u1' },
  { id: 'te1_4', patientId: 'p1', toothNumber: '24', conditionCode: 'C', note: 'Porcelain fused to metal crown', recordedAt: '2026-01-10T10:20:00Z', recordedBy: 'u1' },

  // Patient 2 - Juan dela Cruz
  { id: 'te2_1', patientId: 'p2', toothNumber: '46', conditionCode: 'D', note: 'Cariously exposed pulp cavity', recordedAt: '2026-05-10T08:30:00Z', recordedBy: 'u1' },

  // Patient 3 - Liam Santos (Child - default primary, but has some primary tooth conditions)
  { id: 'te3_1', patientId: 'p3', toothNumber: '55', conditionCode: 'D', note: 'Decay on occlusal surface', recordedAt: '2026-05-20T09:30:00Z', recordedBy: 'u1' },
  { id: 'te3_2', patientId: 'p3', toothNumber: '61', conditionCode: 'H', note: 'Healthy erupting permanent or primary', recordedAt: '2026-05-20T09:30:00Z', recordedBy: 'u1' }
];

export const SEED_PLANNED_TREATMENTS: PlannedTreatment[] = [
  // Patient 1 - Tooth 36 needs extraction
  { id: 'pt1', patientId: 'p1', toothNumber: '36', description: 'Surgical tooth extraction', status: 'planned', linkedProcedureId: null, createdAt: '2026-06-20T11:05:00Z' },
  // Patient 2 - Tooth 46 needs root canal
  { id: 'pt2', patientId: 'p2', toothNumber: '46', description: 'Root canal treatment (RCT)', status: 'planned', linkedProcedureId: null, createdAt: '2026-05-10T08:35:00Z' }
];

export const SEED_PROCEDURES: Procedure[] = [
  // Juan dela Cruz completed first visit RCT prep
  {
    id: 'pr1',
    visitId: 'v1',
    plannedTreatmentId: 'pt2',
    type: 'RCT Access Prep & Pulpectomy',
    toothRef: '46',
    basePrice: 3500,
    notes: 'Access prep done, pulp removed, canals irrigated with NaOCl. Temp filling placed.',
    performedBy: 'u1',
    isBillable: true
  }
];

export const SEED_BILLS: Bill[] = [
  {
    id: 'b1',
    visitId: 'v1',
    treatmentPlanId: 'tp1',
    status: 'finalized',
    discountType: 'none',
    discountPct: 0,
    vatExempt: false,
    vatRate: 0.12,
    subtotal: 4000,
    discountAmount: 0,
    vatAmount: 428.57, // 12% computed out of VAT-inclusive price, or added?
    grandTotal: 4000
  }
];

export const SEED_BILL_ITEMS: BillItem[] = [
  {
    id: 'bi1',
    billId: 'b1',
    procedureId: 'pr1',
    description: 'RCT Access Prep & Pulpectomy (46)',
    quantity: 1,
    unitPrice: 3500,
    lineTotal: 3500
  },
  {
    id: 'bi2',
    billId: 'b1',
    procedureId: null,
    description: 'Clinical Oral Consultation & PPE Fee',
    quantity: 1,
    unitPrice: 500,
    lineTotal: 500
  }
];

export const SEED_LEDGER_ENTRIES: LedgerEntry[] = [
  {
    id: 'le1',
    patientId: 'p2',
    type: 'charge',
    amount: 4000,
    billId: 'b1',
    recordedAt: '2026-05-10T09:10:00Z',
    recordedBy: 'u1',
    notes: 'Charge for Bill #b1'
  },
  {
    id: 'le2',
    patientId: 'p2',
    type: 'payment',
    amount: -3000, // Partial payment
    billId: 'b1',
    recordedAt: '2026-05-10T09:15:00Z',
    recordedBy: 'u1',
    notes: 'Partial payment received - cash. Remaining 1,000 carried over.'
  }
];

export const SEED_PAYMENTS: Payment[] = [
  {
    id: 'py1',
    patientId: 'p2',
    billId: 'b1',
    amount: 3000,
    method: 'cash',
    paidAt: '2026-05-10T09:15:00Z',
    recordedBy: 'u1'
  }
];
