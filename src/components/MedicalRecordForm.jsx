import React, { useEffect, useMemo, useState } from "react";
import { DISEASE_OPTIONS, fieldsForDisease } from "../medical/diseaseConfig.js";
import { createMedicalRecord } from "../services/medicalRecordsApi.js";

function emptyCustom() {
  return { id: `c-${Date.now()}`, key: "", value: "" };
}

export default function MedicalRecordForm({ patientId, onSaved, onCancel }) {
  const [disease, setDisease] = useState("general");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [fieldValues, setFieldValues] = useState({});
  const [customRows, setCustomRows] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const templateFields = useMemo(() => fieldsForDisease(disease), [disease]);

  useEffect(() => {
    const next = {};
    for (const f of templateFields) {
      next[f] = "";
    }
    setFieldValues(next);
  }, [disease, templateFields]);

  function addCustomRow() {
    setCustomRows((r) => [...r, emptyCustom()]);
  }

  function updateCustom(id, patch) {
    setCustomRows((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function removeCustom(id) {
    setCustomRows((rows) => rows.filter((row) => row.id !== id));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const measurements = {};

    for (const f of templateFields) {
      const raw = String(fieldValues[f] ?? "").trim();
      if (raw === "") continue;
      if (f === "HbA1c" || f === "weight" || f === "glucose" || f === "heart_rate" || f === "temperature" || f === "creatinine" || f === "egfr" || f === "peak_flow" || f === "spo2") {
        const n = parseFloat(raw);
        measurements[f] = Number.isNaN(n) ? raw : n;
      } else {
        measurements[f] = raw;
      }
    }

    for (const row of customRows) {
      const k = row.key.trim();
      const v = row.value.trim();
      if (!k || !v) continue;
      const n = parseFloat(v);
      measurements[k] = Number.isNaN(n) ? v : n;
    }

    if (Object.keys(measurements).length === 0 && !notes.trim()) {
      setError("Add at least one measurement or a clinical note.");
      return;
    }

    setSaving(true);
    try {
      await createMedicalRecord(patientId, {
        disease,
        date,
        measurements,
        notes: notes.trim(),
      });
      onSaved?.();
    } catch (err) {
      setError(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <p className="text-xs text-error flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">error</span>
          {error}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Disease / program
          </label>
          <select
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
            className="carevia-auth-input w-full px-4 py-3 rounded-xl text-sm appearance-none"
          >
            {DISEASE_OPTIONS.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Record date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="carevia-auth-input w-full px-4 py-3 rounded-xl text-sm"
          />
        </div>
      </div>

      {templateFields.length > 0 && (
        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Suggested fields
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templateFields.map((f) => (
              <div key={f} className="space-y-1">
                <label className="text-[10px] uppercase tracking-wide text-outline">{f}</label>
                <input
                  type="text"
                  value={fieldValues[f] ?? ""}
                  onChange={(e) =>
                    setFieldValues((prev) => ({ ...prev, [f]: e.target.value }))
                  }
                  placeholder={f === "blood_pressure" ? "e.g. 128/82" : ""}
                  className="carevia-auth-input w-full px-3 py-2.5 rounded-lg text-sm"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {disease === "other" && templateFields.length === 0 && (
        <p className="text-xs text-on-surface-variant">
          No preset fields for &quot;Other&quot;. Add custom measurements below.
        </p>
      )}

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            Custom fields
          </p>
          <button
            type="button"
            onClick={addCustomRow}
            className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Add custom field
          </button>
        </div>
        {customRows.length === 0 ? (
          <p className="text-xs text-outline">Optional — any vital or lab label.</p>
        ) : (
          <ul className="space-y-2">
            {customRows.map((row) => (
              <li key={row.id} className="flex flex-wrap gap-2 items-center">
                <input
                  type="text"
                  value={row.key}
                  onChange={(e) => updateCustom(row.id, { key: e.target.value })}
                  placeholder="Field name"
                  className="carevia-auth-input flex-1 min-w-[120px] px-3 py-2 rounded-lg text-sm"
                />
                <input
                  type="text"
                  value={row.value}
                  onChange={(e) => updateCustom(row.id, { value: e.target.value })}
                  placeholder="Value"
                  className="carevia-auth-input flex-1 min-w-[120px] px-3 py-2 rounded-lg text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeCustom(row.id)}
                  className="p-2 rounded-lg text-outline hover:text-error hover:bg-error/10"
                  aria-label="Remove row"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
          Clinical notes
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Context, medication changes, plan…"
          className="carevia-auth-input w-full px-4 py-3 rounded-xl text-sm resize-y min-h-[4.5rem]"
        />
      </div>

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="carevia-btn-primary disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-[18px] relative z-10">save</span>
          {saving ? "Saving…" : "Save record"}
        </button>
        <button type="button" onClick={onCancel} className="carevia-btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
