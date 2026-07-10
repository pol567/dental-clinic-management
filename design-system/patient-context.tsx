'use client';

import React, { createContext, useContext, useState } from 'react';

// Patient Context
interface PatientContextType {
  activePatientId: string | null;
  setActivePatientId: (id: string | null) => void;
}

const PatientContext = createContext<PatientContextType | undefined>(undefined);

export function PatientProvider({ children }: { children: React.ReactNode }) {
  const [activePatientId, setActivePatientId] = useState<string | null>(null);

  return (
    <PatientContext.Provider value={{ activePatientId, setActivePatientId }}>
      {children}
    </PatientContext.Provider>
  );
}

export function useActivePatient() {
  const context = useContext(PatientContext);
  if (!context) {
    throw new Error('useActivePatient must be used within a PatientProvider');
  }
  return context;
}

// Encounter (Visit) Context
interface EncounterContextType {
  activeEncounterId: string | null;
  setActiveEncounterId: (id: string | null) => void;
  isVisitFlowActive: boolean;
  setIsVisitFlowActive: (active: boolean) => void;
  selectedTooth: string | null;
  setSelectedTooth: (tooth: string | null) => void;
}

const EncounterContext = createContext<EncounterContextType | undefined>(undefined);

export function EncounterProvider({ children }: { children: React.ReactNode }) {
  const [activeEncounterId, setActiveEncounterId] = useState<string | null>(null);
  const [isVisitFlowActive, setIsVisitFlowActive] = useState<boolean>(false);
  const [selectedTooth, setSelectedTooth] = useState<string | null>(null);

  return (
    <EncounterContext.Provider
      value={{
        activeEncounterId,
        setActiveEncounterId,
        isVisitFlowActive,
        setIsVisitFlowActive,
        selectedTooth,
        setSelectedTooth,
      }}
    >
      {children}
    </EncounterContext.Provider>
  );
}

export function useActiveEncounter() {
  const context = useContext(EncounterContext);
  if (!context) {
    throw new Error('useActiveEncounter must be used within an EncounterProvider');
  }
  return context;
}
