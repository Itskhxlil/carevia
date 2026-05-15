import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import LiveDashboard from "./LiveDashboard.jsx";

export default function HeroSection({ openAuth }) {
  const { t } = useTranslation();
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-12 overflow-hidden bg-background">
      {/* Grid background */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="heroGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-primary/20" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#heroGrid)" />
        </svg>
      </div>

      {/* Radial glow top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-radial from-primary/[0.08] to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Animated ECG line */}
      <div className="absolute top-[55%] left-0 right-0 pointer-events-none opacity-[0.1]">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path
            d="M0,30 L300,30 L320,30 L335,8 L350,52 L365,4 L380,56 L395,30 L550,30 L570,30 L585,15 L600,45 L615,30 L800,30 L820,30 L835,8 L850,52 L865,4 L880,56 L895,30 L1050,30 L1070,30 L1085,15 L1100,45 L1115,30 L1440,30"
            stroke="url(#ecgGrad)" strokeWidth="2" strokeLinecap="round" className="carevia-ecg-path"
          />
          <defs>
            <linearGradient id="ecgGrad" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="rgb(var(--color-primary))" stopOpacity="0" />
              <stop offset="30%" stopColor="rgb(var(--color-primary))" />
              <stop offset="70%" stopColor="rgb(var(--color-tertiary))" />
              <stop offset="100%" stopColor="rgb(var(--color-tertiary))" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2.5 bg-primary/10 border border-primary/20 rounded-full px-5 py-2.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-[11px] font-bold text-primary tracking-[0.15em] uppercase">
              {t("landing.hero.badge")}
            </span>
          </div>
        </motion.div>

        {/* Main headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-on-surface leading-[1.08] tracking-tight font-headline">
            {t("landing.hero.title1")}
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-blue-500 to-tertiary bg-clip-text text-transparent">
                {t("landing.hero.title2")}
              </span>
              <svg className="absolute -bottom-2 left-0 w-full h-3 opacity-40" viewBox="0 0 300 12" fill="none">
                <path d="M2 8 Q75 2 150 7 Q225 12 298 4" stroke="url(#underlineGrad)" strokeWidth="3" strokeLinecap="round" />
                <defs>
                  <linearGradient id="underlineGrad" x1="0" y1="0" x2="300" y2="0">
                    <stop offset="0%" stopColor="rgb(var(--color-primary))" />
                    <stop offset="100%" stopColor="rgb(var(--color-tertiary))" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-on-surface-variant text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          {t("landing.hero.subtext")}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
        >
          <button
            onClick={() => openAuth("signup")}
            className="group relative bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white px-9 py-4 rounded-2xl text-base font-bold transition-all duration-300 shadow-[0_8px_40px_rgba(37,99,235,0.25)] hover:shadow-[0_14px_50px_rgba(37,99,235,0.4)] hover:-translate-y-1 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">clinical_notes</span>
              {t("landing.hero.startManaging")}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
          <button
            onClick={() => openAuth("signin")}
            className="flex items-center gap-2 px-9 py-4 rounded-2xl text-base font-semibold text-on-surface-variant hover:text-on-surface border border-outline-variant/80 hover:border-primary/40 bg-surface/30 hover:bg-surface/60 transition-all duration-300 backdrop-blur-sm"
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            {t("landing.nav.accessDashboard")}
          </button>
        </motion.div>

        {/* Trust line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-6 text-[11px] text-outline mb-16"
        >
          {[t("landing.hero.trust1"), t("landing.hero.trust2"), t("landing.hero.trust3")].map((trustLabel, idx) => (
            <span key={idx} className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-primary/70 text-[13px]">verified</span>
              {trustLabel}
            </span>
          ))}
        </motion.div>

        {/* Live Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring", bounce: 0.2 }}
        >
          <LiveDashboard />
        </motion.div>
      </div>
    </section>
  );
}
