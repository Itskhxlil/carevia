import React from "react";

/* ─────────────────────────────────────────────
   StatCard — improved KPI card with icons & gradients
─────────────────────────────────────────────── */
export function StatCard({ icon, label, value, delta, positive = true, color = "primary" }) {
  const colorMap = {
    primary:   "from-teal-500/20 to-teal-500/5 text-teal-400 border-teal-500/20 shadow-teal-500/5",
    secondary: "from-sky-500/20 to-sky-500/5 text-sky-400 border-sky-500/20 shadow-sky-500/5",
    tertiary:  "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20 shadow-amber-500/5",
    error:     "from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20 shadow-rose-500/5",
    success:   "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5",
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-5 border bg-gradient-to-br ${c}
        transition-all duration-300 ease-out hover:-translate-y-1.5 group
      `}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-slate-900/60 flex items-center justify-center group-hover:scale-110 transition-transform`}>
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
        {delta && (
          <span
            className={`
              text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm
              ${positive
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
              }
            `}
          >
            {delta}
          </span>
        )}
      </div>

      <div>
        <p className="text-2xl font-black font-headline text-on-surface tracking-tight">
          {value}
        </p>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{label}</p>
      </div>

      {/* Decorative background glow */}
      <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-current opacity-5 blur-2xl pointer-events-none" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   MedicalCard — redefined clinical context card
─────────────────────────────────────────────── */
export function MedicalCard({ title, children, icon, accent = "primary" }) {
  const accentMap = {
    primary:   { color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20" },
    secondary: { color: "text-sky-400",  bg: "bg-sky-500/10",  border: "border-sky-500/20" },
    tertiary:  { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    error:     { color: "text-rose-400",  bg: "bg-rose-500/10",  border: "border-rose-500/20" },
    success:   { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  };

  const a = accentMap[accent] || accentMap.primary;

  return (
    <div
      className={`
        bg-slate-900/40 backdrop-blur-md rounded-2xl p-6 border ${a.border}
        transition-all duration-300 hover:bg-slate-900/60 group
      `}
    >
      <div className="flex items-center gap-3 mb-5">
        {icon && (
          <div className={`w-9 h-9 rounded-xl ${a.bg} flex items-center justify-center shrink-0`}>
            <span className={`material-symbols-outlined text-[20px] ${a.color}`}>{icon}</span>
          </div>
        )}
        <h3 className="text-sm font-bold font-headline text-on-surface uppercase tracking-wider">{title}</h3>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   InfoRow — stylized key-value row
─────────────────────────────────────────────── */
export function InfoRow({ label, value, mono = false, color = "white" }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-slate-800/40 last:border-0">
      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 shrink-0 mt-0.5">{label}</span>
      <span className={`text-sm ${color === 'white' ? 'text-slate-200' : 'text-' + color} text-right leading-tight ${mono ? "font-mono" : "font-medium"}`}>
        {value}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   StatusChip — medical status colors
─────────────────────────────────────────────── */
export function StatusChip({ status }) {
  const styles = {
    Active:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    Stable:     "bg-teal-500/15 text-teal-400 border-teal-500/20",
    Pending:    "bg-amber-500/15 text-amber-400 border-amber-500/20",
    Critical:   "bg-rose-500/15 text-rose-400 border-rose-500/20",
    Discharged: "bg-slate-700/20 text-slate-400 border-slate-700/30",
    Normal:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
    Warning:    "bg-amber-500/15 text-amber-400 border-amber-500/20",
  };

  const s = styles[status] || styles["Stable"];

  return (
    <span
      className={`
        text-[9px] font-black uppercase tracking-widest
        px-2.5 py-1 rounded-lg border ${s}
      `}
    >
      {status}
    </span>
  );
}
