import React, { useState } from "react";
import { signIn, signUp } from "../../services/authStorage.js";

const SPECIALTIES = [
  "Cardiology", "Diabetes & Endocrinology", "Neurology",
  "Pediatrics", "Radiology", "General Practice",
];

export default function AuthModal({ mode, setMode, onClose, onSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState("");

  function handleSignIn(e) {
    e.preventDefault(); setError("");
    const r = signIn({ email, password });
    if (!r.ok) { setError(r.error); return; }
    onSuccess();
  }

  function handleSignUp(e) {
    e.preventDefault(); setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    const r = signUp({ email, password, name, specialty });
    if (!r.ok) { setError(r.error); return; }
    onSuccess();
  }

  const inputCls =
    "w-full pl-10 pr-4 py-3 rounded-xl outline-none text-sm font-medium bg-[#0d1f30] border border-[#1e3a52] text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/50 transition-all";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md bg-[#0a1929] rounded-2xl p-8 shadow-[0_40px_100px_rgba(0,0,0,0.7),0_0_0_1px_rgba(20,184,166,0.15)] animate-[carevia-fade-in-up_0.4s_ease-out_both]"
        role="dialog"
      >
        {/* Close */}
        <button
          type="button" onClick={onClose}
          className="absolute top-4 right-4 bg-slate-800/60 hover:bg-slate-700/60 p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shadow-[0_0_16px_rgba(20,184,166,0.5)]">
            <span className="material-symbols-outlined text-white text-[18px]">favorite</span>
          </div>
          <div>
            <p className="text-base font-extrabold text-white font-headline">Carevia</p>
            <p className="text-[10px] text-teal-400/70 uppercase tracking-wider">Clinical Archivist</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex bg-slate-900/60 p-1 rounded-xl mb-6 border border-slate-700/40">
          {[["signin", "Sign in"], ["signup", "Create account"]].map(([m, label]) => (
            <button
              key={m} type="button"
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                mode === m
                  ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-5">
          <h2 className="text-lg font-bold text-white">
            {mode === "signin" ? "Welcome back, Doctor" : "Set up your workspace"}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {mode === "signin" ? "Sign in with your registered credentials." : "Your data stays securely in this browser."}
          </p>
        </div>

        {mode === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <Field label="Email" icon="mail">
              <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="doctor@clinic.org" className={inputCls} />
            </Field>
            <Field label="Password" icon="lock">
              <input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" className={inputCls} />
            </Field>
            {error && <ErrorMsg message={error} />}
            <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(20,184,166,0.35)] hover:shadow-[0_6px_28px_rgba(20,184,166,0.5)] mt-2">
              Sign in to Dashboard
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <Field label="Full name" icon="person">
              <input type="text" required value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Dr. Samira Al-Najjar" className={inputCls} />
            </Field>
            <Field label="Email" icon="mail">
              <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="doctor@clinic.org" className={inputCls} />
            </Field>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 ml-1">Specialty</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px] pointer-events-none">medical_services</span>
                <select required value={specialty} onChange={(e) => { setSpecialty(e.target.value); setError(""); }} className={`${inputCls} appearance-none`}>
                  <option value="" disabled>Select specialty</option>
                  {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px] pointer-events-none">keyboard_arrow_down</span>
              </div>
            </div>
            <Field label="Password" icon="lock">
              <input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="At least 6 characters" className={inputCls} />
            </Field>
            <Field label="Confirm password" icon="verified_user">
              <input type="password" required value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(""); }} placeholder="Repeat password" className={inputCls} />
            </Field>
            {error && <ErrorMsg message={error} />}
            <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(20,184,166,0.35)] hover:shadow-[0_6px_28px_rgba(20,184,166,0.5)] mt-2">
              Create account & enter
            </button>
          </form>
        )}

        <p className="mt-5 pt-4 border-t border-slate-800 text-[10px] text-slate-600 text-center">
          Demo mode — credentials stored only in this browser session.
        </p>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 ml-1">{label}</label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px] pointer-events-none">{icon}</span>
        {children}
      </div>
    </div>
  );
}

function ErrorMsg({ message }) {
  return (
    <div className="flex items-center gap-2 text-rose-400 text-xs font-medium py-2 px-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
      <span className="material-symbols-outlined text-[14px]">error</span>
      {message}
    </div>
  );
}
