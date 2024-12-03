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
          light: "#f8fafc",
          dark: "#121212",
        },
        foreground: {
          light: "#1a202c",
          dark: "#e0e0e0",
        },
        card: {
          light: "#ffffff",
          dark: "#1e1e1e",
        },
        "card-foreground": {
          light: "#1a202c",
          dark: "#e0e0e0",
        },
        primary: {
          light: "#4a5568",
          dark: "#bb86fc",
        },
        "primary-foreground": {
          light: "#ffffff",
          dark: "#121212",
        },
        muted: {
          light: "#e2e8f0",
          dark: "#2d3748",
        },
        "muted-foreground": {
          light: "#4a5568",
          dark: "#a0aec0",
        },
        accent: {
          light: "#edf2f7",
          dark: "#2c5282",
        },
        "accent-foreground": {
          light: "#2d3748",
          dark: "#e2e8f0",
        },
      },
      keyframes: {
        modalShow: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        modalHide: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
      },
      animation: {
        'modal-show': 'modalShow 0.3s ease-out',
        'modal-hide': 'modalHide 0.3s ease-in',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};