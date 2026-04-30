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

export default function MedicalChart({ data, type, emptyMessage }) {
  if (!data?.length) {
    return (
      <div className="carevia-glass-subtle rounded-xl p-8 text-center text-sm text-outline">
        {emptyMessage || "No data to display."}
      </div>
    );
  }

  const showSecondLine = type === "bloodPressure";

  return (
    <div className="carevia-glass-card p-4 sm:p-6 w-full min-h-[280px]">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(63,72,80,0.35)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: "rgb(var(--color-outline))", fontSize: 11 }}
            axisLine={{ stroke: "rgba(63,72,80,0.5)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "rgb(var(--color-outline))", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={44}
          />
          <Tooltip
            contentStyle={tooltipStyle}
            labelStyle={{ color: "rgb(var(--color-primary))" }}
            formatter={(value, name) => {
              if (name === "secondary") return [value, "Diastolic (mmHg)"];
              if (showSecondLine) return [value, "Systolic (mmHg)"];
              if (type === "glucose") return [value, "Glucose"];
              if (type === "weight") return [value, "Weight (kg)"];
              return [value, "Value"];
            }}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="value"
            stroke="rgb(var(--color-primary))"
            strokeWidth={2}
            dot={{ r: 3, fill: "rgb(var(--color-primary))" }}
            activeDot={{ r: 5 }}
          />
          {showSecondLine && (
            <Line
              type="monotone"
              dataKey="secondary"
              name="secondary"
              stroke="rgb(var(--color-secondary))"
              strokeWidth={2}
              dot={{ r: 3, fill: "rgb(var(--color-secondary))" }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
      <p className="text-[10px] text-outline mt-2 text-center uppercase tracking-wider">
        {type === "glucose" && "Glucose (demo series)"}
        {type === "bloodPressure" && "Blood pressure — systolic / diastolic"}
        {type === "weight" && "Weight (demo series)"}
      </p>
    </div>
  );
}
