import React from "react";
import { motion } from "framer-motion";

const PROBLEMS = [
  {
    icon: "folder_off",
    title: "Scattered Patient Records",
    desc: "Paper files, spreadsheets, and multiple disconnected systems. Critical data gets lost between departments.",
    stat: "62%",
    statLabel: "of clinics still rely on paper",
    gradient: "from-rose-500/20 to-red-600/10",
    iconBg: "bg-rose-500/15",
    iconColor: "text-rose-400",
    borderColor: "border-rose-500/15",
  },
  {
    icon: "timer_off",
    title: "Slow Record Retrieval",
    desc: "Minutes wasted searching for patient history during critical consultations. Time that should go to patient care.",
    stat: "4.5min",
    statLabel: "avg. time to find a record",
    gradient: "from-amber-500/20 to-orange-600/10",
    iconBg: "bg-amber-500/15",
    iconColor: "text-amber-400",
    borderColor: "border-amber-500/15",
  },
  {
    icon: "visibility_off",
    title: "Missed Critical Alerts",
    desc: "Abnormal lab values go unnoticed. Elevated glucose, dangerous BP readings — without automated flags, they slip through.",
    stat: "28%",
    statLabel: "of critical values missed",
    gradient: "from-violet-500/20 to-purple-600/10",
    iconBg: "bg-violet-500/15",
    iconColor: "text-violet-400",
    borderColor: "border-violet-500/15",
  },
];

const SOLUTIONS = [
  {
    icon: "hub",
    title: "Unified Patient Archive",
    desc: "Every record, vital, and note — in one searchable workspace. Find any patient in under 2 seconds.",
    iconColor: "text-teal-400",
    iconBg: "bg-teal-500/15",
  },
  {
    icon: "speed",
    title: "Instant Clinical Access",
    desc: "QR-code bedside retrieval. Structured data entry. Zero redundant clicking.",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/15",
  },
  {
    icon: "notifications_active",
    title: "Smart Value Flagging",
    desc: "Automatic alerts for out-of-range vitals. Critical, warning, and normal — at a glance.",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: "easeOut" },
  }),
};

export default function ProblemsSection() {
  return (
    <section id="problems" className="py-28 relative">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-outline/30 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[11px] font-bold tracking-[0.2em] text-rose-400/80 uppercase mb-3 block">
            The Problem
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface font-headline mb-5">
            Healthcare data is{" "}
            <span className="text-rose-400">broken</span>
          </h2>
          <p className="text-on-surface-variant text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Doctors spend more time searching for records than treating patients. 
            Critical information falls through the cracks.
          </p>
        </motion.div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-24">
          {PROBLEMS.map((p, i) => (
            <motion.div
              key={p.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className={`group relative rounded-2xl p-6 bg-gradient-to-br ${p.gradient} border ${p.borderColor} backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]`}
            >
              <div className={`w-12 h-12 rounded-xl ${p.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <span className={`material-symbols-outlined text-[24px] ${p.iconColor}`}>{p.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2 font-headline">{p.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-5">{p.desc}</p>
              <div className="pt-4 border-t border-outline-variant/10">
                <span className={`text-2xl font-black ${p.iconColor} font-headline`}>{p.stat}</span>
                <span className="text-[11px] text-outline ml-2">{p.statLabel}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider arrow */}
        <div className="flex justify-center mb-20">
          <div className="w-12 h-12 rounded-full border border-teal-500/20 bg-teal-500/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-teal-400 text-[20px] animate-bounce">arrow_downward</span>
          </div>
        </div>

        {/* Solution header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-bold tracking-[0.2em] text-teal-400 uppercase mb-3 block">
            The Solution
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface font-headline mb-5">
            Carevia{" "}
            <span className="bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
              fixes this
            </span>
          </h2>
        </motion.div>

        {/* Solution cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SOLUTIONS.map((s, i) => (
            <motion.div
              key={s.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="group relative rounded-2xl p-6 bg-gradient-to-br from-teal-500/[0.07] to-cyan-500/[0.04] border border-teal-500/15 backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(20,184,166,0.1)] hover:border-teal-500/25"
            >
              <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <span className={`material-symbols-outlined text-[24px] ${s.iconColor}`}>{s.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2 font-headline">{s.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
