import React from "react";
import { motion } from "framer-motion";

export default function CtaSection({ openAuth }) {
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/15 via-transparent to-cyan-900/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-teal-500/[0.04] rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="relative z-10 max-w-3xl mx-auto px-6 text-center"
      >
        {/* Icon */}
        <div className="relative inline-block mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shadow-[0_12px_40px_rgba(20,184,166,0.4)]">
            <span className="material-symbols-outlined text-white text-[36px]">health_metrics</span>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-teal-400/20 animate-ping" style={{ animationDuration: "3s" }} />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface font-headline mb-5 leading-tight">
          Ready to modernize your
          <br />
          <span className="bg-gradient-to-r from-teal-300 to-cyan-400 bg-clip-text text-transparent">
            clinical workflow?
          </span>
        </h2>

        <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          Set up your workspace in under a minute. No subscriptions, no cloud upload, 
          no compromise on patient data privacy.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openAuth("signup")}
            className="group relative bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white px-10 py-4.5 rounded-2xl text-base font-bold transition-all duration-300 shadow-[0_10px_40px_rgba(20,184,166,0.4)] hover:shadow-[0_16px_56px_rgba(20,184,166,0.55)] hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              Start Managing Patients — Free
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>

        {/* Bottom stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { val: "< 2s", label: "Record retrieval" },
            { val: "100%", label: "Local privacy" },
            { val: "5+", label: "Vital metrics" },
            { val: "∞", label: "Patient capacity" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black text-teal-400 font-headline mb-1">{s.val}</p>
              <p className="text-[11px] text-slate-500 uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
