/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        pink: {
          DEFAULT: "#FFCBE1",
          dark: "#8B446A", // Deep Rose
        },
        green: {
          DEFAULT: "#D6E5BD",
          dark: "#4B6541", // Olive Green
        },
        yellow: {
          DEFAULT: "#F9E1A8",
          dark: "#806D3E", // Golden Brown
        },
        blue: {
          DEFAULT: "#BCD8EC",
          dark: "#365370", // Steel Blue
          font: "#2C3E50",
          muted: "#567D91",
          hightlight: "#FF5733",
        },
        lavender: {
          DEFAULT: "#DCCCEC",
          dark: "#5A4A6A", // Deep Lavender
        },
        peach: {
          DEFAULT: "#FFDAB4",
          dark: "#8B5A3C", // Cocoa Brown
        },
        ghost: {
          DEFAULT: "#F5F5F5",
          dark: "#2E2E2E", // Light Gray
        },
      },
    },
    fontFamily: {
      lato: ["Lato", "sans-serif"],
      poppins: ["Poppins", "sans-serif"],
    },
  },
  plugins: [],
  darkMode: "selector",
};
