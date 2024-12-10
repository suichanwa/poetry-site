/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/ui-shadcn/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          light: "#ffffff",
          dark: "#0a0a0a",  // True black background
        },
        foreground: {
          light: "#000000",
          dark: "#ffffff",  // Pure white text
        },
        card: {
          light: "#ffffff",
          dark: "#141414",  // Slightly lighter than background
        },
        "card-foreground": {
          light: "#000000",
          dark: "#ffffff",
        },
        primary: {
          light: "#000000",
          dark: "#ffffff",
        },
        "primary-foreground": {
          light: "#ffffff",
          dark: "#000000",
        },
        muted: {
          light: "#f5f5f5",
          dark: "#262626",  // Neutral dark gray
        },
        "muted-foreground": {
          light: "#737373",
          dark: "#a3a3a3",  // Muted text
        },
        accent: {
          light: "#f5f5f5",
          dark: "#1f1f1f",  // Subtle accent
        },
        "accent-foreground": {
          light: "#000000",
          dark: "#ffffff",
        },
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
        DEFAULT: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};