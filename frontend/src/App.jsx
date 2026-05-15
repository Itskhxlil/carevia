import React, { useLayoutEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { applyThemeFromSettings } from "./services/themeSync.js";
import LandingPage from "./components/landing/LandingPage.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";
import OverviewPage from "./pages/OverviewPage.jsx";
import PatientsPage from "./pages/PatientsPage.jsx";
import NewPatientPage from "./pages/NewPatientPage.jsx";
import PatientDetailPage from "./pages/PatientDetailPage.jsx";
import PatientEditPage from "./pages/PatientEditPage.jsx";
import AppointmentsPage from "./pages/AppointmentsPage.jsx";
import RecordsPage from "./pages/RecordsPage.jsx";
import AnalyticsPage from "./pages/AnalyticsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";

function ThemeSync() {
  useLayoutEffect(() => {
    applyThemeFromSettings();
    function onSettings() {
      applyThemeFromSettings();
    }
    window.addEventListener("carevia-settings-updated", onSettings);
    return () => window.removeEventListener("carevia-settings-updated", onSettings);
  }, []);
  return null;
}

export default function App() {
  return (
    <>
      <ThemeSync />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ai-analysis" element={<Navigate to="/dashboard/analytics" replace />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="overview" replace />} />
          <Route path="overview" element={<OverviewPage />} />
          <Route path="patients/new" element={<NewPatientPage />} />
          <Route path="patients/:patientId/edit" element={<PatientEditPage />} />
          <Route path="patients/:patientId" element={<PatientDetailPage />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="records" element={<RecordsPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
