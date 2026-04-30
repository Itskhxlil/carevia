import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar({ doctorName = "", specialty = "", email = "", onSignOut }) {
  const { t } = useTranslation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const userWrapRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (userWrapRef.current && !userWrapRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const initials = String(doctorName || "?")
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header
      className={`
        sticky top-0 z-50 transition-all duration-300
        ${scrolled
          ? "bg-[#060f1a]/95 backdrop-blur-xl border-b border-teal-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "bg-[#060f1a]/80 backdrop-blur-md border-b border-white/5"
        }
      `}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/dashboard/overview" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shadow-[0_0_16px_rgba(20,184,166,0.4)] group-hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-white text-[18px]">favorite</span>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="text-base font-black text-white tracking-tight font-headline">
              Carevia
            </span>
            <span className="text-[9px] font-bold tracking-[0.1em] text-teal-400/70 uppercase">
              Archivist
            </span>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md hidden md:flex items-center gap-3 px-4 py-2 bg-slate-900/60 border border-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-teal-500/20 focus-within:border-teal-500/40 transition-all duration-300">
          <span className="material-symbols-outlined text-slate-500 text-[18px]">search</span>
          <input
            type="text"
            placeholder={t("navbar.search") || "Search patients, records..."}
            className="w-full bg-transparent text-sm text-slate-200 placeholder:text-slate-600 outline-none font-body"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-slate-700 bg-slate-800 text-slate-500 text-[10px] font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setNotifOpen((o) => !o); setUserOpen(false); }}
              className="w-10 h-10 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition-all"
              aria-label={t("navbar.notifications")}
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-teal-500 border border-[#060f1a]" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-72 z-50 bg-[#0a1929] border border-slate-800 rounded-2xl p-4 shadow-2xl animate-[carevia-fade-in-up_0.3s_ease-out_both]">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 ml-1">
                  Notifications
                </p>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <span className="material-symbols-outlined text-slate-700 text-[32px] mb-2">notifications_off</span>
                  <p className="text-xs text-slate-500">
                    No new alerts at this time.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative ml-1" ref={userWrapRef}>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setUserOpen((o) => !o); setNotifOpen(false); }}
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/60 transition-all duration-300 hover:border-teal-500/30"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center text-white text-[11px] font-black shadow-[0_0_12px_rgba(20,184,166,0.35)]">
                {initials}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-bold text-white truncate max-w-[100px]">{doctorName || "Dr. User"}</p>
                <p className="text-[9px] font-bold text-slate-500 truncate uppercase tracking-wider">{specialty || "General"}</p>
              </div>
              <span className="material-symbols-outlined text-slate-500 text-[18px] hidden sm:block">expand_more</span>
            </button>

            {userOpen && (
              <div
                className="absolute right-0 top-12 w-56 z-50 py-2 bg-[#0a1929] border border-slate-800 rounded-2xl shadow-2xl animate-[carevia-fade-in-up_0.3s_ease-out_both]"
                role="menu"
              >
                <div className="px-4 py-2 mb-1 border-b border-slate-800/60">
                   <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">{email || "clinical.workspace"}</p>
                </div>
                
                <Link
                  to="/dashboard/profile"
                  role="menuitem"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-teal-500/10 transition-colors"
                  onClick={() => setUserOpen(false)}
                >
                  <span className="material-symbols-outlined text-[20px]">account_circle</span>
                  My Profile
                </Link>
                <Link
                  to="/dashboard/settings"
                  role="menuitem"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-teal-500/10 transition-colors"
                  onClick={() => setUserOpen(false)}
                >
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                  Workspace Settings
                </Link>

                <div className="mt-1 pt-1 border-t border-slate-800/60">
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                    onClick={() => { setUserOpen(false); onSignOut(); }}
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
