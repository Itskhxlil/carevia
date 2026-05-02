/** @type {import('tailwindcss').Config} */
/* Colors use CSS variables — see index.css (html.dark vs light) */
const c = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  darkMode: "class",
  safelist: [
    // Dynamic colors used in landing page components
    { pattern: /text-(teal|rose|sky|amber|cyan|emerald|violet|purple|blue)-(300|400|500)/ },
    { pattern: /bg-(teal|rose|sky|amber|cyan|emerald|violet|purple|blue)-(400|500)\/(5|10|15|60|70|80)/ },
    { pattern: /border-(teal|rose|sky|amber|cyan|emerald|violet|purple|blue)-(500)\/(15|20|25|30)/ },
    { pattern: /from-(teal|cyan|sky)-(400|500)/ },
    { pattern: /to-(emerald|sky|blue)-(500)/ },
  ],
  content: [
    "./index.html",
    "./*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./pages/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        /* Primary — Teal */
        primary:                   c("--color-primary"),
        "primary-hover":           c("--color-primary-hover"),
        "primary-dim":             c("--color-primary-dim"),
        "on-primary":              c("--color-on-primary"),
        "primary-container":       c("--color-primary-container"),
        "on-primary-container":    c("--color-on-primary-container"),
        "primary-fixed":           c("--color-primary-fixed"),
        "primary-fixed-dim":       c("--color-primary-fixed-dim"),

        /* Secondary — Sky Blue */
        secondary:                      c("--color-secondary"),
        "on-secondary":                 c("--color-on-secondary"),
        "secondary-container":          c("--color-secondary-container"),
        "on-secondary-container":       c("--color-on-secondary-container"),
        "secondary-fixed":              c("--color-secondary-fixed"),
        "secondary-fixed-dim":          c("--color-secondary-fixed-dim"),
        "on-secondary-fixed":           c("--color-on-secondary-fixed"),
        "on-secondary-fixed-variant":   c("--color-on-secondary-fixed-variant"),

        /* Tertiary — Gold */
        tertiary:                       c("--color-tertiary"),
        "on-tertiary":                  c("--color-on-tertiary"),
        "tertiary-container":           c("--color-tertiary-container"),
        "on-tertiary-container":        c("--color-on-tertiary-container"),
        "tertiary-fixed":               c("--color-tertiary-fixed"),
        "tertiary-fixed-dim":           c("--color-tertiary-fixed-dim"),
        "on-tertiary-fixed":            c("--color-on-tertiary-fixed"),
        "on-tertiary-fixed-variant":    c("--color-on-tertiary-fixed-variant"),

        /* Surface / Background */
        background:                     c("--color-background"),
        "on-background":                c("--color-on-background"),
        surface:                        c("--color-surface"),
        "on-surface":                   c("--color-on-surface"),
        "surface-variant":              c("--color-surface-variant"),
        "on-surface-variant":           c("--color-on-surface-variant"),
        "surface-dim":                  c("--color-surface-dim"),
        "surface-bright":               c("--color-surface-bright"),
        "surface-container-lowest":     c("--color-surface-container-lowest"),
        "surface-container-low":        c("--color-surface-container-low"),
        "surface-container":            c("--color-surface-container"),
        "surface-container-high":       c("--color-surface-container-high"),
        "surface-container-highest":    c("--color-surface-container-highest"),
        "surface-tint":                 c("--color-surface-tint"),

        /* Outline */
        outline:                        c("--color-outline"),
        "outline-variant":              c("--color-outline-variant"),

        /* Error */
        error:                          c("--color-error"),
        "on-error":                     c("--color-on-error"),
        "error-container":              c("--color-error-container"),
        "on-error-container":           c("--color-on-error-container"),

        /* Inverse */
        "inverse-primary":              c("--color-inverse-primary"),
        "inverse-surface":              c("--color-inverse-surface"),
        "inverse-on-surface":           c("--color-inverse-on-surface"),
      },
      borderRadius: {
        "clinical-sm":   "0.125rem",
        "clinical-md":   "0.25rem",
        "clinical-lg":   "0.5rem",
        "clinical-pill": "0.75rem",
      },
      fontFamily: {
        headline: ["Poppins", "Manrope", "sans-serif"],
        body:     ["Inter", "sans-serif"],
        label:    ["Inter", "sans-serif"],
        display:  ["Poppins", "Manrope", "sans-serif"],
      },
      keyframes: {
        "carevia-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":       { transform: "translateY(-8px)" },
        },
        "carevia-shimmer": {
          "0%":   { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
        "carevia-glow-pulse": {
          "0%, 100%": { opacity: "0.45" },
          "50%":      { opacity: "0.85" },
        },
        "carevia-fade-in-up": {
          from: { opacity: "0", transform: "translateY(24px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "carevia-slide-in-right": {
          from: { opacity: "0", transform: "translateX(24px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "carevia-float":          "carevia-float 5s ease-in-out infinite",
        "carevia-shimmer":        "carevia-shimmer 1.1s ease-out",
        "carevia-glow-pulse":     "carevia-glow-pulse 3s ease-in-out infinite",
        "carevia-fade-in-up":     "carevia-fade-in-up 0.6s ease-out both",
        "carevia-slide-in-right": "carevia-slide-in-right 0.6s ease-out both",
      },
    },
  },
  plugins: [],
};
