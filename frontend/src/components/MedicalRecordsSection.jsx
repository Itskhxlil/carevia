import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchMedicalRecords } from "../services/medicalRecordsApi.js";
import { evaluateMeasurements } from "../medical/evaluateMeasurements.js";
import { buildChartDescriptors } from "../medical/chartSeries.js";
import RecordStatusBadge from "./RecordStatusBadge.jsx";
import FlexibleVitalChart from "./FlexibleVitalChart.jsx";
import MedicalRecordForm from "./MedicalRecordForm.jsx";
import { usePatients } from "../PatientsContext.jsx";
import { getSession } from "../services/authStorage.js";

function getAutoSpecialty(patient, doctor) {
  // 1. Check patient diseaseType
  if (patient?.diseaseType && patient.diseaseType !== "general") {
    return patient.diseaseType;
  }

  // 2. Fallback to Doctor's specialty
  const spec = doctor?.specialty || "";
  if (spec.toLowerCase().includes("cardiology")) return "cardiology";
  if (spec.toLowerCase().includes("diabetes")) return "diabetes";
  if (spec.toLowerCase().includes("pulmonology")) return "pulmonology";
  if (spec.toLowerCase().includes("nephrology")) return "nephrology";
  
  // Default to patient's diseaseType (which might be "general")
  return patient?.diseaseType || "general";
}

function formatMeasPreview(m) {
  if (!m || typeof m !== "object") return "—";
  const entries = Object.entries(m).filter(([k]) => k !== "notes");
  if (entries.length === 0) return "—";
  return entries
    .slice(0, 4)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");
}

export default function MedicalRecordsSection({ patientId, onRecordAdded }) {
  const { t } = useTranslation();
  const { patients } = usePatients();
  const patient = patients.find(p => p.id === patientId);
  const doctor = getSession();
  const diseaseType = getAutoSpecialty(patient, doctor);

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoadError("");
    setLoading(true);
    try {
      const list = await fetchMedicalRecords(patientId);
      setRecords(list);
    } catch (e) {
      setLoadError(e.message || "Could not load medical records.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    load();
  }, [load]);

  const charts = buildChartDescriptors(records);

  return (
    <section className="space-y-6 mt-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold font-headline text-on-surface tracking-tight flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[26px]">monitor_heart</span>
            {t("medical.records")}
          </h2>
          <p className="text-sm text-on-surface-variant mt-1 max-w-2xl">
            {t("patientDetail.vitalsHistory")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="carevia-btn-primary shrink-0"
        >
          <span className="material-symbols-outlined text-[20px] relative z-10">add</span>
          {t("medical.addRecord")}
        </button>
      </div>

      {loadError && (
        <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {loadError}
        </div>
      )}

      {showForm && (
        <div className="carevia-glass-card p-6 sm:p-8 border border-primary/20">
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-4">
            {t("medical.addRecord")}
          </h3>
          <MedicalRecordForm
            patientId={patientId}
            disease={diseaseType}
            onSaved={() => {
              setShowForm(false);
              load();
              onRecordAdded?.();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="carevia-glass-subtle rounded-2xl p-6 sm:p-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-4">
          {t("common.date")} ({records.length})
        </h3>
        {loading ? (
          <p className="text-sm text-outline">{t("common.loading")}</p>
        ) : records.length === 0 ? (
          <p className="text-sm text-outline">
            {t("medical.noRecords")}
          </p>
        ) : (
          <ul className="space-y-4">
            {records.map((r) => {
              const ev = evaluateMeasurements(r.measurements);
              return (
                <li
                  key={r.id}
                  className="rounded-xl border border-outline-variant/15 bg-surface-container-lowest/50 p-4 sm:p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-mono text-primary">{r.date}</p>
                      <p className="text-sm font-semibold text-on-surface capitalize mt-0.5">
                        {r.disease}
                      </p>
                    </div>
                    <RecordStatusBadge status={ev.status} />
                  </div>
                  <p className="text-sm text-on-surface-variant mt-2 font-mono break-all">
                    {formatMeasPreview(r.measurements)}
                  </p>
                  {ev.flags.length > 0 && (
                    <ul className="mt-2 text-xs text-amber-200/90 list-disc list-inside space-y-0.5">
                      {ev.flags.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  )}
                  {r.notes && (
                    <p className="text-sm text-on-surface-variant mt-3 pt-3 border-t border-outline-variant/10 whitespace-pre-wrap">
                      {r.notes}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {charts.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface">
            {t("common.workspace")}
          </h3>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {charts.map((c) => (
              <FlexibleVitalChart
                key={c.key}
                title={c.key}
                data={c.data}
                chartType={c.chartType}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
