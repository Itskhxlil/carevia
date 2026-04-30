import { loadSettings } from "./authStorage.js";

/** Apply saved theme + keyboard-hint class on <html>. */
export function applyThemeFromSettings() {
  const s = loadSettings();
  const root = document.documentElement;
  if (s.themeMode === "light") root.classList.remove("dark");
  else root.classList.add("dark");
  root.classList.toggle("carevia-kbd-hints", Boolean(s.showKeyboardHints));
}

export function getThemeMode() {
  return loadSettings().themeMode === "light" ? "light" : "dark";
}
