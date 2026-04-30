import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "carevia_patients";

function normalizePatient(p) {
  return {
    ...p,
    followUps: Array.isArray(p.followUps) ? p.followUps : [],
  };
}

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(normalizePatient);
  } catch {
    return [];
  }
}

const PatientsContext = createContext(null);

export function PatientsProvider({ children }) {
  const [patients, setPatients] = useState(readStored);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
  }, [patients]);

  const addPatient = useCallback((row) => {
    const id = `PT-${Date.now()}`;
    setPatients((prev) => [...prev, normalizePatient({ ...row, id })]);
  }, []);

  const updatePatient = useCallback((id, data) => {
    setPatients((prev) =>
      prev.map((p) => (p.id === id ? normalizePatient({ ...p, ...data }) : p))
    );
  }, []);

  const removePatient = useCallback((id) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addFollowUp = useCallback((patientId, { date, note }) => {
    const n = String(note || "").trim();
    if (!n) return;
    const fuId = `FU-${Date.now()}`;
    setPatients((prev) =>
      prev.map((p) => {
        if (p.id !== patientId) return p;
        const list = [...(p.followUps || [])];
        list.push({ id: fuId, date: date || new Date().toISOString().slice(0, 10), note: n });
        return { ...p, followUps: list };
      })
    );
  }, []);

  const value = useMemo(
    () => ({ patients, addPatient, updatePatient, removePatient, addFollowUp }),
    [patients, addPatient, updatePatient, removePatient, addFollowUp]
  );

  return <PatientsContext.Provider value={value}>{children}</PatientsContext.Provider>;
}

export function usePatients() {
  const ctx = useContext(PatientsContext);
  if (!ctx) throw new Error("usePatients must be used within PatientsProvider");
  return ctx;
}
