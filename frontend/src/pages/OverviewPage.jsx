import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loadSettings } from "../services/authStorage.js";
import { StatCard, MedicalCard, InfoRow, StatusChip } from "../components/Cards.jsx";
import { usePatients } from "../PatientsContext.jsx";
import { fetchRecentRecordStats } from "../services/medicalRecordsApi.js";

export default function OverviewPage() {
  const { t } = useTranslation();
  const { patients } = usePatients();
  const [monitoringCount, setMonitoringCount] = useState(null);
  const settings = loadSettings();
  const session = JSON.parse(localStorage.getItem("carevia_session") || "{}");
  const doctorName = session.name ?? "";
  const specialty  = session.specialty ?? "";
  const firstName  = doctorName.trim().split(/\s+/)[0] || "Doctor";

  const total        = patients.length;
  const criticalCount = patients.filter((p) => p.status === "Critical").length;
  const criticalRows  = patients.filter((p) => p.status === "Critical");

  const showCriticalBanner = settings.notifyCriticalAlerts && criticalCount > 0;

  useEffect(() => {
    let cancelled = false;
    fetchRecentRecordStats(7)
      .then((d) => {
        if (!cancelled) setMonitoringCount(typeof d.count === "number" ? d.count : 0);
      })
      .catch(() => { if (!cancelled) setMonitoringCount(null); });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10 space-y-10">

      {/* Critical Banner */}
      {showCriticalBanner && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 backdrop-blur-md animate-[carevia-fade-in-up_0.5s_ease-out_both]"
        >
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-12 h-12 rounded-xl bg-rose-500/15 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
              <span className="material-symbols-outlined text-rose-400 text-[24px]">emergency</span>
            </div>
            <div>
              <p className="text-sm font-black text-on-surface">
                {t("overview.criticalBanner", { count: criticalCount }) || `${criticalCount} Patients in Critical Condition`}
              </p>
              <p className="text-xs text-on-surface-variant mt-1">
                {t("overview.reviewList") || "Please review their clinical summary immediately."}
              </p>
            </div>
          </div>
          <Link to="/dashboard/patients" className="bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-rose-500/20">
            {t("overview.openPatients") || "View All Critical"}
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-teal-400 to-cyan-600" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400/70">
              {t("overview.workspace") || "Clinical Workspace"}
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-headline text-on-surface tracking-tight">
            {t("overview.greeting", { name: firstName }) || `Good day, Dr. ${firstName}`}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1.5 font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">calendar_today</span>
            {new Date().toLocaleDateString(t("langCode") === "ar" ? "ar-EG" : "en-GB", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <Link to="/dashboard/patients/new" className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-[0_8px_24px_rgba(20,184,166,0.3)] hover:-translate-y-0.5 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          {t("overview.newPatient") || "New Patient Record"}
        </Link>
      </div>

      {/* Stats Grid */}
      <section>
        <div className="flex items-center justify-between mb-5">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">
             {t("overview.todayOverview") || "Patient Registry Health"}
           </p>
           <div className="h-px flex-1 bg-outline-variant/30 ml-4"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard 
            icon="group" 
            label={t("overview.totalPatients") || "Total Registry"} 
            value={total.toString()} 
            color="primary"
          />
          <StatCard
            icon="monitor_heart"
            label={t("overview.monitoring") || "Recent Monitoring"}
            value={monitoringCount === null ? "—" : monitoringCount.toString()}
            delta={monitoringCount !== null ? "Last 7d" : undefined}
            positive={monitoringCount !== null}
            color="secondary"
          />
          <StatCard 
            icon="emergency" 
            label={t("overview.criticalCases") || "Critical Alerts"} 
            value={criticalCount.toString()} 
            color={criticalCount > 0 ? "error" : "success"}
          />
          <StatCard
            icon="science"
            label={t("overview.pendingLabs") || "Lab Results"}
            value={settings.notifyLabResults ? "0" : "—"}
            delta={settings.notifyLabResults ? "No pending" : "Disabled"}
            positive={false}
            color="tertiary"
          />
        </div>
      </section>

      {/* Snapshot Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <MedicalCard title={t("overview.upcomingAppointments") || "Appointments"} icon="event_available" accent="secondary">
            {!settings.notifyAppointments ? (
              <p className="text-xs text-on-surface-variant leading-relaxed italic">{t("overview.appointmentsOff") || "Notifications disabled in settings."}</p>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                 <span className="material-symbols-outlined text-outline/30 text-[32px] mb-2">event_busy</span>
                 <p className="text-xs text-on-surface-variant">{t("overview.appointmentsEmpty") || "No appointments scheduled for today."}</p>
              </div>
            )}
          </MedicalCard>

          <MedicalCard title={t("overview.criticalAlerts") || "Clinical Alerts"} icon="warning" accent="error">
            {!settings.notifyCriticalAlerts ? (
              <p className="text-xs text-on-surface-variant leading-relaxed italic">{t("overview.criticalOff") || "Alerts are currently muted."}</p>
            ) : criticalRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                 <span className="material-symbols-outlined text-primary/20 text-[32px] mb-2">check_circle</span>
                 <p className="text-xs text-on-surface-variant">{t("overview.criticalEmpty") || "All patients are currently stable."}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {criticalRows.map((p) => (
                  <Link
                    key={p.id}
                    to={`/dashboard/patients/${p.id}`}
                    className="flex items-start gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/10 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                       <span className="material-symbols-outlined text-rose-400 text-[18px]">emergency</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-rose-500/70 tracking-widest uppercase">{p.id}</p>
                      <p className="text-xs font-bold text-on-surface truncate">{p.name}</p>
                      <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">{p.diagnosis}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </MedicalCard>

          <MedicalCard title={t("overview.yourProfile") || "Physician Profile"} icon="badge" accent="primary">
            <div className="bg-surface-container-low/60 rounded-xl p-3 border border-outline-variant/30">
              <InfoRow label={t("overview.physician") || "Physician"} value={doctorName || "Dr. User"} />
              <InfoRow label={t("overview.specialty") || "Specialty"} value={specialty || "—"} />
              <InfoRow label="Access Mode" value="Local Workspace" color="teal-400" />
              <div className="pt-4 flex items-center justify-between">
                <StatusChip status="Active" />
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                   Session Encrypted
                </span>
              </div>
            </div>
          </MedicalCard>
      </section>

      {/* Footer Info */}
      <div className="flex items-start gap-4 p-5 bg-teal-500/5 border border-teal-500/10 rounded-2xl">
        <div className="w-10 h-10 rounded-xl bg-teal-400/10 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-teal-400 text-[20px]">verified_user</span>
        </div>
        <div>
           <p className="text-sm font-bold text-on-surface">Local Privacy Shield Active</p>
           <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
             Your workspace is running in a local-first environment. All patient records and measurements are stored only on this device.
           </p>
        </div>
      </div>
    </div>
  );
}
