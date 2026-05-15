import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loadSettings, getSession } from "../services/authStorage.js";
import { StatCard, MedicalCard, InfoRow, StatusChip } from "../components/Cards.jsx";
import { usePatients } from "../PatientsContext.jsx";
import { fetchRecentRecordStats } from "../services/medicalRecordsApi.js";
import { fetchAppointments } from "../services/appointmentsApi.js";

export default function OverviewPage() {
  const { t } = useTranslation();
  const { patients } = usePatients();
  const [monitoringCount, setMonitoringCount] = useState(null);
  const [upcomingApps, setUpcomingApps] = useState([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const settings = loadSettings();
  const session = getSession() || {};
  const doctorName = session.name ?? "";
  const specialty  = session.specialty ?? "";
  
  // Strip "Dr." or "د." prefixes to avoid "Dr. Dr." greeting
  const cleanName = doctorName.trim().replace(/^(dr\.?|د\.?|m\.?|mme\.?|mr\.?|mrs\.?)\s*/i, "");
  const firstName  = cleanName.split(/\s+/)[0] || t("common.physician");

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

    setLoadingApps(true);
    fetchAppointments()
      .then(data => {
        if (!cancelled) {
          const now = new Date();
          now.setHours(0,0,0,0);
          const filtered = data
            .filter(a => a.status === "Scheduled" && new Date(a.date) >= now)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .slice(0, 3);
          setUpcomingApps(filtered);
        }
      })
      .catch(e => console.error("Apps load error", e))
      .finally(() => { if (!cancelled) setLoadingApps(false); });

    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => { 
      cancelled = true; 
      clearInterval(clockInterval);
    };
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
            {t("overview.openPatients", "View All Critical")}
          </Link>
        </div>
      )}

      {/* Header */}
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-primary to-blue-600" />
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">
              {t("dashboard.workspace")}
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-headline text-on-surface tracking-tight">
            {t("dashboard.greeting", { name: firstName })}
          </h1>
          <p className="text-on-surface-variant text-sm mt-1.5 font-medium flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {currentTime.toLocaleDateString(t("langCode") === "ar" ? "ar-EG" : t("langCode") === "fr" ? "fr-FR" : "en-GB", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant/40" />
            <span className="flex items-center gap-1.5 text-primary font-bold">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </p>
        </div>

        <Link to="/dashboard/patients/new" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary-hover hover:to-blue-700 text-white px-6 py-3 rounded-2xl text-sm font-bold transition-all shadow-[0_8px_24px_rgba(var(--color-primary),0.25)] hover:-translate-y-0.5 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          {t("patients.addPatient")}
        </Link>
      </div>

      {/* Stats Grid */}
      <section>
        <div className="flex items-center justify-between mb-5">
           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-outline">
             {t("dashboard.todayOverview")}
           </p>
           <div className="h-px flex-1 bg-outline-variant/30 ms-4"></div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard 
            icon="group" 
            label={t("dashboard.totalPatients")} 
            value={total.toString()} 
            color="primary"
          />
          <StatCard
            icon="monitor_heart"
            label={t("dashboard.recentMonitoring")}
            value={monitoringCount === null ? "—" : monitoringCount.toString()}
            delta={monitoringCount !== null ? t("dashboard.last7d", "Last 7d") : undefined}
            positive={monitoringCount !== null}
            color="secondary"
          />
          <StatCard 
            icon="emergency" 
            label={t("dashboard.criticalCases")} 
            value={criticalCount.toString()} 
            color={criticalCount > 0 ? "error" : "success"}
          />
        </div>
      </section>

      {/* Snapshot Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <MedicalCard title={t("dashboard.upcomingAppointments")} icon="event_available" accent="secondary">
            {!settings.notifyAppointments ? (
              <p className="text-xs text-on-surface-variant leading-relaxed italic">{t("settings.appointmentsDesc")}</p>
            ) : loadingApps ? (
              <div className="py-4 flex justify-center"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div></div>
            ) : upcomingApps.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                 <span className="material-symbols-outlined text-outline/30 text-[32px] mb-2">event_busy</span>
                 <p className="text-xs text-on-surface-variant">{t("dashboard.noApps")}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingApps.map(a => {
                  const p = patients.find(pat => pat.id === a.patient_id);
                  const d = new Date(a.date);
                  const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
                  return (
                    <div key={a.id} className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/80 flex justify-between items-center">
                      <div className="min-w-0">
                        <p className="text-[10px] font-black text-primary uppercase">{dateStr} • {time}</p>
                        <p className="text-xs font-bold text-on-surface truncate">{p?.name || t("common.noData")}</p>
                      </div>
                      <Link to={`/dashboard/appointments`} className="text-outline hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                      </Link>
                    </div>
                  );
                })}
              </div>
            )}
          </MedicalCard>

          <MedicalCard title={t("dashboard.criticalAlerts")} icon="warning" accent="error">
            {!settings.notifyCriticalAlerts ? (
              <p className="text-xs text-on-surface-variant leading-relaxed italic">{t("settings.criticalDesc")}</p>
            ) : criticalRows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                 <span className="material-symbols-outlined text-primary/20 text-[32px] mb-2">check_circle</span>
                 <p className="text-xs text-on-surface-variant">{t("dashboard.allStable")}</p>
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

          <MedicalCard title={t("sidebar.profile")} icon="badge" accent="primary">
            <div className="bg-surface-container-low/60 rounded-xl p-3 border border-outline-variant/80">
              <InfoRow label={t("common.physician")} value={doctorName || "—"} />
              <InfoRow label={t("common.specialty")} value={t(`medical.diseases.${specialty.toLowerCase()}`) || specialty || "—"} />
              <InfoRow label={t("dashboard.accessMode", "Access Mode")} value={t("dashboard.localWorkspace", "Local Workspace")} color="primary" />
              <div className="pt-4 flex items-center justify-between">
                <StatusChip status={t("status.Active")} />
                <span className="text-[10px] font-bold text-outline uppercase tracking-widest flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                   {t("dashboard.sessionEncrypted", "Session Encrypted")}
                </span>
              </div>
            </div>
          </MedicalCard>
      </section>

      {/* Future Tools / QR Access */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-start gap-4 p-5 bg-primary/5 border border-primary/10 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-2">
            <span className="text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 bg-primary/10 text-primary rounded-full border border-primary/20">
              {t("common.futureFeature")}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-[20px]">qr_code_2</span>
          </div>
          <div>
             <p className="text-sm font-bold text-on-surface">{t("landing.features.items.qr.title")}</p>
             <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
               {t("landing.features.items.qr.desc")}
             </p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-5 bg-primary/5 border border-primary/10 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
          </div>
          <div>
             <p className="text-sm font-bold text-on-surface">{t("dashboard.privacyShield", "Local Privacy Shield Active")}</p>
             <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
               {t("dashboard.privacyNote")}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
