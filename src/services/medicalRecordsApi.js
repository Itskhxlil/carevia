const BASE =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE
    ? String(import.meta.env.VITE_API_BASE).replace(/\/$/, "")
    : "";

async function parseJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function fetchMedicalRecords(patientId) {
  const res = await fetch(
    `${BASE}/api/patients/${encodeURIComponent(patientId)}/medical-records`
  );
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data.error || res.statusText || "Failed to load records");
  }
  return Array.isArray(data) ? data : [];
}

export async function createMedicalRecord(patientId, body) {
  const res = await fetch(
    `${BASE}/api/patients/${encodeURIComponent(patientId)}/medical-records`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data.error || res.statusText || "Failed to save record");
  }
  return data;
}

export async function fetchRecentRecordStats(days = 7) {
  const res = await fetch(`${BASE}/api/stats/recent?days=${encodeURIComponent(days)}`);
  const data = await parseJson(res);
  if (!res.ok) {
    throw new Error(data.error || "Failed to load stats");
  }
  return data;
}
