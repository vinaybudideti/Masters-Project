import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#080810",
        "bg-secondary": "#0f0f1a",
        "glass-bg": "rgba(255,255,255,0.05)",
        primary: {
          DEFAULT: "#6366f1",
          glow: "#818cf8",
          dark: "#4f46e5",
        },
        accent: {
          DEFAULT: "#22d3ee",
          dark: "#0891b2",
        },
        health: {
          DEFAULT: "#10b981",
          dark: "#059669",
        },
        "text-primary": "#f8fafc",
        "text-secondary": "#94a3b8",
        "text-muted": "#64748b",
        "glass-border": "rgba(255,255,255,0.1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-mesh":
          "radial-gradient(at 40% 20%, hsla(240,100%,74%,0.15) 0, transparent 50%), radial-gradient(at 80% 0%, hsla(189,100%,56%,0.1) 0, transparent 50%), radial-gradient(at 0% 50%, hsla(355,100%,93%,0.05) 0, transparent 50%)",
        "primary-gradient": "linear-gradient(135deg, #6366f1, #8b5cf6)",
        "health-gradient": "linear-gradient(135deg, #10b981, #059669)",
        "card-gradient":
          "linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))",
      },
      boxShadow: {
        glass: "0 4px 30px rgba(0, 0, 0, 0.3)",
        "glass-lg": "0 8px 40px rgba(0, 0, 0, 0.4)",
        glow: "0 0 20px rgba(99,102,241,0.3)",
        "glow-sm": "0 0 10px rgba(99,102,241,0.2)",
        "health-glow": "0 0 20px rgba(16,185,129,0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "gradient-shift": "gradient-shift 8s ease infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slide-up 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "typing-dot": "typing-dot 1.4s ease-in-out infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "typing-dot": {
          "0%, 60%, 100%": { opacity: "0.2", transform: "scale(1)" },
          "30%": { opacity: "1", transform: "scale(1.2)" },
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
