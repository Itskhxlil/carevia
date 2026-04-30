/**
 * Deterministic demo vitals derived from patient id (no DB / no context changes).
 */

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function linspace(n, base, drift, noise) {
  const out = [];
  for (let i = 0; i < n; i += 1) {
    out.push(Math.round((base + drift * i + (noise * Math.sin(i)) * 0.5) * 10) / 10);
  }
  return out;
}

/**
 * @returns {{ glucose: number[], bloodPressure: {systolic:number, diastolic:number}[], weight: number[] }}
 */
export function buildDemoMeasurementsForPatient(patient) {
  const seed = hashString(patient?.id || "demo");
  const age = Number(patient?.age) || 45;

  const gBase = 95 + (seed % 35);
  const glucose = linspace(10, gBase, (seed % 3) - 1, 4 + (seed % 5));

  const sysBase = 110 + (seed % 25);
  const bloodPressure = Array.from({ length: 10 }, (_, i) => {
    const sys = Math.round(sysBase + (seed % 5) * Math.sin(i * 0.6) + i * 0.4);
    const dia = Math.round(55 + (age > 60 ? 15 : 8) + (seed % 4) * Math.sin(i * 0.5));
    return { systolic: sys, diastolic: Math.min(dia, sys - 25) };
  });

  const wBase = 70 + (seed % 25) + (age > 55 ? 5 : 0);
  const weight = linspace(10, wBase, ((seed >> 3) % 3) * 0.15 - 0.1, 1.2);

  return { glucose, bloodPressure, weight };
}

/**
 * Chart-friendly points for one series type.
 */
export function toChartPoints(measurements, type) {
  if (type === "glucose") {
    return measurements.glucose.map((value, i) => ({
      label: `D${i + 1}`,
      value,
      secondary: null,
    }));
  }
  if (type === "bloodPressure") {
    return measurements.bloodPressure.map((bp, i) => ({
      label: `D${i + 1}`,
      value: bp.systolic,
      secondary: bp.diastolic,
    }));
  }
  if (type === "weight") {
    return measurements.weight.map((value, i) => ({
      label: `D${i + 1}`,
      value,
      secondary: null,
    }));
  }
  return [];
}
