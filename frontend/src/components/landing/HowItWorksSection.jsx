import React from "react";
import { motion } from "framer-motion";

const STEPS = [
  {
    step: "01",
    icon: "person_add",
    title: "Register Patients",
    desc: "Enter demographics, diagnosis, and initial status. The record is searchable immediately across your workspace.",
    color: "teal",
    accent: "from-teal-400 to-emerald-500",
  },
  {
    step: "02",
    icon: "edit_note",
    title: "Record & Track",
    desc: "Log vitals after each encounter — glucose, blood pressure, weight, SpO₂. Every entry is timestamped and stored.",
    color: "cyan",
    accent: "from-cyan-400 to-sky-500",
  },
  {
    step: "03",
    icon: "insights",
    title: "Analyze & Decide",
    desc: "View trend charts, status breakdowns, and critical alerts. Make faster, data-informed clinical decisions.",
    color: "sky",
    accent: "from-sky-400 to-blue-500",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-28 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050d18] via-[#071520] to-[#050d18]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[11px] font-bold tracking-[0.2em] text-teal-400 uppercase mb-3 block">
            Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface font-headline mb-5">
            Three steps to{" "}
            <span className="bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
              clinical clarity
            </span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto">
            From patient registration to actionable insight — in under a minute.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-[72px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px]">
            <div className="w-full h-full bg-gradient-to-r from-teal-500/30 via-cyan-500/30 to-sky-500/30 rounded-full" />
            <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-teal-400/60 to-transparent rounded-full animate-pulse" style={{ animationDuration: "3s" }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Circle with icon */}
                <div className="relative mb-8">
                  {/* Outer ring */}
                  <div className={`w-[120px] h-[120px] rounded-full border-2 border-${step.color}-500/15 flex items-center justify-center bg-gradient-to-br from-${step.color}-500/[0.06] to-transparent`}>
                    {/* Inner circle */}
                    <div className="w-[84px] h-[84px] rounded-full bg-[#0a1525] border border-slate-700/40 flex items-center justify-center group-hover:border-teal-500/30 transition-colors duration-500">
                      <span className={`material-symbols-outlined text-${step.color}-400 text-[32px] group-hover:scale-110 transition-transform duration-300`}>
                        {step.icon}
                      </span>
                    </div>
                  </div>
                  {/* Step number */}
                  <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br ${step.accent} text-white text-xs font-black flex items-center justify-center shadow-[0_4px_16px_rgba(20,184,166,0.4)]`}>
                    {i + 1}
                  </div>
                  {/* Glow */}
                  <div className={`absolute inset-0 rounded-full bg-${step.color}-500/[0.05] blur-2xl pointer-events-none group-hover:bg-${step.color}-500/[0.1] transition-all duration-500`} />
                </div>

                <h3 className="text-lg font-bold text-on-surface mb-3 font-headline">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
