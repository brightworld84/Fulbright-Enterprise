import React, { createContext, useContext, useState } from "react";

interface MedicalRecordContextType {
  showAddRecordModal: boolean;
  setShowAddRecordModal: (value: boolean) => void;
  selectedRecordId: string | null;
  setSelectedRecordId: (id: string | null) => void;
}

const MedicalRecordContext = createContext<MedicalRecordContextType | undefined>(undefined);

export const MedicalRecordProvider = ({ children }: { children: React.ReactNode }) => {
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  return (
    <MedicalRecordContext.Provider
      value={{
        showAddRecordModal,
        setShowAddRecordModal,
        selectedRecordId,
        setSelectedRecordId,
      }}
    >
      {children}
    </MedicalRecordContext.Provider>
  );
};

export const useMedicalRecord = () => {
  const context = useContext(MedicalRecordContext);
  if (!context) {
    throw new Error("useMedicalRecord must be used within a MedicalRecordProvider");
  }
  return context;
};
