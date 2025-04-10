import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  loginWithSocial: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  const loginWithSocial = async (data: any) => {
    setUser(data);
  };

  return (
    <AuthContext.Provider value={{ loginWithSocial }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
