import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { usePatients } from "../PatientsContext.jsx";
import PageShell from "./PageShell.jsx";

const STATUSES = ["Active", "Stable", "Pending", "Critical", "Discharged"];

export default function PatientEditPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patients, updatePatient } = usePatients();
  const patient = patients.find((p) => p.id === patientId);

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [lastVisit, setLastVisit] = useState("");
  const [status, setStatus] = useState("Active");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patient) return;
    setName(patient.name);
    setAge(String(patient.age));
    setDiagnosis(patient.diagnosis);
    setLastVisit(patient.lastVisit);
    setStatus(patient.status);
  }, [patient]);

  if (!patient) {
    return (
      <PageShell title="Patient not found" description="This record may have been removed.">
        <Link to="/dashboard/patients" className="carevia-btn-primary inline-flex">
          Back to patients
        </Link>
      </PageShell>
    );
  }

  function handleSubmit(e) {
    e.preventDefault();
    const n = name.trim();
    const a = parseInt(age, 10);
    const d = diagnosis.trim();
    if (!n || !d || Number.isNaN(a) || a < 0 || a > 150) {
      setError("Please enter a valid name, age, and diagnosis.");
      return;
    }
    updatePatient(patient.id, {
      name: n,
      age: a,
      diagnosis: d,
      lastVisit,
      status,
    });
    navigate(`/dashboard/patients/${patient.id}`, { replace: true });
  }

  return (
    <PageShell
      title="Edit patient"
      description={`Updating ${patient.id}`}
    >
      <div className="flex gap-3 mb-6">
        <Link to={`/dashboard/patients/${patient.id}`} className="carevia-btn-secondary">
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          View record
        </Link>
        <Link to="/dashboard/patients" className="carevia-btn-secondary">
          Cancel
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-6 carevia-glass-card p-6 sm:p-8"
      >
        {error && (
          <div className="flex items-center gap-2 text-error text-xs font-medium">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="ep-name" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Full name
          </label>
          <input
            id="ep-name"
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            className="w-full px-4 py-3 carevia-glass-subtle rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="ep-age" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Age
            </label>
            <input
              id="ep-age"
              type="number"
              min={0}
              max={150}
              value={age}
              onChange={(e) => { setAge(e.target.value); setError(""); }}
              className="w-full px-4 py-3 carevia-glass-subtle rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="ep-visit" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
              Last visit
            </label>
            <input
              id="ep-visit"
              type="date"
              value={lastVisit}
              onChange={(e) => setLastVisit(e.target.value)}
              className="w-full px-4 py-3 carevia-glass-subtle rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="ep-dx" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Diagnosis / notes
          </label>
          <input
            id="ep-dx"
            type="text"
            value={diagnosis}
            onChange={(e) => { setDiagnosis(e.target.value); setError(""); }}
            className="w-full px-4 py-3 carevia-glass-subtle rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="ep-status" className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Status
          </label>
          <select
            id="ep-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-4 py-3 carevia-glass-subtle rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="carevia-btn-primary">
            Save changes
          </button>
        </div>
      </form>
    </PageShell>
  );
}
