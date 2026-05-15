/**
 * Client-side auth + profile (localStorage, demo / academic use only).
 */

const AUTH_KEY = "carevia_auth_user";
const ACCOUNTS_KEY = "carevia_accounts";
const SETTINGS_KEY = "carevia_app_settings";

const LEGACY_NAME = "carevia_doctor_name";
const LEGACY_SPEC = "carevia_doctor_specialty";

export function getDefaultSettings() {
  return {
    notifyAppointments: true,
    notifyCriticalAlerts: true,
    compactTables: false,
    showKeyboardHints: true,
    themeMode: "light",
  };
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return getDefaultSettings();
    return { ...getDefaultSettings(), ...JSON.parse(raw) };
  } catch {
    return getDefaultSettings();
  }
}

export function saveSettings(partial) {
  const next = { ...loadSettings(), ...partial };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  return next;
}

function syncLegacyKeys(user) {
  if (!user?.name) return;
  localStorage.setItem(LEGACY_NAME, user.name);
  localStorage.setItem(LEGACY_SPEC, user.specialty || "");
}

/** @returns {null | object} */
export function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) {
      const u = JSON.parse(raw);
      syncLegacyKeys(u);
      return u;
    }
  } catch {
    /* ignore */
  }
  const name = localStorage.getItem(LEGACY_NAME);
  if (name) {
    return {
      email: "",
      name,
      specialty: localStorage.getItem(LEGACY_SPEC) || "",
      title: "",
      phone: "",
      institution: "",
      memberSince: null,
      legacy: true,
    };
  }
  return null;
}

export function setSession(user) {
  const next = {
    email: user.email || "",
    name: user.name,
    specialty: user.specialty || "",
    title: user.title || "",
    phone: user.phone || "",
    institution: user.institution || "",
    memberSince: user.memberSince || new Date().toISOString(),
    legacy: false,
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(next));
  syncLegacyKeys(next);
}

export function updateSession(partial) {
  const cur = getSession();
  if (!cur) return null;
  if (cur.legacy) {
    const next = { ...cur, ...partial, legacy: true };
    if (next.name) localStorage.setItem(LEGACY_NAME, next.name);
    localStorage.setItem(LEGACY_SPEC, next.specialty || "");
    return next;
  }
  const next = { ...cur, ...partial, legacy: false };
  localStorage.setItem(AUTH_KEY, JSON.stringify(next));
  syncLegacyKeys(next);
  updateAccountRecord(next);
  return next;
}

export function clearSession() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(LEGACY_NAME);
  localStorage.removeItem(LEGACY_SPEC);
}

function loadAccounts() {
  try {
    return JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveAccounts(list) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(list));
}

function encodePw(p) {
  return btoa(unescape(encodeURIComponent(p)));
}

function decodeCheck(stored, plain) {
  try {
    return stored === encodePw(plain);
  } catch {
    return false;
  }
}

export function signUp({ email, password, name, specialty }) {
  const em = String(email).trim().toLowerCase();
  if (!em || !password || !String(name).trim() || !specialty) {
    return { ok: false, error: "Please complete all required fields." };
  }
  const accounts = loadAccounts();
  if (accounts.some((a) => a.email === em)) {
    return { ok: false, error: "This email is already registered. Sign in instead." };
  }
  const memberSince = new Date().toISOString();
  accounts.push({
    email: em,
    password: encodePw(password),
    name: name.trim(),
    specialty,
    title: "",
    phone: "",
    institution: "",
    memberSince,
  });
  saveAccounts(accounts);
  setSession({
    email: em,
    name: name.trim(),
    specialty,
    title: "",
    phone: "",
    institution: "",
    memberSince,
  });
  return { ok: true };
}

export function signIn({ email, password }) {
  const em = String(email).trim().toLowerCase();
  const accounts = loadAccounts();
  const acc = accounts.find((a) => a.email === em);
  if (!acc || !decodeCheck(acc.password, password)) {
    return { ok: false, error: "Invalid email or password." };
  }
  setSession({
    email: acc.email,
    name: acc.name,
    specialty: acc.specialty,
    title: acc.title || "",
    phone: acc.phone || "",
    institution: acc.institution || "",
    memberSince: acc.memberSince || new Date().toISOString(),
  });
  return { ok: true };
}

function updateAccountRecord(user) {
  if (!user.email) return;
  const accounts = loadAccounts();
  const i = accounts.findIndex((a) => a.email === user.email);
  if (i === -1) return;
  accounts[i] = {
    ...accounts[i],
    name: user.name,
    specialty: user.specialty,
    title: user.title ?? accounts[i].title ?? "",
    phone: user.phone ?? accounts[i].phone ?? "",
    institution: user.institution ?? accounts[i].institution ?? "",
    memberSince: user.memberSince ?? accounts[i].memberSince,
  };
  saveAccounts(accounts);
}

export function clearAllAppData() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(ACCOUNTS_KEY);
  localStorage.removeItem(SETTINGS_KEY);
  localStorage.removeItem(LEGACY_NAME);
  localStorage.removeItem(LEGACY_SPEC);
  localStorage.removeItem("carevia_patients");
}

export function exportUserDataBlob() {
  const session = getSession();
  const patients = localStorage.getItem("carevia_patients");
  const payload = {
    exportedAt: new Date().toISOString(),
    profile: session,
    patientsRaw: patients,
    settings: loadSettings(),
  };
  return new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
}
