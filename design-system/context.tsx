'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { DensityMode, densitySpacing, SpacingTokens } from './spacing';
import { colors } from './colors';
import { radius } from './radius';
import { typography } from './typography';
import { shadows } from './shadows';
import { zIndex } from './zIndex';
import { motionConfig } from './motion';

interface DesignSystemContextType {
  density: DensityMode;
  setDensity: (mode: DensityMode) => void;
  spacing: SpacingTokens;
  colors: typeof colors;
  radius: typeof radius;
  typography: typeof typography;
  shadows: typeof shadows;
  zIndex: typeof zIndex;
  motion: typeof motionConfig;
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined);

export function DesignSystemProvider({
  children,
  defaultDensity = 'comfortable'
}: {
  children: React.ReactNode;
  defaultDensity?: DensityMode;
}) {
  const [density, setDensityState] = useState<DensityMode>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('clinic-density') as DensityMode;
      if (stored && (stored === 'compact' || stored === 'comfortable' || stored === 'touch')) {
        return stored;
      }
    }
    return defaultDensity;
  });

  const setDensity = (mode: DensityMode) => {
    setDensityState(mode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('clinic-density', mode);
    }
  };

  const value: DesignSystemContextType = {
    density,
    setDensity,
    spacing: densitySpacing[density],
    colors,
    radius,
    typography,
    shadows,
    zIndex,
    motion: motionConfig,
  };

  return (
    <DesignSystemContext.Provider value={value}>
      {children}
    </DesignSystemContext.Provider>
  );
}

export function useDesignSystem() {
  const context = useContext(DesignSystemContext);
  if (!context) {
    throw new Error('useDesignSystem must be used within a DesignSystemProvider');
  }
  return context;
}
