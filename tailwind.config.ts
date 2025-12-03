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
        gtbank: {
          orange: "#E15C42",
          "orange-light": "#F39B8F",
          "orange-dark": "#C24A35",
          navy: "#0A2463",
          "navy-light": "#1D4B9F",
          white: "#FFFFFF",
          gray: "#F5F5F5",
        },
        primary: "#E15C42", // GTBank orange
        secondary: "#0A2463", // GTBank navy
        accent: "#E15C42",
        success: "#10B981",
        warning: "#F59E0B",
        error: "#EF4444",
        info: "#3B82F6",
        neutral: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },
      },
      backgroundColor: {
        "dark-primary": "#1A1A1A",
        "dark-secondary": "#252525",
        "dark-tertiary": "#333333",
      },
      borderColor: {
        "dark-border": "#404040",
      },
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
        "3xl": ["30px", "36px"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        "card-hover": "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        modal: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;
