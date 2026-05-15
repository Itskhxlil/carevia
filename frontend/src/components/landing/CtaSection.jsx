import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function CtaSection({ openAuth }) {
  const { t } = useTranslation();
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-blue-900/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-primary/[0.04] rounded-full blur-[120px]" />
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
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-[0_12px_40px_rgba(37,99,235,0.4)]">
            <span className="material-symbols-outlined text-white text-[36px]">health_metrics</span>
          </div>
          <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping" style={{ animationDuration: "3s" }} />
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface font-headline mb-5 leading-tight">
          {t("landing.cta.title1")}
          <br />
          <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            {t("landing.cta.title2")}
          </span>
        </h2>

        <p className="text-on-surface-variant text-lg mb-12 max-w-xl mx-auto leading-relaxed">
          {t("landing.cta.subtext")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => openAuth("signup")}
            className="group relative bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white px-10 py-4 rounded-2xl text-base font-bold transition-all duration-300 shadow-[0_10px_40px_rgba(37,99,235,0.3)] hover:shadow-[0_16px_56px_rgba(37,99,235,0.5)] hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              {t("landing.cta.btn")}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>

        {/* Bottom stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { val: "< 2s", label: t("landing.cta.stats.retrieval") },
            { val: "100%", label: t("landing.cta.stats.privacy") },
            { val: "5+", label: t("landing.cta.stats.metrics") },
            { val: "∞", label: t("landing.cta.stats.capacity") },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black text-primary font-headline mb-1">{s.val}</p>
              <p className="text-[11px] text-on-surface-variant uppercase tracking-wider">{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
