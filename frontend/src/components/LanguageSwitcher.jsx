import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

const languages = [
  { code: "en", name: "English", flag: "🇺🇸", short: "EN" },
  { code: "ar", name: "العربية", flag: "🇸🇦", short: "AR", dir: "rtl" },
  { code: "fr", name: "Français", flag: "🇫🇷", short: "FR" },
];

export default function LanguageSwitcher({ className = "" }) {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface-container-low/40 border border-outline-variant/80 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:border-outline-variant transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
        aria-label="Change Language"
      >
        <span className="text-base">{currentLang.flag}</span>
        <span className="hidden sm:block">{currentLang.short}</span>
        <span className="material-symbols-outlined text-[16px]">expand_more</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-full mt-2 w-40 rounded-xl bg-surface border border-outline-variant/80 shadow-xl overflow-hidden z-[100] ${i18n.dir() === 'rtl' ? 'left-0' : 'right-0'}`}
          >
            <div className="py-2">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                    i18n.language === lang.code
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  }`}
                  dir={lang.dir || "ltr"}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
