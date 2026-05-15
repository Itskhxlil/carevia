import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: "easeOut" },
  }),
};

export default function FeaturesSection() {
  const { t } = useTranslation();

  const FEATURES = [
    {
      icon: "group",
      title: t("landing.features.items.registry.title"),
      desc: t("landing.features.items.registry.desc"),
      gradient: "from-primary/15 to-blue-500/5",
      iconColor: "text-primary",
      border: "border-primary/15",
      preview: (
        <div className="mt-4 bg-surface-container-low/50 rounded-xl p-3 border border-outline-variant/80">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-[7px] font-black text-white">AH</div>
            <div><p className="text-[9px] font-bold text-on-surface">Ahmad Hassan</p><p className="text-[7px] text-outline">CRV-0042 · Critical</p></div>
            <span className="ms-auto text-[7px] font-bold text-error bg-error/10 px-1.5 py-0.5 rounded-full">!</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-[7px] font-black text-white">SM</div>
            <div><p className="text-[9px] font-bold text-on-surface">Sarah Mitchell</p><p className="text-[7px] text-outline">CRV-0118 · Stable</p></div>
            <span className="ms-auto text-[7px] font-bold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">✓</span>
          </div>
        </div>
      ),
    },
    {
      icon: "monitor_heart",
      title: t("landing.features.items.vitals.title"),
      desc: t("landing.features.items.vitals.desc"),
      gradient: "from-sky-500/15 to-blue-500/5",
      iconColor: "text-sky-500",
      border: "border-sky-500/15",
      preview: (
        <div className="mt-4 bg-surface-container-low/50 rounded-xl p-3 border border-outline-variant/80">
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: t("medical.fields.glucose"), value: "186", unit: "mg/dL", alert: true },
              { label: t("medical.fields.oxygen_saturation"), value: "97", unit: "%", alert: false },
            ].map((v) => (
              <div key={v.label} className={`p-2 rounded-lg border ${v.alert ? "border-error/20 bg-error/5" : "border-outline-variant/80 bg-surface-container/30"}`}>
                <p className="text-[7px] text-outline uppercase">{v.label}</p>
                <p className={`text-sm font-black ${v.alert ? "text-error" : "text-on-surface"}`}>{v.value}<span className="text-[8px] font-normal text-outline ms-0.5">{v.unit}</span></p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: "monitoring",
      title: t("landing.features.items.analytics.title"),
      desc: t("landing.features.items.analytics.desc"),
      gradient: "from-blue-600/15 to-blue-400/5",
      iconColor: "text-blue-500",
      border: "border-blue-500/15",
      preview: (
        <div className="mt-4 bg-surface-container-low/50 rounded-xl p-3 border border-outline-variant/80">
          <div className="flex items-end gap-1 h-12 px-1">
            {[35, 55, 40, 70, 50, 80, 65, 75].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/70 to-blue-400/50" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: "qr_code_2",
      title: t("landing.features.items.qr.title"),
      desc: t("landing.features.items.qr.desc"),
      gradient: "from-slate-500/15 to-slate-400/5",
      iconColor: "text-slate-400",
      border: "border-slate-500/15",
      preview: (
        <div className="mt-4 flex flex-col items-center">
          <div className="w-16 h-16 bg-surface-container/50 rounded-xl border border-outline-variant/80 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-on-surface-variant text-[32px]">qr_code_2</span>
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-surface-container-high text-outline rounded-full border border-outline-variant/80">
            {t("common.futureFeature")}
          </span>
        </div>
      ),
    },
    {
      icon: "notifications_active",
      title: t("landing.features.items.alerts.title"),
      desc: t("landing.features.items.alerts.desc"),
      gradient: "from-error/15 to-rose-500/5",
      iconColor: "text-error",
      border: "border-error/15",
      preview: (
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-error/10 border border-error/15">
            <span className="w-1.5 h-1.5 rounded-full bg-error" />
            <span className="text-[8px] text-error font-medium">{t("landing.solutions.s3.desc")}</span>
          </div>
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-warning/10 border border-warning/15">
            <span className="w-1.5 h-1.5 rounded-full bg-warning" />
            <span className="text-[8px] text-warning font-medium">Follow-up overdue</span>
          </div>
        </div>
      ),
    },
    {
      icon: "lock",
      title: t("landing.features.items.privacy.title"),
      desc: t("landing.features.items.privacy.desc"),
      gradient: "from-tertiary/15 to-cyan-500/5",
      iconColor: "text-tertiary",
      border: "border-tertiary/15",
      preview: (
        <div className="mt-4 flex items-center gap-3 px-3 py-2.5 rounded-lg bg-tertiary/5 border border-tertiary/15">
          <span className="material-symbols-outlined text-tertiary text-[18px]">shield</span>
          <div>
            <p className="text-[9px] font-bold text-tertiary">{t("dashboard.sessionEncrypted")}</p>
            <p className="text-[7px] text-outline">Zero external transmission</p>
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="features" className="py-28 relative bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary/[0.03] rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-0 w-72 h-72 bg-tertiary/[0.03] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-3 block">
            {t("landing.features.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface font-headline mb-5">
            {t("landing.features.title")}
          </h2>
          <p className="text-on-surface-variant text-base sm:text-lg max-w-2xl mx-auto">
            {t("landing.features.subtext")}
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
              className={`group relative rounded-2xl p-6 bg-gradient-to-br ${f.gradient} border ${f.border} backdrop-blur-sm hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_20px_60px_rgba(var(--color-primary),0.1)] hover:border-opacity-40`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-surface-container-high/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className={`material-symbols-outlined text-[22px] ${f.iconColor}`}>{f.icon}</span>
                </div>
                <h3 className="text-base font-bold text-on-surface font-headline">{f.title}</h3>
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">{f.desc}</p>
              {f.preview}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
