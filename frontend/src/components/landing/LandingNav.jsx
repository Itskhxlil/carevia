import React, { useState, useEffect } from "react";

export default function LandingNav({ openAuth }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#050d18]/90 backdrop-blur-2xl border-b border-teal-500/10 shadow-[0_4px_40px_rgba(0,0,0,0.5)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 flex items-center justify-center shadow-[0_0_20px_rgba(20,184,166,0.5)]">
              <span className="material-symbols-outlined text-white text-[18px]">favorite</span>
            </div>
            <div className="absolute inset-0 rounded-xl bg-teal-400/20 animate-ping" style={{ animationDuration: "3s" }} />
          </div>
          <div>
            <span className="text-lg font-extrabold tracking-tight text-white font-headline">
              Carevia
            </span>
            <span className="hidden sm:inline text-[9px] font-bold tracking-[0.18em] text-teal-400/60 uppercase ml-2">
              Clinical Archivist
            </span>
          </div>
        </div>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-1">
          {[
            ["Problems", "#problems"],
            ["Features", "#features"],
            ["How It Works", "#how-it-works"],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="relative px-4 py-2 text-[13px] font-medium text-slate-400 hover:text-white transition-colors duration-300 group"
            >
              {label}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-teal-400 to-cyan-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => openAuth("signin")}
            className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block px-4 py-2"
          >
            Sign in
          </button>
          <button
            onClick={() => openAuth("signup")}
            className="relative group bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 shadow-[0_4px_24px_rgba(20,184,166,0.3)] hover:shadow-[0_8px_32px_rgba(20,184,166,0.5)] hover:-translate-y-0.5 overflow-hidden"
          >
            <span className="relative z-10">Access Dashboard</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          </button>
        </div>
      </div>
    </header>
  );
}
