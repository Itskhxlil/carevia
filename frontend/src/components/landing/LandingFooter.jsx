import React from "react";
import { useTranslation } from "react-i18next";
import logo from "../../assets/logo.png";

export default function LandingFooter() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-outline-variant/80 py-10 relative bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <img src={logo} alt="Carevia" className="h-24 w-auto opacity-90 hover:opacity-100 transition-opacity" />
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-[12px] text-on-surface-variant">
            <a href="#features" className="hover:text-primary transition-colors">{t("footer.features")}</a>
            <a href="#how-it-works" className="hover:text-workflow transition-colors">{t("footer.workflow")}</a>
            <a href="#problems" className="hover:text-primary transition-colors">{t("footer.why")}</a>
          </div>

          {/* Copyright */}
          <p className="text-[11px] text-outline">
            {t("footer.copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
