import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function ProblemsSection() {
  const { t } = useTranslation();

  const PROBLEMS = [
    {
      icon: "folder_off",
      title: t("landing.problems.p1.title"),
      desc: t("landing.problems.p1.desc"),
      stat: t("landing.problems.p1.stat"),
      statLabel: t("landing.problems.p1.statLabel"),
      gradient: "from-error/20 to-error/5",
      iconBg: "bg-error/15",
      iconColor: "text-error",
      borderColor: "border-error/15",
    },
    {
      icon: "timer_off",
      title: t("landing.problems.p2.title"),
      desc: t("landing.problems.p2.desc"),
      stat: t("landing.problems.p2.stat"),
      statLabel: t("landing.problems.p2.statLabel"),
      gradient: "from-warning/20 to-warning/5",
      iconBg: "bg-warning/15",
      iconColor: "text-warning",
      borderColor: "border-warning/15",
    },
    {
      icon: "visibility_off",
      title: t("landing.problems.p3.title"),
      desc: t("landing.problems.p3.desc"),
      stat: t("landing.problems.p3.stat"),
      statLabel: t("landing.problems.p3.statLabel"),
      gradient: "from-secondary/20 to-secondary/5",
      iconBg: "bg-secondary/15",
      iconColor: "text-secondary",
      borderColor: "border-secondary/15",
    },
  ];

  const SOLUTIONS = [
    {
      icon: "hub",
      title: t("landing.solutions.s1.title"),
      desc: t("landing.solutions.s1.desc"),
      iconColor: "text-primary",
      iconBg: "bg-primary/15",
    },
    {
      icon: "speed",
      title: t("landing.solutions.s2.title"),
      desc: t("landing.solutions.s2.desc"),
      iconColor: "text-blue-500",
      iconBg: "bg-blue-500/15",
    },
    {
      icon: "notifications_active",
      title: t("landing.solutions.s3.title"),
      desc: t("landing.solutions.s3.desc"),
      iconColor: "text-tertiary",
      iconBg: "bg-tertiary/15",
    },
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.5, delay: i * 0.12, ease: "easeOut" },
    }),
  };

  return (
    <section id="problems" className="py-28 relative bg-background">
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
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
          <span className="text-[11px] font-bold tracking-[0.2em] text-error/80 uppercase mb-3 block">
            {t("landing.problems.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface font-headline mb-5">
            {t("landing.problems.title1")}{" "}
            <span className="text-error">{t("landing.problems.title2")}</span>
          </h2>
          <p className="text-on-surface-variant text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("landing.problems.subtext")}
          </p>
        </motion.div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-24">
          {PROBLEMS.map((p, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className={`group relative rounded-2xl p-6 bg-gradient-to-br ${p.gradient} border ${p.borderColor} backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(var(--color-error),0.1)]`}
            >
              <div className={`w-12 h-12 rounded-xl ${p.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <span className={`material-symbols-outlined text-[24px] ${p.iconColor}`}>{p.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface mb-2 font-headline">{p.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-5">{p.desc}</p>
              <div className="pt-4 border-t border-outline-variant/10">
                <span className={`text-2xl font-black ${p.iconColor} font-headline`}>{p.stat}</span>
                <span className="text-[11px] text-outline ms-2">{p.statLabel}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Divider arrow */}
        <div className="flex justify-center mb-20">
          <div className="w-12 h-12 rounded-full border border-primary/20 bg-primary/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[20px] animate-bounce">arrow_downward</span>
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
          <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-3 block">
            {t("landing.solutions.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface font-headline mb-5">
            {t("landing.solutions.title1")}{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {t("landing.solutions.title2")}
            </span>
          </h2>
        </motion.div>

        {/* Solution cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SOLUTIONS.map((s, i) => (
            <motion.div
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              className="group relative rounded-2xl p-6 bg-gradient-to-br from-primary/[0.07] to-blue-500/[0.04] border border-primary/15 backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(var(--color-primary),0.08)] hover:border-primary/25"
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
