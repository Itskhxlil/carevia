import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { loadSettings, saveSettings } from "../services/authStorage.js";
import { applyThemeFromSettings } from "../services/themeSync.js";
import LanguageSwitcher from "./LanguageSwitcher.jsx";
import logo from "../assets/logo.png";
import { usePatients } from "../PatientsContext.jsx";

export default function Navbar({ doctorName = "", specialty = "", email = "", onSignOut }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { patients } = usePatients();
  
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen]   = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [theme, setTheme]         = useState(() => loadSettings().themeMode || "light");
  
  const [search, setSearch] = useState("");
  const [showResults, setShowResults] = useState(false);
  
  const userWrapRef = useRef(null);
  const searchWrapRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (userWrapRef.current && !userWrapRef.current.contains(e.target)) setUserOpen(false);
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target)) setShowResults(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onSettings() { setTheme(loadSettings().themeMode || "light"); }
    window.addEventListener("carevia-settings-updated", onSettings);
    return () => window.removeEventListener("carevia-settings-updated", onSettings);
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    saveSettings({ themeMode: next });
    setTheme(next);
    applyThemeFromSettings();
    window.dispatchEvent(new CustomEvent("carevia-settings-updated"));
  }

  const searchResults = search.trim() 
    ? patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))
    : [];

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
          ? "bg-background/95 backdrop-blur-xl border-b border-primary/10 shadow-[0_4px_30px_rgba(var(--color-primary),0.05)]"
          : "bg-background/80 backdrop-blur-md border-b border-outline-variant/15"
        }
      `}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-32 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/dashboard/overview" className="shrink-0 transition-transform hover:scale-105 active:scale-95">
          <img src={logo} alt="Carevia" className="h-24 w-auto transform scale-125 origin-left" />
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md hidden md:block relative" ref={searchWrapRef}>
          <div className="flex items-center gap-3 px-4 py-2 bg-surface-container-low/60 border border-outline-variant/80 rounded-xl focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/40 transition-all duration-300">
            <span className="material-symbols-outlined text-on-surface-variant/50 text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowResults(true); }}
              onFocus={() => setShowResults(true)}
              placeholder={t("navbar.searchPlaceholder")}
              className="w-full bg-transparent text-sm text-on-surface-variant placeholder:text-outline outline-none font-body"
            />
          </div>

          {showResults && search.trim() && (
            <div className="absolute left-0 right-0 top-12 max-h-80 overflow-y-auto bg-surface border border-outline-variant/40 rounded-2xl shadow-2xl z-[60] py-2 animate-[carevia-fade-in-up_0.2s_ease-out_both]">
               <p className="text-[9px] font-black uppercase tracking-widest text-outline px-4 py-1.5 mb-1 border-b border-outline-variant/10">
                 {t("common.search")} ({searchResults.length})
               </p>
               {searchResults.length > 0 ? (
                 searchResults.map(p => (
                   <button
                     key={p.id}
                     onClick={() => {
                        navigate(`/dashboard/patients/${p.id}`);
                        setSearch("");
                        setShowResults(false);
                     }}
                     className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-primary/10 text-left transition-colors group"
                   >
                     <div className="min-w-0">
                       <p className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">{p.name}</p>
                       <p className="text-[10px] text-on-surface-variant font-mono truncate">{p.id}</p>
                     </div>
                     <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'Critical' ? 'bg-error' : 'bg-primary'}`} />
                   </button>
                 ))
               ) : (
                 <div className="px-4 py-6 text-center">
                    <p className="text-xs text-outline italic">{t("patients.noMatch")}</p>
                 </div>
               )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <LanguageSwitcher className="hidden sm:inline-block" />
          
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-surface-container-low/40 border border-outline-variant/80 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition-all"
            aria-label={t("settings.appearance")}
            title={theme === "dark" ? t("settings.light") : t("settings.dark")}
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setNotifOpen((o) => !o); setUserOpen(false); }}
              className="w-10 h-10 rounded-xl bg-surface-container-low/40 border border-outline-variant/80 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition-all"
              aria-label={t("navbar.notifications")}
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-primary border border-background" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-12 w-72 z-50 bg-surface border border-outline-variant/40 rounded-2xl p-4 shadow-2xl animate-[carevia-fade-in-up_0.3s_ease-out_both]">
                <p className="text-[10px] font-black uppercase tracking-widest text-outline mb-3 ml-1">
                  {t("navbar.notifications")}
                </p>
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <span className="material-symbols-outlined text-outline/30 text-[32px] mb-2">notifications_off</span>
                  <p className="text-xs text-on-surface-variant">
                    {t("navbar.noNotifications")}
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
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 rounded-xl border border-outline-variant/80 bg-surface-container-low/40 hover:bg-surface-container-low/60 transition-all duration-300 hover:border-primary/30"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-white text-[11px] font-black shadow-[0_0_12px_rgba(37,99,235,0.3)]">
                {initials}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <p className="text-xs font-bold text-on-surface truncate max-w-[100px]">{doctorName || t("common.physician")}</p>
                <p className="text-[9px] font-bold text-on-surface-variant truncate uppercase tracking-wider">{t(`medical.diseases.${specialty.toLowerCase()}`) || specialty || t("medical.diseases.general")}</p>
              </div>
              <span className="material-symbols-outlined text-outline text-[18px] hidden sm:block">expand_more</span>
            </button>

            {userOpen && (
              <div
                className="absolute right-0 top-12 w-56 z-50 py-2 bg-surface border border-outline-variant/40 rounded-2xl shadow-2xl animate-[carevia-fade-in-up_0.3s_ease-out_both]"
                role="menu"
              >
                <div className="px-4 py-2 mb-1 border-b border-outline-variant/15">
                   <p className="text-[9px] font-black text-outline uppercase tracking-widest">{email || "clinical.workspace"}</p>
                </div>
                
                <Link
                  to="/dashboard/profile"
                  role="menuitem"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-primary/10 transition-colors"
                  onClick={() => setUserOpen(false)}
                >
                  <span className="material-symbols-outlined text-[20px]">account_circle</span>
                  {t("sidebar.profile")}
                </Link>
                <Link
                  to="/dashboard/settings"
                  role="menuitem"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-primary/10 transition-colors"
                  onClick={() => setUserOpen(false)}
                >
                  <span className="material-symbols-outlined text-[20px]">tune</span>
                  {t("sidebar.settings")}
                </Link>

                <div className="mt-1 pt-1 border-t border-outline-variant/15">
                  <button
                    type="button"
                    role="menuitem"
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-error hover:bg-error/10 transition-colors text-left"
                    onClick={() => { setUserOpen(false); onSignOut(); }}
                  >
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    {t("sidebar.signOut")}
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
