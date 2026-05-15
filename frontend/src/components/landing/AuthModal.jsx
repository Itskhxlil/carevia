import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { signIn, signUp } from "../../services/authStorage.js";
import logo from "../../assets/logo.png";

const SPECIALTIES = [
  "cardiology", "diabetes", "pulmonology",
  "nephrology", "general",
];

export default function AuthModal({ mode, setMode, onClose, onSuccess }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState("");

  function handleSignIn(e) {
    e.preventDefault(); setError("");
    const r = signIn({ email, password });
    if (!r.ok) { setError(t("auth.errorInvalid")); return; }
    onSuccess();
  }

  function handleSignUp(e) {
    e.preventDefault(); setError("");
    if (password.length < 6) { setError(t("auth.passwordShort")); return; }
    if (password !== confirm) { setError(t("auth.passwordMatch")); return; }
    const r = signUp({ email, password, name, specialty });
    if (!r.ok) { setError(t("auth.errorExists")); return; }
    onSuccess();
  }

  const inputCls =
    "w-full ps-10 pe-4 py-3 rounded-xl outline-none text-sm font-medium bg-surface-container-low border border-outline-variant/80 text-on-surface placeholder-outline focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="relative w-full max-w-md bg-surface rounded-2xl p-8 shadow-[0_40px_100px_rgba(0,0,0,0.3),0_0_0_1px_rgba(var(--color-primary),0.1)] animate-[carevia-fade-in-up_0.4s_ease-out_both]"
        role="dialog"
      >
        {/* Close */}
        <button
          type="button" onClick={onClose}
          className="absolute top-4 end-4 bg-surface-container-high/60 hover:bg-surface-container-high/90 p-2 rounded-xl text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <img src={logo} alt="Carevia" className="h-48 w-auto transform scale-110" />
        </div>

        {/* Tab switcher */}
        <div className="flex bg-surface-container-low/60 p-1 rounded-xl mb-6 border border-outline-variant/80">
          {[["signin", t("auth.signInBtn")], ["signup", t("auth.signUpBtn")]].map(([m, label]) => (
            <button
              key={m} type="button"
              onClick={() => { setMode(m); setError(""); }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${
                mode === m
                  ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-md"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mb-5">
          <h2 className="text-lg font-bold text-on-surface">
            {t("auth.welcome")}
          </h2>
        </div>

        {mode === "signin" ? (
          <form onSubmit={handleSignIn} className="space-y-4">
            <Field label={t("auth.email")} icon="mail">
              <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="doctor@clinic.org" className={inputCls} />
            </Field>
            <Field label={t("auth.password")} icon="lock">
              <input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" className={inputCls} />
            </Field>
            {error && <ErrorMsg message={error} />}
            <button type="submit" className="carevia-btn-primary w-full mt-2">
              {t("auth.signInBtn")}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUp} className="space-y-4">
            <Field label={t("auth.name")} icon="person">
              <input type="text" required value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Dr. Samira Al-Najjar" className={inputCls} />
            </Field>
            <Field label={t("auth.email")} icon="mail">
              <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="doctor@clinic.org" className={inputCls} />
            </Field>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant ms-1">{t("auth.specialty")}</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">medical_services</span>
                <select required value={specialty} onChange={(e) => { setSpecialty(e.target.value); setError(""); }} className={`${inputCls} appearance-none`}>
                  <option value="" disabled>{t("auth.selectSpecialty")}</option>
                  {SPECIALTIES.map((s) => <option key={s} value={s}>{t(`medical.diseases.${s}`)}</option>)}
                </select>
                <span className="material-symbols-outlined absolute end-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">keyboard_arrow_down</span>
              </div>
            </div>
            <Field label={t("auth.password")} icon="lock">
              <input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" className={inputCls} />
            </Field>
            <Field label={t("auth.password")} icon="verified_user">
              <input type="password" required value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(""); }} placeholder="••••••••" className={inputCls} />
            </Field>
            {error && <ErrorMsg message={error} />}
            <button type="submit" className="carevia-btn-primary w-full mt-2">
              {t("auth.createAccountBtn")}
            </button>
          </form>
        )}

        <p className="mt-5 pt-4 border-t border-outline-variant/15 text-[10px] text-outline text-center">
          {t("auth.demoNote")}
        </p>
      </div>
    </div>
  );
}

function Field({ label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-on-surface-variant ms-1">{label}</label>
      <div className="relative">
        <span className="material-symbols-outlined absolute start-3 top-1/2 -translate-y-1/2 text-outline text-[18px] pointer-events-none">{icon}</span>
        {children}
      </div>
    </div>
  );
}

function ErrorMsg({ message }) {
  return (
    <div className="flex items-center gap-2 text-error text-xs font-medium py-2 px-3 bg-error/10 rounded-xl border border-error/20">
      <span className="material-symbols-outlined text-[14px]">error</span>
      {message}
    </div>
  );
}
