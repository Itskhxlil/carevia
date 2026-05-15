import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { loadSettings, saveSettings } from "../../services/authStorage.js";
import { applyThemeFromSettings } from "../../services/themeSync.js";
import LanguageSwitcher from "../LanguageSwitcher.jsx";
import logo from "../../assets/logo.png";

export default function LandingNav({ openAuth }) {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => loadSettings().themeMode || "light");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    function onSettings() {
      setTheme(loadSettings().themeMode || "light");
    }
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

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-2xl border-b border-outline-variant/80 shadow-[0_4px_30px_rgba(var(--color-primary),0.08)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[140px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center shrink-0">
          <img src={logo} alt="Carevia" className="h-32 w-auto transform scale-110" />
        </div>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            [t("landing.nav.problems"), "#problems"],
            [t("landing.nav.features"), "#features"],
            [t("landing.nav.howItWorks"), "#how-it-works"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="relative px-4 py-2 text-[13px] font-medium text-on-surface-variant hover:text-on-surface transition-colors duration-300 group"
            >
              {label}
              <span className="absolute bottom-0 start-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary group-hover:w-3/4 transition-all duration-300 rounded-full" />
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-block" />
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-surface-container-low/40 border border-outline-variant/80 flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition-all me-2"
            aria-label="Toggle Theme"
            title={theme === "dark" ? t("common.themeLight") : t("common.themeDark")}
          >
            <span className="material-symbols-outlined text-[20px]">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          <button
            onClick={() => openAuth("signin")}
            className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors hidden sm:block px-4 py-2"
          >
            {t("landing.nav.signIn")}
          </button>
          <button
            onClick={() => openAuth("signup")}
            className="relative group bg-gradient-to-r from-primary to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-[0_4px_24px_rgba(37,99,235,0.3)] hover:shadow-[0_8px_32px_rgba(37,99,235,0.5)] hover:-translate-y-0.5 overflow-hidden"
          >
            <span className="relative z-10">{t("landing.nav.accessDashboard")}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      </div>
    </header>
  );
}
