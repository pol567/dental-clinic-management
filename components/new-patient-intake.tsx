'use client';

import React, { useState, useEffect } from 'react';
import { useClinic } from '@/lib/clinic-state';
import { DEFAULT_MEDICAL_QUESTIONS } from '@/lib/types';
import { ChevronLeft, ChevronRight, UserPlus, FileText, AlertTriangle, ShieldCheck, UserCheck, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NewPatientIntakeProps {
  onCancel: () => void;
  onSuccess: (newPatientId: string) => void;
}

export const NewPatientIntake: React.FC<NewPatientIntakeProps> = ({
  onCancel,
  onSuccess
}) => {
  const { addPatient, currentUser } = useClinic();

  // Multi-step Form State: 0 (Demographics), 1 (Medical & Allergies), 2 (Consents)
  const [step, setStep] = useState(0);

  // SECTION 1: DEMOGRAPHICS
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [sex, setSex] = useState<'Male' | 'Female'>('Female');
  const [contact, setContact] = useState('');
  const [address, setAddress] = useState('');

  // Guardian details for minors (DOB age < 18)
  const [isMinor, setIsMinor] = useState(false);
  const [guardianName, setGuardianName] = useState('');
  const [guardianContact, setGuardianContact] = useState('');

  // Statutory flags
  const [isSenior, setIsSenior] = useState(false);
  const [isPwd, setIsPwd] = useState(false);
  const [scPwdIdNumber, setScPwdIdNumber] = useState('');
  const [tin, setTin] = useState('');

  // SECTION 2: MEDICAL HISTORY & ALLERGIES
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [allergyCustomInput, setAllergyCustomInput] = useState('');

  const [medicalAnswers, setMedicalAnswers] = useState<{ [qId: string]: { answer: boolean; notes: string } }>({
    q1: { answer: false, notes: '' },
    q2: { answer: false, notes: '' },
    q3: { answer: false, notes: '' },
    q4: { answer: false, notes: '' },
    q5: { answer: false, notes: '' },
    q6: { answer: false, notes: '' }
  });

  // SECTION 3: CONSENTS
  const [consentTreatment, setConsentTreatment] = useState(false);
  const [consentRadiograph, setConsentRadiograph] = useState(false);
  const [consentExtraction, setConsentExtraction] = useState(false);
  const [consentDataPrivacy, setConsentDataPrivacy] = useState(false);

  // Errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Trigger minor guardian fields dynamically based on DOB age
  useEffect(() => {
    if (!dateOfBirth) {
      setTimeout(() => {
        setIsMinor(false);
      }, 0);
      return;
    }
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }

    const minor = age < 18;
    const senior = age >= 60;

    setTimeout(() => {
      setIsMinor(minor);
      setIsSenior(senior);
    }, 0);
  }, [dateOfBirth]);

  const handleAllergyToggle = (substance: string) => {
    if (selectedAllergies.includes(substance)) {
      setSelectedAllergies(selectedAllergies.filter(x => x !== substance));
    } else {
      setSelectedAllergies([...selectedAllergies, substance]);
    }
  };

  const handleCustomAllergyAdd = () => {
    const trimmed = allergyCustomInput.trim();
    if (trimmed && !selectedAllergies.includes(trimmed)) {
      setSelectedAllergies([...selectedAllergies, trimmed]);
      setAllergyCustomInput('');
    }
  };

  const validateStep = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (step === 0) {
      if (!name.trim()) newErrors.name = 'Patient name is required.';
      if (!dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required.';
      if (!contact.trim()) newErrors.contact = 'Contact number is required.';
      if (!address.trim()) newErrors.address = 'Primary residential address is required.';

      if (isMinor) {
        if (!guardianName.trim()) newErrors.guardianName = 'Guardian name is required for minors.';
        if (!guardianContact.trim()) newErrors.guardianContact = 'Guardian contact number is required.';
      }

      if ((isSenior || isPwd) && !scPwdIdNumber.trim()) {
        newErrors.scPwdIdNumber = 'OSCA or PWD ID Number is required for tax deduction.';
      }
    }

    if (step === 2) {
      if (!consentDataPrivacy) newErrors.consentDataPrivacy = 'Data Privacy Consent is mandatory under PH RA 10173.';
      if (!consentTreatment) newErrors.consentTreatment = 'General Treatment Consent is required to start any dental care.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setErrors({});
    setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (!validateStep()) return;

    // Build the package
    const patientData = {
      name,
      dateOfBirth,
      sex,
      contact,
      address,
      isSenior,
      isPwd,
      scPwdIdNumber: (isSenior || isPwd) ? scPwdIdNumber : undefined,
      tin: tin.trim() ? tin : undefined,
      guardianName: isMinor ? guardianName : undefined,
      guardianContact: isMinor ? guardianContact : undefined
    };

    const answersList = Object.entries(medicalAnswers).reduce((acc, [qId, val]) => {
      acc[qId] = { answer: val.answer, notes: val.notes };
      return acc;
    }, {} as { [qId: string]: { answer: boolean; notes?: string } });

    const consentsList: Array<{ type: 'treatment' | 'radiograph' | 'extraction' | 'data_privacy', textVersion: string }> = [];
    if (consentTreatment) consentsList.push({ type: 'treatment', textVersion: 'v1.0-General-Treatment-Consent' });
    if (consentRadiograph) consentsList.push({ type: 'radiograph', textVersion: 'v1.0-Radiology-Authorization' });
    if (consentExtraction) consentsList.push({ type: 'extraction', textVersion: 'v1.1-Surgical-Extraction-Consent' });
    if (consentDataPrivacy) consentsList.push({ type: 'data_privacy', textVersion: 'v1.2-Standard-Data-Privacy-PH-RA10173' });

    const createdPatient = addPatient(patientData, selectedAllergies, answersList, consentsList);
    onSuccess(createdPatient.id);
  };

  return (
    <div id="new-patient-intake-wrapper" className="max-w-2xl mx-auto bg-white border border-slate-200 shadow-sm rounded-2xl overflow-hidden">
      {/* Progress Wizard Header */}
      <div className="bg-gradient-to-br from-cyan-700 to-cyan-900 p-6 text-white flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Patient Intake & Consent Form
          </h3>
          <p className="text-xs text-cyan-100">Establish a legal and clinical digital patient chart</p>
        </div>
        <span className="text-xs font-mono tabular-nums font-bold bg-cyan-600/40 border border-white/10 px-3 py-1 rounded-full">
          Step {step + 1} of 3
        </span>
      </div>

      {/* Steps Visual Tracker */}
      <div className="flex border-b border-slate-100 bg-slate-50/50 p-4">
        {[
          { label: 'Demographics & ID' },
          { label: 'Medical & Allergies' },
          { label: 'PH Privacy & Consents' }
        ].map((item, idx) => (
          <div key={idx} className="flex-1 flex items-center gap-2 px-2">
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${idx === step
                ? 'bg-cyan-700 text-white font-bold ring-2 ring-cyan-600 ring-offset-2'
                : idx < step
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-200 text-slate-500'
              }
            `}>
              {idx < step ? <Check className="h-3.5 w-3.5" /> : idx + 1}
            </span>
            <span className={`text-xs font-semibold ${idx === step ? 'text-slate-800 font-bold' : 'text-slate-400'}`}>
              {item.label}
            </span>
            {idx < 2 && <div className="flex-1 h-0.5 bg-slate-200 ml-2 hidden sm:block"></div>}
          </div>
        ))}
      </div>

      {/* Intake Wizard Body */}
      <div className="p-6 sm:p-8 space-y-6">

        {/* STEP 1: DEMOGRAPHICS */}
        {step === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-800">1. Demographic Records</h4>
              <p className="text-xs text-slate-500">Inputs must match official government ID records for safety and tax audits.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="intake-name" className="block text-xs font-bold text-slate-600 uppercase">Patient Full Name</label>
                <input
                  type="text"
                  id="intake-name"
                  placeholder="e.g. Maria Clara Santos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-white border rounded-2xl px-4 py-2.5 text-sm font-medium focus:ring-1 focus:ring-cyan-600
                    ${errors.name ? 'border-red-400 focus:border-red-400' : 'border-slate-300 focus:border-cyan-600'}
                  `}
                />
                {errors.name && <p className="text-[11px] text-red-500 font-semibold">{errors.name}</p>}
              </div>

              {/* DOB */}
              <div className="space-y-1.5">
                <label htmlFor="intake-dob" className="block text-xs font-bold text-slate-600 uppercase">Date of Birth</label>
                <input
                  type="date"
                  id="intake-dob"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className={`w-full bg-white border rounded-2xl px-4 py-2.5 text-sm font-medium focus:ring-1 focus:ring-cyan-600
                    ${errors.dateOfBirth ? 'border-red-400 focus:border-red-400' : 'border-slate-300 focus:border-cyan-600'}
                  `}
                />
                {errors.dateOfBirth && <p className="text-[11px] text-red-500 font-semibold">{errors.dateOfBirth}</p>}
              </div>

              {/* Sex */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-600 uppercase">Biological Sex</label>
                <div className="flex gap-2 bg-slate-100 p-1 rounded-xl h-[45px]">
                  {(['Male', 'Female'] as const).map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSex(option)}
                      className={`flex-1 text-xs font-bold rounded-xl transition-all capitalize ${
                        sex === option ? 'bg-white text-cyan-800 shadow-sm' : 'text-slate-500'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="intake-contact" className="block text-xs font-bold text-slate-600 uppercase">Contact Number</label>
                <input
                  type="text"
                  id="intake-contact"
                  placeholder="e.g. +63 917 123 4567"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className={`w-full bg-white border rounded-2xl px-4 py-2.5 text-sm font-medium focus:ring-1 focus:ring-cyan-600
                    ${errors.contact ? 'border-red-400 focus:border-red-400' : 'border-slate-300 focus:border-cyan-600'}
                  `}
                />
                {errors.contact && <p className="text-[11px] text-red-500 font-semibold">{errors.contact}</p>}
              </div>

              {/* Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="intake-address" className="block text-xs font-bold text-slate-600 uppercase">Residential Address</label>
                <input
                  type="text"
                  id="intake-address"
                  placeholder="e.g. Apartment 4B, Blue Ridge Condominium, Quezon City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full bg-white border rounded-2xl px-4 py-2.5 text-sm font-medium focus:ring-1 focus:ring-cyan-600
                    ${errors.address ? 'border-red-400 focus:border-red-400' : 'border-slate-300 focus:border-cyan-600'}
                  `}
                />
                {errors.address && <p className="text-[11px] text-red-500 font-semibold">{errors.address}</p>}
              </div>
            </div>

            {/* DYNAMIC GUARDIAN FIELDS FOR MINORS */}
            <AnimatePresence>
              {isMinor && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-amber-50/50 border border-amber-200/60 p-4 rounded-xl space-y-4"
                >
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="h-5 w-5" />
                    <div>
                      <h5 className="text-xs font-bold uppercase tracking-wider">Minor Onboarding Required</h5>
                      <p className="text-[11px] text-amber-700 font-medium">Under PH regulations, legal guardians must authorize dental operations.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="intake-guardian-name" className="block text-[10px] font-bold text-amber-800 uppercase">Guardian Full Name</label>
                      <input
                        type="text"
                        id="intake-guardian-name"
                        placeholder="Parent or authorized legal guardian"
                        value={guardianName}
                        onChange={(e) => setGuardianName(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-2xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-amber-500"
                      />
                      {errors.guardianName && <p className="text-[10px] text-red-600 font-semibold">{errors.guardianName}</p>}
                    </div>
                    <div className="space-y-1">
                      <label htmlFor="intake-guardian-contact" className="block text-[10px] font-bold text-amber-800 uppercase">Guardian Contact</label>
                      <input
                        type="text"
                        id="intake-guardian-contact"
                        placeholder="Contact number of legal guardian"
                        value={guardianContact}
                        onChange={(e) => setGuardianContact(e.target.value)}
                        className="w-full bg-white border border-amber-300 rounded-2xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-amber-500"
                      />
                      {errors.guardianContact && <p className="text-[10px] text-red-600 font-semibold">{errors.guardianContact}</p>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* DYNAMIC TAX & ID FOR SENIORS/PWDS */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Statutory Exemption Eligibility
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer select-none transition-all
                  ${isSenior ? 'bg-cyan-50/30 border-cyan-500 font-bold' : 'bg-white border-slate-200'}
                `}>
                  <input
                    type="checkbox"
                    id="intake-senior-checkbox"
                    checked={isSenior}
                    onChange={(e) => setIsSenior(e.target.checked)}
                    className="h-5 w-5 rounded-xl border-slate-300 text-cyan-700 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="block text-sm font-bold text-slate-800">Senior Citizen</span>
                    <span className="block text-[10px] text-slate-500">60+ Eligible for VAT-exempt + 20%</span>
                  </div>
                </label>

                <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer select-none transition-all
                  ${isPwd ? 'bg-cyan-50/30 border-cyan-500 font-bold' : 'bg-white border-slate-200'}
                `}>
                  <input
                    type="checkbox"
                    id="intake-pwd-checkbox"
                    checked={isPwd}
                    onChange={(e) => setIsPwd(e.target.checked)}
                    className="h-5 w-5 rounded-xl border-slate-300 text-cyan-700 focus:ring-cyan-500"
                  />
                  <div>
                    <span className="block text-sm font-bold text-slate-800">PWD Status</span>
                    <span className="block text-[10px] text-slate-500">Persons with Disability exemption</span>
                  </div>
                </label>
              </div>

              {(isSenior || isPwd) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3.5"
                >
                  <span className="block text-xs font-bold text-slate-700">Official Exemption Verification Data</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="intake-sc-pwd-id" className="block text-[10px] font-bold text-slate-600 uppercase">OSCA / PWD ID Number</label>
                      <input
                        type="text"
                        id="intake-sc-pwd-id"
                        placeholder="ID printed on OSCA/PWD Card"
                        value={scPwdIdNumber}
                        onChange={(e) => setScPwdIdNumber(e.target.value)}
                        className={`w-full bg-white border rounded-2xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-cyan-600
                          ${errors.scPwdIdNumber ? 'border-red-300' : 'border-slate-300'}
                        `}
                      />
                      {errors.scPwdIdNumber && <p className="text-[10px] text-red-500 font-semibold">{errors.scPwdIdNumber}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="intake-tin" className="block text-[10px] font-bold text-slate-600 uppercase">TIN (Optional)</label>
                      <input
                        type="text"
                        id="intake-tin"
                        placeholder="Tax Identification Number"
                        value={tin}
                        onChange={(e) => setTin(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-2xl px-3 py-2 text-xs font-medium focus:ring-1 focus:ring-cyan-600"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}

        {/* STEP 2: MEDICAL HISTORY & ALLERGIES */}
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-800">2. Clinical Background & Drug Allergies</h4>
              <p className="text-xs text-slate-500">Critical safety protocols. Allergies surface prominently across dentist visits.</p>
            </div>

            {/* Drug Allergies Tagging */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Drug Allergies / Material Allergies
              </label>
              <div className="flex flex-wrap gap-2">
                {['Lidocaine', 'Penicillin', 'Latex', 'Aspirin', 'Amoxicillin', 'Erythromycin'].map(substance => {
                  const isTagged = selectedAllergies.includes(substance);
                  const isLidocaine = substance === 'Lidocaine';
                  return (
                    <button
                      key={substance}
                      type="button"
                      onClick={() => handleAllergyToggle(substance)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer flex items-center gap-1
                        ${isTagged
                          ? isLidocaine
                            ? 'bg-red-500 text-white border-red-600 shadow-sm'
                            : 'bg-amber-500 text-white border-amber-600 shadow-sm'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                        }
                      `}
                    >
                      {isTagged && <AlertTriangle className="h-3 w-3" />}
                      {substance} {isLidocaine && isTagged && '(High Danger)'}
                    </button>
                  );
                })}
              </div>

              {/* Custom Allergy Entry */}
              <div className="flex gap-2 max-w-sm mt-2">
                <input
                  type="text"
                  placeholder="Add other custom allergy substance..."
                  value={allergyCustomInput}
                  onChange={(e) => setAllergyCustomInput(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 rounded-2xl px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600"
                />
                <button
                  type="button"
                  onClick={handleCustomAllergyAdd}
                  className="px-3 py-1.5 bg-slate-800 text-white hover:bg-slate-900 rounded-xl text-xs font-bold transition-all min-h-[44px]"
                >
                  Add Custom
                </button>
              </div>
            </div>

            {/* Medical History Checklist */}
            <div className="border-t border-slate-100 pt-5 space-y-4">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Systemic Medical Questionnaire
              </label>

              <div className="space-y-3.5">
                {DEFAULT_MEDICAL_QUESTIONS.map(q => {
                  const data = medicalAnswers[q.id];
                  return (
                    <div
                      key={q.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-slate-50/50 border border-slate-100 rounded-xl gap-3"
                    >
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-slate-800 leading-tight block">{q.questionText}</span>
                        {data.answer && (
                          <input
                            type="text"
                            placeholder="Add explanation/medications/clinical instructions..."
                            value={data.notes}
                            onChange={(e) => setMedicalAnswers({
                              ...medicalAnswers,
                              [q.id]: { ...data, notes: e.target.value }
                            })}
                            className="mt-2 w-full bg-white border border-slate-200 rounded-2xl px-2.5 py-1 text-xs font-medium text-slate-700 placeholder-slate-400 focus:ring-1 focus:ring-cyan-600"
                          />
                        )}
                      </div>

                      {/* YES/NO Toggle */}
                      <div className="flex bg-slate-200/80 p-0.5 rounded-xl h-[34px] w-[110px] self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => setMedicalAnswers({
                            ...medicalAnswers,
                            [q.id]: { ...data, answer: false }
                          })}
                          className={`flex-1 text-[11px] font-bold rounded-xl transition-all ${
                            !data.answer ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'
                          }`}
                        >
                          No
                        </button>
                        <button
                          type="button"
                          onClick={() => setMedicalAnswers({
                            ...medicalAnswers,
                            [q.id]: { ...data, answer: true }
                          })}
                          className={`flex-1 text-[11px] font-bold rounded-xl transition-all ${
                            data.answer ? 'bg-red-500 text-white shadow-sm' : 'text-slate-500'
                          }`}
                        >
                          Yes
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 3: CONSENTS */}
        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-base font-bold text-slate-800">3. Legal Consent & PH RA 10173 Compliance</h4>
              <p className="text-xs text-slate-500">Explicit legal permissions are captured digitally with tamper-proof version stamps.</p>
            </div>

            <div className="space-y-4">
              {/* Data Privacy Consent - MANDATORY */}
              <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all select-none
                ${consentDataPrivacy ? 'bg-emerald-50/20 border-emerald-500' : 'bg-white border-slate-200'}
              `}>
                <input
                  type="checkbox"
                  id="intake-privacy-consent"
                  checked={consentDataPrivacy}
                  onChange={(e) => setConsentDataPrivacy(e.target.checked)}
                  className="h-5 w-5 mt-0.5 rounded-xl border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    Data Privacy Consent (RA 10173) <span className="text-[9px] font-mono tabular-nums bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-xl uppercase">Required</span>
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    I authorize Echevaria Dental Clinic to collect and process my health data and medical records strictly in compliance with the <strong className="text-slate-600">Philippine Data Privacy Act of 2012 (RA 10173)</strong> for dental operations.
                  </p>
                  <span className="block text-[10px] text-slate-400 font-mono tabular-nums">Form Document Version: v1.2-Standard-Data-Privacy-PH-RA10173</span>
                </div>
              </label>

              {/* General Treatment Consent - MANDATORY */}
              <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all select-none
                ${consentTreatment ? 'bg-emerald-50/20 border-emerald-500' : 'bg-white border-slate-200'}
              `}>
                <input
                  type="checkbox"
                  id="intake-treatment-consent"
                  checked={consentTreatment}
                  onChange={(e) => setConsentTreatment(e.target.checked)}
                  className="h-5 w-5 mt-0.5 rounded-xl border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    General Treatment & Clinical Consent <span className="text-[9px] font-mono tabular-nums bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-xl uppercase">Required</span>
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    I voluntarily consent to oral diagnostics, standard dental cleaning, local anesthetics, and preventive clinical care performed by licensed dentists of this clinic.
                  </p>
                  <span className="block text-[10px] text-slate-400 font-mono tabular-nums">Form Document Version: v1.0-General-Treatment-Consent</span>
                </div>
              </label>

              {/* Radiograph Consent - OPTIONAL */}
              <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all select-none
                ${consentRadiograph ? 'bg-slate-50 border-slate-400' : 'bg-white border-slate-200'}
              `}>
                <input
                  type="checkbox"
                  id="intake-radiograph-consent"
                  checked={consentRadiograph}
                  onChange={(e) => setConsentRadiograph(e.target.checked)}
                  className="h-5 w-5 mt-0.5 rounded-xl border-slate-300 text-cyan-700 focus:ring-cyan-500"
                />
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    Radiology & Imaging Authorization <span className="text-[9px] font-mono tabular-nums bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-xl uppercase">Optional</span>
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    I authorize clinical diagnostic x-rays (periapical, panoramic, or bitewing) as requested by the dentist to properly evaluate sub-surface dental pathologies.
                  </p>
                  <span className="block text-[10px] text-slate-400 font-mono tabular-nums">Form Document Version: v1.0-Radiology-Authorization</span>
                </div>
              </label>

              {/* Extraction Consent - OPTIONAL */}
              <label className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all select-none
                ${consentExtraction ? 'bg-slate-50 border-slate-400' : 'bg-white border-slate-200'}
              `}>
                <input
                  type="checkbox"
                  id="intake-extraction-consent"
                  checked={consentExtraction}
                  onChange={(e) => setConsentExtraction(e.target.checked)}
                  className="h-5 w-5 mt-0.5 rounded-xl border-slate-300 text-cyan-700 focus:ring-cyan-500"
                />
                <div className="space-y-1">
                  <span className="block text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    Surgical Extraction & Minor Surgery Consent <span className="text-[9px] font-mono tabular-nums bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-xl uppercase">Optional</span>
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    I acknowledge and consent to minor oral surgeries, including surgical tooth extractions, under local anesthesia with full disclosure of typical post-op conditions.
                  </p>
                  <span className="block text-[10px] text-slate-400 font-mono tabular-nums">Form Document Version: v1.1-Surgical-Extraction-Consent</span>
                </div>
              </label>
            </div>

            {errors.consentDataPrivacy && (
              <p className="text-xs text-red-500 font-semibold bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {errors.consentDataPrivacy}
              </p>
            )}
            {errors.consentTreatment && !errors.consentDataPrivacy && (
              <p className="text-xs text-red-500 font-semibold bg-red-50 border border-red-200 p-3 rounded-xl flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                {errors.consentTreatment}
              </p>
            )}

            {/* Audit compliance footnote */}
            <div className="bg-slate-50 p-4 rounded-xl text-xs text-slate-500 border border-slate-200/60 leading-relaxed">
              <span className="font-bold text-slate-700 flex items-center gap-1 mb-1">
                <UserCheck className="h-4 w-4 text-cyan-700" />
                Intake Attestation:
              </span>
              Onboarding logged by <strong className="text-slate-700">{currentUser.displayName} (Dentist)</strong> on {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}. This record represents legally acknowledged consent under standard medical operations.
            </div>
          </motion.div>
        )}

      </div>

      {/* Intake Wizard Action Bar */}
      <div className="bg-slate-50 border-t border-slate-100 p-6 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            id="intake-prev-btn"
            onClick={handlePrev}
            className="py-2.5 px-5 border border-slate-300 bg-white hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-700 transition-all flex items-center gap-1 cursor-pointer min-h-[44px]"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
        ) : (
          <button
            type="button"
            id="intake-cancel-btn"
            onClick={onCancel}
            className="py-2.5 px-5 border border-slate-300 bg-white hover:bg-slate-50 rounded-xl font-bold text-sm text-slate-500 transition-all cursor-pointer min-h-[44px]"
          >
            Cancel Onboarding
          </button>
        )}

        {step < 2 ? (
          <button
            type="button"
            id="intake-next-btn"
            onClick={handleNext}
            className="py-2.5 px-6 bg-cyan-700 hover:bg-cyan-800 text-white rounded-xl font-bold text-sm shadow-sm transition-all flex items-center gap-1 cursor-pointer min-h-[44px]"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            id="intake-submit-btn"
            onClick={handleSubmit}
            className="py-3 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <ShieldCheck className="h-4 w-4" />
            Complete & Save Intake
          </button>
        )}
      </div>
    </div>
  );
};
