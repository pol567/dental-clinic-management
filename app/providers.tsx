'use client';

import React from 'react';
import { ClinicProvider } from '@/lib/clinic-state';
import { DesignSystemProvider } from '@/design-system/context';
import { PatientProvider, EncounterProvider } from '@/design-system/patient-context';
import { WorkspaceProvider } from '@/design-system/workspace';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DesignSystemProvider>
      <PatientProvider>
        <EncounterProvider>
          <WorkspaceProvider>
            <ClinicProvider>
              {children}
            </ClinicProvider>
          </WorkspaceProvider>
        </EncounterProvider>
      </PatientProvider>
    </DesignSystemProvider>
  );
}
