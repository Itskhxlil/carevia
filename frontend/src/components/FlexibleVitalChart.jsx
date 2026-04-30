import React from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "rgba(25, 28, 30, 0.95)",
  border: "1px solid rgba(63, 72, 80, 0.5)",
  borderRadius: "8px",
  fontSize: "12px",
  color: "#e0e3e5",
};

function humanKey(key) {
  return String(key)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function FlexibleVitalChart({ title, data, chartType }) {
  if (!data?.length) {
    return (
      <div className="carevia-glass-subtle rounded-xl p-6 text-center text-sm text-outline">
        Not enough points for {humanKey(title)}.
      </div>
    );
  }

  const isBp = chartType === "bloodPressure";

  return (
    <div className="carevia-glass-card p-4 sm:p-6 w-full min-h-[240px]">
      <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-2">
        {humanKey(title)}
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(63,72,80,0.35)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "rgb(var(--color-outline))", fontSize: 10 }}
            axisLine={{ stroke: "rgba(63,72,80,0.5)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgb(var(--color-outline))", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value, name) => {
              if (isBp && name === "secondary") return [value, "Diastolic"];
              if (isBp) return [value, "Systolic"];
              return [value, humanKey(title)];
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="rgb(var(--color-primary))"
            strokeWidth={2}
            dot={{ r: 3, fill: "rgb(var(--color-primary))" }}
          />
          {isBp && (
            <Line
              type="monotone"
              dataKey="secondary"
              stroke="rgb(var(--color-secondary))"
              strokeWidth={2}
              dot={{ r: 3, fill: "rgb(var(--color-secondary))" }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-outline mt-1 text-center">
        {isBp ? "Systolic / diastolic (mmHg)" : "Trend over visit dates"}
      </p>
    </div>
  );
}
