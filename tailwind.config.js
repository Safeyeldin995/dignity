/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dignity: {
          black: "#0A0A0A",
          white: "#FAFAFA",
          gold: "#C9A84C",
          "gold-light": "#E8C96A",
          "gold-dark": "#9E7A2E",
          cream: "#F5F0E8",
          "cream-dark": "#EDE5D5",
          charcoal: "#1A1A1A",
          "gray-mid": "#6B6B6B",
          "gray-light": "#D4D4D4",
          rose: "#C4A0A0",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "Georgia", "serif"],
        sans: ["'Jost'", "system-ui", "sans-serif"],
        arabic: ["'Noto Serif Arabic'", "serif"],
        "arabic-sans": ["'IBM Plex Sans Arabic'", "sans-serif"],
      },
      fontSize: {
        "2xs": "0.625rem",
        base: ["1rem", { lineHeight: "1.75" }],
        lg: ["1.125rem", { lineHeight: "1.75" }],
        xl: ["1.25rem", { lineHeight: "1.75" }],
      },
      spacing: {
        "touch-target": "48px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "slide-right": "slideRight 0.4s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      boxShadow: {
        "dignity-sm": "0 2px 8px rgba(0,0,0,0.08)",
        dignity: "0 4px 24px rgba(0,0,0,0.12)",
        "dignity-lg": "0 8px 48px rgba(0,0,0,0.18)",
        "gold-glow": "0 0 20px rgba(201,168,76,0.3)",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [
    function ({ addUtilities, addBase }) {
      addBase({
        ":root": {
          "--font-size-scale": "1",
          "--high-contrast": "0",
        },
        "[data-font-size='large']": {
          "--font-size-scale": "1.25",
        },
        "[data-font-size='xlarge']": {
          "--font-size-scale": "1.5",
        },
        "[data-high-contrast='true']": {
          "--high-contrast": "1",
        },
      });
      addUtilities({
        ".rtl-flip": {
          transform: "scaleX(-1)",
        },
        ".focus-ring": {
          outline: "3px solid #C9A84C",
          outlineOffset: "2px",
        },
        ".sr-only-focusable:focus": {
          position: "static",
          width: "auto",
          height: "auto",
          clip: "auto",
          overflow: "visible",
          whiteSpace: "normal",
        },
        ".touch-target": {
          minHeight: "48px",
          minWidth: "48px",
        },
      });
    },
  ],
};
