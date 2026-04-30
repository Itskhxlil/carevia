/**
 * Rule-based status (no ML). For education / quick triage hints only.
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
  const o = { normal: 0, warning: 1, critical: 2 };
  return o[a] >= o[b] ? a : b;
}

/**
 * @returns {{ status: 'normal'|'warning'|'critical', flags: string[] }}
 */
export function evaluateMeasurements(measurements) {
  if (!measurements || typeof measurements !== "object") {
    return { status: "normal", flags: [] };
  }

  let status = "normal";
  const flags = [];

  const g = parseFloat(measurements.glucose);
  if (!Number.isNaN(g)) {
    if (g > 180) {
      status = rank(status, "critical");
      flags.push("Glucose > 180 (critical range)");
    } else if (g > 140) {
      status = rank(status, "warning");
      flags.push("Glucose elevated");
    }
  }

  const hba = parseFloat(measurements.HbA1c ?? measurements.hba1c);
  if (!Number.isNaN(hba)) {
    if (hba > 9) {
      status = rank(status, "critical");
      flags.push("HbA1c very high");
    } else if (hba > 7) {
      status = rank(status, "warning");
      flags.push("HbA1c above usual target (>7%)");
    }
  }

  const bp =
    parseBloodPressure(measurements.blood_pressure) ||
    parseBloodPressure(measurements.bp);
  if (bp) {
    if (bp.sys >= 180 || bp.dia >= 110) {
      status = rank(status, "critical");
      flags.push("Blood pressure crisis range");
    } else if (bp.sys > 140 || bp.dia > 90) {
      status = rank(status, "warning");
      flags.push("Blood pressure > 140/90");
    }
  }

  const spo2 = parseFloat(measurements.spo2);
  if (!Number.isNaN(spo2)) {
    if (spo2 < 88) {
      status = rank(status, "critical");
      flags.push("SpO2 very low");
    } else if (spo2 < 92) {
      status = rank(status, "warning");
      flags.push("SpO2 below typical target");
    }
  }

  return { status, flags };
}
