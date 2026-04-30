import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { StatusChip, MedicalCard, InfoRow } from "../components/Cards.jsx";
import { usePatients } from "../PatientsContext.jsx";
import PageShell from "./PageShell.jsx";
import MedicalRecordsSection from "../components/MedicalRecordsSection.jsx";

export default function PatientDetailPage() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patients, addFollowUp } = usePatients();
  const patient = patients.find((p) => p.id === patientId);

  const [fuDate, setFuDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [fuNote, setFuNote] = useState("");
  const [fuError, setFuError] = useState("");

  if (!patient) {
    return (
      <PageShell title="Patient not found" description="This record may have been removed or the ID is incorrect.">
        <Link to="/dashboard/patients" className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 w-max">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Return to Registry
        </Link>
      </PageShell>
    );
  }

  function handleAddFollowUp(e) {
    e.preventDefault();
    setFuError("");
    if (!fuNote.trim()) {
      setFuError("Enter a note for this follow-up.");
      return;
    }
    addFollowUp(patient.id, { date: fuDate, note: fuNote });
    setFuNote("");
    setFuDate(new Date().toISOString().slice(0, 10));
  }

  const followUps = [...(patient.followUps || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10 space-y-8">
      
      {/* Redesigned Header: Name + Condition + Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Accent glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-black text-2xl shadow-lg border border-white/10 shrink-0">
            {patient.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
             <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight truncate">{patient.name}</h1>
                <StatusChip status={patient.status} />
             </div>
             <p className="text-base text-slate-400 font-medium truncate max-w-xl">
                {patient.diagnosis || "No primary diagnosis recorded"}
             </p>
             <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-2 flex items-center gap-2">
                <span>Registry ID: {patient.id}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span>Age: {patient.age}</span>
                <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                <span className="text-teal-500">Last Encounter: {patient.lastVisit}</span>
             </p>
          </div>
        </div>

        <div className="flex items-center gap-3 relative z-10">
           <Link to="/dashboard/patients" className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all shadow-sm" title="Back to Registry">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
           </Link>
           <Link to={`/dashboard/patients/${patient.id}/edit`} className="h-12 px-6 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 hover:bg-teal-500/20 transition-all font-bold text-sm flex items-center gap-2 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">edit</span>
              Edit Record
           </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Vitals & Clinical Context */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Charts & Vitals Grid Placeholder/Redesign */}
          <section className="space-y-4">
             <div className="flex items-center justify-between mb-2 px-2">
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                   <span className="w-1.5 h-4 rounded-full bg-teal-500"></span>
                   Primary Vitals
                </h2>
                <button className="text-[10px] font-bold text-teal-400/70 hover:text-teal-400 uppercase tracking-widest transition-colors flex items-center gap-1">
                   <span className="material-symbols-outlined text-[14px]">add_chart</span>
                   New Measurement
                </button>
             </div>
             
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-sm group hover:border-teal-500/30 transition-all">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center">
                         <span className="material-symbols-outlined text-teal-400 text-[18px]">favorite</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Blood Pressure</span>
                   </div>
                   <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">128/84</span>
                      <span className="text-xs font-bold text-slate-500">mmHg</span>
                   </div>
                   <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full"></div>
                   </div>
                </div>
                
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-sm group hover:border-rose-500/30 transition-all">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                         <span className="material-symbols-outlined text-rose-400 text-[18px]">water_drop</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Glucose Level</span>
                   </div>
                   <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-rose-300">142</span>
                      <span className="text-xs font-bold text-slate-500">mg/dL</span>
                   </div>
                   <div className="mt-3 flex items-center gap-1.5 font-bold text-[10px] text-rose-400">
                      <span className="material-symbols-outlined text-[14px]">trending_up</span>
                      <span>High (Elevated)</span>
                   </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-sm group hover:border-sky-500/30 transition-all">
                   <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                         <span className="material-symbols-outlined text-sky-400 text-[18px]">monitor_weight</span>
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Weight Status</span>
                   </div>
                   <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-white">78.5</span>
                      <span className="text-xs font-bold text-slate-500">kg</span>
                   </div>
                   <p className="mt-3 text-[10px] font-bold text-slate-500">-1.2kg since last visit</p>
                </div>
             </div>
          </section>

          {/* Medical Records Component below */}
          <MedicalRecordsSection patientId={patient.id} />
        </div>

        {/* Right Column: Follow-ups & Summary */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Clinical Info Card */}
          <MedicalCard title="Clinical Summary" icon="info" accent="primary">
            <div className="bg-slate-950/40 rounded-xl p-4 space-y-1">
              <InfoRow label="Patient Age" value={`${patient.age} years`} />
              <InfoRow label="Registry Status" value={patient.status} />
              <InfoRow label="Latest Encounter" value={patient.lastVisit} mono />
              <div className="pt-4">
                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1.5">Diagnosis Archive</p>
                 <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-teal-500/30 pl-3 py-1">
                    "{patient.diagnosis || "No detailed notes provided for this record."}"
                 </p>
              </div>
            </div>
          </MedicalCard>

          {/* Follow-up Section */}
          <div className="bg-slate-900/40 rounded-2xl p-6 sm:p-8 border border-slate-800">
            <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-teal-400 text-[20px]">event_repeat</span>
              Add Clinical Follow-up
            </h3>
            <form onSubmit={handleAddFollowUp} className="space-y-5">
              {fuError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {fuError}
                </div>
              )}
              <div className="space-y-1.5">
                <label htmlFor="fu-date" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Encounter Date
                </label>
                <input
                  id="fu-date"
                  type="date"
                  value={fuDate}
                  onChange={(e) => setFuDate(e.target.value)}
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/40 outline-none transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="fu-note" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                  Clinical Observation
                </label>
                <textarea
                  id="fu-note"
                  rows={3}
                  value={fuNote}
                  onChange={(e) => { setFuNote(e.target.value); setFuError(""); }}
                  placeholder="Summarize follow-up findings, medication adjustments..."
                  className="w-full bg-slate-950/60 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500/40 outline-none transition-all resize-none min-h-[5rem]"
                />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-teal-500/10 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Follow-up
              </button>
            </form>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
             <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">
                Timeline History ({followUps.length})
             </h3>
             {followUps.length === 0 ? (
               <div className="p-8 text-center bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                  <span className="material-symbols-outlined text-slate-800 text-[32px] mb-2">history</span>
                  <p className="text-xs text-slate-600">No follow-up entries yet.</p>
               </div>
             ) : (
               <div className="space-y-4">
                  {followUps.map((fu, idx) => (
                    <div
                      key={fu.id}
                      className="relative pl-8 pb-4 last:pb-0"
                    >
                      {/* Line connector */}
                      {idx !== followUps.length - 1 && (
                        <div className="absolute left-[7px] top-[24px] bottom-0 w-[2px] bg-slate-800"></div>
                      )}
                      {/* Node */}
                      <div className="absolute left-0 top-[6px] w-[16px] h-[16px] rounded-full border-2 border-teal-500/40 bg-[#060f1a] shadow-[0_0_8px_rgba(20,184,166,0.2)]"></div>
                      
                      <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 hover:bg-slate-900/60 transition-colors">
                        <p className="text-[10px] font-black text-teal-500/80 mb-2 font-mono uppercase tracking-widest">{fu.date}</p>
                        <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">{fu.note}</p>
                      </div>
                    </div>
                  ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
