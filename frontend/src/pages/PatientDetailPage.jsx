import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { StatusChip, MedicalCard, InfoRow } from "../components/Cards.jsx";
import { usePatients } from "../PatientsContext.jsx";
import PageShell from "./PageShell.jsx";
import MedicalRecordsSection from "../components/MedicalRecordsSection.jsx";
import { fetchMedicalRecords } from "../services/medicalRecordsApi.js";

import { evaluateMeasurements } from "../medical/evaluateMeasurements.js";

/* ── config ── */
const VITAL_CONFIGS = {
  cardiology: [
    { key: "blood_pressure", label: "Blood Pressure", icon: "favorite", color: "primary", unit: "mmHg" },
    { key: "heart_rate", label: "Heart Rate", icon: "ecg", color: "rose-400", unit: "bpm" },
    { key: "cholesterol", label: "Cholesterol", icon: "science", color: "amber-400", unit: "mg/dL" },
    { key: "weight", label: "Weight", icon: "monitor_weight", color: "sky-400", unit: "kg" },
    { key: "ecg_notes", label: "ECG Notes", icon: "monitor_heart", color: "violet-400", unit: "" }
  ],
  diabetes: [
    { key: "glucose", label: "Glucose", icon: "water_drop", color: "rose-400", unit: "mg/dL" },
    { key: "HbA1c", label: "HbA1c", icon: "biotech", color: "violet-400", unit: "%" },
    { key: "weight", label: "Weight", icon: "monitor_weight", color: "sky-400", unit: "kg" },
    { key: "insulin_dosage", label: "Insulin", icon: "syringe", color: "teal-400", unit: "units" }
  ],
  pulmonology: [
    { key: "oxygen_saturation", label: "SpO2", icon: "air", color: "sky-400", unit: "%" },
    { key: "respiratory_rate", label: "Resp. Rate", icon: "lungs", color: "teal-400", unit: "bpm" },
    { key: "peak_flow", label: "Peak Flow", icon: "speed", color: "amber-400", unit: "L/min" },
    { key: "temperature", label: "Temp", icon: "thermometer", color: "orange-400", unit: "°C" }
  ],
  nephrology: [
    { key: "creatinine", label: "Creatinine", icon: "science", color: "violet-400", unit: "mg/dL" },
    { key: "urea", label: "Urea", icon: "bloodtype", color: "rose-400", unit: "mg/dL" },
    { key: "gfr", label: "GFR", icon: "fluid_balance", color: "sky-400", unit: "mL/min" },
    { key: "blood_pressure", label: "BP", icon: "favorite", color: "primary", unit: "mmHg" }
  ],
  general: [
    { key: "temperature", label: "Temperature", icon: "thermometer", color: "orange-400", unit: "°C" },
    { key: "weight", label: "Weight", icon: "monitor_weight", color: "sky-400", unit: "kg" },
    { key: "blood_pressure", label: "Blood Pressure", icon: "favorite", color: "primary", unit: "mmHg" },
    { key: "heart_rate", label: "Heart Rate", icon: "ecg", color: "rose-400", unit: "bpm" }
  ]
};

/* ── helpers ── */
function extractLatest(records, key) {
  if (!records || records.length === 0) return null;
  for (const rec of records) {
    const m = rec.measurements || {};
    if (m[key] !== undefined && m[key] !== null && m[key] !== "") {
      return { value: m[key], date: rec.date };
    }
  }
  return null;
}

function VitalCard({ icon, iconColor, bgColor, label, value, unit, sub, subColor }) {
  const { t } = useTranslation();
  const displayValue = value === true ? t("common.Present", "Present") : value === false ? t("common.Absent", "Absent") : value;
  return (
    <div className={`p-5 rounded-2xl bg-surface/60 border border-outline-variant/80 shadow-sm hover:border-${iconColor}/30 transition-all group`}>
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-8 h-8 rounded-lg ${bgColor} flex items-center justify-center`}>
          <span className={`material-symbols-outlined text-${iconColor} text-[18px]`}>{icon}</span>
        </div>
        <span className="text-[10px] font-black text-outline uppercase tracking-widest">{label}</span>
      </div>
      {displayValue ? (
        <>
          <div className="flex items-baseline gap-1">
            <span className={`text-xl font-black text-${iconColor} truncate max-w-full`} title={String(displayValue)}>
              {String(displayValue)}
            </span>
            {unit && <span className="text-xs font-bold text-outline">{unit}</span>}
          </div>
          {sub && <p className={`mt-2 text-[9px] font-bold text-${subColor || "outline/60"}`}>{sub}</p>}
        </>
      ) : (
        <p className="text-sm text-outline/40 italic">{t("common.noData")}</p>
      )}
    </div>
  );
}

export default function PatientDetailPage() {
  const { t } = useTranslation();
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patients, updatePatient, addFollowUp } = usePatients();
  const patient = patients.find((p) => p.id === patientId);

  const [fuDate, setFuDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [fuNote, setFuNote] = useState("");
  const [fuError, setFuError] = useState("");
  const [records, setRecords] = useState([]);
  const [recordsRev, setRecordsRev] = useState(0); 

  const loadRecords = useCallback(async () => {
    if (!patientId || !patient) return;
    try {
      const list = await fetchMedicalRecords(patientId);
      const sortedList = Array.isArray(list) ? [...list].sort((a, b) => String(b.date).localeCompare(String(a.date))) : [];
      setRecords(sortedList);

      // Auto-update status based on latest record
      if (sortedList.length > 0) {
        const latest = sortedList[0];
        const { status } = evaluateMeasurements(latest.measurements);
        if (patient.status !== status) {
          updatePatient(patient.id, { status });
        }
      }
    } catch (err) {
      console.error("Failed to load records", err);
      setRecords([]);
    }
  }, [patientId, patient?.status, updatePatient]);

  useEffect(() => { loadRecords(); }, [loadRecords, recordsRev]);

  if (!patient) {
    return (
      <PageShell title={t("patientDetail.notFound")} description={t("patientDetail.notFoundDesc")}>
        <Link to="/dashboard/patients" className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface px-6 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 w-max">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          {t("patientDetail.back")}
        </Link>
      </PageShell>
    );
  }

  const vCards = VITAL_CONFIGS[patient.diseaseType] || VITAL_CONFIGS.general;

  function handleAddFollowUp(e) {
    e.preventDefault();
    setFuError("");
    if (!fuNote.trim()) { setFuError(t("common.error")); return; }
    addFollowUp(patient.id, { date: fuDate, note: fuNote });
    setFuNote("");
    setFuDate(new Date().toISOString().slice(0, 10));
  }

  const followUps = [...(patient.followUps || [])].sort((a, b) => String(b.date).localeCompare(String(a.date)));

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10 space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-surface/40 border border-outline-variant/80 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-black text-2xl shadow-lg border border-white/10 shrink-0">
            {patient.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 mb-1.5 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-black text-on-surface tracking-tight leading-tight truncate">{patient.name}</h1>
              <StatusChip status={t(`status.${patient.status}`)} />
            </div>
            <p className="text-base text-on-surface-variant font-medium truncate max-w-xl">{patient.diagnosis || t("medical.diseases.general")}</p>
            <p className="text-[10px] font-black text-outline uppercase tracking-widest mt-2 flex items-center gap-2 flex-wrap">
              <span>{t("patients.colId")}: {patient.id}</span>
              <span className="w-1 h-1 rounded-full bg-outline/30" />
              {patient.gender && <><span>{t(`common.${patient.gender}`, patient.gender)}</span><span className="w-1 h-1 rounded-full bg-outline/30" /></>}
              <span>{t("patientDetail.age")}: {patient.age}</span>
              <span className="w-1 h-1 rounded-full bg-outline/30" />
              {patient.bloodType && <><span className="text-rose-400">🩸 {patient.bloodType}</span><span className="w-1 h-1 rounded-full bg-outline/30" /></>}
              <span className="text-primary">{t("patients.colLastVisit")}: {patient.lastVisit}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Link to="/dashboard/patients" className="w-12 h-12 rounded-2xl bg-surface-container-high/60 border border-outline-variant/80 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-primary/50 transition-all shadow-sm" title={t("patientDetail.back")}>
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </Link>
          <Link to={`/dashboard/patients/${patient.id}/edit`} className="h-12 px-6 rounded-2xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all font-bold text-sm flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">edit</span>
            {t("common.edit")}
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* ── Left Column ── */}
        <div className="lg:col-span-8 space-y-8">

          {/* Vital Cards — Real Data */}
          <section className="space-y-4">
            <div className="flex items-center justify-between mb-2 px-2">
              <h2 className="text-xs font-black text-outline uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-4 rounded-full bg-primary" />
                {t("medical.vitals")}
              </h2>
              {records.length > 0 && (
                <span className="text-[10px] text-outline/60 font-bold">{t("patientDetail.autoDetected", "Auto-detected from latest record")}</span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {vCards.map((v) => {
                const latest = extractLatest(records, v.key);
                return (
                  <VitalCard
                    key={v.key}
                    icon={v.icon}
                    iconColor={v.color}
                    bgColor={`bg-${v.color}/10`}
                    label={t(`medical.fields.${v.key}`, v.label)}
                    value={latest?.value}
                    unit={v.unit}
                    sub={latest ? `${t("common.updated", "Updated")}: ${latest.date}` : null}
                  />
                );
              })}
            </div>
          </section>

          {/* Medical Records */}
          <MedicalRecordsSection
            patientId={patient.id}
            onRecordAdded={() => setRecordsRev(v => v + 1)}
          />
        </div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-4 space-y-8">

          {/* Clinical Summary */}
          <MedicalCard title={t("patientDetail.clinicalSummary")} icon="info" accent="primary">
            <div className="bg-surface-container-low/40 rounded-xl p-4 space-y-1">
              <InfoRow label={t("patientDetail.age")} value={`${patient.age}`} />
              {patient.gender && <InfoRow label={t("patientDetail.gender")} value={t(`common.${patient.gender}`, patient.gender)} />}
              {patient.bloodType && <InfoRow label={t("patientDetail.bloodType")} value={patient.bloodType} />}
              {patient.phone && <InfoRow label={t("common.phone", "Phone")} value={patient.phone} />}
              {patient.email && <InfoRow label={t("common.email", "Email")} value={patient.email} />}
              <InfoRow label={t("common.status")} value={t(`status.${patient.status}`)} />
              <InfoRow label={t("patients.colLastVisit")} value={patient.lastVisit} mono />
              {patient.assignedDoctor && <InfoRow label={t("common.physician")} value={patient.assignedDoctor} />}
              {patient.diseaseType && <InfoRow label={t("medical.disease")} value={t(`medical.diseases.${patient.diseaseType.toLowerCase()}`)} />}
              {patient.address && <InfoRow label={t("patientDetail.address")} value={patient.address} />}
            </div>
            {patient.diagnosis && (
              <div className="pt-4">
                <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1.5">{t("patients.colDiagnosis")}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed italic border-s-2 border-primary/30 ps-3 py-1">
                  {patient.diagnosis}
                </p>
              </div>
            )}
            {patient.medicalHistory && (
              <div className="pt-3">
                <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1.5">{t("patientDetail.medicalHistory")}</p>
                <p className="text-sm text-on-surface-variant leading-relaxed">{patient.medicalHistory}</p>
              </div>
            )}
          </MedicalCard>

          {/* Allergies & Meds */}
          {(patient.allergies || patient.currentMedications) && (
            <MedicalCard title={t("patientDetail.medicalHistory")} icon="medication" accent="amber">
              {patient.allergies && (
                <div className="mb-3">
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">{t("patients.allergies")}</p>
                  <p className="text-sm text-on-surface-variant">{patient.allergies}</p>
                </div>
              )}
              {patient.currentMedications && (
                <div>
                  <p className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">{t("patients.currentMedications")}</p>
                  <p className="text-sm text-on-surface-variant">{patient.currentMedications}</p>
                </div>
              )}
            </MedicalCard>
          )}

          {/* Emergency Contact */}
          {(patient.emergencyContact || patient.emergencyPhone) && (
            <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/10">
              <p className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">emergency</span>
                {t("patientDetail.emergency")}
              </p>
              {patient.emergencyContact && <p className="text-sm font-bold text-on-surface">{patient.emergencyContact}</p>}
              {patient.emergencyPhone && <p className="text-sm text-on-surface-variant">{patient.emergencyPhone}</p>}
            </div>
          )}

          {/* Follow-up Form */}
          <div className="bg-surface/40 rounded-2xl p-6 sm:p-8 border border-outline-variant/80">
            <h3 className="text-[11px] font-black text-outline uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">event_repeat</span>
              {t("patientDetail.addFollowUp")}
            </h3>
            <form onSubmit={handleAddFollowUp} className="space-y-5">
              {fuError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-400 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {fuError}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-outline uppercase tracking-widest ml-1">{t("common.date")}</label>
                <input id="fu-date" type="date" value={fuDate} onChange={e => setFuDate(e.target.value)} className="w-full bg-surface-container-low/60 border border-outline-variant/80 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-outline uppercase tracking-widest ml-1">{t("common.notes")}</label>
                <textarea id="fu-note" rows={3} value={fuNote} onChange={e => { setFuNote(e.target.value); setFuError(""); }} placeholder={t("patientDetail.noteHint")} className="w-full bg-surface-container-low/60 border border-outline-variant/80 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all resize-none min-h-[5rem]" />
              </div>
              <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl transition-all shadow-lg shadow-teal-500/10 hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[18px]">save</span>
                {t("patientDetail.saveFollowUp")}
              </button>
            </form>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-outline uppercase tracking-[0.2em] px-2">
              {t("patientDetail.timeline")} ({followUps.length})
            </h3>
            {followUps.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                <span className="material-symbols-outlined text-slate-800 text-[32px] mb-2">history</span>
                <p className="text-xs text-slate-600">{t("patientDetail.noFollowUps")}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {followUps.map((fu, idx) => (
                  <div key={fu.id} className="relative ps-8 pb-4 last:pb-0">
                    {idx !== followUps.length - 1 && (
                      <div className="absolute start-[7px] top-[24px] bottom-0 w-[2px] bg-slate-800" />
                    )}
                    <div className="absolute start-0 top-[6px] w-[16px] h-[16px] rounded-full border-2 border-primary/40 bg-background shadow-[0_0_8px_rgba(var(--color-primary),0.2)]" />
                    <div className="p-4 rounded-2xl bg-surface/40 border border-outline-variant/80 hover:bg-surface/60 transition-colors">
                      <p className="text-[10px] font-black text-primary/80 mb-2 font-mono uppercase tracking-widest">{fu.date}</p>
                      <p className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">{fu.note}</p>
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
