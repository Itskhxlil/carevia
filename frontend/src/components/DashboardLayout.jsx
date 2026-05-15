import React, { useEffect, useReducer } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar.jsx";
import { PatientsProvider } from "../PatientsContext.jsx";
import { clearSession, getSession } from "../services/authStorage.js";

export default function DashboardLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [, bumpSession] = useReducer((x) => x + 1, 0);

  const NAV_ITEMS = [
    { to: "overview",     icon: "dashboard",    label: t("sidebar.overview") },
    { to: "patients",     icon: "group",        label: t("sidebar.patients") },
    { to: "appointments", icon: "event_note",   label: t("sidebar.appointments") },
    { to: "records",      icon: "description",  label: t("sidebar.records") },
    { to: "analytics",    icon: "monitoring",   label: t("sidebar.analytics") },
  ];

  function navClass(isActive) {
    return `
      flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
      ${isActive 
        ? "bg-primary/15 text-primary border border-primary/20 shadow-[0_0_20px_rgba(var(--color-primary),0.1)]" 
        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/40 border border-transparent"
      }
    `;
  }

  useEffect(() => {
    if (!getSession()) navigate("/", { replace: true });
  }, [navigate]);

  useEffect(() => {
    function onProfileUpdate() { bumpSession(); }
    window.addEventListener("carevia-profile-updated", onProfileUpdate);
    return () => window.removeEventListener("carevia-profile-updated", onProfileUpdate);
  }, []);

  const session    = getSession();
  const doctorName = session?.name ?? "";
  const specialty  = session?.specialty ?? "";
  const email      = session?.email ?? "";

  function handleSignOut() {
    clearSession();
    navigate("/", { replace: true });
  }

  return (
    <PatientsProvider>
      <div className="min-h-screen bg-background text-on-surface flex flex-col font-body selection:bg-primary/30 transition-colors duration-300">
        <Navbar doctorName={doctorName} specialty={specialty} email={email} onSignOut={handleSignOut} />

        {/* Mobile tab bar */}
        <nav
          className="lg:hidden flex gap-1 overflow-x-auto px-4 py-2 border-b border-outline-variant/20 bg-background/80 backdrop-blur-md"
          aria-label="Workspace sections"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "overview"}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors
                ${isActive ? "bg-primary/15 text-primary" : "text-on-surface-variant"}`
              }
            >
              <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-1 overflow-hidden min-h-0">
          {/* Desktop Sidebar */}
          <aside
            className="hidden lg:flex flex-col w-64 shrink-0 py-8 px-4 gap-1 border-r border-outline-variant/20 bg-surface"
            aria-label="Main navigation"
          >
            {/* Removed sidebar header banner */}


            <div className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "overview"}
                  className={({ isActive }) => navClass(isActive)}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Removed duplicate Profile/Settings/Sign Out from sidebar as they exist in Navbar */}

            
          </aside>

           <main className="flex-1 overflow-y-auto min-h-0 bg-background relative">
            {/* Background glows for main area */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-64 -mt-64" />
               <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/3 rounded-full blur-[100px] -ml-40 -mb-40" />
            </div>
            <div className="relative z-10">
               <Outlet />
            </div>
          </main>
        </div>
      </div>
    </PatientsProvider>
  );
}
