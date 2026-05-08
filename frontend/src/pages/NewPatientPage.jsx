import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePatients } from "../PatientsContext.jsx";
import PageShell from "./PageShell.jsx";

const STATUSES = ["Active", "Stable", "Pending", "Critical", "Discharged"];

export default function NewPatientPage() {
  const navigate = useNavigate();
  const { addPatient } = usePatients();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [lastVisit, setLastVisit] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState("Active");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const n = name.trim();
    const a = parseInt(age, 10);
    const d = diagnosis.trim();
    if (!n || !d || Number.isNaN(a) || a < 0 || a > 150) {
      setError("Please enter a valid name, age, and diagnosis.");
      return;
    }
    addPatient({
      name: n,
      age: a,
      diagnosis: d,
      lastVisit,
      status,
    });
    navigate("/dashboard/patients", { replace: true });
  }

  const inputCls = "w-full bg-surface-container-low/60 border border-outline-variant/30 rounded-2xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all placeholder:text-outline";
  const labelCls = "block text-[10px] font-black text-on-surface-variant uppercase tracking-widest ml-1 mb-1.5";

  return (
    <PageShell
      title="Create Medical Record"
      description="All data is stored locally in your clinical workspace."
    >
      <div className="max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-surface/40 border border-outline-variant/30 p-6 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden"
        >
          {/* Subtle decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl" />

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 font-bold flex items-center gap-2 animate-pulse">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="np-name" className={labelCls}>
              Patient Full Name
            </label>
            <input
              id="np-name"
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(""); }}
              className={inputCls}
              placeholder="e.g. Ahmad Al-Masri"
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="np-age" className={labelCls}>
                Age (Years)
              </label>
              <input
                id="np-age"
                type="number"
                min={0}
                max={150}
                value={age}
                onChange={(e) => { setAge(e.target.value); setError(""); }}
                className={inputCls}
                placeholder="0-150"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="np-visit" className={labelCls}>
                First Admission Date
              </label>
              <input
                id="np-visit"
                type="date"
                value={lastVisit}
                onChange={(e) => setLastVisit(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="np-dx" className={labelCls}>
              Primary Diagnosis / Clinical Notes
            </label>
            <textarea
              id="np-dx"
              rows={3}
              value={diagnosis}
              onChange={(e) => { setDiagnosis(e.target.value); setError(""); }}
              className={`${inputCls} resize-none`}
              placeholder="Enter initial clinical overview..."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="np-status" className={labelCls}>
              Clinical Status
            </label>
            <div className="relative">
              <select
                id="np-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`${inputCls} appearance-none`}
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s} className="bg-surface">{s}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">expand_more</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <button type="submit" className="flex-1 sm:flex-none px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-lg shadow-teal-500/20 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
              Register Patient
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard/patients")}
              className="flex-1 sm:flex-none px-8 py-4 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface font-black text-xs uppercase tracking-widest rounded-2xl transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
        
        {/* Info Box */}
        <div className="mt-8 p-6 bg-teal-500/5 border border-teal-500/10 rounded-3xl flex items-start gap-4">
           <div className="w-10 h-10 rounded-xl bg-teal-400/10 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-teal-400 text-[20px]">security</span>
           </div>
            <div>
              <p className="text-sm font-bold text-on-surface">HIPAA Data Safety</p>
              <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                 All medical records created here are encrypted and stored in your local browser storage. Carevia never uploads patient data to any cloud or external server.
              </p>
            </div>
        </div>
      </div>
    </PageShell>
  );
}
