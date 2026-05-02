import React from "react";
import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: "group",
    title: "Patient Registry",
    desc: "Centralized records for your entire patient base. Search, filter, and access any record instantly.",
    gradient: "from-teal-500/15 to-emerald-500/5",
    iconColor: "text-teal-400",
    border: "border-teal-500/15",
    preview: (
      <div className="mt-4 bg-slate-900/50 rounded-xl p-3 border border-slate-800/30">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center text-[7px] font-black text-white">AH</div>
          <div><p className="text-[9px] font-bold text-white">Ahmad Hassan</p><p className="text-[7px] text-slate-500">CRV-0042 · Critical</p></div>
          <span className="ml-auto text-[7px] font-bold text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded-full">!</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-[7px] font-black text-white">SM</div>
          <div><p className="text-[9px] font-bold text-white">Sarah Mitchell</p><p className="text-[7px] text-slate-500">CRV-0118 · Stable</p></div>
          <span className="ml-auto text-[7px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">✓</span>
        </div>
      </div>
    ),
  },
  {
    icon: "monitor_heart",
    title: "Vital Tracking",
    desc: "Log BP, glucose, SpO₂, weight with temporal trend analysis. Every entry timestamped chronologically.",
    gradient: "from-sky-500/15 to-blue-500/5",
    iconColor: "text-sky-400",
    border: "border-sky-500/15",
    preview: (
      <div className="mt-4 bg-slate-900/50 rounded-xl p-3 border border-slate-800/30">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Glucose", value: "186", unit: "mg/dL", alert: true },
            { label: "SpO₂", value: "97", unit: "%", alert: false },
          ].map((v) => (
            <div key={v.label} className={`p-2 rounded-lg border ${v.alert ? "border-rose-500/20 bg-rose-500/5" : "border-slate-700/30 bg-slate-800/30"}`}>
              <p className="text-[7px] text-slate-500 uppercase">{v.label}</p>
              <p className={`text-sm font-black ${v.alert ? "text-rose-400" : "text-white"}`}>{v.value}<span className="text-[8px] font-normal text-slate-500 ml-0.5">{v.unit}</span></p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: "monitoring",
    title: "Clinical Analytics",
    desc: "Status distribution charts, vital trends, and cross-patient comparative views for data-driven care.",
    gradient: "from-violet-500/15 to-purple-500/5",
    iconColor: "text-violet-400",
    border: "border-violet-500/15",
    preview: (
      <div className="mt-4 bg-slate-900/50 rounded-xl p-3 border border-slate-800/30">
        <div className="flex items-end gap-1 h-12 px-1">
          {[35, 55, 40, 70, 50, 80, 65, 75].map((h, i) => (
            <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-violet-500/70 to-purple-400/50" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    ),
  },
  {
    icon: "qr_code_2",
    title: "QR Patient Access",
    desc: "Generate shareable QR codes for instant bedside record retrieval — no search friction.",
    gradient: "from-amber-500/15 to-yellow-500/5",
    iconColor: "text-amber-400",
    border: "border-amber-500/15",
    preview: (
      <div className="mt-4 flex justify-center">
        <div className="w-16 h-16 bg-slate-900/50 rounded-xl border border-slate-800/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-amber-400/60 text-[32px]">qr_code_2</span>
        </div>
      </div>
    ),
  },
  {
    icon: "notifications_active",
    title: "Smart Alerts",
    desc: "Contextual flags for critical values, overdue follow-ups, and pending lab results.",
    gradient: "from-rose-500/15 to-pink-500/5",
    iconColor: "text-rose-400",
    border: "border-rose-500/15",
    preview: (
      <div className="mt-4 space-y-1.5">
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/15">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          <span className="text-[8px] text-rose-300 font-medium">Glucose elevated — review meds</span>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/15">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span className="text-[8px] text-amber-300 font-medium">Follow-up overdue by 5 days</span>
        </div>
      </div>
    ),
  },
  {
    icon: "lock",
    title: "Local-First Privacy",
    desc: "All data stored locally on your device. Zero cloud dependency. Full control over patient information.",
    gradient: "from-emerald-500/15 to-teal-500/5",
    iconColor: "text-emerald-400",
    border: "border-emerald-500/15",
    preview: (
      <div className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
        <span className="material-symbols-outlined text-emerald-400 text-[18px]">shield</span>
        <div>
          <p className="text-[9px] font-bold text-emerald-300">Data encrypted locally</p>
          <p className="text-[7px] text-slate-500">Zero external transmission</p>
        </div>
      </div>
    ),
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-28 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-teal-500/[0.03] rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-cyan-500/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-bold tracking-[0.2em] text-teal-400 uppercase mb-3 block">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-headline mb-5">
            Everything a clinician needs
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto">
            Not a generic health app — a physician-grade archiving tool built for real clinical workflows.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={fadeUp}
              className={`group relative rounded-2xl p-6 bg-gradient-to-br ${f.gradient} border ${f.border} backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] hover:border-opacity-40`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className={`material-symbols-outlined text-[22px] ${f.iconColor}`}>{f.icon}</span>
                </div>
                <h3 className="text-base font-bold text-white font-headline">{f.title}</h3>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              {f.preview}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
