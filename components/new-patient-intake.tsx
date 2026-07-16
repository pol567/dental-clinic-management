'use client';

import React, { useState, useEffect } from 'react';
import { useClinic } from '@/lib/clinic-state';
import { DEFAULT_MEDICAL_QUESTIONS } from '@/lib/types';
import { ChevronLeft, ChevronRight, UserPlus, Shield, AlertTriangle, Check } from 'lucide-react';

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

    // ponytail: age limits are evaluated in-memory. An upgrade path should log an audit trace in the patient registration ledger.
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
        if (!name.trim()) {
          // Skip if parent name itself is empty
        }
        if (!guardianName.trim()) newErrors.guardianName = 'Guardian name is required for minors.';
        if (!guardianContact.trim()) newErrors.guardianContact = 'Guardian contact number is required.';
      }

      // ponytail: statutory tax exemptions are verified using text ID input fields. An upgrade path should call a government integration API (OSCA/NCDA database) for automated credential validation.
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
    <div id="new-patient-intake-wrapper" className="max-w-4xl mx-auto bg-white border border-border rounded flex flex-col">
      {/* Header (No gradients, flat clinical surface) */}
      <div className="border-b border-border p-6 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-primary" />
            Patient Intake & Consent Form
          </h3>
          <p className="text-xs text-text-muted">Register a clinical patient file folder.</p>
        </div>
        <span className="text-xs font-mono font-bold bg-primary-tint text-primary px-2.5 py-1 rounded">
          Step {step + 1} of 3
        </span>
      </div>

      {/* Progress Tracker (Text-based horizontal list, no visual bubble indicator) */}
      <div className="flex border-b border-border bg-[#F8F7F5] px-6 py-3 text-xs overflow-x-auto divide-x divide-border">
        {[
          { label: 'Demographics & ID' },
          { label: 'Medical & Allergies' },
          { label: 'Privacy & Consents' }
        ].map((item, idx) => {
          const isActive = idx === step;
          const isDone = idx < step;
          return (
            <div key={idx} className={`flex items-center gap-2 px-4 first:pl-0 ${isActive ? 'font-bold' : ''}`}>
              {isDone ? (
                <span className="text-success flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5" />
                </span>
              ) : (
                <span className={`text-[10px] font-mono font-bold ${isActive ? 'text-primary' : 'text-text-muted'}`}>
                  0{idx + 1}.
                </span>
              )}
              <span className={`transition-all leading-none ${isActive ? 'text-text-primary border-b border-text-primary pb-0.5' : 'text-text-muted'}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Form Content */}
      <div className="p-6 sm:p-8 space-y-6">

        {/* STEP 1: DEMOGRAPHICS */}
        {step === 0 && (
          <div className="space-y-5">
            <div className="border-b border-border pb-2.5">
              <h4 className="text-sm font-bold text-text-primary">1. Patient Information Details</h4>
              <p className="text-xs text-text-muted">Personal records must match government-issued identification cards.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="intake-name" className="block text-xs font-bold text-text-secondary uppercase tracking-wider">Patient Full Name*</label>
                <input
                  type="text"
                  id="intake-name"
                  placeholder="e.g. Maria Clara Santos"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full bg-white border rounded px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none h-11
                    ${errors.name ? 'border-danger' : 'border-border'}
                  `}
                />
                {errors.name && <p className="text-[11px] text-danger font-semibold">{errors.name}</p>}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1.5 sm:col-span-1">
                <label htmlFor="intake-dob" className="block text-xs font-bold text-text-secondary uppercase tracking-wider">Date of Birth*</label>
                <input
                  type="date"
                  id="intake-dob"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className={`w-full bg-white border rounded px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none h-11
                    ${errors.dateOfBirth ? 'border-danger' : 'border-border'}
                  `}
                />
                {errors.dateOfBirth && <p className="text-[11px] text-danger font-semibold">{errors.dateOfBirth}</p>}
              </div>

              {/* Biological Sex */}
              <div className="space-y-1.5 sm:col-span-1">
                <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">Biological Sex*</label>
                <div className="flex bg-[#F1F5F9] p-0.5 rounded text-xs border border-border h-11 items-center">
                  {(['Male', 'Female'] as const).map(option => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSex(option)}
                      className={`flex-1 py-2 rounded text-xs font-bold transition-all capitalize cursor-pointer h-9 ${
                        sex === option ? 'bg-white text-primary shadow-xs' : 'text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact Number */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="intake-contact" className="block text-xs font-bold text-text-secondary uppercase tracking-wider">Contact Number*</label>
                <input
                  type="text"
                  id="intake-contact"
                  placeholder="e.g. +63 917 123 4567"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className={`w-full bg-white border rounded px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none h-11
                    ${errors.contact ? 'border-danger' : 'border-border'}
                  `}
                />
                {errors.contact && <p className="text-[11px] text-danger font-semibold">{errors.contact}</p>}
              </div>

              {/* Address */}
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="intake-address" className="block text-xs font-bold text-text-secondary uppercase tracking-wider">Residential Address*</label>
                <input
                  type="text"
                  id="intake-address"
                  placeholder="e.g. 45 Rizal Street, Barangay Central, Makati City"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full bg-white border rounded px-3 py-2 text-sm font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none h-11
                    ${errors.address ? 'border-danger' : 'border-border'}
                  `}
                />
                {errors.address && <p className="text-[11px] text-danger font-semibold">{errors.address}</p>}
              </div>
            </div>

            {/* DYNAMIC GUARDIAN FIELDS FOR MINORS */}
            {isMinor && (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded space-y-3.5">
                <div className="flex items-start gap-2 text-amber-800">
                  <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider">Minor Onboarding Requirements</h5>
                    <p className="text-[11px] text-amber-700 font-medium">Under clinical operations protocols, a legal parent or guardian must authorize procedures.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="intake-guardian-name" className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider">Guardian Full Name*</label>
                    <input
                      type="text"
                      id="intake-guardian-name"
                      placeholder="Parent / Legal Guardian"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-amber-500 outline-none h-9"
                    />
                    {errors.guardianName && <p className="text-[10px] text-danger font-semibold mt-0.5">{errors.guardianName}</p>}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="intake-guardian-contact" className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider">Guardian Contact*</label>
                    <input
                      type="text"
                      id="intake-guardian-contact"
                      placeholder="Contact number of guardian"
                      value={guardianContact}
                      onChange={(e) => setGuardianContact(e.target.value)}
                      className="w-full bg-white border border-amber-300 rounded px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-amber-500 outline-none h-9"
                    />
                    {errors.guardianContact && <p className="text-[10px] text-danger font-semibold mt-0.5">{errors.guardianContact}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* DYNAMIC TAX & ID FOR SENIORS/PWDS */}
            <div className="border-t border-border pt-4 space-y-4">
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
                Statutory Exemption Status
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="intake-senior-checkbox"
                    checked={isSenior}
                    onChange={(e) => setIsSenior(e.target.checked)}
                    className="h-4 w-4 border-border rounded text-primary focus:ring-primary mt-0.5 shrink-0"
                  />
                  <div>
                    <span className="block text-xs font-bold text-text-primary">Senior Citizen Discount</span>
                    <span className="block text-[11px] text-text-muted mt-0.5">60+ years old. Entitled to 20% discount + VAT exemption (PH OSCA).</span>
                  </div>
                </label>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    id="intake-pwd-checkbox"
                    checked={isPwd}
                    onChange={(e) => setIsPwd(e.target.checked)}
                    className="h-4 w-4 border-border rounded text-primary focus:ring-primary mt-0.5 shrink-0"
                  />
                  <div>
                    <span className="block text-xs font-bold text-text-primary">PWD Status Discount</span>
                    <span className="block text-[11px] text-text-muted mt-0.5">Person with Disability. Entitled to 20% discount + VAT exemption.</span>
                  </div>
                </label>
              </div>

              {(isSenior || isPwd) && (
                <div className="bg-[#F8F7F5] border border-border p-4 rounded space-y-3">
                  <span className="block text-xs font-bold text-text-primary leading-none">Exemption Identification Credentials</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label htmlFor="intake-sc-pwd-id" className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">OSCA / PWD ID Number*</label>
                      <input
                        type="text"
                        id="intake-sc-pwd-id"
                        placeholder="Required for billing verification"
                        value={scPwdIdNumber}
                        onChange={(e) => setScPwdIdNumber(e.target.value)}
                        className={`w-full bg-white border rounded px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none h-9
                          ${errors.scPwdIdNumber ? 'border-danger' : 'border-border'}
                        `}
                      />
                      {errors.scPwdIdNumber && <p className="text-[10px] text-danger font-semibold mt-0.5">{errors.scPwdIdNumber}</p>}
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="intake-tin" className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider">TIN Snapshot (Optional)</label>
                      <input
                        type="text"
                        id="intake-tin"
                        placeholder="Tax Identification Number"
                        value={tin}
                        onChange={(e) => setTin(e.target.value)}
                        className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none h-9"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 2: MEDICAL HISTORY & ALLERGIES */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="border-b border-border pb-2.5">
              <h4 className="text-sm font-bold text-text-primary">2. Medical Carousels & Allergies</h4>
              <p className="text-xs text-text-muted">Clinical records that govern patient safety flags during charting.</p>
            </div>

            {/* Drug Allergies Section */}
            <div className="space-y-3">
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
                Drug / Material Allergies
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
                      className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-all cursor-pointer flex items-center gap-1.5 leading-none
                        ${isTagged
                          ? isLidocaine
                            ? 'bg-danger text-white border-danger'
                            : 'bg-[#B45309] text-white border-[#B45309]'
                          : 'bg-white text-text-secondary border-border hover:border-text-muted'
                        }
                      `}
                    >
                      {isTagged && <AlertTriangle className="h-3 w-3" />}
                      {substance} {isLidocaine && isTagged && '(High Risk)'}
                    </button>
                  );
                })}
              </div>

              {/* Custom Allergy */}
              <div className="flex gap-2 max-w-sm pt-1">
                <input
                  type="text"
                  placeholder="Custom allergy substance..."
                  value={allergyCustomInput}
                  onChange={(e) => setAllergyCustomInput(e.target.value)}
                  className="flex-1 bg-white border border-border rounded px-3 py-1.5 text-xs font-medium focus:ring-1 focus:ring-primary focus:border-primary outline-none h-9"
                />
                <button
                  type="button"
                  onClick={handleCustomAllergyAdd}
                  className="px-3 py-1.5 bg-[#1F2933] text-white hover:bg-slate-800 rounded text-xs font-bold transition-all min-h-[36px] cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Medical Questionnaire Table */}
            <div className="border-t border-border pt-4 space-y-4">
              <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider">
                Systemic Medical Questionnaire
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEFAULT_MEDICAL_QUESTIONS.map(q => {
                  const data = medicalAnswers[q.id];
                  return (
                    <div key={q.id} className="p-4 bg-white border border-border rounded space-y-3 transition-colors hover:bg-[#F8F7F5]/50">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <span className="text-xs font-bold text-text-primary leading-relaxed">{q.questionText}</span>
                        
                        {/* Selector Toggles */}
                        <div className="flex bg-[#F1F5F9] p-0.5 rounded text-xs w-[100px] border border-border h-8 shrink-0">
                          <button
                            type="button"
                            onClick={() => setMedicalAnswers({
                              ...medicalAnswers,
                              [q.id]: { ...data, answer: false }
                            })}
                            className={`flex-1 text-[10px] font-bold rounded transition-all cursor-pointer ${
                              !data.answer ? 'bg-white text-text-primary shadow-xs' : 'text-text-muted hover:text-text-primary'
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
                            className={`flex-1 text-[10px] font-bold rounded transition-all cursor-pointer ${
                              data.answer ? 'bg-danger text-white' : 'text-text-muted hover:text-text-primary'
                            }`}
                          >
                            Yes
                          </button>
                        </div>
                      </div>

                      {data.answer && (
                        <div className="pt-1">
                          <input
                            type="text"
                            placeholder="Please specify conditions, drugs, or clinical notes..."
                            value={data.notes}
                            onChange={(e) => setMedicalAnswers({
                              ...medicalAnswers,
                              [q.id]: { ...data, notes: e.target.value }
                            })}
                            className="w-full bg-white border border-border rounded px-3 py-1.5 text-xs font-medium text-text-primary placeholder-text-muted focus:ring-1 focus:ring-primary focus:border-primary outline-none h-9"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: CONSENTS */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="border-b border-border pb-2.5">
              <h4 className="text-sm font-bold text-text-primary">3. Legal Authorization & Privacy Consents</h4>
              <p className="text-xs text-text-muted">Under PH law, digital consents serve as formal authorization and must be acknowledged.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* Data Privacy Consent - REQUIRED */}
              <div className="space-y-2">
                <div className="flex items-start gap-2.5 select-none">
                  <input
                    type="checkbox"
                    id="intake-privacy-consent"
                    checked={consentDataPrivacy}
                    onChange={(e) => setConsentDataPrivacy(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 border-border rounded focus:ring-emerald-500 mt-1 shrink-0"
                  />
                  <div className="flex-1">
                    <label htmlFor="intake-privacy-consent" className="text-sm font-bold text-text-primary flex items-center gap-1.5 cursor-pointer">
                      Data Privacy Consent (RA 10173)* 
                      <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded uppercase leading-none font-bold">Required</span>
                    </label>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      I authorize Echevaria Dental Clinic to collect, process, and retain my health data and medical records strictly in compliance with the <strong className="text-text-primary">Philippine Data Privacy Act of 2012 (RA 10173)</strong>.
                    </p>
                    {/* scrollable text */}
                    <div className="mt-2 text-[10px] font-mono text-text-muted bg-[#F8F7F5] border border-border rounded p-3 h-16 overflow-y-auto leading-relaxed">
                      STANDARD CONTRACT STATEMENT v1.2-PH-RA10173: Patient health records including clinical history, diagnoses, radiographic imaging, and ledger balance statements are subject to medical secrecy. Access is restricted to authorized clinic operators. Data retention is set to 15 years from the last treatment date.
                    </div>
                  </div>
                </div>
              </div>

              {/* General Treatment Consent - REQUIRED */}
              <div className="space-y-2">
                <div className="flex items-start gap-2.5 select-none">
                  <input
                    type="checkbox"
                    id="intake-treatment-consent"
                    checked={consentTreatment}
                    onChange={(e) => setConsentTreatment(e.target.checked)}
                    className="h-4 w-4 text-emerald-600 border-border rounded focus:ring-emerald-500 mt-1 shrink-0"
                  />
                  <div className="flex-1">
                    <label htmlFor="intake-treatment-consent" className="text-sm font-bold text-text-primary flex items-center gap-1.5 cursor-pointer">
                      General Treatment & Clinical Consent*
                      <span className="text-[9px] font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 rounded uppercase leading-none font-bold">Required</span>
                    </label>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      I voluntarily authorize the licensed clinical staff of Echevaria Dental to perform diagnostic cleanings, oral examinations, and local anesthetic administrations.
                    </p>
                    <div className="mt-2 text-[10px] font-mono text-text-muted bg-[#F8F7F5] border border-border rounded p-3 h-16 overflow-y-auto leading-relaxed">
                      STANDARD CLINICAL AGREEMENT v1.0: Diagnostics include visual exams, periodontal probing, and study models. Standard treatments involve scaling and root planing, fluoride applications, and local anesthetics (Mepivacaine/Lidocaine). Any surgical risks or deviations will be explained by the treating dentist.
                    </div>
                  </div>
                </div>
              </div>

              {/* Radiograph Consent - OPTIONAL */}
              <div className="space-y-2">
                <div className="flex items-start gap-2.5 select-none">
                  <input
                    type="checkbox"
                    id="intake-radiograph-consent"
                    checked={consentRadiograph}
                    onChange={(e) => setConsentRadiograph(e.target.checked)}
                    className="h-4 w-4 text-primary border-border rounded focus:ring-primary mt-1 shrink-0"
                  />
                  <div className="flex-1">
                    <label htmlFor="intake-radiograph-consent" className="text-sm font-bold text-text-primary flex items-center gap-1.5 cursor-pointer">
                      Radiology & Imaging Authorization
                      <span className="text-[9px] font-mono bg-[#F1F5F9] text-text-muted px-1.5 py-0.5 rounded uppercase leading-none font-bold">Optional</span>
                    </label>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      I authorize the capture of dental radiographs (x-rays) as needed for internal diagnostic tracing and analysis.
                    </p>
                  </div>
                </div>
              </div>

              {/* Extraction Consent - OPTIONAL */}
              <div className="space-y-2">
                <div className="flex items-start gap-2.5 select-none">
                  <input
                    type="checkbox"
                    id="intake-extraction-consent"
                    checked={consentExtraction}
                    onChange={(e) => setConsentExtraction(e.target.checked)}
                    className="h-4 w-4 text-primary border-border rounded focus:ring-primary mt-1 shrink-0"
                  />
                  <div className="flex-1">
                    <label htmlFor="intake-extraction-consent" className="text-sm font-bold text-text-primary flex items-center gap-1.5 cursor-pointer">
                      Surgical Extraction Consent
                      <span className="text-[9px] font-mono bg-[#F1F5F9] text-text-muted px-1.5 py-0.5 rounded uppercase leading-none font-bold">Optional</span>
                    </label>
                    <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                      I acknowledge and authorize surgical tooth extractions under local anesthesia as direct treatments.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Error notifications */}
            {errors.consentDataPrivacy && (
              <div className="flex items-center gap-2 text-danger text-xs font-bold bg-red-50 border border-red-200 p-3 rounded">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {errors.consentDataPrivacy}
              </div>
            )}
            {errors.consentTreatment && !errors.consentDataPrivacy && (
              <div className="flex items-center gap-2 text-danger text-xs font-bold bg-red-50 border border-red-200 p-3 rounded">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {errors.consentTreatment}
              </div>
            )}

            {/* Audit compliance footnote */}
            {/* ponytail: consent inputs are simple checkbox controls. In production, this should integrate with a drawing canvas or signature pad for legal e-signatures. */}
            <div className="bg-[#F8F7F5] border border-border p-4 rounded text-xs text-text-secondary leading-relaxed">
              <span className="font-bold text-text-primary flex items-center gap-1.5 mb-1.5">
                <Shield className="h-4 w-4 text-primary" />
                Session Intake Attestation
              </span>
              Onboarding logged by dentist <strong className="text-text-primary">{currentUser.displayName}</strong>. This record represents legally acknowledged consent under standard medical operations.
            </div>
          </div>
        )}

      </div>

      {/* Action Bar (Flat borders, standard 44px buttons) */}
      <div className="bg-[#F8F7F5] border-t border-border p-6 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            id="intake-prev-btn"
            onClick={handlePrev}
            className="py-2 px-5 border border-border bg-white hover:bg-background rounded font-bold text-sm text-text-primary transition-all flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            <ChevronLeft className="h-4 w-4" /> Back
          </button>
        ) : (
          <button
            type="button"
            id="intake-cancel-btn"
            onClick={onCancel}
            className="py-2 px-5 border border-border bg-white hover:bg-background rounded font-bold text-sm text-text-secondary transition-all cursor-pointer min-h-[44px]"
          >
            Cancel Onboarding
          </button>
        )}

        {step < 2 ? (
          <button
            type="button"
            id="intake-next-btn"
            onClick={handleNext}
            className="py-2 px-6 bg-primary hover:bg-primary-hover text-white rounded font-bold text-sm transition-all flex items-center gap-1.5 cursor-pointer min-h-[44px]"
          >
            Continue <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            id="intake-submit-btn"
            onClick={handleSubmit}
            className="py-2 px-6 bg-success hover:bg-green-700 text-white rounded font-bold text-sm transition-all flex items-center gap-2 cursor-pointer min-h-[44px]"
          >
            <Shield className="h-4 w-4" />
            Complete & Save Intake
          </button>
        )}
      </div>
    </div>
  );
};
