import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  clearAllAppData,
  exportUserDataBlob,
  loadSettings,
  saveSettings,
} from "../authStorage.js";
import PageShell from "./PageShell.jsx";

export default function SettingsPage() {
  const { t, i18n }   = useTranslation();
  const [settings, setSettings] = useState(loadSettings);
  const [confirmErase, setConfirmErase] = useState(false);

  function patch(partial) {
    const next = saveSettings(partial);
    setSettings(next);
    window.dispatchEvent(new Event("carevia-settings-updated"));

    if (partial.language) {
      i18n.changeLanguage(partial.language);
      document.documentElement.dir  = partial.language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = partial.language;
    }
  }

  function handleExport() {
    const blob = exportUserDataBlob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `carevia-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleEraseAll() {
    if (!confirmErase) { setConfirmErase(true); return; }
    clearAllAppData();
    window.location.href = "/";
  }

  return (
    <PageShell title={t("settings.title")} description={t("settings.description")}>
      <div className="max-w-2xl space-y-6">

        {/* Language */}
        <SettingSection
          icon="language"
          title={t("settings.language")}
          description={t("settings.languageDesc")}
        >
          <div className="flex flex-wrap gap-3">
            {[
              { id: "en", label: "English",  flag: "🇬🇧" },
              { id: "ar", label: "العربية",  flag: "🇸🇦" },
              { id: "fr", label: "Français",  flag: "🇫🇷" },
            ].map((lang) => (
              <button
                key={lang.id}
                type="button"
                onClick={() => patch({ language: lang.id })}
                className={
                  settings.language === lang.id
                    ? "carevia-btn-primary"
                    : "carevia-btn-secondary"
                }
              >
                <span className="text-base">{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </div>
        </SettingSection>

        {/* Appearance */}
        <SettingSection
          icon="contrast"
          title={t("settings.appearance")}
          description={t("settings.appearanceDesc")}
        >
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => patch({ themeMode: "dark" })}
              className={settings.themeMode !== "light" ? "carevia-btn-primary" : "carevia-btn-secondary"}
            >
              <span className="material-symbols-outlined text-[18px] relative z-10">dark_mode</span>
              {t("settings.dark")}
            </button>
            <button
              type="button"
              onClick={() => patch({ themeMode: "light" })}
              className={settings.themeMode === "light" ? "carevia-btn-primary" : "carevia-btn-secondary"}
            >
              <span className="material-symbols-outlined text-[18px] relative z-10">light_mode</span>
              {t("settings.light")}
            </button>
          </div>
        </SettingSection>

        {/* Highlights */}
        <SettingSection
          icon="notifications"
          title={t("settings.highlights")}
          description={t("settings.highlightsDesc")}
        >
          <div className="space-y-4">
            <ToggleRow
              label={t("settings.labResults")}
              description={t("settings.labResultsDesc")}
              checked={settings.notifyLabResults}
              onChange={(v) => patch({ notifyLabResults: v })}
            />
            <ToggleRow
              label={t("settings.appointmentsPanel")}
              description={t("settings.appointmentsPanelDesc")}
              checked={settings.notifyAppointments}
              onChange={(v) => patch({ notifyAppointments: v })}
            />
            <ToggleRow
              label={t("settings.criticalAlerts")}
              description={t("settings.criticalAlertsDesc")}
              checked={settings.notifyCriticalAlerts}
              onChange={(v) => patch({ notifyCriticalAlerts: v })}
            />
          </div>
        </SettingSection>

        {/* Workspace */}
        <SettingSection icon="tune" title={t("settings.workspace")}>
          <div className="space-y-4">
            <ToggleRow
              label={t("settings.compactTables")}
              description={t("settings.compactTablesDesc")}
              checked={settings.compactTables}
              onChange={(v) => patch({ compactTables: v })}
            />
            <ToggleRow
              label={t("settings.keyboardHints")}
              description={t("settings.keyboardHintsDesc")}
              checked={settings.keyboardHints}
              onChange={(v) => patch({ keyboardHints: v })}
            />
          </div>
        </SettingSection>

        {/* Data */}
        <SettingSection
          icon="database"
          title={t("settings.data")}
          description={t("settings.dataDesc")}
        >
          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={handleExport} className="carevia-btn-primary">
              <span className="material-symbols-outlined text-[18px] relative z-10">download</span>
              {t("settings.exportBackup")}
            </button>
            <button
              type="button"
              onClick={handleEraseAll}
              className={`carevia-btn-secondary ${confirmErase ? "!border-error/40 !text-error" : ""}`}
            >
              {confirmErase ? t("settings.confirmErase") : t("settings.eraseAll")}
            </button>
          </div>
          {confirmErase && (
            <button
              type="button"
              onClick={() => setConfirmErase(false)}
              className="text-xs text-outline hover:text-on-surface-variant underline mt-2"
            >
              {t("settings.cancelErase")}
            </button>
          )}
        </SettingSection>

        {/* About */}
        <div className="rounded-2xl p-5 bg-primary/6 border border-primary/15 space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-primary">{t("settings.about")}</p>
          <p className="text-sm text-on-surface-variant">{t("settings.aboutDesc")}</p>
          <p className="text-[11px] text-outline font-mono">{t("common.version")}</p>
        </div>
      </div>
    </PageShell>
  );
}

function SettingSection({ icon, title, description, children }) {
  return (
    <section className="carevia-glass-card p-6 sm:p-7 space-y-5">
      <div>
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary text-[20px]">{icon}</span>
          </div>
          <h3 className="text-sm font-bold font-headline uppercase tracking-wider text-on-surface">
            {title}
          </h3>
        </div>
        {description && (
          <p className="text-xs text-on-surface-variant leading-relaxed pl-10">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-on-surface">{label}</p>
        <p className="text-[11px] text-outline mt-0.5 leading-relaxed">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`
          shrink-0 relative w-12 h-6 rounded-full transition-all duration-300
          ${checked
            ? "shadow-[0_0_20px_rgba(13,200,175,0.4)]"
            : "bg-surface-container-high border border-outline-variant/35"
          }
        `}
        style={checked ? {
          background: "linear-gradient(135deg, rgb(var(--color-primary)) 0%, rgb(var(--color-primary-dim)) 100%)"
        } : {}}
      >
        <span
          className={`
            absolute top-1 w-4 h-4 rounded-full transition-all duration-300 shadow-sm
            ${checked ? "left-7 bg-white" : "left-1 bg-on-surface-variant"}
          `}
        />
      </button>
    </div>
  );
}
