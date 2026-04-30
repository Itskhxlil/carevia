import { parseBloodPressure } from "./evaluateMeasurements.js";

function bpKey(key) {
  const k = String(key).toLowerCase();
  return k === "blood_pressure" || k === "bp" || (k.includes("blood") && k.includes("pressure"));
}

/**
 * @param {Array<{ date: string, measurements: Record<string, unknown> }>} records
 * @returns {Array<{ key: string, chartType: 'bloodPressure'|'numeric', data: Array<{label: string, value: number, secondary: number|null}> }>}
 */
export function buildChartDescriptors(records) {
  const sorted = [...records].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const keys = new Set();
  for (const r of sorted) {
    const m = r.measurements;
    if (m && typeof m === "object") {
      Object.keys(m).forEach((k) => keys.add(k));
    }
  }

  const out = [];
  for (const key of keys) {
    if (key === "notes") continue;
    const samples = sorted.map((r) => r.measurements?.[key]);

    if (bpKey(key)) {
      const data = sorted
        .map((r) => {
          const p = parseBloodPressure(r.measurements?.[key]);
          if (!p) return null;
          return { label: r.date, value: p.sys, secondary: p.dia };
        })
        .filter(Boolean);
      if (data.length >= 2) {
        out.push({ key, chartType: "bloodPressure", data });
      }
      continue;
    }

    const numericRows = sorted
      .map((r) => {
        const v = r.measurements?.[key];
        const n = typeof v === "number" ? v : parseFloat(v);
        if (Number.isNaN(n)) return null;
        return { label: r.date, value: n, secondary: null };
      })
      .filter(Boolean);

    if (numericRows.length >= 2) {
      out.push({ key, chartType: "numeric", data: numericRows });
    }
  }

  return out;
}
