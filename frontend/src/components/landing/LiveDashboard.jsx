import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

/* Simulated live data for the dashboard preview */
const STATUS_COLORS = {
  critical: { bg: "bg-error/15", text: "text-error", border: "border-error/25", dot: "bg-error" },
  warning: { bg: "bg-warning/15", text: "text-warning", border: "border-warning/25", dot: "bg-warning" },
  stable: { bg: "bg-emerald-500/15", text: "text-emerald-500", border: "border-emerald-500/25", dot: "bg-emerald-500" },
  info: { bg: "bg-primary/15", text: "text-primary", border: "border-primary/25", dot: "bg-primary" },
};

const CHART_DATA = [40, 55, 45, 68, 52, 78, 60, 85, 72, 90, 68, 82];

function AnimatedNumber({ target }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let frame;
    const duration = 1500;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      setVal(Math.floor(progress * target));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return val;
}

export default function LiveDashboard() {
  const { t } = useTranslation();
  const [activeAlert, setActiveAlert] = useState(0);

  const PATIENTS = [
    { id: "CRV-0042", name: "Ahmad Hassan", age: 54, status: "critical", initials: "AH" },
    { id: "CRV-0118", name: "Sarah Mitchell", age: 38, status: "stable", initials: "SM" },
    { id: "CRV-0203", name: "Omar Benali", age: 67, status: "warning", initials: "OB" },
    { id: "CRV-0097", name: "Leila Farouk", age: 45, status: "stable", initials: "LF" },
  ];

  const ALERTS = [
    { type: "critical", msg: `Ahmad H. — ${t("medical.fields.glucose")} 186 mg/dL ↑`, time: "2m ago" },
    { type: "warning", msg: `Omar B. — BP 148/94 mmHg`, time: "8m ago" },
    { type: "info", msg: `Lab results ready for Sarah M.`, time: "14m ago" },
  ];

  useEffect(() => {
    const iv = setInterval(() => setActiveAlert((p) => (p + 1) % ALERTS.length), 3000);
    return () => clearInterval(iv);
  }, [ALERTS.length]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-outline-variant/80 shadow-[0_50px_120px_rgba(var(--color-primary),0.12),0_0_0_1px_rgba(var(--color-primary),0.05)] bg-surface">
      {/* Browser chrome bar */}
      <div className="bg-surface-container-high border-b border-outline-variant/80 px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]/80" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]/80" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]/80" />
        </div>
        <div className="flex-1 mx-6 bg-surface-container-low rounded-lg px-4 py-1.5 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary/40 text-[14px]">lock</span>
          <span className="text-[11px] text-on-surface-variant font-medium">carevia.app/dashboard/overview</span>
        </div>
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-md bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined text-outline text-[12px]">refresh</span>
          </div>
        </div>
      </div>

      {/* Dashboard content */}
      <div className="p-3 sm:p-5 grid grid-cols-12 gap-3 min-h-[340px]">
        {/* Sidebar */}
        <div className="col-span-2 hidden md:flex flex-col gap-1.5 pe-3 border-e border-outline-variant/20">
          <div className="flex items-center gap-2 mb-3 px-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-[0_2px_10px_rgba(37,99,235,0.3)]">
              <span className="material-symbols-outlined text-white text-[12px]">favorite</span>
            </div>
            <span className="text-[10px] font-bold text-on-surface">Carevia</span>
          </div>
          {[
            { icon: "grid_view", label: t("sidebar.overview"), active: true },
            { icon: "group", label: t("sidebar.patients"), active: false },
            { icon: "event", label: t("sidebar.appointments"), active: false },
            { icon: "analytics", label: t("sidebar.analytics"), active: false },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary border border-primary/20"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">{item.icon}</span>
              <span className="hidden lg:inline">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Main area */}
        <div className="col-span-12 md:col-span-10 space-y-3">
          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { icon: "group", label: t("dashboard.totalPatients"), val: 247, color: "primary", change: "+12" },
              { icon: "warning", label: t("dashboard.criticalCases"), val: 12, color: "error", change: "+3" },
              { icon: "event", label: t("dashboard.upcomingAppointments"), val: 38, color: "blue-500", change: "5 left" },
              { icon: "monitoring", label: t("sidebar.analytics"), val: 94, color: "tertiary", change: "7 new" },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-surface-container-low/40 rounded-xl p-3 border border-outline-variant/80 hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`material-symbols-outlined text-[14px] ${s.color.startsWith("text-") ? s.color : `text-${s.color}`}`}>{s.icon}</span>
                  <span className={`text-[8px] font-bold ${s.color === "primary" ? "text-primary/70 bg-primary/10" : s.color === "error" ? "text-error/70 bg-error/10" : "text-on-surface-variant bg-surface-container/50"} px-1.5 py-0.5 rounded-full`}>
                    {s.change}
                  </span>
                </div>
                <p className={`text-xl font-black ${s.color.startsWith("text-") ? s.color : `text-${s.color}`} group-hover:opacity-80 transition-opacity`}>
                  <AnimatedNumber target={s.val} />
                </p>
                <p className="text-[9px] text-outline mt-0.5 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Charts + Alerts row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* Chart */}
            <div className="sm:col-span-2 bg-surface-container-low/30 rounded-xl p-3 border border-outline-variant/25">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Patient Admissions</span>
                <span className="text-[9px] text-primary/60 font-medium">Last 12 months</span>
              </div>
              <div className="flex items-end gap-1.5 h-24 px-1">
                {CHART_DATA.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/70 to-blue-400/50 transition-all duration-500 hover:from-primary hover:to-blue-400 cursor-pointer relative group"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  >
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-surface-container-highest text-[8px] text-primary px-1.5 py-0.5 rounded font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {Math.round(h * 2.8)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts panel */}
            <div className="bg-surface-container-low/30 rounded-xl p-3 border border-outline-variant/25">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{t("dashboard.criticalAlerts")}</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-error opacity-75" />
                  <span className="relative rounded-full h-2 w-2 bg-error" />
                </span>
              </div>
              <div className="space-y-2">
                {ALERTS.map((a, i) => {
                  const c = STATUS_COLORS[a.type];
                  return (
                    <div
                      key={i}
                      className={`flex items-start gap-2 p-2 rounded-lg border transition-all duration-500 ${
                        i === activeAlert
                          ? `${c.bg} ${c.border} scale-[1.02]`
                          : "border-transparent opacity-60"
                      }`}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${c.dot} mt-1 shrink-0`} />
                      <div className="min-w-0">
                        <p className={`text-[9px] font-semibold ${c.text} truncate`}>{a.msg}</p>
                        <p className="text-[8px] text-outline/50">{a.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Patient list mini */}
          <div className="bg-surface-container-low/30 rounded-xl p-3 border border-outline-variant/25">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{t("overview.recentPatients")}</span>
              <span className="text-[9px] text-primary/60 cursor-pointer hover:text-primary transition-colors">{t("overview.openPatients")} →</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PATIENTS.map((p) => {
                const c = STATUS_COLORS[p.status];
                return (
                  <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg bg-surface-container-high/40 border border-outline-variant/80 hover:border-primary/30 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-[9px] font-black text-white shrink-0">
                      {p.initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-bold text-on-surface truncate">{p.name}</p>
                      <div className="flex items-center gap-1">
                        <span className={`text-[7px] font-bold uppercase ${c.text}`}>{t(`status.${p.status.charAt(0).toUpperCase() + p.status.slice(1)}`)}</span>
                        <span className="text-[7px] text-outline">· {p.age}y</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-32 bg-primary/[0.05] blur-3xl pointer-events-none" />
    </div>
  );
}
