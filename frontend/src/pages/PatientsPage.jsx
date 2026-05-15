import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PatientList from "../components/PatientList.jsx";
import PageShell from "./PageShell.jsx";

export default function PatientsPage() {
  const { t } = useTranslation();
  return (
    <PageShell
      title={t("patients.title", "Patients")}
      description={t("patients.description", "Search, sort, and export your registry. Add records with the button below.")}
    >
      <div className="flex justify-end">
        <Link to="/dashboard/patients/new" className="carevia-btn-primary">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          {t("patients.addPatient", "Add patient")}
        </Link>
      </div>

      <PatientList />
    </PageShell>
  );
}
