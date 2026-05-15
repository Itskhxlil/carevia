# Carevia — Clinical Workspace

A professional, multilingual clinical patient management system built with **React 18 + Vite + Node.js + MySQL**.

---

## Project Structure

```
carevia/
├── frontend/                    # React 18 + Vite + TailwindCSS
│   ├── public/
│   │   └── doctors.png
│   ├── src/
│   │   ├── assets/              # Logo and static assets
│   │   ├── components/          # Reusable UI components
│   │   │   ├── landing/         # Landing page components
│   │   │   ├── Cards.jsx
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── PatientList.jsx
│   │   │   └── LanguageSwitcher.jsx
│   │   ├── i18n/                # Multilingual translations (ar, en, fr)
│   │   ├── medical/             # Disease configs and measurement logic
│   │   ├── pages/               # Route-level page components
│   │   ├── services/            # API and storage service layer
│   │   ├── utils/               # Shared utilities
│   │   ├── App.jsx
│   │   ├── PatientsContext.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── vercel.json
│   └── package.json
│
├── backend/                     # Node.js + Express REST API
│   ├── routes/
│   │   ├── medicalRecords.js    # GET/POST/DELETE medical records
│   │   └── appointments.js     # GET/POST/PATCH/DELETE appointments
│   ├── database/
│   │   └── schema.sql           # MySQL schema
│   ├── medicalRecordsStore.js   # In-memory + MySQL store
│   ├── appointmentsStore.js     # In-memory + MySQL store
│   ├── index.js                 # Express app entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MySQL (optional — falls back to in-memory store)

### 1. Install dependencies

```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && npm install
```

### 2. Configure environment (optional)

Copy `frontend/env.example` to `frontend/.env` and adjust if needed.

For MySQL support, create `backend/.env`:
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=carevia
API_PORT=3001
```

### 3. Start the development servers

```bash
# Terminal 1 — Backend API
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Frontend → http://localhost:5173  
Backend API → http://localhost:3001

---

## Features

- 🌐 **Multilingual** — Arabic (RTL), English, French
- 👨‍⚕️ **Patient Registry** — Full CRUD with structured medical profiles
- 📋 **Medical Records** — Per-visit vital tracking (glucose, BP, weight, SpO₂)
- 📅 **Appointments** — Month / Week / Day calendar with scheduling
- 📊 **Clinical Analytics** — Trend charts, status distributions, critical alerts
- 🔒 **Local-First Privacy** — Data stored locally, no cloud dependency by default
- 🌗 **Dark / Light Mode** — System-aware theme toggle

---

## Tech Stack

| Layer      | Technology                                  |
|------------|---------------------------------------------|
| Frontend   | React 18, Vite, TailwindCSS, Framer Motion  |
| Routing    | React Router v6                             |
| i18n       | i18next, react-i18next                      |
| Charts     | Recharts                                    |
| Backend    | Node.js, Express                            |
| Database   | MySQL 8 (optional), in-memory fallback      |
| Icons      | Material Symbols Outlined (Google Fonts)    |

---

## Deployment

### Vercel (Frontend)
The `frontend/vercel.json` is pre-configured for SPA routing. Push and connect the `frontend/` directory.

### Backend
Deploy as a Node.js service. Set the environment variables above on your hosting provider.
