import React, { useEffect, useReducer } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";
import { PatientsProvider } from "./PatientsContext.jsx";
import { clearSession, getSession } from "./authStorage.js";

const NAV_ITEMS = [
  { to: "overview",     icon: "dashboard",    label: "Overview" },
  { to: "patients",     icon: "group",         label: "Patient Registry" },
  { to: "appointments", icon: "event_note",    label: "Appointments" },
  { to: "labs",         icon: "science",       label: "Lab Results" },
  { to: "records",      icon: "description",   label: "Clinical Records" },
  { to: "analytics",    icon: "monitoring",    label: "Vitals Analytics" },
];

function navClass(isActive) {
  return `
    flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
    ${isActive 
      ? "bg-teal-500/15 text-teal-400 border border-teal-500/20 shadow-[0_0_20px_rgba(20,184,166,0.1)]" 
      : "text-slate-500 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent"
    }
  `;
}

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [, bumpSession] = useReducer((x) => x + 1, 0);

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
      <div className="min-h-screen bg-[#060f1a] text-slate-100 flex flex-col font-body selection:bg-teal-500/30">
        <Navbar doctorName={doctorName} specialty={specialty} email={email} onSignOut={handleSignOut} />

        {/* Mobile tab bar */}
        <nav
          className="lg:hidden flex gap-1 overflow-x-auto px-4 py-2 border-b border-white/5 bg-[#060f1a]/80 backdrop-blur-md"
          aria-label="Workspace sections"
        >
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "overview"}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors
                ${isActive ? "bg-teal-500/15 text-teal-400" : "text-slate-500"}`
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
            className="hidden lg:flex flex-col w-64 shrink-0 py-8 px-4 gap-1 border-r border-white/5 bg-[#070e18]"
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

            
            {/* Sidebar Footer */}
            <div className="mt-6 px-4">
               <div className="p-3 rounded-xl bg-teal-500/5 border border-teal-500/10">
                  <div className="flex items-center gap-2 mb-1.5">
                     <span className="material-symbols-outlined text-teal-500 text-[14px]">bolt</span>
                     <span className="text-[9px] font-black text-teal-400 uppercase tracking-wider">Local Health Store</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal">Your data is stored 100% locally for maximum privacy.</p>
               </div>
            </div>
          </aside>

          <main className="flex-1 overflow-y-auto min-h-0 bg-[#060f1a] relative">
            {/* Background glows for main area */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -mr-64 -mt-64" />
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
