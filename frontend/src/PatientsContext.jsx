import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getSession } from "./services/authStorage.js";

const STORAGE_KEY = "carevia_patients";

function generateId() {
  const now = Date.now();
  const rand = Math.floor(Math.random() * 900) + 100;
  return `PT-${now}-${rand}`;
}

function normalizePatient(p) {
  return {
    // Identity
    id: p.id || generateId(),
    name: p.name || "",
    gender: p.gender || "",
    age: typeof p.age === "number" ? p.age : (parseInt(p.age, 10) || 0),
    bloodType: p.bloodType || "",
    phone: p.phone || "",
    email: p.email || "",
    address: p.address || "",
    emergencyContact: p.emergencyContact || "",
    emergencyPhone: p.emergencyPhone || "",
    // Doctor / Tenant Association
    assignedDoctorId: p.assignedDoctorId || "", // The doctor's email/id who owns this patient
    specialty: p.specialty || "",               // The clinical specialty (e.g., Cardiology)
    // Medical
    diagnosis: p.diagnosis || "",
    diseaseType: p.diseaseType || "general",
    medicalHistory: p.medicalHistory || "",
    allergies: p.allergies || "",
    currentMedications: p.currentMedications || "",
    status: p.status || "Active",
    lastVisit: p.lastVisit || new Date().toISOString().slice(0, 10),
    // Follow-ups
    followUps: Array.isArray(p.followUps) ? p.followUps : [],
    // Metadata
    createdAt: p.createdAt || new Date().toISOString(),
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
  const [allPatients, setAllPatients] = useState(readStored);
  const session = getSession();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allPatients));
  }, [allPatients]);

  // Filter patients based on current doctor
  const patients = useMemo(() => {
    if (!session) return [];
    const doctorId = session.email;
    const docSpec = session.specialty?.toLowerCase();

    return allPatients.filter(p => {
      // Direct assignment
      if (p.assignedDoctorId === doctorId) return true;
      // Match by specialty (e.g. Cardiology doctor sees cardiology patients)
      if (docSpec && p.diseaseType?.toLowerCase() === docSpec) return true;
      if (docSpec && p.specialty?.toLowerCase() === docSpec) return true;
      
      return false;
    });
  }, [allPatients, session]);

  const addPatient = useCallback((row) => {
    const id = generateId();
    const doctorId = getSession()?.email || "";
    const specialty = getSession()?.specialty || "";
    
    const patient = normalizePatient({ 
      ...row, 
      id, 
      assignedDoctorId: doctorId,
      specialty: specialty // Default specialty from doctor if not set
    });
    
    setAllPatients((prev) => [...prev, patient]);
    return patient;
  }, []);

  const updatePatient = useCallback((id, data) => {
    setAllPatients((prev) =>
      prev.map((p) => (p.id === id ? normalizePatient({ ...p, ...data }) : p))
    );
  }, []);

  const removePatient = useCallback((id) => {
    setAllPatients((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const addFollowUp = useCallback((patientId, { date, note }) => {
    const n = String(note || "").trim();
    if (!n) return;
    const fuId = `FU-${Date.now()}`;
    setAllPatients((prev) =>
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
