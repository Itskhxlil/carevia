import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./en.json";
import ar from "./ar.json";
import fr from "./fr.json";
import { loadSettings } from "../../authStorage.js";

const resources = {
  en: { translation: en },
  ar: { translation: ar },
  fr: { translation: fr },
};

const settings = loadSettings();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: settings.language || "en", // Default from our settings
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
