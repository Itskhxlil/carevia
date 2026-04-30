import React from "react";

/**
 * Medical hero animation — teal/navy theme with pulse rings and ECG.
 */
export default function ClinicalHeroAnimation() {
  return (
    <div
      className="relative w-full min-h-[280px] md:min-h-[380px] flex flex-col items-center justify-center overflow-hidden rounded-2xl"
      style={{
        background: "linear-gradient(145deg, rgba(6,37,53,0.9) 0%, rgba(5,25,38,0.95) 100%)",
        border: "1px solid rgba(13,200,175,0.2)",
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(13,200,175,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(13,200,175,0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Teal glow at center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(13,200,175,0.12), transparent 70%)",
        }}
      />

      {/* Pulse rings */}
      <div className="absolute left-[12%] top-[20%] w-20 h-20 rounded-full border border-primary/30 carevia-pulse-ring pointer-events-none" />
      <div className="absolute left-[12%] top-[20%] w-20 h-20 rounded-full border border-primary/20 carevia-pulse-ring-delayed pointer-events-none" />
      <div className="absolute right-[12%] bottom-[20%] w-14 h-14 rounded-full border border-secondary/25 carevia-pulse-ring pointer-events-none" />

      {/* Hub orbit */}
      <div className="relative w-48 h-48 md:w-56 md:h-56 mx-auto mt-2">
        <div className="absolute inset-0 rounded-full border border-dashed border-primary/15" />

        {/* Orbiting icon 1 */}
        <div className="absolute inset-0 animate-[spin_20s_linear_infinite]">
          <div className="absolute left-1/2 top-0 w-9 h-9 -translate-x-1/2 -translate-y-1 rounded-xl flex items-center justify-center text-primary"
            style={{ background: "rgba(13,200,175,0.12)", border: "1px solid rgba(13,200,175,0.3)" }}>
            <span className="material-symbols-outlined text-[18px]">folder_special</span>
          </div>
        </div>

        {/* Orbiting icon 2 */}
        <div className="absolute inset-3 animate-[spin_14s_linear_infinite_reverse]">
          <div className="absolute left-1/2 bottom-0 w-9 h-9 -translate-x-1/2 translate-y-1 rounded-xl flex items-center justify-center text-secondary"
            style={{ background: "rgba(96,200,240,0.12)", border: "1px solid rgba(96,200,240,0.25)" }}>
            <span className="material-symbols-outlined text-[18px]">science</span>
          </div>
        </div>

        {/* Orbiting icon 3 */}
        <div className="absolute inset-6 animate-[spin_18s_linear_infinite]">
          <div className="absolute right-0 top-1/2 w-8 h-8 translate-x-1 -translate-y-1/2 rounded-xl flex items-center justify-center text-tertiary"
            style={{ background: "rgba(255,196,97,0.10)", border: "1px solid rgba(255,196,97,0.25)" }}>
            <span className="material-symbols-outlined text-[16px]">vaccines</span>
          </div>
        </div>

        {/* Center hub */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-2xl carevia-hub-glow"
            style={{
              background: "linear-gradient(135deg, rgba(13,200,175,0.25) 0%, rgba(9,150,130,0.18) 100%)",
              border: "1px solid rgba(13,200,175,0.45)",
            }}
          >
            <span className="material-symbols-outlined text-primary text-[2.4rem]">monitor_heart</span>
          </div>
        </div>
      </div>

      {/* ECG line */}
      <div className="relative z-10 w-[88%] max-w-md h-12 md:h-14 mt-5">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 400 56" fill="none" aria-hidden>
          <path
            d="M0 28 H40 L48 28 L52 12 L56 44 L60 20 L64 36 L68 28 H120 L128 28 L132 8 L136 48 L140 16 L144 32 L148 28 H200 L208 28 L212 10 L216 46 L220 18 L224 34 L228 28 H280 L288 28 L292 14 L296 42 L300 22 L304 30 L308 28 H360 L368 28 L372 6 L376 50 L380 12 L384 38 L388 28 H400"
            stroke="url(#carevia-teal-ecg)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="carevia-ecg-path"
          />
          <defs>
            <linearGradient id="carevia-teal-ecg" x1="0" y1="0" x2="400" y2="0" gradientUnits="userSpaceOnUse">
              <stop stopColor="rgba(13,200,175,0)" />
              <stop offset="0.35" stopColor="rgba(13,200,175,0.9)" />
              <stop offset="0.7"  stopColor="rgba(96,200,240,0.95)" />
              <stop offset="1"    stopColor="rgba(13,200,175,0)" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Bars */}
      <div className="flex items-end justify-center gap-1.5 h-9 md:h-10 mt-3 px-4">
        {[0.38, 0.58, 0.42, 0.78, 0.52, 0.92, 0.48, 0.68, 0.4, 0.72, 0.55, 0.85].map((h, i) => (
          <span
            key={i}
            className="w-1.5 rounded-sm carevia-data-bar"
            style={{
              height: `${Math.round(h * 100)}%`,
              animationDelay: `${i * 0.07}s`,
              background: "linear-gradient(to top, rgba(9,150,130,0.5), rgb(13,200,175))",
            }}
          />
        ))}
      </div>

      <p className="relative z-10 mt-4 mb-2 px-6 text-center text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.22em] text-outline">
        Patient records · Labs · Clinical archive
      </p>
    </div>
  );
}
