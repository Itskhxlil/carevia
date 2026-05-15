import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { usePatients } from "../PatientsContext.jsx";
import PageShell from "./PageShell.jsx";

const STATUSES = ["Active","Stable","Pending","Critical","Discharged"];
const BLOOD_TYPES = ["A+","A-","B+","B-","AB+","AB-","O+","O-"];
const DISEASE_TYPES = ["diabetes","cardiology","pulmonology","nephrology","general","other"];

const inputCls = "w-full px-4 py-3 bg-surface-container-low/60 border border-outline-variant/80 rounded-xl text-sm text-on-surface focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all placeholder:text-outline";
const labelCls = "block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-1.5";

export default function PatientEditPage() {
  const { t } = useTranslation();
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { patients, updatePatient } = usePatients();
  const patient = patients.find((p) => p.id === patientId);

  const [form, setForm] = useState({
    name:"", gender:"Male", age:"", bloodType:"A+",
    phone:"", email:"", address:"",
    emergencyContact:"", emergencyPhone:"",
    diagnosis:"", diseaseType:"general", status:"Active",
    medicalHistory:"", allergies:"", currentMedications:"",
    lastVisit:"",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!patient) return;
    setForm({
      name: patient.name || "",
      gender: patient.gender || "Male",
      age: String(patient.age || ""),
      bloodType: patient.bloodType || "A+",
      phone: patient.phone || "",
      email: patient.email || "",
      address: patient.address || "",
      emergencyContact: patient.emergencyContact || "",
      emergencyPhone: patient.emergencyPhone || "",
      diagnosis: patient.diagnosis || "",
      diseaseType: patient.diseaseType || "general",
      status: patient.status || "Active",
      medicalHistory: patient.medicalHistory || "",
      allergies: patient.allergies || "",
      currentMedications: patient.currentMedications || "",
      lastVisit: patient.lastVisit || "",
    });
  }, [patient]);

  if (!patient) {
    return (
      <PageShell title={t("patients.notFound","Patient not found")} description={t("patients.recordRemoved","This record may have been removed.")}>
        <Link to="/dashboard/patients" className="carevia-btn-primary inline-flex">
          {t("patients.backToPatients","Back to patients")}
        </Link>
      </PageShell>
    );
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); setError(""); }

  function handleSubmit(e) {
    e.preventDefault();
    const n = form.name.trim();
    const a = parseInt(form.age, 10);
    const d = form.diagnosis.trim();
    if (!n || isNaN(a) || a < 0 || a > 150 || !d) {
      setError(t("patients.invalidForm","Please enter a valid name, age, and diagnosis."));
      return;
    }
    updatePatient(patient.id, { ...form, age: a });
    navigate(`/dashboard/patients/${patient.id}`, { replace: true });
  }

  return (
    <PageShell
      title={t("patients.editPatientTitle","Edit Patient")}
      description={`${t("patients.updating","Updating")} ${patient.id}`}
    >
      <div className="flex gap-3 mb-6">
        <Link to={`/dashboard/patients/${patient.id}`} className="carevia-btn-secondary">
          <span className="material-symbols-outlined text-[18px]">visibility</span>
          {t("patients.viewRecord","View record")}
        </Link>
        <Link to="/dashboard/patients" className="carevia-btn-secondary">
          {t("common.cancel","Cancel")}
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        {error && (
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
            <span className="material-symbols-outlined text-[16px]">error</span>{error}
          </div>
        )}

        {/* Personal Info */}
        <div className="bg-surface/40 border border-outline-variant/20 rounded-2xl p-6 space-y-5">
          <p className="text-[10px] font-black text-outline uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">person</span>{t("patients.personalInfo")}
          </p>

          <div className="space-y-2">
            <label className={labelCls}>{t("patients.fullName","Full name")} *</label>
            <input className={inputCls} value={form.name} onChange={e => set("name", e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("newPatient.gender")}</label>
              <select className={inputCls} value={form.gender} onChange={e => set("gender", e.target.value)}>
                <option value="Male">{t("common.Male")}</option>
                <option value="Female">{t("common.Female")}</option>
                <option value="Other">{t("common.Other")}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelCls}>{t("patients.age","Age")} *</label>
              <input className={inputCls} type="number" min={0} max={150} value={form.age} onChange={e => set("age", e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("newPatient.bloodType")}</label>
              <select className={inputCls} value={form.bloodType} onChange={e => set("bloodType", e.target.value)}>
                {BLOOD_TYPES.map(b => <option key={b}>{b}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelCls}>{t("newPatient.phone")}</label>
              <input className={inputCls} type="tel" value={form.phone} onChange={e => set("phone", e.target.value)} />
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelCls}>{t("auth.email")}</label>
            <input className={inputCls} type="email" value={form.email} onChange={e => set("email", e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className={labelCls}>{t("newPatient.address")}</label>
            <input className={inputCls} value={form.address} onChange={e => set("address", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("newPatient.emergencyContact")}</label>
              <input className={inputCls} value={form.emergencyContact} onChange={e => set("emergencyContact", e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className={labelCls}>{t("newPatient.emergencyPhone")}</label>
              <input className={inputCls} type="tel" value={form.emergencyPhone} onChange={e => set("emergencyPhone", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Medical Info */}
        <div className="bg-surface/40 border border-outline-variant/20 rounded-2xl p-6 space-y-5">
          <p className="text-[10px] font-black text-outline uppercase tracking-widest flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">medical_services</span>{t("patients.medicalInfo")}
          </p>

          <div className="space-y-2">
            <label className={labelCls}>{t("patients.diagnosis","Diagnosis / notes")} *</label>
            <input className={inputCls} value={form.diagnosis} onChange={e => set("diagnosis", e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelCls}>{t("newPatient.diseaseCategory")}</label>
              <select className={inputCls} value={form.diseaseType} onChange={e => set("diseaseType", e.target.value)}>
                {DISEASE_TYPES.map(d => <option key={d} value={d}>{t(`medical.diseases.${d}`)}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelCls}>{t("patients.status","Status")}</label>
              <select className={inputCls} value={form.status} onChange={e => set("status", e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{t(`status.${s}`,s)}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className={labelCls}>{t("patients.lastVisit","Last visit date")}</label>
            <input className={inputCls} type="date" value={form.lastVisit} onChange={e => set("lastVisit", e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className={labelCls}>{t("patients.medicalHistory")}</label>
            <textarea className={`${inputCls} resize-none`} rows={3} value={form.medicalHistory} onChange={e => set("medicalHistory", e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className={labelCls}>{t("patients.allergies")}</label>
            <textarea className={`${inputCls} resize-none`} rows={2} value={form.allergies} onChange={e => set("allergies", e.target.value)} />
          </div>

          <div className="space-y-2">
            <label className={labelCls}>{t("patients.currentMedications")}</label>
            <textarea className={`${inputCls} resize-none`} rows={2} value={form.currentMedications} onChange={e => set("currentMedications", e.target.value)} />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="submit" className="carevia-btn-primary">
            <span className="material-symbols-outlined text-[18px] relative z-10">save</span>
            {t("common.save","Save Changes")}
          </button>
        </div>
      </form>
    </PageShell>
  );
}
