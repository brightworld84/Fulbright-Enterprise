import React, { createContext, useContext, useState, ReactNode } from "react";

type AccessibilityOptions = {
  highContrast: boolean;
  largeText: boolean;
  screenReaderOptimized: boolean;
  reducedMotion: boolean;
};

type AccessibilityContextType = {
  options: AccessibilityOptions;
  toggleHighContrast: () => void;
  toggleLargeText: () => void;
  toggleScreenReaderOptimized: () => void;
  toggleReducedMotion: () => void;
  resetAccessibilityOptions: () => void;
};

const defaultOptions: AccessibilityOptions = {
  highContrast: false,
  largeText: false,
  screenReaderOptimized: false,
  reducedMotion: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider = ({ children }: { children: ReactNode }) => {
  const [options, setOptions] = useState<AccessibilityOptions>(defaultOptions);

  const toggleOption = (key: keyof AccessibilityOptions) => {
    setOptions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const resetAccessibilityOptions = () => setOptions(defaultOptions);

  return (
    <AccessibilityContext.Provider
      value={{
        options,
        toggleHighContrast: () => toggleOption("highContrast"),
        toggleLargeText: () => toggleOption("largeText"),
        toggleScreenReaderOptimized: () => toggleOption("screenReaderOptimized"),
        toggleReducedMotion: () => toggleOption("reducedMotion"),
        resetAccessibilityOptions,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error("useAccessibility must be used within AccessibilityProvider");
  }
  return context;
};
