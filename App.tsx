// App.tsx
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppNavigator from "./navigation/AppNavigator";
import { ToastProvider } from "./contexts/ToastContext";
import { AuthProvider } from "./contexts/AuthContext";
import { MedicalRecordProvider } from "./contexts/MedicalRecordContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MedicalRecordProvider>
          <AccessibilityProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </AccessibilityProvider>
        </MedicalRecordProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

