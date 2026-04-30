import React, { useCallback, useEffect, useState } from "react";
import { fetchMedicalRecords } from "../services/medicalRecordsApi.js";
import { evaluateMeasurements } from "../medical/evaluateMeasurements.js";
import { buildChartDescriptors } from "../medical/chartSeries.js";
import RecordStatusBadge from "./RecordStatusBadge.jsx";
import FlexibleVitalChart from "./FlexibleVitalChart.jsx";
import MedicalRecordForm from "./MedicalRecordForm.jsx";

function formatMeasPreview(m) {
  if (!m || typeof m !== "object") return "—";
  const entries = Object.entries(m).filter(([k]) => k !== "notes");
  if (entries.length === 0) return "—";
  return entries
    .slice(0, 4)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");
}

export default function MedicalRecordsSection({ patientId }) {
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
            Medical records & monitoring
          </h2>
          <p className="text-sm text-on-surface-variant mt-1 max-w-2xl">
            Flexible JSON vitals per visit, disease templates, custom fields, and simple rule-based
            flags. Stored on the Carevia API (MySQL or in-memory for demos).
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="carevia-btn-primary shrink-0"
        >
          <span className="material-symbols-outlined text-[20px] relative z-10">add</span>
          Add record
        </button>
      </div>

      {loadError && (
        <div className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">
          {loadError}{" "}
          <span className="text-on-surface-variant">
            Start the API with <code className="text-xs bg-surface px-1 rounded">npm run server</code>{" "}
            (optional MySQL via <code className="text-xs bg-surface px-1 rounded">.env</code>).
          </span>
        </div>
      )}

      {showForm && (
        <div className="carevia-glass-card p-6 sm:p-8 border border-primary/20">
          <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-4">
            New medical record
          </h3>
          <MedicalRecordForm
            patientId={patientId}
            onSaved={() => {
              setShowForm(false);
              load();
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <div className="carevia-glass-subtle rounded-2xl p-6 sm:p-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-4">
          History ({records.length})
        </h3>
        {loading ? (
          <p className="text-sm text-outline">Loading…</p>
        ) : records.length === 0 ? (
          <p className="text-sm text-outline">
            No monitoring entries yet. Use &quot;Add record&quot; to capture vitals for any disease.
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
            Trends (auto-detected)
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
