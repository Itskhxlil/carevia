import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePatients } from "../PatientsContext.jsx";
import { getSession } from "../services/authStorage.js";
import { createMedicalRecord } from "../services/medicalRecordsApi.js";
import { diseaseFields as DISEASE_FIELDS, DISEASE_OPTIONS } from "../medical/diseaseConfig.js";

const BLOOD_TYPES = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const STATUSES = ["Active","Stable","Pending","Critical","Discharged"];

const inputCls = "w-full bg-surface-container-low/60 border border-outline-variant/80 rounded-xl px-4 py-3 text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all placeholder:text-outline";
const labelCls = "block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1.5";

const STEPS = ["personal","medical","confirm"];
const STEP_ICONS = ["person","medical_services","check_circle"];

function StepperBar({ current }) { const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                done ? "bg-primary border-primary" : active ? "border-primary bg-primary/10" : "border-outline-variant/40 bg-surface/40"
              }`}>
                {done
                  ? <span className="material-symbols-outlined text-white text-[18px]">check</span>
                  : <span className={`material-symbols-outlined text-[18px] ${active ? "text-primary" : "text-outline"}`}>{STEP_ICONS[i]}</span>
                }
              </div>
              <span className={`text-[9px] font-black uppercase tracking-widest ${active ? "text-primary" : done ? "text-on-surface" : "text-outline"}`}>
                {s === "personal" ? t("newPatient.step1") : s === "medical" ? t("newPatient.step2") : t("common.confirm", "Confirm")}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 w-16 sm:w-24 mx-2 mb-5 rounded-full transition-all duration-500 ${i < current ? "bg-primary" : "bg-outline-variant/30"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Use t("newPatient.placeholders.X") instead of static object

export default function NewPatientPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addPatient } = usePatients();
  const session = getSession();
  const doctorName = session?.name || "Dr.";
  const doctorSpecialty = session?.specialty?.toLowerCase() || "";

  // Filter disease options based on doctor specialty
  const filteredDiseaseOptions = useMemo(() => {
    if (!doctorSpecialty || doctorSpecialty.includes("general")) return DISEASE_OPTIONS;
    return DISEASE_OPTIONS.filter(o => 
      doctorSpecialty.includes(o.id.toLowerCase()) || o.id === "general"
    );
  }, [doctorSpecialty]);

  const defaultDiseaseType = useMemo(() => {
    const specific = filteredDiseaseOptions.find(o => o.id !== "general");
    return specific ? specific.id : "general";
  }, [filteredDiseaseOptions]);

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Step 1: Personal
  const [personal, setPersonal] = useState({
    name: "", gender: "Male", age: "", bloodType: "A+",
    phone: "", email: "", address: "",
    emergencyContact: "", emergencyPhone: "",
  });

  // Step 2: Medical
  const [medical, setMedical] = useState({
    diagnosis: "", diseaseType: defaultDiseaseType, status: "Active",
    medicalHistory: "", notes: "",
    lastVisit: new Date().toISOString().slice(0, 10),
  });
  const [showAllergies, setShowAllergies] = useState(false);
  const [allergies, setAllergies] = useState("");
  const [showMeds, setShowMeds] = useState(false);
  const [currentMedications, setCurrentMedications] = useState("");
  const [measurements, setMeasurements] = useState({});

  const activeFields = DISEASE_FIELDS[medical.diseaseType] || [];

  const diagPlaceholder = useMemo(() => {
    return t(`newPatient.placeholders.${medical.diseaseType}`, { defaultValue: t("newPatient.placeholders.general") });
  }, [medical.diseaseType, t]);

  function setP(k, v) { setPersonal(p => ({ ...p, [k]: v })); setError(""); }
  function setM(k, v) { setMedical(m => ({ ...m, [k]: v })); setError(""); }
  function setMeas(k, v) { setMeasurements(m => ({ ...m, [k]: v })); }

  function validateStep0() {
    if (!personal.name.trim()) return t("newPatient.validationName");
    const a = parseInt(personal.age, 10);
    if (isNaN(a) || a < 0 || a > 150) return t("newPatient.validationAge");
    if (!personal.phone.trim()) return t("newPatient.validationName"); // Or add validationPhone
    return "";
  }
  function validateStep1() {
    if (!medical.diagnosis.trim()) return t("newPatient.validationDiag");
    return "";
  }

  function handleNext() {
    const err = step === 0 ? validateStep0() : validateStep1();
    if (err) { setError(err); return; }
    setError("");
    setStep(s => s + 1);
  }

  async function handleSubmit() {
    setSaving(true);
    setError("");
    try {
      const patient = addPatient({
        ...personal,
        age: parseInt(personal.age, 10),
        ...medical,
        allergies: showAllergies ? allergies : "",
        currentMedications: showMeds ? currentMedications : "",
        assignedDoctor: doctorName,
      });

      // Create initial medical record if measurements exist
      const meas = Object.fromEntries(
        Object.entries(measurements).filter(([, v]) => String(v).trim() !== "")
      );
      if (Object.keys(meas).length > 0 || medical.notes.trim()) {
        try {
          await createMedicalRecord(patient.id, {
            disease: medical.diseaseType,
            date: medical.lastVisit,
            measurements: meas,
            notes: medical.notes.trim(),
          });
        } catch { /* API may be offline, patient still saved locally */ }
      }

      navigate(`/dashboard/patients/${patient.id}`, { replace: true });
    } catch (e) {
      setError(e.message || "Failed to save patient.");
      setSaving(false);
    }
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[10px] font-black text-outline uppercase tracking-[0.2em] mb-1">{t("newPatient.title")}</p>
        <h1 className="text-2xl font-black text-on-surface">{t("newPatient.title")}</h1>
        <p className="text-sm text-on-surface-variant mt-1">{t("newPatient.description")}</p>
      </div>

      <StepperBar current={step} />

      <div className="max-w-2xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs text-rose-400 font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">error</span>
            {error}
          </div>
        )}

        {/* ── STEP 0: Personal ── */}
        {step === 0 && (
          <div className="bg-surface/40 border border-outline-variant/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20" />

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[20px]">person</span>
              </div>
              <div>
                <p className="text-xs font-black text-on-surface uppercase tracking-widest">{t("newPatient.step1")}</p>
                <p className="text-base font-black text-on-surface">{t("newPatient.step1")}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelCls}>{t("newPatient.fullName")}</label>
              <input className={inputCls} placeholder={t("newPatient.fullName")} value={personal.name} onChange={e => setP("name", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelCls}>{t("newPatient.gender")}</label>
                <select className={inputCls} value={personal.gender} onChange={e => setP("gender", e.target.value)}>
                  <option value="Male">{t("common.Male", "Male")}</option>
                  <option value="Female">{t("common.Female", "Female")}</option>
                  <option value="Other">{t("common.Other", "Other")}</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelCls}>{t("newPatient.age")}</label>
                <input className={inputCls} type="number" min={0} max={150} placeholder="e.g. 45" value={personal.age} onChange={e => setP("age", e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelCls}>{t("newPatient.bloodType")}</label>
                <select className={inputCls} value={personal.bloodType} onChange={e => setP("bloodType", e.target.value)}>
                  {BLOOD_TYPES.map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelCls}>{t("newPatient.phone")}</label>
                <input className={inputCls} type="tel" placeholder="+966 5XX XXX XXXX" value={personal.phone} onChange={e => setP("phone", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelCls}>{t("newPatient.email")}</label>
              <input className={inputCls} type="email" placeholder="patient@email.com" value={personal.email} onChange={e => setP("email", e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className={labelCls}>{t("newPatient.address")}</label>
              <input className={inputCls} placeholder="City, Street..." value={personal.address} onChange={e => setP("address", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelCls}>{t("newPatient.emergencyContact")}</label>
                <input className={inputCls} placeholder="Contact name" value={personal.emergencyContact} onChange={e => setP("emergencyContact", e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className={labelCls}>{t("newPatient.emergencyPhone")}</label>
                <input className={inputCls} type="tel" placeholder="+966..." value={personal.emergencyPhone} onChange={e => setP("emergencyPhone", e.target.value)} />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[18px]">badge</span>
              <div className="text-xs">
                <p className="font-bold text-on-surface">{t("newPatient.physician")}</p>
                <p className="text-on-surface-variant">{doctorName}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={handleNext} className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-teal-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                {t("newPatient.continue")}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 1: Medical ── */}
        {step === 1 && (
          <div className="bg-surface/40 border border-outline-variant/20 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/5 rounded-full blur-3xl -mr-20 -mt-20" />

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-teal-400 text-[20px]">medical_services</span>
              </div>
              <div>
                <p className="text-xs font-black text-on-surface uppercase tracking-widest">{t("newPatient.step2")}</p>
                <p className="text-base font-black text-on-surface">{t("newPatient.step2")}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelCls}>{t("newPatient.diagnosis")}</label>
              <input className={inputCls} placeholder={diagPlaceholder} value={medical.diagnosis} onChange={e => setM("diagnosis", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelCls}>{t("newPatient.diseaseCategory")}</label>
                <select className={inputCls} value={medical.diseaseType} onChange={e => { setM("diseaseType", e.target.value); setMeasurements({}); }}>
                  {filteredDiseaseOptions.map(o => <option key={o.id} value={o.id}>{t(`medical.diseases.${o.id}`)}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className={labelCls}>{t("newPatient.status")}</label>
                <select className={inputCls} value={medical.status} onChange={e => setM("status", e.target.value)}>
                  {STATUSES.map(s => <option key={s} value={s}>{t(`status.${s}`)}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className={labelCls}>{t("medical.date")}</label>
              <input className={inputCls} type="date" value={medical.lastVisit} onChange={e => setM("lastVisit", e.target.value)} />
            </div>

            <div className="space-y-2">
              <label className={labelCls}>{t("newPatient.medicalHistory")}</label>
              <textarea className={`${inputCls} resize-none`} rows={3} placeholder={t("newPatient.placeholders.medicalHistory")} value={medical.medicalHistory} onChange={e => setM("medicalHistory", e.target.value)} />
            </div>

            {/* Dynamic vital fields */}
            {activeFields.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] font-black text-outline uppercase tracking-widest">{t("newPatient.initialVitals")} <span className="normal-case font-medium text-outline/60">{t("newPatient.optional")}</span></p>
                <div className="grid grid-cols-2 gap-3">
                  {activeFields.map(f => (
                    <div key={f} className="space-y-1.5">
                      <label className="text-[10px] uppercase tracking-wide text-outline font-bold">{t(`medical.fields.${f}`, f.replace(/_/g, " "))}</label>
                      <input
                        className={inputCls}
                        placeholder={f === "blood_pressure" ? "e.g. 128/82" : ""}
                        value={measurements[f] || ""}
                        onChange={e => setMeas(f, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Optional: Allergies */}
            <div className="space-y-3">
              <button type="button" onClick={() => setShowAllergies(v => !v)} className={`flex items-center gap-2 text-xs font-bold transition-colors ${showAllergies ? "text-amber-400" : "text-outline hover:text-on-surface"}`}>
                <span className={`material-symbols-outlined text-[18px] transition-transform ${showAllergies ? "rotate-45" : ""}`}>add_circle</span>
                {showAllergies ? t("newPatient.hideAllergies") : `${t("newPatient.addAllergies")} ${t("newPatient.optional")}`}
              </button>
              {showAllergies && (
                <textarea className={`${inputCls} resize-none`} rows={2} placeholder={t("newPatient.placeholders.allergies")} value={allergies} onChange={e => setAllergies(e.target.value)} />
              )}
            </div>

            {/* Optional: Current Medications */}
            <div className="space-y-3">
              <button type="button" onClick={() => setShowMeds(v => !v)} className={`flex items-center gap-2 text-xs font-bold transition-colors ${showMeds ? "text-sky-400" : "text-outline hover:text-on-surface"}`}>
                <span className={`material-symbols-outlined text-[18px] transition-transform ${showMeds ? "rotate-45" : ""}`}>add_circle</span>
                {showMeds ? t("newPatient.hideMeds") : `${t("newPatient.addMeds")} ${t("newPatient.optional")}`}
              </button>
              {showMeds && (
                <textarea className={`${inputCls} resize-none`} rows={2} placeholder={t("newPatient.placeholders.medications")} value={currentMedications} onChange={e => setCurrentMedications(e.target.value)} />
              )}
            </div>

            <div className="space-y-2">
              <label className={labelCls}>{t("newPatient.notes")}</label>
              <textarea className={`${inputCls} resize-none`} rows={3} placeholder={t("newPatient.placeholders.notes")} value={medical.notes} onChange={e => setM("notes", e.target.value)} />
            </div>

            <div className="flex justify-between pt-2">
              <button onClick={() => { setStep(0); setError(""); }} className="px-6 py-3.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                {t("common.back")}
              </button>
              <button onClick={handleNext} className="px-8 py-3.5 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-teal-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                {t("common.view")}
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Confirm ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-surface/40 border border-outline-variant/20 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-emerald-400 text-[20px]">check_circle</span>
                </div>
                <div>
                  <p className="text-xs font-black text-on-surface uppercase tracking-widest">{t("newPatient.step3")}</p>
                  <p className="text-base font-black text-on-surface">{t("newPatient.step3")}</p>
                </div>
              </div>

              {/* Summary rows */}
              {[
                { label: t("newPatient.summary.fullName"), value: personal.name },
                { label: t("newPatient.summary.genderAge"), value: `${t(`common.${personal.gender}`)}, ${personal.age} ${t("patients.age")}` },
                { label: t("newPatient.summary.bloodType"), value: personal.bloodType },
                { label: t("newPatient.summary.phone"), value: personal.phone },
                { label: t("newPatient.summary.diagnosis"), value: medical.diagnosis },
                { label: t("newPatient.summary.diseaseType"), value: t(`medical.diseases.${medical.diseaseType}`) },
                { label: t("newPatient.summary.status"), value: t(`status.${medical.status}`) },
                { label: t("newPatient.summary.firstAdmission"), value: medical.lastVisit },
                { label: t("newPatient.summary.assignedDoctor"), value: doctorName },
              ].map(row => (
                <div key={row.label} className="flex items-center justify-between py-2.5 border-b border-outline-variant/10 last:border-0">
                  <span className="text-[10px] font-black text-outline uppercase tracking-widest">{row.label}</span>
                  <span className="text-sm font-bold text-on-surface text-right max-w-[60%] truncate">{row.value || "—"}</span>
                </div>
              ))}

              {Object.entries(measurements).filter(([,v]) => String(v).trim()).map(([k, v]) => (
                <div key={k} className="flex items-center justify-between py-2.5 border-b border-outline-variant/10 last:border-0">
                  <span className="text-[10px] font-black text-outline uppercase tracking-widest">{t(`medical.fields.${k}`, k.replace(/_/g, " "))}</span>
                  <span className="text-sm font-bold text-primary">{v}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl flex items-start gap-3">
              <span className="material-symbols-outlined text-teal-400 text-[20px] mt-0.5">security</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">{t("newPatient.privacySecurity")}</p>
            </div>

            <div className="flex justify-between">
              <button onClick={() => { setStep(1); setError(""); }} className="px-6 py-3.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface font-black text-xs uppercase tracking-widest rounded-xl transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                {t("common.back")}
              </button>
              <button onClick={handleSubmit} disabled={saving} className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black text-xs uppercase tracking-widest rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-60">
                <span className="material-symbols-outlined text-[18px]">{saving ? "hourglass_empty" : "how_to_reg"}</span>
                {saving ? t("common.saving") : t("newPatient.save")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
