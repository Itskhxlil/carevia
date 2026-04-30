import React, { useMemo, useState } from "react";
import { getSession, updateSession } from "../authStorage.js";
import { usePatients } from "../PatientsContext.jsx";
import PageShell from "./PageShell.jsx";

const SPECIALTIES = [
  "Cardiology",
  "Diabetes & Endocrinology",
  "Neurology",
  "Pediatrics",
  "Radiology",
  "General Practice",
];

export default function ProfilePage() {
  const { patients } = usePatients();
  const initial      = useMemo(() => getSession(), []);
  const [name,        setName]        = useState(initial?.name ?? "");
  const [title,       setTitle]       = useState(initial?.title ?? "");
  const [phone,       setPhone]       = useState(initial?.phone ?? "");
  const [institution, setInstitution] = useState(initial?.institution ?? "");
  const [specialty,   setSpecialty]   = useState(initial?.specialty ?? "");
  const [saved,       setSaved]       = useState(false);

  const initials = useMemo(() => {
    const parts = String(name || "DR").trim().split(/\s+/);
    return parts.slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  }, [name]);

  const memberLabel = initial?.memberSince
    ? new Date(initial.memberSince).toLocaleDateString(undefined, {
        year: "numeric", month: "long", day: "numeric",
      })
    : "—";

  function handleSave(e) {
    e.preventDefault();
    updateSession({ name: name.trim(), title: title.trim(), phone: phone.trim(), institution: institution.trim(), specialty });
    window.dispatchEvent(new Event("carevia-profile-updated"));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <PageShell title="Profile" description="How you appear in the workspace. Changes are saved on this device only.">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">

        {/* Avatar Card */}
        <div className="carevia-glass-card p-7 flex flex-col items-center text-center">
          <div className="relative mb-5">
            <div className="absolute inset-0 rounded-full animate-carevia-glow-pulse"
              style={{ background: "radial-gradient(circle, rgba(13,200,175,0.25) 0%, transparent 70%)", transform: "scale(1.8)" }} />
            <div className="relative h-24 w-24 rounded-full flex items-center justify-center text-white text-xl font-extrabold font-headline ring-4 ring-primary/25 carevia-profile-avatar shadow-[0_0_30px_rgba(13,200,175,0.35)]"
              style={{ background: "linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-primary-dim)) 100%)" }}>
              {initials}
            </div>
          </div>
          <p className="font-bold text-on-surface text-sm">{name || "Your name"}</p>
          <p className="text-xs text-outline mt-0.5">{title || "Role / title"}</p>
          <div className="w-full mt-5 pt-5 border-t border-outline-variant/15 space-y-2">
            <p className="text-[11px] text-outline uppercase tracking-wider">Member since</p>
            <p className="text-xs font-medium text-primary">{memberLabel}</p>
          </div>
          {initial?.legacy && (
            <p className="text-[10px] text-amber-400/90 mt-4 leading-relaxed px-2 text-center">
              Guest session: create an account from the home page to sign in on future visits.
            </p>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Patients",  value: patients.length },
              { label: "Critical",  value: patients.filter((p) => p.status === "Critical").length },
              { label: "Workspace", value: "Local", isText: true },
            ].map((s) => (
              <div key={s.label} className="carevia-glass-card p-5 flex flex-col gap-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-outline">{s.label}</p>
                {s.isText ? (
                  <p className="text-sm font-semibold text-on-surface-variant">Clinical archive</p>
                ) : (
                  <p className="text-2xl font-extrabold font-headline text-on-surface">{s.value}</p>
                )}
              </div>
            ))}
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSave} className="carevia-glass-card p-6 sm:p-8 space-y-5 max-w-2xl">
            <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-wider flex items-center gap-2">
              <span className="w-1 h-5 rounded-full bg-primary inline-block" />
              Professional details
            </h3>

            {/* Email (readonly) */}
            <div className="space-y-2">
              <label htmlFor="pf-email" className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Email
              </label>
              <input
                id="pf-email"
                type="email"
                value={initial?.email || ""}
                disabled
                className="w-full px-4 py-3 rounded-xl bg-surface-container-low/40 border border-outline-variant/20 text-sm text-outline cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldInput id="pf-name" label="Display name" value={name} onChange={setName} required />
              <FieldInput id="pf-title" label="Title / role" value={title} onChange={setTitle} placeholder="e.g. Attending physician" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldInput id="pf-phone" label="Phone" value={phone} onChange={setPhone} placeholder="Optional" type="tel" />
              <FieldInput id="pf-inst" label="Institution" value={institution} onChange={setInstitution} placeholder="Hospital or clinic" />
            </div>

            <div className="space-y-2">
              <label htmlFor="pf-spec" className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Specialty
              </label>
              <select
                id="pf-spec"
                value={specialty || ""}
                onChange={(e) => setSpecialty(e.target.value)}
                required
                className="carevia-auth-input w-full px-4 py-3 rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25 appearance-none"
              >
                <option value="" disabled>Select specialty</option>
                {specialty && !SPECIALTIES.includes(specialty) && (
                  <option value={specialty}>{specialty}</option>
                )}
                {SPECIALTIES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button type="submit" className="carevia-btn-primary">
                <span className="material-symbols-outlined text-[18px] relative z-10">save</span>
                Save profile
              </button>
              {saved && (
                <span className="text-xs font-medium text-primary flex items-center gap-1.5 animate-carevia-fade-in-up">
                  <span className="material-symbols-outlined text-[16px]">check_circle</span>
                  Saved successfully
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
    </PageShell>
  );
}

function FieldInput({ id, label, value, onChange, placeholder = "", type = "text", required = false }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="carevia-auth-input w-full px-4 py-3 rounded-xl text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/25 placeholder:text-outline/50"
      />
    </div>
  );
}
