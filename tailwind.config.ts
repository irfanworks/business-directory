import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        canvas: "var(--color-canvas)",
        surface: {
          DEFAULT: "var(--color-surface)",
          soft: "var(--color-surface-soft)",
        },
        ink: {
          950: "var(--color-ink-950)",
          900: "var(--color-ink-900)",
          700: "var(--color-ink-700)",
          500: "var(--color-ink-500)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          soft: "var(--color-accent-soft)",
          hover: "var(--color-accent-hover)",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
        display: [
          "var(--font-display)",
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "sans-serif",
        ],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        control: "10px",
        btn: "12px",
        card: "16px",
        surface: "20px",
      },
      boxShadow: {
        card: "var(--shadow-card)",
        elevated: "var(--shadow-elevated)",
        focus: "var(--shadow-focus)",
      },
      transitionDuration: {
        micro: "150ms",
        soft: "200ms",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      maxWidth: {
        site: "72rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
export default config;
