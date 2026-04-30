# Carevia — Clinical Archivist

A medical workspace UI built with **React 18 + Vite + Tailwind CSS**.  
Academic project — UI only, no backend.

---

## Project Structure

```
carevia/
├── index.html                  # HTML shell + Google Fonts
├── vite.config.js
├── tailwind.config.js          # Full design system tokens
├── postcss.config.js
├── package.json
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Router (/ → Register, /dashboard → Dashboard)
    ├── index.css               # Tailwind directives + global styles
    │
    ├── pages/
    │   ├── RegisterPage.jsx    # Doctor onboarding form
    │   └── DashboardPage.jsx   # Main clinical workspace
    │
    ├── components/
    │   ├── Navbar.jsx          # Sticky top nav (glassmorphism)
    │   ├── Cards.jsx           # StatCard, MedicalCard, InfoRow, StatusChip
    │   └── PatientList.jsx     # High-density sortable patient table
    │
    └── services/               # Empty — ready for API integration
        ├── patientService.js
        └── authService.js
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Design System

Follows **The Clinical Archivist** design system (`design.md`):

| Token                  | Hex       | Usage                            |
|------------------------|-----------|----------------------------------|
| `surface`              | `#101415` | Page background                  |
| `surface-container-low`| `#191c1e` | Sidebar, visual panel            |
| `surface-container-lowest`| `#0b0f10` | Cards (elevated feel)         |
| `primary`              | `#93ccff` | Brand blue, interactive elements |
| `on-surface`           | `#e0e3e5` | Primary text                     |
| `outline-variant`      | `#3f4850` | Ghost borders (used at /20 opacity)|

**Fonts:** Manrope (headlines) + Inter (body/labels)  
**Icons:** Material Symbols Outlined

---

## Key Design Rules Implemented

- **No-Line Rule** — sections separated by tonal background shifts, not borders  
- **Ghost Borders** — `border-outline-variant/20` only where needed  
- **Glassmorphism** — Navbar uses `bg-surface/80 backdrop-blur-[12px]`  
- **CTA Gradient** — `bg-gradient-to-b from-primary to-primary-container`  
- **Status Chips** — only UI element using `rounded-full`  
- **High-Density Table** — no dividers, hover-based row separation  
- **Typography** — never bolder than "Medium" for body; scale does the hierarchy work  
