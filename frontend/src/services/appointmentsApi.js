import { getSession } from "./authStorage.js";

const BASE =
  typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE
    ? String(import.meta.env.VITE_API_BASE).replace(/\/$/, "")
    : "";

function getAuthHeaders() {
  const session = getSession();
  if (!session) return {};
  return {
    "X-Doctor-Email": session.email || "",
    "X-Doctor-Specialty": session.specialty || "",
  };
}

async function parseJson(res) {
  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

export async function fetchAppointments() {
  const res = await fetch(`${BASE}/api/appointments`, {
    headers: getAuthHeaders(),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to load appointments");
  return data;
}

export async function createAppointment(body) {
  const res = await fetch(`${BASE}/api/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to create appointment");
  return data;
}

export async function updateAppointmentStatus(id, status) {
  const res = await fetch(`${BASE}/api/appointments/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to update status");
  return data;
}

export async function deleteAppointment(id) {
  const res = await fetch(`${BASE}/api/appointments/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await parseJson(res);
  if (!res.ok) throw new Error(data.error || "Failed to delete appointment");
  return data;
}
