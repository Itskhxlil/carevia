import React from "react";

const styles = {
  normal: "bg-[rgb(var(--color-secondary))]/15 text-[rgb(var(--color-secondary))] border-[rgb(var(--color-secondary))]/35",
  warning: "bg-amber-500/15 text-amber-200 border-amber-500/35",
  critical: "bg-error/15 text-error border-error/40",
};

const labels = {
  normal: "Normal",
  warning: "Warning",
  critical: "Critical",
};

export default function RecordStatusBadge({ status }) {
  const s = styles[status] ? status : "normal";
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border
        ${styles[s]}
      `}
    >
      {labels[s]}
    </span>
  );
}
