# AI_PROJECT_CONTEXT: Carevia — Clinical Archivist (Master Reference)

This document provides a comprehensive, high-density technical overview of the Carevia project for AI models and developers.

---

## 1. Project Philosophy
**Carevia** is a "Local-First" Clinical Management System (CMS). It prioritizes data privacy, clinical precision, and a premium "High-Performance" aesthetic. It is designed specifically for individual physicians or clinical practices to archive patient data with zero cloud dependency by default.

---

## 2. Technical Stack & Dependencies
- **Runtime**: Node.js
- **Frontend**: React (v18.3), Vite (v5.4)
- **Styling**: Tailwind CSS (v3.4), PostCSS, Vanilla CSS (Design System)
- **Routing**: React Router Dom (v6.26)
- **State Management**: React Context (`PatientsContext.jsx`) + LocalStorage
- **Internationalization**: i18next (ar, en, fr) + RTL support
- **Visualization**: Recharts (Medical trend charts)
- **Backend**: Express.js (v4.21)
- **Database**: Dual-mode (MySQL 8.x via `mysql2` or In-Memory fallback)

---

## 3. Directory Structure Map

### Root Configuration
- `package.json`: Contains scripts (`dev`, `server`, `dev:full` via concurrently).
- `tailwind.config.js`: **Critical.** Defines the "Teal/Navy" design system, custom keyframes (`carevia-float`, `shimmer`, `glow-pulse`), and clinical border radii.
- `index.css`: Defines the CSS Variable design system for Light/Dark modes and "Glassmorphism" component classes (`carevia-glass-card`, `carevia-btn-primary`).

### Core Application
- `main.jsx`: Entry point, wraps `<App />` in `<BrowserRouter>`.
- `App.jsx`: Main router and `<ThemeSync />` provider.
- `AuthPage.jsx`: Combined landing page and Auth UI (Signup/Login).
- `DashboardLayout.jsx`: Main container with Sidebar (Desktop) and Nav Bar (Mobile).
- `PatientsContext.jsx`: Global context manager for `patients` and `followUps`. Syncs to `carevia_patients` in localStorage.

### Pages (`/pages`)
- `OverviewPage.jsx`: Dashboard with KPI StatCards, Critical Alerts, and Activity Summary.
- `PatientDetailPage.jsx`: Full clinical record of a patient, including vitals grid and timeline of follow-ups.
- `PatientEditPage.jsx`: Form to modify demographics and diagnosis.
- `NewPatientPage.jsx`: Wizard for registering new patients.
- `AnalyticsPage.jsx`: Comparative views and population health charts.
- `SettingsPage.jsx`: Language toggle, Theme toggle, Data Export/Import, and Notification preferences.

### Components (`/src/components`)
- `MedicalRecordForm.jsx`: Dynamic form that adapts to "Disease Templates" (Diabetes, Hypertension, etc.).
- `MedicalRecordsSection.jsx`: List view of all visit records for a patient.
- `RecordStatusBadge.jsx`: Color-coded status indicator (Stable, Critical, etc.).
- `Cards.jsx`: UI library containing `StatCard`, `MedicalCard`, `InfoRow`, and `StatusChip`.

### Infrastructure (`/server` & `/src/services`)
- `server/index.js`: Express entry point.
- `server/medicalRecordsStore.js`: Logic to switch between MySQL and Memory. Handles `medical_records` table.
- `src/services/medicalRecordsApi.js`: Frontend fetch wrappers for the backend API.
- `authStorage.js`: **Vital.** Manages `carevia_session` and `carevia_app_settings` in localStorage.

---

## 4. Data Models & Schemas

### Patient Object (Frontend)
```json
{
  "id": "PT-171423... (Date.now())",
  "name": "String",
  "age": "Number",
  "status": "Stable | Critical | Normal | Pending",
  "diagnosis": "String",
  "lastVisit": "YYYY-MM-DD",
  "followUps": [
    { "id": "FU-...", "date": "YYYY-MM-DD", "note": "String" }
  ]
}
```

### Medical Record (Backend/API)
- **Table**: `medical_records`
- **Columns**: `id`, `patient_id`, `disease`, `record_date`, `measurements` (JSON Blob), `notes`, `created_at`.

### App Settings (localStorage)
```json
{
  "language": "en | ar | fr",
  "themeMode": "dark | light",
  "notifyLabResults": "Boolean",
  "notifyAppointments": "Boolean",
  "notifyCriticalAlerts": "Boolean",
  "compactTables": "Boolean",
  "keyboardHints": "Boolean"
}
```

---

## 5. UI/UX & Design Tokens

### Color Palette (CSS Variables)
- **Primary**: Teal (`#0DC8AF`) — Used for actions, progress, and medical symbols.
- **Surface**: Deep Navy (`#08121E`) — Primary dark background.
- **Secondary**: Sky Blue — Used for informational metrics.
- **Tertiary**: Warm Gold — Used for lab results/trending items.

### Key CSS Classes
- `.carevia-glass-card`: Semi-transparent background with `backdrop-filter: blur(12px)`.
- `.carevia-btn-primary`: Gradient teal button with a "shimmer" hover effect.
- `.carevia-mesh-bg`: Complex radial-gradient background used in Hero/Auth pages.

---

## 6. Business Logic Flows

### Authentication
Carevia uses a "Local Auth" simulation. 
- `signUp()` hashes (simulated) and stores user info in `carevia_doctors`. 
- `signIn()` validates against this local array and creates a `carevia_session`.
- *Note*: This is designed for single-user local workstations.

### Internationalization (i18n)
- Configured in `src/i18n/index.js`.
- Uses `LanguageDetector`.
- **Direction Handling**: `SettingsPage.jsx` manually updates `document.documentElement.dir` to `"rtl"` when Arabic is selected.

### Theming
- Initialized in `index.html` (inline script) to prevent flash of unstyled content (FOUC).
- Synchronized via `App.jsx`'s `ThemeSync` component which listens for a `carevia-settings-updated` CustomEvent.

---

## 7. API Endpoints
- `GET /health`: Returns service status and store type (mysql/memory).
- `GET /api/records/:patientId`: Lists all medical records for a specific patient.
- `POST /api/records`: Creates a new record (Disease, Measurements, Notes).
- `GET /api/stats/records?days=N`: Returns count of records in the last N days.

---

## 8. Common Developer Patterns
1. **Adding a Vitals Metric**: Update `src/medical/diseaseConfig.js` to include the field in a specific disease template. `MedicalRecordForm` will auto-render it.
2. **Accessing Global Patient State**: Use `const { patients, addPatient } = usePatients();`.
3. **UI Updates**: All UI elements should use Tailwind classes or the utility components in `Cards.jsx`.

---
*Created for AI consumption to ensure perfect project comprehension.*
