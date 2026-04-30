import React, { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageShell from "./PageShell.jsx";
import EmptyPanel from "./EmptyPanel.jsx";
import { usePatients } from "../PatientsContext.jsx";
import MedicalChart from "../components/MedicalChart.jsx";
import {
  buildDemoMeasurementsForPatient,
  toChartPoints,
} from "../utils/demoMeasurements.js";

const barTooltipStyle = {
  backgroundColor: "rgba(10, 22, 38, 0.96)",
  border: "1px solid rgba(13, 200, 175, 0.25)",
  borderRadius: "10px",
  fontSize: "12px",
  color: "#dce8f8",
};

const BAR_COLORS = [
  "rgb(var(--color-primary))",
  "rgb(var(--color-secondary))",
  "rgb(var(--color-tertiary))",
  "#34d399",
  "#60a5fa",
  "#a78bfa",
];

export default function AnalyticsPage() {
  const { patients } = usePatients();
  const total = patients.length;
  const byStatus = patients.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const statusChartData = useMemo(
    () => Object.entries(byStatus).map(([name, value]) => ({ name, value })),
    [byStatus]
  );

  const [patientId, setPatientId] = useState(() => patients[0]?.id || "");

  useEffect(() => {
    if (!patientId && patients.length > 0) setPatientId(patients[0].id);
  }, [patients, patientId]);

  const patient = useMemo(
    () => patients.find((p) => p.id === patientId) || null,
    [patients, patientId]
  );

  const measurements  = useMemo(() => (patient ? buildDemoMeasurementsForPatient(patient) : null), [patient]);
  const glucosePoints = useMemo(() => (measurements ? toChartPoints(measurements, "glucose") : []), [measurements]);
  const bpPoints      = useMemo(() => (measurements ? toChartPoints(measurements, "bloodPressure") : []), [measurements]);
  const weightPoints  = useMemo(() => (measurements ? toChartPoints(measurements, "weight") : []), [measurements]);

  return (
    <PageShell
      title="Analytics"
      description="Registry overview, status distribution, and demo vital trends per patient."
    >
      {total === 0 ? (
        <EmptyPanel
          icon="monitoring"
          title="No analytics yet"
          detail="Add patients from the Patients tab to see charts and breakdowns here."
        />
      ) : (
        <div className="space-y-10">

          {/* KPI row */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="carevia-glass-card p-5 flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[22px]">group</span>
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline mt-1">Total registry</p>
              <p className="text-3xl font-extrabold font-headline text-on-surface">{total}</p>
            </div>

            {Object.entries(byStatus).slice(0, 3).map(([status, count]) => (
              <div key={status} className="carevia-glass-card p-5 flex flex-col gap-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    {status === "Critical" ? "emergency" : status === "Stable" ? "check_circle" : "pending"}
                  </span>
                </div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-outline mt-1">{status}</p>
                <p className="text-3xl font-extrabold font-headline text-on-surface">{count}</p>
              </div>
            ))}
          </div>

          {/* Status chart */}
          {statusChartData.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-sm font-bold text-on-surface tracking-tight flex items-center gap-2">
                <span className="w-1 h-5 rounded-full bg-primary inline-block" />
                Patients by status
              </h2>
              <div className="carevia-glass-card p-5 sm:p-7 w-full min-h-[280px]">
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={statusChartData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "rgb(var(--color-outline))", fontSize: 11 }}
                      axisLine={{ stroke: "rgba(13,200,175,0.2)" }}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "rgb(var(--color-outline))", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={36}
                    />
                    <Tooltip contentStyle={barTooltipStyle} formatter={(v) => [v, "Patients"]} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={52}>
                      {statusChartData.map((_, i) => (
                        <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {/* Vital trends */}
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-on-surface tracking-tight flex items-center gap-2">
                  <span className="w-1 h-5 rounded-full bg-secondary inline-block" />
                  Vital trends (demo series)
                </h2>
                <p className="text-xs text-on-surface-variant mt-1 max-w-xl">
                  Synthetic time series derived from each patient ID for visualization only—not clinical data.
                </p>
              </div>
              <div className="relative min-w-[200px] sm:max-w-xs w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px] pointer-events-none">person</span>
                <select
                  id="analytics-patient"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="carevia-auth-input w-full pl-10 pr-4 py-3 rounded-xl text-sm appearance-none"
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-outline pointer-events-none text-[20px]">keyboard_arrow_down</span>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-1 xl:grid-cols-3">
              <MedicalChart data={glucosePoints}  type="glucose"       emptyMessage="No glucose series for this selection." />
              <MedicalChart data={bpPoints}       type="bloodPressure" emptyMessage="No blood pressure series for this selection." />
              <MedicalChart data={weightPoints}   type="weight"        emptyMessage="No weight series for this selection." />
            </div>
          </section>
        </div>
      )}
    </PageShell>
  );
}
