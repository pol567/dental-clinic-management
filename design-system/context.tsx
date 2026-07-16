'use client';

import React, { createContext, useContext } from 'react';
import { densitySpacing, SpacingTokens } from './spacing';
import { colors } from './colors';
import { radius } from './radius';
import { typography } from './typography';
import { shadows } from './shadows';
import { zIndex } from './zIndex';
import { motionConfig } from './motion';

interface DesignSystemContextType {
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
  children
}: {
  children: React.ReactNode;
}) {
  const value: DesignSystemContextType = {
    spacing: densitySpacing,
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
