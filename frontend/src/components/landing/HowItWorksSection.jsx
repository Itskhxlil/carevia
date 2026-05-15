import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

export default function HowItWorksSection() {
  const { t } = useTranslation();

  const STEPS = [
    {
      step: "01",
      icon: "person_add",
      title: t("landing.howItWorks.steps.s1.title"),
      desc: t("landing.howItWorks.steps.s1.desc"),
      color: "primary",
      accent: "from-primary to-blue-600",
    },
    {
      step: "02",
      icon: "edit_note",
      title: t("landing.howItWorks.steps.s2.title"),
      desc: t("landing.howItWorks.steps.s2.desc"),
      color: "blue-500",
      accent: "from-blue-500 to-sky-600",
    },
    {
      step: "03",
      icon: "insights",
      title: t("landing.howItWorks.steps.s3.title"),
      desc: t("landing.howItWorks.steps.s3.desc"),
      color: "tertiary",
      accent: "from-tertiary to-sky-500",
    },
  ];
  return (
    <section id="how-it-works" className="py-28 relative bg-background">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-surface-container-low/20 via-surface-container-low/40 to-surface-container-low/20" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-[11px] font-bold tracking-[0.2em] text-primary uppercase mb-3 block">
            {t("landing.howItWorks.badge")}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-on-surface font-headline mb-5">
            {t("landing.howItWorks.title1")}{" "}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {t("landing.howItWorks.title2")}
            </span>
          </h2>
          <p className="text-on-surface-variant text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            {t("landing.howItWorks.subtext")}
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-[72px] left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-[2px]">
            <div className="w-full h-full bg-gradient-to-r from-primary/30 via-blue-500/30 to-tertiary/30 rounded-full" />
            <div className="absolute top-0 start-0 h-full w-1/3 bg-gradient-to-r from-primary/60 to-transparent rounded-full animate-pulse" style={{ animationDuration: "3s" }} />
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
                  <div className={`w-[120px] h-[120px] rounded-full border-2 ${step.color === 'primary' ? 'border-primary/15' : step.color === 'blue-500' ? 'border-blue-500/15' : 'border-tertiary/15'} flex items-center justify-center bg-gradient-to-br ${step.color === 'primary' ? 'from-primary/[0.06]' : step.color === 'blue-500' ? 'from-blue-500/[0.06]' : 'from-tertiary/[0.06]'} to-transparent`}>
                    {/* Inner circle */}
                    <div className="w-[84px] h-[84px] rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center group-hover:border-primary/30 transition-colors duration-500">
                      <span className={`material-symbols-outlined ${step.color === 'primary' ? 'text-primary' : step.color === 'blue-500' ? 'text-blue-500' : 'text-tertiary'} text-[32px] group-hover:scale-110 transition-transform duration-300`}>
                        {step.icon}
                      </span>
                    </div>
                  </div>
                  {/* Step number */}
                  <div className={`absolute -top-1 -right-1 w-8 h-8 rounded-full bg-gradient-to-br ${step.accent} text-white text-xs font-black flex items-center justify-center shadow-[0_4px_16px_rgba(37,99,235,0.4)]`}>
                    {i + 1}
                  </div>
                  {/* Glow */}
                  <div className={`absolute inset-0 rounded-full ${step.color === 'primary' ? 'bg-primary/[0.05] group-hover:bg-primary/[0.1]' : step.color === 'blue-500' ? 'bg-blue-500/[0.05] group-hover:bg-blue-500/[0.1]' : 'bg-tertiary/[0.05] group-hover:bg-tertiary/[0.1]'} blur-2xl pointer-events-none transition-all duration-500`} />
                </div>

                <h3 className="text-lg font-bold text-on-surface mb-3 font-headline">{step.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
