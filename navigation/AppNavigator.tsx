import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import RecordsPage from "../pages/RecordsPage";
import FHIRIntegrationPage from "../pages/FHIRIntegrationPage";
import AIPage from "../pages/AIPage";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
  Records: undefined;
  FHIR: undefined;
  AI: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginPage} />
      <Stack.Screen name="Home" component={HomePage} />
      <Stack.Screen name="Profile" component={ProfilePage} />
      <Stack.Screen name="Records" component={RecordsPage} />
      <Stack.Screen name="FHIR" component={FHIRIntegrationPage} />
      <Stack.Screen name="AI" component={AIPage} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
