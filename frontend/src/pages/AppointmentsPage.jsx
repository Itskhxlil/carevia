import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import PageShell from "./PageShell.jsx";
import { usePatients } from "../PatientsContext.jsx";
import { fetchAppointments, createAppointment, updateAppointmentStatus, deleteAppointment } from "../services/appointmentsApi.js";
import { StatCard } from "../components/Cards.jsx";

// Days and Months are handled via i18n

export default function AppointmentsPage() {
  const { t, i18n } = useTranslation();
  const { patients } = usePatients();
  const isRtl = i18n.dir() === "rtl";

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month"); // month, week, day
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  // Stats
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const todayCount = appointments.filter(a => a.date.slice(0, 10) === todayStr).length;
    const upcoming = appointments.filter(a => a.date >= now.toISOString() && a.status === "Scheduled").length;
    const completed = appointments.filter(a => a.status === "Completed").length;
    return { todayCount, upcoming, completed };
  }, [appointments]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  // Calendar Helpers
  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const day = currentDate.getDate();

    if (viewMode === "month") {
      const totalDays = daysInMonth(year, month);
      const startOffset = firstDayOfMonth(year, month);
      const days = [];
      const prevMonthDays = daysInMonth(year, month - 1);
      for (let i = startOffset - 1; i >= 0; i--) {
        days.push({ day: prevMonthDays - i, month: month - 1, year, isCurrent: false });
      }
      for (let i = 1; i <= totalDays; i++) {
        days.push({ day: i, month, year, isCurrent: true });
      }
      const remaining = 42 - days.length;
      for (let i = 1; i <= remaining; i++) {
        days.push({ day: i, month: month + 1, year, isCurrent: false });
      }
      return days;
    } else if (viewMode === "week") {
      const days = [];
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(startOfWeek.getDate() + i);
        days.push({ day: d.getDate(), month: d.getMonth(), year: d.getFullYear(), isCurrent: true });
      }
      return days;
    } else {
      return [{ day: currentDate.getDate(), month: currentDate.getMonth(), year: currentDate.getFullYear(), isCurrent: true }];
    }
  }, [currentDate, viewMode]);

  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewMode === "month") d.setMonth(d.getMonth() - 1);
    else if (viewMode === "week") d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
    if (viewMode !== "month") setSelectedDate(d);
  };
  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewMode === "month") d.setMonth(d.getMonth() + 1);
    else if (viewMode === "week") d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
    if (viewMode !== "month") setSelectedDate(d);
  };

  const getDayAppointments = (year, month, day) => {
    const target = new Date(year, month, day).toISOString().slice(0, 10);
    return appointments.filter(a => a.date.slice(0, 10) === target);
  };

  const dayApps = useMemo(() => {
    return getDayAppointments(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
  }, [selectedDate, appointments]);

  async function handleStatusChange(id, status) {
    try {
      await updateAppointmentStatus(id, status);
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <PageShell title={t("appointments.title")} description={t("appointments.description")}>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard icon="calendar_today" label={t("appointments.statsToday")} value={stats.todayCount.toString()} color="primary" />
        <StatCard icon="upcoming" label={t("appointments.statsUpcoming")} value={stats.upcoming.toString()} color="secondary" />
        <StatCard icon="task_alt" label={t("appointments.statsCompleted")} value={stats.completed.toString()} color="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        
        {/* Calendar Section */}
        <div className="carevia-glass-card overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-black text-on-surface capitalize">
                {t(`appointments.months.${["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][currentDate.getMonth()]}`)} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center gap-1">
                <button onClick={handlePrev} className="p-2 rounded-xl hover:bg-surface-variant transition-colors">
                  <span className="material-symbols-outlined">{isRtl ? "chevron_right" : "chevron_left"}</span>
                </button>
                <button onClick={handleNext} className="p-2 rounded-xl hover:bg-surface-variant transition-colors">
                  <span className="material-symbols-outlined">{isRtl ? "chevron_left" : "chevron_right"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl border border-outline-variant/80">
              {["month", "week", "day"].map(m => (
                <button
                  key={m}
                  onClick={() => setViewMode(m)}
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === m ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-outline hover:text-on-surface"}`}
                >
                  {t(`appointments.view${m.charAt(0).toUpperCase() + m.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 p-4">
            {viewMode === 'month' && (
              <div className="grid grid-cols-7 mb-2">
                {["sun", "mon", "tue", "wed", "thu", "fri", "sat"].map(d => (
                  <div key={d} className="text-center py-2 text-[10px] font-black text-outline uppercase tracking-widest">
                    {t(`appointments.days.${d}`)}
                  </div>
                ))}
              </div>
            )}
            <div className={`grid gap-px bg-outline-variant/20 border border-outline-variant/20 rounded-2xl overflow-hidden ${viewMode === 'month' ? 'grid-cols-7' : viewMode === 'week' ? 'grid-cols-7' : 'grid-cols-1'}`}>
              {calendarDays.map((d, i) => {
                const isSelected = selectedDate.getDate() === d.day && selectedDate.getMonth() === d.month && selectedDate.getFullYear() === d.year;
                const apps = getDayAppointments(d.year, d.month, d.day);
                const isToday = new Date().toISOString().slice(0, 10) === new Date(d.year, d.month, d.day).toISOString().slice(0, 10);
                
                return (
                  <div
                    key={i}
                    onClick={() => {
                      const newD = new Date(d.year, d.month, d.day);
                      setSelectedDate(newD);
                      if (viewMode !== 'month') setCurrentDate(newD);
                    }}
                    className={`p-2 transition-all cursor-pointer relative group ${d.isCurrent ? "bg-surface/40" : "bg-surface-container-low/20 opacity-40"} ${isSelected ? "ring-2 ring-inset ring-primary/50" : "hover:bg-surface-variant/40"} ${viewMode === 'month' ? 'min-h-[100px]' : 'min-h-[200px]'}`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-xs font-bold ${isToday ? "w-6 h-6 rounded-lg bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/30" : "text-on-surface"}`}>
                        {d.day}
                      </span>
                      {viewMode !== 'month' && (
                        <span className="text-[10px] font-black text-outline uppercase">{t(`appointments.days.${["sun", "mon", "tue", "wed", "thu", "fri", "sat"][new Date(d.year, d.month, d.day).getDay()]}`)}</span>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      {apps.map(a => {
                        const patient = patients.find(p => p.id === a.patient_id);
                        const time = new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return (
                          <div key={a.id} className="flex items-center gap-2 p-1.5 rounded-lg bg-surface-container-high/50 border border-outline-variant/10">
                            <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${a.status === 'Scheduled' ? 'bg-primary' : a.status === 'Completed' ? 'bg-success' : 'bg-rose-500'}`} />
                            <div className="min-w-0 flex-1">
                              <p className="text-[9px] font-bold text-on-surface truncate">{patient?.name}</p>
                              {viewMode !== 'month' && <p className="text-[8px] text-outline">{time}</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Day View */}
        <div className="flex flex-col gap-6">
          <div className="carevia-glass-card p-6">
             <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] font-black text-outline uppercase tracking-widest">{selectedDate.toLocaleDateString(undefined, { weekday: 'long' })}</p>
                  <h3 className="text-lg font-black text-on-surface">
                    {selectedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(true)}
                  className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center hover:bg-primary/20 transition-all shadow-lg shadow-primary/5"
                >
                  <span className="material-symbols-outlined">add</span>
                </button>
             </div>

             <div className="space-y-4">
                {dayApps.length === 0 ? (
                  <div className="py-10 text-center">
                    <span className="material-symbols-outlined text-outline/30 text-[40px] mb-2">event_busy</span>
                    <p className="text-xs text-outline italic">{t("appointments.noApps")}</p>
                  </div>
                ) : (
                  dayApps.map(a => {
                    const patient = patients.find(p => p.id === a.patient_id);
                    const time = new Date(a.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                    return (
                      <div key={a.id} className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/80 group hover:border-primary/40 transition-all">
                        <div className="flex justify-between items-start mb-2">
                           <div className="min-w-0">
                              <p className="text-xs font-black text-primary mb-0.5">{time}</p>
                              <p className="text-sm font-bold text-on-surface truncate">{patient?.name || "Unknown Patient"}</p>
                           </div>
                            <select
                               value={a.status}
                               onChange={(e) => handleStatusChange(a.id, e.target.value)}
                               className="text-[10px] font-bold bg-background border border-outline-variant/80 rounded-lg px-2 py-1 outline-none"
                            >
                               <option value="Scheduled">{t("status.Scheduled")}</option>
                               <option value="Completed">{t("status.Completed")}</option>
                               <option value="Cancelled">{t("status.Cancelled")}</option>
                            </select>
                        </div>
                        {a.notes && <p className="text-[11px] text-on-surface-variant italic line-clamp-2">{a.notes}</p>}
                      </div>
                    );
                  })
                )}
             </div>
          </div>

          <div className="carevia-glass-card p-6 bg-primary/5 border-primary/20">
             <div className="flex items-center gap-3 mb-2">
                <span className="material-symbols-outlined text-primary text-[20px]">info</span>
                <p className="text-xs font-bold text-on-surface">{t("common.workspace")}</p>
             </div>
             <p className="text-[11px] text-on-surface-variant leading-relaxed">
               {t("dashboard.privacyNote")}
             </p>
          </div>
        </div>
      </div>

      {/* New Appointment Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-surface border border-outline-variant/80 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-outline-variant/20 flex items-center justify-between">
                <h3 className="text-lg font-black text-on-surface">{t("appointments.newApp")}</h3>
                <button onClick={() => setShowModal(false)} className="text-outline hover:text-on-surface">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <form
                className="p-6 space-y-5"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  const patient_id = fd.get("patient");
                  const time = fd.get("time");
                  const notes = fd.get("notes");
                  const fullDate = new Date(selectedDate);
                  const [h, m] = time.split(":");
                  fullDate.setHours(h, m, 0, 0);
                  
                  try {
                    const newApp = await createAppointment({
                      patient_id,
                      date: fullDate.toISOString(),
                      notes,
                      status: "Scheduled"
                    });
                    setAppointments(prev => [...prev, newApp]);
                    setShowModal(false);
                  } catch (err) {
                    alert(err.message);
                  }
                }}
              >
                 <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline">{t("appointments.selectPatient")}</label>
                  <select name="patient" required className="w-full bg-surface-container-low border border-outline-variant/80 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20">
                    <option value="">{t("appointments.selectPatient")}</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline">{t("appointments.time")}</label>
                  <input name="time" type="time" required className="w-full bg-surface-container-low border border-outline-variant/80 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-outline">{t("appointments.notes")}</label>
                  <textarea name="notes" rows={3} className="w-full bg-surface-container-low border border-outline-variant/80 rounded-xl px-4 py-3 text-sm text-on-surface outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder={t("appointments.notesPlaceholder")} />
                </div>
                <button type="submit" className="w-full py-4 bg-primary text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                  {t("appointments.schedule")}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
