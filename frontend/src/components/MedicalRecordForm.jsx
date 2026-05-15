import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { fieldsForDisease } from "../medical/diseaseConfig.js";
import { createMedicalRecord } from "../services/medicalRecordsApi.js";

export default function MedicalRecordForm({ patientId, disease, onSaved, onCancel }) {
  const { t } = useTranslation();
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");
  const [fieldValues, setFieldValues] = useState({});
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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const measurements = {};

    for (const f of templateFields) {
      const raw = String(fieldValues[f] ?? "").trim();
      if (raw === "") continue;
      
      // Numerical parsing for known numeric fields
      const numericFields = [
        "HbA1c", "weight", "glucose", "heart_rate", "temperature", 
        "creatinine", "gfr", "peak_flow", "oxygen_saturation", 
        "respiratory_rate", "urea", "cholesterol"
      ];
      
      if (numericFields.includes(f)) {
        const n = parseFloat(raw);
        measurements[f] = Number.isNaN(n) ? raw : n;
      } else {
        measurements[f] = raw;
      }
    }

    if (Object.keys(measurements).length === 0 && !notes.trim()) {
      setError(t("common.error"));
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
      setError(err.message || t("common.error"));
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
            {t("medical.disease")}
          </label>
          <div className="carevia-auth-input w-full px-4 py-3 rounded-xl text-sm bg-surface-container-high/30 capitalize font-semibold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            {t(`medical.diseases.${disease.toLowerCase()}`)}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
            {t("medical.date")}
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
            {t("medical.measurements")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {templateFields.map((f) => (
              <div key={f} className="space-y-1">
                <label className="text-[10px] uppercase tracking-wide text-outline">
                  {t(`medical.fields.${f}`, f.replace(/_/g, " "))}
                </label>
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

      <div className="space-y-2">
        <label className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
          {t("medical.notes")}
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("newPatient.notes")}
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
          {saving ? t("common.saving") : t("medical.addRecord")}
        </button>
        <button type="button" onClick={onCancel} className="carevia-btn-secondary">
          {t("common.cancel")}
        </button>
      </div>
    </form>
  );
}
