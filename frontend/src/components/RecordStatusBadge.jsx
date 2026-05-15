import React from "react";
import { useTranslation } from "react-i18next";

const styles = {
  Stable: "bg-emerald-500/15 text-emerald-400 border-emerald-500/35",
  Warning: "bg-amber-500/15 text-amber-200 border-amber-500/35",
  Critical: "bg-error/15 text-error border-error/40",
};

export default function RecordStatusBadge({ status }) {
  const { t } = useTranslation();
  const norm = status ? (status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()) : "Stable";
  const s = styles[norm] ? norm : "Stable";
  
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border
        ${styles[s]}
      `}
    >
      {t(`status.${s}`)}
    </span>
  );
}
