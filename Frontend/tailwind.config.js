/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
    },
    screens: {
      xs: "475px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
    extend: {
      colors: {
        cream: {
          DEFAULT: "#FBF7EE",
          warm: "#FFF3E1",
          card: "#F6F0E3",
        },
        ivory: "#F1ECDD",
        charcoal: {
          DEFAULT: "#2A2620",
          soft: "#443F35",
        },
        dark: {
          bg: "#111611",
          surface: "#182017",
          card: "#202A1F",
          cardHover: "#283427",
          border: "#2C3B2A",
          text: "#EBE6DA",
          muted: "#A2AFA0",
        },
        olive: {
          950: "#1B2417",
          900: "#26331F",
          800: "#33422A",
          700: "#42542F",
          600: "#526B3C",
          500: "#6F8B5B",
          400: "#93AC80",
          300: "#AEC3B0",
          200: "#CFDCC7",
          100: "#E6EEDE",
        },
        clay: {
          800: "#4A362B",
          600: "#6B4F3F",
          500: "#8C6E63",
          400: "#B08D6E",
          300: "#D3A376",
          200: "#E8C99C",
          100: "#F3DDBB",
        },
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        sans: ["'General Sans'", "'Manrope'", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.75rem",
        "4xl": "2.5rem",
        "5xl": "3rem",
      },
      boxShadow: {
        soft: "0 20px 60px -25px rgba(38, 51, 31, 0.25)",
        card: "0 12px 30px -15px rgba(42, 38, 32, 0.18)",
        nav: "0 8px 30px -12px rgba(42, 38, 32, 0.15)",
        darkGlow: "0 0 35px -5px rgba(111, 139, 91, 0.25)",
        "elevation-1": "0 2px 8px -2px rgba(42, 38, 32, 0.08), 0 1px 4px -1px rgba(42, 38, 32, 0.05)",
        "elevation-2": "0 8px 24px -6px rgba(42, 38, 32, 0.12), 0 3px 8px -2px rgba(42, 38, 32, 0.08)",
        "elevation-3": "0 16px 36px -8px rgba(42, 38, 32, 0.18), 0 6px 16px -3px rgba(42, 38, 32, 0.10)",
        glow: "0 0 25px rgba(82, 107, 60, 0.35)",
        dock: "0 12px 40px -10px rgba(0, 0, 0, 0.25), 0 0 1px 1px rgba(255, 255, 255, 0.1)",
      },
      maxWidth: {
        "8xl": "90rem",
        inner: "760px",
      },
      keyframes: {
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.6", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
      },
      animation: {
        shimmer: "shimmer 2s infinite",
        fadeUp: "fadeUp 0.5s ease-out forwards",
        slideUp: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 4s ease-in-out infinite",
        pulseGlow: "pulseGlow 3s ease-in-out infinite",
      },
      transitionTimingFunction: {
        kare: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
