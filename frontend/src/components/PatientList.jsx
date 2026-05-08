import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadSettings } from "../services/authStorage.js";
import { StatusChip } from "./Cards.jsx";
import { usePatients } from "../PatientsContext.jsx";

export default function PatientList() {
  const navigate = useNavigate();
  const { patients } = usePatients();
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [, setSettingsRev] = useState(0);

  useEffect(() => {
    function onSettings() {
      setSettingsRev((x) => x + 1);
    }
    window.addEventListener("carevia-settings-updated", onSettings);
    return () => window.removeEventListener("carevia-settings-updated", onSettings);
  }, []);

  const filtered = patients.filter((p) =>
    [p.name, p.diagnosis, p.id, p.status].some((v) =>
      String(v).toLowerCase().includes(search.toLowerCase())
    )
  );

  const sorted = [...filtered].sort((a, b) => {
    const av = a[sortKey];
    const bv = b[sortKey];
    if (typeof av === "number" && typeof bv === "number") return sortAsc ? av - bv : bv - av;
    return sortAsc
      ? String(av).localeCompare(String(bv))
      : String(bv).localeCompare(String(av));
  });

  function handleSort(key) {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  function handleExport() {
    const blob = new Blob([JSON.stringify(patients, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `carevia-patients-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const emptyNoData = patients.length === 0;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 p-6 rounded-3xl bg-surface/40 border border-outline-variant/30 shadow-xl">
        <div className="flex-1 space-y-4">
           <div>
              <h3 className="text-[11px] font-black text-outline uppercase tracking-[0.2em] mb-1">Clinical Registry</h3>
              <p className="text-xl font-black text-on-surface">Active Patient Records</p>
           </div>
           
           <div className="flex items-center gap-3 px-4 py-2 bg-surface-container-low/60 border border-outline-variant/30 rounded-2xl w-full max-w-md focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all duration-300">
              <span className="material-symbols-outlined text-outline text-[20px]">search</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, ID, or diagnosis..."
                className="w-full bg-transparent text-sm text-on-surface-variant placeholder:text-outline outline-none font-body py-1.5"
              />
              {search && (
                <button type="button" onClick={() => setSearch("")} className="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              )}
           </div>
        </div>

        <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              disabled={patients.length === 0}
              className="h-12 px-5 rounded-2xl border border-outline-variant/30 bg-surface-container-low/40 text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition-all text-xs font-bold uppercase tracking-widest disabled:opacity-30 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export Data
            </button>
        </div>
      </div>

      {/* Registry List Redesign (Cards instead of Table) */}
      <div className="space-y-3">
         {sorted.length > 0 ? (
           sorted.map((patient) => (
              <div
                key={patient.id}
                onClick={() => navigate(`/dashboard/patients/${patient.id}`)}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-surface/30 border border-outline-variant/20 hover:bg-surface/60 hover:border-primary/30 transition-all cursor-pointer shadow-sm relative overflow-hidden"
              >
                {/* Status indicator strip */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                   patient.status === 'Critical' ? 'bg-rose-500' : 
                   patient.status === 'Stable' ? 'bg-teal-500' : 'bg-amber-500'
                } opacity-40 group-hover:opacity-100 transition-opacity`}></div>

                 <div className="flex items-center gap-5 relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-surface border border-outline-variant/40 flex items-center justify-center text-on-surface font-black text-sm shadow-inner group-hover:scale-105 transition-transform shrink-0">
                       {patient.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                       <div className="flex items-center gap-3 mb-1">
                          <span className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">{patient.name}</span>
                          <span className="text-[10px] font-mono text-outline uppercase tracking-widest">{patient.id}</span>
                       </div>
                       <p className="text-xs text-on-surface-variant truncate max-w-[200px] sm:max-w-xs">{patient.diagnosis || "General Admission"}</p>
                    </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-8 relative z-10">
                    <div className="flex flex-col items-center sm:items-end">
                       <span className="text-[9px] font-black text-outline uppercase tracking-[0.15em] mb-0.5">Last Encounter</span>
                       <span className="text-xs font-bold text-on-surface-variant">{patient.lastVisit}</span>
                    </div>
                                      <div className="flex flex-col items-center sm:items-end">
                       <span className="text-[9px] font-black text-outline uppercase tracking-[0.15em] mb-0.5">Age</span>
                       <span className="text-xs font-bold text-on-surface-variant">{patient.age}y</span>
                    </div>

                   <div className="flex items-center gap-6">
                      <StatusChip status={patient.status} />
                                            <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="w-9 h-9 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-primary/50 transition-all"
                            title="Clinical Overview"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/patients/${patient.id}`);
                            }}
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                          <button
                            type="button"
                            className="w-9 h-9 rounded-xl bg-surface-container-high/60 border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all"
                            title="Modify Record"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/dashboard/patients/${patient.id}/edit`);
                            }}
                          >
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                       </div>
                   </div>
                </div>
             </div>
           ))
         ) : (
            <div className="p-20 text-center bg-surface/20 rounded-3xl border border-dashed border-outline-variant/40">
               <span className="material-symbols-outlined text-outline/20 text-[48px] mb-4">
                 {emptyNoData ? "person_add" : "person_search"}
               </span>
               <p className="text-sm font-bold text-outline">
                 {emptyNoData
                   ? "No patient records found in your registry."
                   : "No patients match your search criteria."}
               </p>
               <p className="text-xs text-outline/60 mt-2">
                  {emptyNoData ? "Start by adding a new record to your workspace." : "Try clearing your filters or search keywords."}
               </p>
            </div>
         )}
      </div>

      <div className="px-6 py-4 flex items-center justify-between gap-4 flex-wrap border-t border-outline-variant/10">
        <p className="text-[10px] font-black text-outline uppercase tracking-widest">
          Active Registry:{" "}
          <span className="text-on-surface">{sorted.length} Records displayed</span>
        </p>
      </div>
    </div>
  );
}
