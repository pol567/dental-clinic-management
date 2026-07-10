'use client';

import React, { useState, useEffect } from 'react';
import { useClinic } from '@/lib/clinic-state';
import { Patient, Visit, Bill, BillItem, PlannedTreatment } from '@/lib/types';
import { OdontogramChart } from './odontogram-chart';
import {
  Activity, Check, ChevronRight, Clipboard, ShieldAlert, AlertTriangle, FileText,
  DollarSign, Landmark, CreditCard, ChevronLeft, Save, Sparkles, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ActiveVisitFlowProps {
  patientId: string;
  onCloseVisit: () => void;
}

export const ActiveVisitFlow: React.FC<ActiveVisitFlowProps> = ({
  patientId,
  onCloseVisit
}) => {
  const {
    patients,
    allergies,
    treatmentPlans,
    visits,
    procedures,
    bills,
    billItems,
    openVisit,
    addDiagnosis,
    performProcedure,
    createBill,
    finalizeBill,
    recordPayment,
    plannedTreatments,
    currentUser
  } = useClinic();

  const patient = patients.find(p => p.id === patientId);

  // Flow State: 0 (Open Visit), 1 (Chart & Diagnose), 2 (Procedures), 3 (Billing), 4 (Payment)
  const [activeStep, setActiveStep] = useState(0);

  // Local State: Step 0 (Open Visit)
  const [chiefComplaint, setChiefComplaint] = useState('Severe pressure pain on lower left jaw.');
  const [treatmentPlanId, setTreatmentPlanId] = useState<string | null>(null);
  const [generalNotes, setGeneralNotes] = useState('Patient reports acute pulpitis pain radiating to the ear.');
  const [visitObj, setVisitObj] = useState<Visit | null>(null);

  // Local State: Step 1 (Chart & Diagnose / Diagnosis Log)
  const [diagnosisTooth, setDiagnosisTooth] = useState<string>('');
  const [diagnosisDesc, setDiagnosisDesc] = useState('');
  const [visitDiagnoses, setVisitDiagnoses] = useState<Array<{ tooth: string; desc: string }>>([]);

  // Local State: Step 2 (Perform Procedures)
  const [checkedPlannedPt, setCheckedPlannedPt] = useState<{ [id: string]: boolean }>({});
  const [customProcType, setCustomProcType] = useState('Composite resin filling');
  const [customProcTooth, setCustomProcTooth] = useState('11');
  const [customProcPrice, setCustomProcPrice] = useState(1500);
  const [customProcBillable, setCustomProcBillable] = useState(true);
  const [completedProcs, setCompletedProcs] = useState<Array<{ id: string; type: string; tooth: string; price: number; billable: boolean; ptId: string | null }>>([]);

  // Local State: Step 3 (Draft Bill & Discount)
  const [discountType, setDiscountType] = useState<'none' | 'senior' | 'pwd' | 'promotional' | 'custom'>('none');
  const [customDiscountPct, setCustomDiscountPct] = useState(0);
  const [scPwdIdSnapshot, setScPwdIdSnapshot] = useState(patient?.scPwdIdNumber || '');
  const [tinSnapshot, setTinSnapshot] = useState(patient?.tin || '');
  const [draftBill, setDraftBill] = useState<Bill | null>(null);
  const [draftLines, setDraftLines] = useState<Omit<BillItem, 'id' | 'billId'>[]>([]);

  // Local State: Step 4 (Payment)
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'gcash' | 'bank'>('cash');
  const [paymentDone, setPaymentDone] = useState(false);

  useEffect(() => {
    if (!patient) return;
    // Pre-populate checked planned treatments
    const activePlanned = plannedTreatments.filter(pt => pt.patientId === patientId && pt.status === 'planned');
    const checked: { [id: string]: boolean } = {};
    activePlanned.forEach(pt => {
      checked[pt.id] = true;
    });

    const isSr = patient.isSenior;
    const isP = patient.isPwd;

    setTimeout(() => {
      setCheckedPlannedPt(checked);
      if (isSr) {
        setDiscountType('senior');
      } else if (isP) {
        setDiscountType('pwd');
      }
    }, 0);
  }, [patientId, patient, plannedTreatments]);

  if (!patient) return <div className="p-12 text-center">Patient records missing</div>;

  const patientAllergies = allergies.filter(a => a.patientId === patientId);
  const hasLidocaineAllergy = patientAllergies.some(a => a.substance.toLowerCase() === 'lidocaine');

  // STEP 0: START VISIT
  const handleStartVisit = () => {
    const v = openVisit(patientId, chiefComplaint, treatmentPlanId, generalNotes);
    setVisitObj(v);
    setActiveStep(1);
  };

  // STEP 1: ADD DIAGNOSIS
  const handleAddDiagnosis = () => {
    if (!diagnosisDesc.trim()) return;
    addDiagnosis(visitObj!.id, diagnosisTooth || null, diagnosisDesc);
    setVisitDiagnoses([...visitDiagnoses, { tooth: diagnosisTooth, desc: diagnosisDesc }]);
    setDiagnosisTooth('');
    setDiagnosisDesc('');
  };

  // STEP 2: COMPLETE PROCEDURES
  const handleCompleteProcedure = (pt: PlannedTreatment) => {
    // map planned price based on typical values
    let price = 2000;
    if (pt.description.toLowerCase().includes('extraction')) price = 1500;
    if (pt.description.toLowerCase().includes('root canal') || pt.description.toLowerCase().includes('rct')) price = 4500;
    if (pt.description.toLowerCase().includes('crown')) price = 8000;
    if (pt.description.toLowerCase().includes('implant')) price = 35000;

    const proc = performProcedure(visitObj!.id, pt.id, pt.description, pt.toothNumber || 'General', price, true, 'Completed from planned chart item.');

    setCompletedProcs([...completedProcs, {
      id: proc.id,
      type: proc.type,
      tooth: proc.toothRef,
      price: proc.basePrice,
      billable: proc.isBillable,
      ptId: pt.id
    }]);

    // Uncheck from lists
    setCheckedPlannedPt({ ...checkedPlannedPt, [pt.id]: false });
  };

  const handleAddCustomProcedure = () => {
    const proc = performProcedure(visitObj!.id, null, customProcType, customProcTooth, customProcPrice, customProcBillable, 'Manual clinical entry.');

    setCompletedProcs([...completedProcs, {
      id: proc.id,
      type: proc.type,
      tooth: proc.toothRef,
      price: proc.basePrice,
      billable: proc.isBillable,
      ptId: null
    }]);
  };

  // STEP 3: PREPARE BILL
  const handleProceedToBilling = () => {
    // Generate draft lines from billable procedures
    const lines: Omit<BillItem, 'id' | 'billId'>[] = completedProcs
      .filter(p => p.billable)
      .map(p => ({
        procedureId: p.id,
        description: `${p.type} (Tooth ${p.tooth})`,
        quantity: 1,
        unitPrice: p.price,
        lineTotal: p.price
      }));

    // Add consultation/PPE fee as a manual draft line default
    lines.push({
      procedureId: null,
      description: 'PPE Materials & Infection Control Fee',
      quantity: 1,
      unitPrice: 500,
      lineTotal: 500
    });

    setDraftLines(lines);

    // Calc base subtotal
    const sub = lines.reduce((s, l) => s + l.lineTotal, 0);

    const b = createBill(visitObj!.id, discountType, lines);
    setDraftBill(b);
    setPaymentAmount(b.grandTotal); // default payment amount is full grand total
    setActiveStep(3);
  };

  // Live total computation on user changing discount type
  const getComputedTotals = () => {
    if (!draftBill) return { subtotal: 0, vatExemptReduction: 0, discount: 0, grandTotal: 0 };
    const subtotal = draftLines.reduce((s, l) => s + l.lineTotal, 0);

    let vatAmount = 0;
    let discountAmount = 0;
    let grandTotal = subtotal;

    if (discountType === 'senior' || discountType === 'pwd') {
      // Stripping embedded 12% VAT: Base = Subtotal / 1.12
      const vatExBase = subtotal / 1.12;
      const originalVat = subtotal - vatExBase;

      // 20% discount on the VAT-exclusive base
      const discount = vatExBase * 0.20;

      vatAmount = 0; // completely tax exempt
      discountAmount = discount;
      grandTotal = vatExBase - discount;
    } else if (discountType === 'promotional') {
      const discount = subtotal * 0.10; // 10% promo example
      discountAmount = discount;
      grandTotal = subtotal - discount;
    } else if (discountType === 'custom') {
      const discount = subtotal * (customDiscountPct / 100);
      discountAmount = discount;
      grandTotal = subtotal - discount;
    } else {
      grandTotal = subtotal;
    }

    return {
      subtotal,
      vatExemptReduction: discountType === 'senior' || discountType === 'pwd' ? subtotal - (subtotal / 1.12) : 0,
      discount: discountAmount,
      grandTotal
    };
  };

  const handleFinalizeBill = () => {
    finalizeBill(draftBill!.id, discountType, customDiscountPct);
    const totals = getComputedTotals();
    setPaymentAmount(totals.grandTotal);
    setActiveStep(4);
  };

  // STEP 4: RECORD PAYMENT
  const handleRecordPayment = () => {
    recordPayment(draftBill!.id, paymentAmount, paymentMethod);
    setPaymentDone(true);
  };

  const totals = getComputedTotals();

  return (
    <div id="active-visit-flow-wrapper" className="max-w-4xl mx-auto space-y-6">
      {/* Top Pinned Patient Identity Context Bar */}
      <div className="border-b border-slate-200 pb-5 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <span className="h-10 w-10 bg-cyan-700 text-white rounded-xl flex items-center justify-center font-bold font-mono tabular-nums">
            V
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Visit Pinned Context</span>
              {hasLidocaineAllergy && (
                <span className="text-[9px] bg-red-100 text-red-800 border border-red-300 font-bold px-2 py-0.5 rounded-xl uppercase flex items-center gap-1 animate-pulse">
                  ⚠ LIDOCAINE Allergy Warning
                </span>
              )}
            </div>
            <h3 className="text-base font-bold text-slate-800 mt-0.5">{patient.name} ({patient.sex} · {new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} yrs)</h3>
          </div>
        </div>

        {/* Current Flow Steps Tracker */}
        <div className="flex items-center gap-1.5 self-start md:self-center">
          {[0, 1, 2, 3, 4].map((stepIdx) => {
            const label = stepIdx === 0 ? 'Demographics' : stepIdx === 1 ? 'Chart & Diag' : stepIdx === 2 ? 'Procedures' : stepIdx === 3 ? 'Billing' : 'Payment';
            const isActive = activeStep === stepIdx;
            const isCompleted = activeStep > stepIdx;
            return (
              <React.Fragment key={stepIdx}>
                <div className="flex items-center gap-1">
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all
                    ${isActive ? 'bg-cyan-700 text-white font-bold ring-2 ring-cyan-500 ring-offset-1' : isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}
                  `}>
                    {isCompleted ? '✓' : stepIdx + 1}
                  </span>
                  <span className={`text-[10px] font-bold hidden sm:block ${isActive ? 'text-slate-800' : 'text-slate-400'}`}>
                    {label}
                  </span>
                </div>
                {stepIdx < 4 && <div className="h-0.5 w-4 bg-slate-200"></div>}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STAGE CONTAINER */}
      <div className="space-y-8">

        {/* STEP 0: START VISIT DEMOGRAPHICS */}
        {activeStep === 0 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <Clipboard className="h-5 w-5 text-cyan-700" />
              <div>
                <h4 className="text-base font-bold text-slate-800">Step 1: Open Visit Encounter</h4>
                <p className="text-xs text-slate-500">Record chief symptoms and optionally link to a treatment plan folder.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Chief complaint */}
              <div className="space-y-1.5">
                <label htmlFor="visit-complaint" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Patient Chief Complaint</label>
                <input
                  type="text"
                  id="visit-complaint"
                  placeholder="e.g. Pain on cold liquids, lower right molar"
                  value={chiefComplaint}
                  onChange={(e) => setChiefComplaint(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600"
                />
              </div>

              {/* Treatment plan linking (optional) */}
              <div className="space-y-1.5">
                <label htmlFor="visit-treatment-plan" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Link Multi-Visit Treatment Plan (Optional)</label>
                <select
                  id="visit-treatment-plan"
                  value={treatmentPlanId || ''}
                  onChange={(e) => setTreatmentPlanId(e.target.value || null)}
                  className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-2.5 text-sm font-semibold focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 text-slate-800"
                >
                  <option value="">-- No linked plan (Standalone encounter) --</option>
                  {treatmentPlans.filter(tp => tp.patientId === patientId && tp.status === 'active').map(plan => (
                    <option key={plan.id} value={plan.id}>{plan.title} (ID: {plan.id})</option>
                  ))}
                </select>
              </div>

              {/* General notes */}
              <div className="space-y-1.5">
                <label htmlFor="visit-notes" className="block text-xs font-bold text-slate-600 uppercase tracking-wide">Initial Clinical Observations / Notes</label>
                <textarea
                  id="visit-notes"
                  placeholder="Enter initial visual diagnostics, mobility observations, patient description..."
                  value={generalNotes}
                  onChange={(e) => setGeneralNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:bg-white h-24 focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600 font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
              <button
                onClick={onCloseVisit}
                id="cancel-visit-flow"
                className="py-2.5 px-5 border border-slate-300 bg-white hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-600 min-h-[44px]"
              >
                Cancel Encounter
              </button>
              <button
                onClick={handleStartVisit}
                id="start-visit-encounter"
                className="py-2.5 px-6 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl font-bold text-sm shadow-sm flex items-center gap-1 cursor-pointer min-h-[44px]"
              >
                Open Visit & Start Charting <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 1: INTERACTIVE CHARTING & DIAGNOSIS */}
        {activeStep === 1 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-800">Step 2: Interactive Diagnoses & Charting</h4>
                <p className="text-xs text-slate-500">Tap teeth on the odontogram to chart conditions, planned P treatments, or notes.</p>
              </div>
              <span className="text-xs font-mono tabular-nums font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-xl">Visit Active</span>
            </div>

            {/* Interactive Odontogram Component */}
            <OdontogramChart patientId={patientId} interactive={true} activeVisitId={visitObj?.id} />

            {/* Diagnostics Quick Logger */}
            <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl space-y-3">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Fast-Log Diagnosis Encounter Item</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  placeholder="Tooth # (e.g. 36) (Optional)"
                  value={diagnosisTooth}
                  onChange={(e) => setDiagnosisTooth(e.target.value)}
                  className="sm:col-span-1 bg-white border border-slate-300 rounded-2xl px-3 py-2 text-xs focus:ring-1 focus:ring-cyan-600"
                />
                <input
                  type="text"
                  placeholder="Diagnosed dental pathology (e.g. Deep pulpal decay with irreversible pulpitis)"
                  value={diagnosisDesc}
                  onChange={(e) => setDiagnosisDesc(e.target.value)}
                  className="sm:col-span-2 bg-white border border-slate-300 rounded-2xl px-3 py-2 text-xs focus:ring-1 focus:ring-cyan-600"
                />
                <button
                  onClick={handleAddDiagnosis}
                  id="add-diagnosis-log"
                  className="sm:col-span-1 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow-sm min-h-[44px]"
                >
                  Log Diagnosis
                </button>
              </div>

              {/* Logged diagnoses inside this visit */}
              {visitDiagnoses.length > 0 && (
                <div className="pt-2 border-t border-slate-200 space-y-1.5 max-h-24 overflow-y-auto">
                  {visitDiagnoses.map((d, i) => (
                    <div key={i} className="text-xs text-slate-700 flex items-center gap-2">
                      <span className="font-bold text-cyan-800">{d.tooth ? `[Tooth ${d.tooth}]` : '[General Case]'}</span>
                      <span className="font-medium">{d.desc}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Navigation Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveStep(2)}
                id="proceed-to-procedures"
                className="py-2.5 px-6 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl font-bold text-sm shadow-sm flex items-center gap-1 cursor-pointer"
              >
                Proceed to Treatment Procedures <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PERFORM TREATMENT PROCEDURES */}
        {activeStep === 2 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-800">Step 3: Perform Dental Procedures</h4>
              <p className="text-xs text-slate-500">Candidate procedures are pre-populated directly from teeth flagged as Planned (P) on the odontogram.</p>
            </div>

            {/* Allergy alerts inside procedures */}
            {hasLidocaineAllergy && (
              <div className="bg-red-50 border border-red-300 p-4 rounded-xl flex items-center gap-3 animate-pulse">
                <ShieldAlert className="h-6 w-6 text-red-700" />
                <div>
                  <span className="block text-xs font-bold text-red-800 uppercase tracking-widest">SEVERE LIDOCAINE ALLERGY ON FILE</span>
                  <p className="text-xs text-red-700 font-semibold">Do not use Lidocaine. Verify alternative local anesthetics (e.g. Mepivacaine, Carbocaine) before injecting.</p>
                </div>
              </div>
            )}

            {/* Candidate Treatments from Chart */}
            <div className="space-y-3.5">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Candidate Treatments Planned:</span>

              {plannedTreatments.filter(pt => pt.patientId === patientId && pt.status === 'planned').length === 0 ? (
                <p className="text-xs text-slate-400 italic bg-slate-50 p-4 rounded-xl border border-slate-200">
                  No planned treatments (P) flagged in the Odontogram. Any procedures performed must be entered manually below.
                </p>
              ) : (
                <table className="w-full text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                      <th className="p-2 border-r border-slate-200">Tooth</th>
                      <th className="p-2 border-r border-slate-200">Description</th>
                      <th className="p-2 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plannedTreatments.filter(pt => pt.patientId === patientId && pt.status === 'planned').map(pt => (
                      <tr key={pt.id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="p-2 border-r border-slate-200 text-xs font-bold text-cyan-800">
                          {pt.toothNumber || 'General'}
                        </td>
                        <td className="p-2 border-r border-slate-200 text-sm font-bold text-slate-800">
                          {pt.description}
                        </td>
                        <td className="p-2 text-right">
                          <button
                            onClick={() => handleCompleteProcedure(pt)}
                            id={`complete-pt-btn-${pt.id}`}
                            className="py-1 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Complete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* Add Custom / Standalone Procedures */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Add Manual Custom Procedure (Not from Chart):</span>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-150">
                <div className="space-y-1 sm:col-span-1">
                  <label htmlFor="proc-tooth" className="block text-[10px] font-bold text-slate-500 uppercase">Tooth #</label>
                  <input
                    type="text"
                    id="proc-tooth"
                    value={customProcTooth}
                    onChange={(e) => setCustomProcTooth(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-2xl px-3 py-2 text-xs focus:ring-1 focus:ring-cyan-600"
                  />
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label htmlFor="proc-type" className="block text-[10px] font-bold text-slate-500 uppercase">Procedure Type</label>
                  <select
                    id="proc-type"
                    value={customProcType}
                    onChange={(e) => setCustomProcType(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-2xl px-3 py-2 text-xs text-slate-800 font-medium"
                  >
                    <option value="Composite resin filling">Composite resin filling</option>
                    <option value="Dental prophylaxis (cleaning)">Dental prophylaxis (cleaning)</option>
                    <option value="Surgical tooth extraction">Surgical tooth extraction</option>
                    <option value="Porcelain crown cementation">Porcelain crown cementation</option>
                    <option value="Fluoride varnish application">Fluoride varnish application</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-1">
                  <label htmlFor="proc-price" className="block text-[10px] font-bold text-slate-500 uppercase">Unit Price (₱)</label>
                  <input
                    type="number"
                    id="proc-price"
                    value={customProcPrice}
                    onChange={(e) => setCustomProcPrice(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-2xl px-3 py-2 text-xs font-semibold focus:ring-1 focus:ring-cyan-600"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddCustomProcedure}
                  id="add-custom-proc-btn"
                  className="py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm sm:self-end h-[36px] min-h-[44px]"
                >
                  Log Custom Procedure
                </button>
              </div>
            </div>

            {/* List of completed procedures inside this visit */}
            {completedProcs.length > 0 && (
              <div className="border-t border-slate-100 pt-5 space-y-2.5">
                <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Completed Treatments & Procedures list:</span>
                <table className="w-full text-left border-collapse border border-slate-200">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                      <th className="p-2 border-r border-slate-200">Procedure</th>
                      <th className="p-2 text-right">Price (₱)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedProcs.map((p, idx) => (
                      <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="p-2 border-r border-slate-200 text-xs font-bold text-slate-800">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                            <span>{p.type} (Tooth {p.tooth})</span>
                          </div>
                        </td>
                        <td className="p-2 text-right font-mono tabular-nums font-bold text-slate-700">
                          {p.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveStep(1)}
                className="py-2.5 px-5 border border-slate-300 bg-white hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-600 flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Charting
              </button>
              <button
                onClick={handleProceedToBilling}
                disabled={completedProcs.length === 0}
                id="proceed-to-billing"
                className="py-2.5 px-6 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl font-bold text-sm shadow-sm flex items-center gap-1 disabled:opacity-50 cursor-pointer min-h-[44px]"
              >
                Draft Bill & Apply Discounts <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: DRAFT BILL & DISCOUNTS */}
        {activeStep === 3 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-800">Step 4: Billing Computation & Exemption Math</h4>
                <p className="text-xs text-slate-500">Edit prices, specify discount eligibility, and audit the live tax math.</p>
              </div>
              <span className="text-xs font-mono tabular-nums font-bold bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 rounded-xl uppercase">
                Draft Status
              </span>
            </div>

            {/* Draft Lines Table */}
            <div className="space-y-3">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Line Items (Editable prices):</span>
              <table className="w-full text-left border-collapse border border-slate-200">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase">
                    <th className="p-2 border-r border-slate-200">Description</th>
                    <th className="p-2 text-right">Unit Price (₱)</th>
                  </tr>
                </thead>
                <tbody>
                  {draftLines.map((line, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 text-xs font-bold text-slate-700">
                        {line.description}
                      </td>
                      <td className="p-2 w-32">
                        <input
                          type="number"
                          value={line.unitPrice}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            const updated = [...draftLines];
                            updated[idx].unitPrice = val;
                            updated[idx].lineTotal = val;
                            setDraftLines(updated);
                          }}
                          className="w-full bg-white border border-slate-300 rounded-2xl px-2 py-1 text-xs font-bold text-slate-800 font-mono tabular-nums text-right focus:ring-1 focus:ring-cyan-600"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Discount Eligibility Rules Options */}
            <div className="border-t border-slate-100 pt-5 space-y-3">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Apply Philippine Mandated Exemption or Promotion</span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {([
                  { id: 'none', label: 'None (Standard)' },
                  { id: 'senior', label: 'Senior citizen' },
                  { id: 'pwd', label: 'PWD Exemption' },
                  { id: 'promotional', label: '10% Promo' },
                  { id: 'custom', label: 'Custom' }
                ] as const).map(item => {
                  const isActive = discountType === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      id={`discount-option-${item.id}`}
                      onClick={() => setDiscountType(item.id)}
                      className={`py-2 px-3 border text-xs font-bold rounded-xl transition-all capitalize cursor-pointer
                        ${isActive
                          ? 'bg-cyan-50 border-cyan-600 ring-1 ring-cyan-500 text-cyan-950 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>

              {/* Custom discount selection input percentage */}
              {discountType === 'custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-slate-50 border border-slate-150 p-3 rounded-xl max-w-xs mt-2"
                >
                  <label htmlFor="custom-pct" className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Custom Discount %</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      id="custom-pct"
                      value={customDiscountPct}
                      onChange={(e) => setCustomDiscountPct(Number(e.target.value))}
                      className="w-20 bg-white border border-slate-300 rounded-2xl py-1 px-2 text-xs font-bold font-mono tabular-nums"
                    />
                    <span className="text-xs font-semibold text-slate-500">% reduction</span>
                  </div>
                </motion.div>
              )}

              {/* Senior citizen OSCA ID Snapshot and TIN validation requirements */}
              {(discountType === 'senior' || discountType === 'pwd') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-slate-50 border border-slate-150 p-4 rounded-xl space-y-3 mt-2"
                >
                  <span className="block text-xs font-bold text-cyan-800 flex items-center gap-1">
                    <FileText className="h-4 w-4" /> Mandatory Government Exemption Document Capture
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="bill-sc-pwd" className="block text-[10px] font-bold text-slate-500 uppercase">OSCA / PWD ID Number</label>
                      <input
                        type="text"
                        id="bill-sc-pwd"
                        value={scPwdIdSnapshot}
                        onChange={(e) => setScPwdIdSnapshot(e.target.value)}
                        placeholder="Required ID printed on OSCA card"
                        className="w-full bg-white border border-slate-300 rounded-2xl px-2.5 py-1.5 text-xs font-medium"
                      />
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="bill-tin" className="block text-[10px] font-bold text-slate-500 uppercase">TIN (Optional)</label>
                      <input
                        type="text"
                        id="bill-tin"
                        value={tinSnapshot}
                        onChange={(e) => setTinSnapshot(e.target.value)}
                        placeholder="Tax Identification Number"
                        className="w-full bg-white border border-slate-300 rounded-2xl px-2.5 py-1.5 text-xs font-medium"
                      />
                    </div>
                  </div>
                  <span className="block text-[10.5px] text-slate-400 italic">ⓘ Exemption math will apply once both documents are snapshotted in the database.</span>
                </motion.div>
              )}
            </div>

            {/* AUDIT THE MATH DOCK VISIBLY */}
            <div className="bg-[#1F2933] text-white p-5 rounded-xl space-y-3 font-mono tabular-nums text-xs shadow-sm">
              <span className="block text-[10px] text-cyan-400 font-bold uppercase tracking-widest border-b border-white/10 pb-2">
                Official BIR Audit Computation Dock
              </span>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="opacity-80">Subtotal (VAT-Inclusive Posted Base):</span>
                  <span>₱{totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>

                {/* Exemption reductions showing exact math formula */}
                {totals.vatExemptReduction > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="opacity-80">Less: 12% VAT Exemption (Covered services):</span>
                    <span>-₱{totals.vatExemptReduction.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                {totals.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span className="opacity-80">
                      Less: {discountType === 'senior' || discountType === 'pwd' ? '20% statutory discount' : `${customDiscountPct || '10'}% custom discount`} on exclusive base:
                    </span>
                    <span>-₱{totals.discount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                {/* Double Discount Stack Guard Warning */}
                {discountType !== 'none' && (
                  <div className="text-[10px] text-amber-300/80 italic leading-snug border-t border-white/5 pt-1 mt-1">
                    ⓘ Stacking restriction applies under PH law. Only the higher single eligible concession is deducted.
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold border-t border-white/10 pt-2.5 text-cyan-300 mt-2">
                  <span>COMPUTED GRAND TOTAL DUE:</span>
                  <span>₱{totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setActiveStep(2)}
                className="py-2.5 px-5 border border-slate-300 bg-white hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-600 flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" /> Procedures
              </button>
              <button
                onClick={handleFinalizeBill}
                id="finalize-bill"
                disabled={(discountType === 'senior' || discountType === 'pwd') && !scPwdIdSnapshot.trim()}
                className="py-2.5 px-6 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl font-bold text-sm shadow-sm flex items-center gap-1 disabled:opacity-50 cursor-pointer min-h-[44px]"
              >
                <Save className="h-4 w-4" /> Finalize & Lock Bill <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: PAYMENT SETTLEMENT & CLOSE */}
        {activeStep === 4 && (
          <div className="p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h4 className="text-base font-bold text-slate-800">Step 5: Ledger Settlement & Settle Account</h4>
                <p className="text-xs text-slate-500">Record payments under Cash/Card/GCash/Bank. Outstanding balances carry to the ledger.</p>
              </div>
              <span className="text-xs font-mono tabular-nums font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-xl uppercase">
                Finalized Locked
              </span>
            </div>

            {/* Bill Info Summary */}
            <div className="bg-slate-50 border border-slate-150 p-5 rounded-xl flex items-center justify-between">
              <div>
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Finalized Bill Total</span>
                <span className="text-2xl font-mono tabular-nums font-bold text-slate-800">₱{totals.grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                <span className="block text-[10px] text-slate-500 mt-0.5">VAT-Exempt Concession Applied</span>
              </div>

              <div className="text-right">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tax Snapshot captured</span>
                <span className="text-xs font-mono tabular-nums font-semibold text-slate-600">ID: {scPwdIdSnapshot || 'None needed'}</span>
              </div>
            </div>

            {!paymentDone ? (
              <div className="space-y-5">
                {/* Payment Amount received */}
                <div className="space-y-1.5">
                  <label htmlFor="payment-input" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Amount Received (₱)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">₱</span>
                    <input
                      type="number"
                      id="payment-input"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(Number(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-2xl pl-8 pr-4 py-2.5 text-sm font-mono tabular-nums font-bold text-slate-800 focus:ring-1 focus:ring-cyan-600"
                    />
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentAmount(totals.grandTotal)}
                      id="settle-full-payment"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Settle Full Amount (₱{totals.grandTotal.toLocaleString()})
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentAmount(Math.round(totals.grandTotal / 2))}
                      id="settle-half-payment"
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                    >
                      Split Installment (50%)
                    </button>
                  </div>
                </div>

                {/* Payment Method dropdown */}
                <div className="space-y-1.5">
                  <label htmlFor="payment-method" className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Payment Channel</label>
                  <select
                    id="payment-method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-2xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:ring-1 focus:ring-cyan-600"
                  >
                    <option value="cash">💵 Cash Payment</option>
                    <option value="card">💳 Visa / Mastercard Credit Card</option>
                    <option value="gcash">📱 GCash E-Wallet Mobile</option>
                    <option value="bank">🏦 Direct Bank Wire Transfer</option>
                  </select>
                </div>

                {/* Remaining Balance Calculator preview */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-150 flex items-center justify-between text-xs leading-none">
                  <span className="font-bold text-slate-600 uppercase">Ledger outstanding balance to carry:</span>
                  <span className={`font-mono tabular-nums font-bold text-sm
                    ${(totals.grandTotal - paymentAmount) > 0 ? 'text-red-700' : 'text-green-700'}
                  `}>
                    ₱{Math.max(0, totals.grandTotal - paymentAmount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>

                {/* Payment Action Submit */}
                <button
                  type="button"
                  onClick={handleRecordPayment}
                  id="record-payment"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <DollarSign className="h-4.5 w-4.5" />
                  Record Payment & Synchronize Ledger
                </button>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 text-center space-y-4 bg-emerald-50/20 border border-emerald-200 rounded-xl"
              >
                <div className="h-12 w-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto text-xl">
                  ✓
                </div>
                <div>
                  <h5 className="text-base font-bold text-emerald-900">Encounter Settle Completed</h5>
                  <p className="text-xs text-emerald-700 mt-1">Payment transactions recorded. Patient running balances updated in the ledger.</p>
                </div>

                <div className="bg-white p-4 max-w-sm mx-auto rounded-xl border border-slate-200 text-left text-xs space-y-2 leading-relaxed">
                  <div className="flex justify-between font-bold text-slate-700 pb-1.5 border-b border-slate-100">
                    <span>Ledger Summary:</span>
                    <span>Ref: {draftBill?.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Grand Total:</span>
                    <span className="font-bold">₱{totals.grandTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Payment Received ({paymentMethod.toUpperCase()}):</span>
                    <span className="font-bold">-₱{paymentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-red-700 border-t border-dashed border-slate-200 pt-1.5 mt-1 font-bold">
                    <span>Balance carried forward:</span>
                    <span>₱{Math.max(0, totals.grandTotal - paymentAmount).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onCloseVisit}
                  id="close-visit-flow"
                  className="py-3 px-8 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-sm font-bold shadow-sm cursor-pointer min-h-[44px]"
                >
                  Close Encounter & Return Home
                </button>
              </motion.div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
