/**
 * Rule-based medical status evaluation.
 */

export function parseBloodPressure(raw) {
  if (raw == null || raw === "") return null;
  const s = String(raw).trim();
  const m = s.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const sys = parseFloat(m[1]);
  const dia = parseFloat(m[2]);
  if (Number.isNaN(sys) || Number.isNaN(dia)) return null;
  return { sys, dia };
}

function rank(a, b) {
  const o = { Stable: 0, Warning: 1, Critical: 2 };
  return o[a] >= o[b] ? a : b;
}

/**
 * @returns {{ status: 'Stable'|'Warning'|'Critical', flags: string[] }}
 */
export function evaluateMeasurements(measurements) {
  if (!measurements || typeof measurements !== "object") {
    return { status: "Stable", flags: [] };
  }

  let status = "Stable";
  const flags = [];

  // 1. Glucose (Diabetes)
  const g = parseFloat(measurements.glucose);
  if (!Number.isNaN(g)) {
    if (g > 250) {
      status = rank(status, "Critical");
      flags.push("Glucose > 250 (Critical)");
    } else if (g > 180) {
      status = rank(status, "Warning");
      flags.push("Glucose > 180 (High)");
    }
  }

  // 2. HbA1c (Diabetes)
  const hba = parseFloat(measurements.HbA1c ?? measurements.hba1c);
  if (!Number.isNaN(hba)) {
    if (hba > 9) {
      status = rank(status, "Critical");
      flags.push("HbA1c > 9% (Very High)");
    } else if (hba > 7.5) {
      status = rank(status, "Warning");
      flags.push("HbA1c > 7.5% (High)");
    }
  }

  // 3. Blood Pressure (Cardiology / Nephrology / General)
  const bp = parseBloodPressure(measurements.blood_pressure) || parseBloodPressure(measurements.bp);
  if (bp) {
    if (bp.sys >= 160 || bp.dia >= 100) {
      status = rank(status, "Critical");
      flags.push("BP >= 160/100 (Hypertensive Crisis/Grade 2)");
    } else if (bp.sys >= 140 || bp.dia >= 90) {
      status = rank(status, "Warning");
      flags.push("BP >= 140/90 (Hypertension Stage 1)");
    }
  }

  // 4. Heart Rate (Cardiology)
  const hr = parseFloat(measurements.heart_rate);
  if (!Number.isNaN(hr)) {
    if (hr > 120 || hr < 45) {
      status = rank(status, "Critical");
      flags.push(`Heart Rate ${hr} (Critical Range)`);
    } else if (hr > 100 || hr < 55) {
      status = rank(status, "Warning");
      flags.push(`Heart Rate ${hr} (Abnormal)`);
    }
  }

  // 5. SpO2 (Pulmonology)
  const spo2 = parseFloat(measurements.spo2 || measurements.oxygen_saturation);
  if (!Number.isNaN(spo2)) {
    if (spo2 < 90) {
      status = rank(status, "Critical");
      flags.push("SpO2 < 90% (Critical Hypoxia)");
    } else if (spo2 < 94) {
      status = rank(status, "Warning");
      flags.push("SpO2 < 94% (Low)");
    }
  }

  // 6. Creatinine (Nephrology)
  const creat = parseFloat(measurements.creatinine);
  if (!Number.isNaN(creat)) {
    if (creat > 2.0) {
      status = rank(status, "Critical");
      flags.push("Creatinine > 2.0 (High)");
    } else if (creat > 1.3) {
      status = rank(status, "Warning");
      flags.push("Creatinine > 1.3 (Elevated)");
    }
  }

  return { status, flags };
}
