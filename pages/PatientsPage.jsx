import React from "react";
import { Link } from "react-router-dom";
import PatientList from "../PatientList.jsx";
import PageShell from "./PageShell.jsx";

export default function PatientsPage() {
  return (
    <PageShell
      title="Patients"
      description="Search, sort, and export your registry. Add records with the button below."
    >
      <div className="flex justify-end">
        <Link to="/dashboard/patients/new" className="carevia-btn-primary">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Add patient
        </Link>
      </div>

      <PatientList />
    </PageShell>
  );
}
