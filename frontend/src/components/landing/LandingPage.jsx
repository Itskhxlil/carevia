import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "../../services/authStorage.js";
import HeroSection from "./HeroSection.jsx";
import ProblemsSection from "./ProblemsSection.jsx";
import FeaturesSection from "./FeaturesSection.jsx";
import HowItWorksSection from "./HowItWorksSection.jsx";
import CtaSection from "./CtaSection.jsx";
import LandingNav from "./LandingNav.jsx";
import LandingFooter from "./LandingFooter.jsx";
import AuthModal from "./AuthModal.jsx";

export default function LandingPage() {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("signin");

  useEffect(() => {
    if (getSession()) navigate("/dashboard", { replace: true });
  }, [navigate]);

  const openAuth = (mode) => { setAuthMode(mode); setShowAuth(true); };

  return (
    <div className="min-h-screen bg-[#050d18] text-slate-100 overflow-x-hidden font-body">
      {/* Ambient background orbs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] rounded-full bg-teal-500/[0.03] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/[0.04] blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[400px] h-[400px] rounded-full bg-blue-500/[0.02] blur-[80px]" />
      </div>

      <div className="relative z-10">
        <LandingNav openAuth={openAuth} />
        <HeroSection openAuth={openAuth} />
        <ProblemsSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection openAuth={openAuth} />
        <LandingFooter />
      </div>

      {showAuth && (
        <AuthModal
          mode={authMode}
          setMode={setAuthMode}
          onClose={() => setShowAuth(false)}
          onSuccess={() => navigate("/dashboard", { replace: true })}
        />
      )}
    </div>
  );
}
