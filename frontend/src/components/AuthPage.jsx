import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, signIn, signUp } from "../services/authStorage.js";
import logo from "../assets/logo.png";

const SPECIALTIES = [
  "Cardiology",
  "Diabetes & Endocrinology",
  "Neurology",
  "Pediatrics",
  "Radiology",
  "General Practice",
];

const FEATURES = [
  {
    icon: "group",
    title: "Patient Management",
    desc: "Centralized records for your entire patient registry. Search, filter, and access any record instantly.",
    color: "from-teal-500/20 to-cyan-500/10",
    iconColor: "text-teal-400",
    border: "border-teal-500/20",
  },
  {
    icon: "description",
    title: "Medical Records",
    desc: "Structured clinical documentation. Attach labs, prescriptions, and notes to each visit.",
    color: "from-sky-500/20 to-blue-500/10",
    iconColor: "text-sky-400",
    border: "border-sky-500/20",
  },
  {
    icon: "monitor_heart",
    title: "Measurements Tracking",
    desc: "Log and visualize BP, glucose, weight, and SpO₂ with temporal trend analysis.",
    color: "from-emerald-500/20 to-teal-500/10",
    iconColor: "text-emerald-400",
    border: "border-emerald-500/20",
  },
  {
    icon: "monitoring",
    title: "Clinical Analytics",
    desc: "Status distribution charts, vital trends, and cross-patient comparative views.",
    color: "from-violet-500/20 to-purple-500/10",
    iconColor: "text-violet-400",
    border: "border-violet-500/20",
  },
  {
    icon: "qr_code_2",
    title: "QR Patient Access",
    desc: "Generate shareable QR codes for fast bedside record retrieval — no search needed.",
    color: "from-amber-500/20 to-yellow-500/10",
    iconColor: "text-amber-400",
    border: "border-amber-500/20",
  },
  {
    icon: "analytics",
    title: "Decision Support",
    desc: "Contextual flags for critical values, overdue follow-ups, and pending lab results.",
    color: "from-rose-500/20 to-pink-500/10",
    iconColor: "text-rose-400",
    border: "border-rose-500/20",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: "person_add",
    title: "Register a Patient",
    desc: "Enter demographics, diagnosis, and initial status. The record is immediately searchable across your workspace.",
  },
  {
    step: "02",
    icon: "biotech",
    title: "Record Measurements",
    desc: "Log vitals after each encounter — glucose, blood pressure, weight. Every entry is timestamped and stored chronologically.",
  },
  {
    step: "03",
    icon: "trending_up",
    title: "Analyze & Decide",
    desc: "View trend charts, status breakdowns, and critical alerts. Make faster, data-informed clinical decisions.",
  },
];

const STATS = [
  { value: "< 2s", label: "Record retrieval time" },
  { value: "100%", label: "Local data privacy" },
  { value: "5+", label: "Vital metrics tracked" },
  { value: "∞", label: "Patients per workspace" },
];

export default function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signin");
  const [showAuth, setShowAuth] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [error, setError] = useState("");
  const [scrolled, setScrolled] = useState(false);

  function goDashboard() { navigate("/dashboard", { replace: true }); }

  useEffect(() => {
    if (getSession()) goDashboard();
  }, [navigate]);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 20); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleSignIn(e) {
    e.preventDefault();
    setError("");
    const r = signIn({ email, password });
    if (!r.ok) { setError(r.error); return; }
    goDashboard();
  }

  function handleSignUp(e) {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    const r = signUp({ email, password, name, specialty });
    if (!r.ok) { setError(r.error); return; }
    goDashboard();
  }

  const inputCls =
    "w-full pl-10 pr-4 py-3 rounded-xl outline-none text-sm font-medium bg-[#0d1f30] border border-[#1e3a52] text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500/50 transition-all";

  return (
    <div className="min-h-screen bg-[#060f1a] text-slate-100 overflow-x-hidden font-body">

      {/* ══════ TOP NAV BAR ══════ */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#060f1a]/95 backdrop-blur-xl border-b border-teal-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <img src={logo} alt="Carevia" className="h-28 w-auto transform scale-110" />
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "For Clinicians"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-sm text-slate-400 hover:text-teal-400 transition-colors duration-200"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* CTA buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setShowAuth(true); setMode("signin"); }}
              className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden sm:block"
            >
              Sign in
            </button>
            <button
              type="button"
              id="landing-cta-top"
              onClick={() => { setShowAuth(true); setMode("signup"); }}
              className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-[0_4px_20px_rgba(20,184,166,0.35)] hover:shadow-[0_6px_28px_rgba(20,184,166,0.5)] hover:-translate-y-0.5"
            >
              Access Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* ══════ HERO SECTION ══════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-16 pb-32 overflow-hidden">
        {/* Background mesh */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-teal-500/8 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-40 left-10 w-64 h-64 bg-blue-500/6 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-cyan-500/6 rounded-full blur-3xl" />
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#14b8a6" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* ECG line decoration */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 pointer-events-none opacity-10">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path
              d="M0,40 L200,40 L220,40 L240,10 L260,70 L280,5 L300,75 L320,40 L420,40 L440,40 L460,25 L480,55 L500,40 L600,40 L620,40 L640,15 L660,65 L680,5 L700,75 L720,40 L820,40 L840,40 L860,20 L880,60 L900,40 L1000,40 L1020,40 L1040,10 L1060,70 L1080,5 L1100,75 L1120,40 L1220,40 L1240,40 L1260,25 L1280,55 L1300,40 L1440,40"
              stroke="#14b8a6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/25 rounded-full px-4 py-2 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-xs font-semibold text-teal-300 tracking-wider uppercase">
              Clinical Patient Monitoring Platform
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[76px] font-black text-white leading-[1.05] mb-6 tracking-tight font-headline">
            Monitor Patient Health<br />
            <span className="bg-gradient-to-r from-teal-400 via-cyan-400 to-sky-400 bg-clip-text text-transparent">
              with Precision
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
            Track medical measurements, analyze clinical trends, and improve diagnostic decisions — all within a single secure workspace built for physicians.
          </p>

          {/* CTA group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              id="landing-cta-hero"
              onClick={() => { setShowAuth(true); setMode("signup"); }}
              className="group relative bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white px-9 py-4 rounded-2xl text-base font-bold transition-all duration-300 shadow-[0_8px_32px_rgba(20,184,166,0.4)] hover:shadow-[0_12px_48px_rgba(20,184,166,0.55)] hover:-translate-y-1 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                Start Now — It's Free
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
            <button
              type="button"
              onClick={() => { setShowAuth(true); setMode("signin"); }}
              className="flex items-center gap-2 px-9 py-4 rounded-2xl text-base font-semibold text-slate-300 hover:text-white border border-slate-700 hover:border-teal-500/50 bg-white/5 hover:bg-white/8 transition-all duration-300"
            >
              <span className="material-symbols-outlined text-[20px]">login</span>
              Access Dashboard
            </button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
            {["No subscription required", "Data stays on your device", "HIPAA-conscious design"].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-teal-500 text-[14px]">check_circle</span>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard preview mockup */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 mt-20 w-full">
          <div className="relative rounded-2xl overflow-hidden border border-teal-500/15 shadow-[0_40px_100px_rgba(0,0,0,0.6),0_0_0_1px_rgba(20,184,166,0.1)]">
            {/* Browser chrome */}
            <div className="bg-[#0d1f30] border-b border-slate-700/50 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/70" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                <div className="w-3 h-3 rounded-full bg-green-500/70" />
              </div>
              <div className="flex-1 mx-4 bg-[#060f1a] rounded-md px-3 py-1 text-xs text-slate-500 text-center">
                carevia.app/dashboard/overview
              </div>
            </div>
            {/* Mock dashboard inside */}
            <div className="bg-[#070e18] p-4 sm:p-6 grid grid-cols-12 gap-4 min-h-[320px]">
              {/* Sidebar mock */}
              <div className="col-span-2 hidden sm:flex flex-col gap-2">
                <div className="h-8 bg-teal-500/15 rounded-lg border border-teal-500/20" />
                {["", "", "", "", ""].map((_, i) => (
                  <div key={i} className={`h-7 rounded-lg ${i === 0 ? "bg-slate-700/60" : "bg-slate-800/40"}`} />
                ))}
              </div>
              {/* Main content mock */}
              <div className="col-span-12 sm:col-span-10 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Total Patients", val: "247", color: "teal" },
                    { label: "Critical Cases", val: "12", color: "rose" },
                    { label: "Appointments", val: "38", color: "sky" },
                    { label: "Lab Results", val: "94", color: "amber" },
                  ].map((s) => (
                    <div key={s.label} className={`bg-slate-800/60 rounded-xl p-3 border border-slate-700/40`}>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider">{s.label}</p>
                      <p className={`text-xl font-black text-${s.color}-400 mt-1`}>{s.val}</p>
                    </div>
                  ))}
                </div>
                {/* Chart area mock */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2 bg-slate-800/50 rounded-xl p-3 border border-slate-700/30 h-32 flex items-end gap-1.5 px-4">
                    {[55, 70, 45, 80, 60, 90, 75, 85, 65, 95, 70, 80].map((h, i) => (
                      <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-teal-500 to-cyan-400 opacity-80" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/30 h-32 space-y-2">
                    {["Stable", "Critical", "Pending", "Discharged"].map((s, i) => (
                      <div key={s} className="flex items-center justify-between">
                        <span className="text-[9px] text-slate-500">{s}</span>
                        <div className="w-16 h-1.5 rounded-full bg-slate-700">
                          <div className={`h-full rounded-full ${["bg-teal-400", "bg-rose-400", "bg-amber-400", "bg-slate-400"][i]}`} style={{ width: ["75%", "20%", "35%", "60%"][i] }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Glow under mockup */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-24 bg-teal-500/10 blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* ══════ STATS BAR ══════ */}
      <section className="relative border-y border-slate-800/60 bg-[#070e18]/80 backdrop-blur-sm py-10">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-1">
              <span className="text-3xl font-black text-teal-400 font-headline">{s.value}</span>
              <span className="text-xs text-slate-500 uppercase tracking-wider">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════ FEATURES SECTION ══════ */}
      <section id="features" className="py-28 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-72 h-72 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-[0.2em] text-teal-400 uppercase mb-3 block">Platform Features</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-headline mb-4">
              Everything clinicians need
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Purpose-built for physicians and clinical staff. Not a generic health app — a professional archiving tool.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className={`relative rounded-2xl p-6 bg-gradient-to-br ${f.color} border ${f.border} backdrop-blur-sm group hover:-translate-y-1 transition-all duration-300 hover:shadow-[0_12px_40px_rgba(0,0,0,0.3)]`}
              >
                <div className={`w-11 h-11 rounded-xl bg-slate-900/60 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className={`material-symbols-outlined text-[24px] ${f.iconColor}`}>{f.icon}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2 font-headline">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section id="how-it-works" className="py-28 bg-[#070e18]/60">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-bold tracking-[0.2em] text-teal-400 uppercase mb-3 block">Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-headline mb-4">
              How it works
            </h2>
            <p className="text-slate-400 text-base max-w-xl mx-auto">
              Three simple steps from patient registration to clinical insight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-14 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-teal-500/40 via-cyan-500/40 to-blue-500/40" />

            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="flex flex-col items-center text-center relative">
                <div className="relative mb-6">
                  {/* Step number ring */}
                  <div className="w-28 h-28 rounded-full border-2 border-teal-500/20 flex items-center justify-center bg-gradient-to-br from-teal-500/10 to-cyan-500/5 shadow-[0_0_40px_rgba(20,184,166,0.12)]">
                    <div className="w-20 h-20 rounded-full bg-[#0d1f30] border border-teal-500/20 flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-teal-400 text-[28px]">{step.icon}</span>
                    </div>
                  </div>
                  {/* Step number badge */}
                  <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-teal-500 text-white text-xs font-black flex items-center justify-center shadow-[0_4px_12px_rgba(20,184,166,0.5)]">
                    {i + 1}
                  </div>
                </div>
                <h3 className="text-base font-bold text-white mb-3 font-headline">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FOR CLINICIANS ══════ */}
      <section id="for-clinicians" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-teal-900/10 via-transparent to-blue-900/10" />
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-teal-400 uppercase mb-3 block">For Clinicians</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-headline mb-6 leading-tight">
              Designed for clinical<br />
              <span className="text-teal-400">precision, not marketing</span>
            </h2>
            <p className="text-slate-400 text-base leading-relaxed mb-8">
              Carevia is not a consumer health tracker. It is a physician-grade patient archiving system — built to match the mental model of clinical workflows, not Silicon Valley aesthetics.
            </p>
            <ul className="space-y-4">
              {[
                { icon: "fact_check", text: "Structured data entry that reduces documentation errors" },
                { icon: "visibility", text: "At-a-glance status flags: normal, warning, critical" },
                { icon: "lock", text: "All data is stored locally — zero cloud dependency" },
                { icon: "speed", text: "Fast access: find any patient in under 2 seconds" },
              ].map((item) => (
                <li key={item.text} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-teal-400 text-[16px]">{item.icon}</span>
                  </div>
                  <span className="text-sm text-slate-300 leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual — clinical card */}
          <div className="relative">
            <div className="bg-[#0d1f30] rounded-2xl border border-teal-500/15 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">
              {/* Patient card header */}
              <div className="flex items-start justify-between mb-5 pb-4 border-b border-slate-700/40">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center text-white font-black text-sm shadow-[0_4px_16px_rgba(20,184,166,0.4)]">
                    AH
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Ahmad Hassan</p>
                    <p className="text-xs text-slate-500 mt-0.5">ID: CRV-0042 · Age 54</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/25 uppercase tracking-wider">Critical</span>
              </div>
              {/* Vitals grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { icon: "water_drop", label: "Glucose", value: "186 mg/dL", alert: true },
                  { icon: "favorite", label: "Blood Pressure", value: "148 / 94", alert: true },
                  { icon: "monitor_weight", label: "Weight", value: "87.4 kg", alert: false },
                  { icon: "air", label: "SpO₂", value: "97%", alert: false },
                ].map((v) => (
                  <div key={v.label} className={`rounded-xl p-3 border ${v.alert ? "bg-rose-500/5 border-rose-500/20" : "bg-slate-800/40 border-slate-700/30"}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`material-symbols-outlined text-[14px] ${v.alert ? "text-rose-400" : "text-teal-400"}`}>{v.icon}</span>
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider">{v.label}</span>
                    </div>
                    <p className={`text-sm font-bold ${v.alert ? "text-rose-300" : "text-white"}`}>{v.value}</p>
                  </div>
                ))}
              </div>
              {/* Note */}
              <div className="bg-amber-500/8 border border-amber-500/20 rounded-xl p-3 flex items-start gap-2">
                <span className="material-symbols-outlined text-amber-400 text-[16px] mt-0.5">warning</span>
                <p className="text-xs text-amber-200/80">Glucose and BP elevated — review medication and schedule follow-up within 48h.</p>
              </div>
            </div>
            {/* Glow accent */}
            <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-teal-500/8 rounded-full blur-3xl pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/20 via-[#070e18] to-blue-900/15 pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-teal-500/6 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center mx-auto mb-6 shadow-[0_8px_32px_rgba(20,184,166,0.5)]">
            <span className="material-symbols-outlined text-white text-[32px]">health_metrics</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-headline mb-4">
            Ready to modernize your clinical records?
          </h2>
          <p className="text-slate-400 text-base mb-10 max-w-xl mx-auto leading-relaxed">
            Set up your workspace in under a minute. No subscriptions, no cloud upload, no compromise on data privacy.
          </p>
          <button
            type="button"
            id="landing-cta-bottom"
            onClick={() => { setShowAuth(true); setMode("signup"); }}
            className="group relative bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white px-10 py-4 rounded-2xl text-base font-bold transition-all duration-300 shadow-[0_8px_32px_rgba(20,184,166,0.4)] hover:shadow-[0_12px_48px_rgba(20,184,166,0.55)] hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2 justify-center">
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              Create your workspace
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="border-t border-slate-800/60 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center shrink-0">
            <img src={logo} alt="Carevia" className="h-24 w-auto opacity-80" />
          </div>
          <p className="text-xs text-slate-600">© 2026 Carevia. Patient data stored locally. Zero cloud dependency.</p>
        </div>
      </footer>

      {/* ══════ AUTH MODAL ══════ */}
      {showAuth && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md"
          onClick={(e) => { if (e.target === e.currentTarget) setShowAuth(false); }}
        >
          <div
            className="relative w-full max-w-md bg-[#0a1929] rounded-2xl p-8 shadow-[0_40px_100px_rgba(0,0,0,0.7),0_0_0_1px_rgba(20,184,166,0.15)] animate-[carevia-fade-in-up_0.4s_ease-out_both]"
            role="dialog"
          >
            {/* Close */}
            <button
              type="button"
              onClick={() => setShowAuth(false)}
              className="absolute top-4 right-4 bg-slate-800/60 hover:bg-slate-700/60 p-2 rounded-xl text-slate-400 hover:text-white transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>

            {/* Logo */}
            <div className="flex justify-center mb-10">
              <img src={logo} alt="Carevia" className="h-48 w-auto transform scale-110" />
            </div>

            {/* Tab switcher */}
            <div className="flex bg-slate-900/60 p-1 rounded-xl mb-6 border border-slate-700/40">
              {[["signin", "Sign in"], ["signup", "Create account"]].map(([m, label]) => (
                <button
                  key={m}
                  type="button"
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
                {mode === "signin"
                  ? "Sign in with your registered credentials."
                  : "Your data stays securely in this browser."}
              </p>
            </div>

            {mode === "signin" ? (
              <form onSubmit={handleSignIn} className="space-y-4">
                <AuthField label="Email" icon="mail">
                  <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="doctor@clinic.org" className={inputCls} />
                </AuthField>
                <AuthField label="Password" icon="lock">
                  <input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="••••••••" className={inputCls} />
                </AuthField>
                {error && <AuthError message={error} />}
                <button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white py-3.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(20,184,166,0.35)] hover:shadow-[0_6px_28px_rgba(20,184,166,0.5)] mt-2">
                  Sign in to Dashboard
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignUp} className="space-y-4">
                <AuthField label="Full name" icon="person">
                  <input type="text" required value={name} onChange={(e) => { setName(e.target.value); setError(""); }} placeholder="Dr. Samira Al-Najjar" className={inputCls} />
                </AuthField>
                <AuthField label="Email" icon="mail">
                  <input type="email" required value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} placeholder="doctor@clinic.org" className={inputCls} />
                </AuthField>
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
                <AuthField label="Password" icon="lock">
                  <input type="password" required value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="At least 6 characters" className={inputCls} />
                </AuthField>
                <AuthField label="Confirm password" icon="verified_user">
                  <input type="password" required value={confirm} onChange={(e) => { setConfirm(e.target.value); setError(""); }} placeholder="Repeat password" className={inputCls} />
                </AuthField>
                {error && <AuthError message={error} />}
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
      )}
    </div>
  );
}

function AuthField({ label, icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 ml-1">
        {label}
      </label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px] pointer-events-none">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

function AuthError({ message }) {
  return (
    <div className="flex items-center gap-2 text-rose-400 text-xs font-medium py-2 px-3 bg-rose-500/10 rounded-xl border border-rose-500/20">
      <span className="material-symbols-outlined text-[14px]">error</span>
      {message}
    </div>
  );
}
