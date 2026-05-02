import React from "react";

export default function LandingFooter() {
  return (
    <footer className="border-t border-slate-800/40 py-10 relative">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[13px]">favorite</span>
            </div>
            <div>
              <span className="text-sm font-bold text-white">Carevia</span>
              <span className="text-[9px] text-teal-400/50 uppercase tracking-wider ml-1.5">Clinical Archivist</span>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-[12px] text-slate-500">
            <a href="#features" className="hover:text-teal-400 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-teal-400 transition-colors">Workflow</a>
            <a href="#problems" className="hover:text-teal-400 transition-colors">Why Carevia</a>
          </div>

          {/* Copyright */}
          <p className="text-[11px] text-slate-600">
            © 2026 Carevia. All patient data stored locally.
          </p>
        </div>
      </div>
    </footer>
  );
}
