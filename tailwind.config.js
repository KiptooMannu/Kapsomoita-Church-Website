/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // Scan React files for classes
  ],
  theme: {
    extend: {
      colors: {
        agc: {
          green: "#0B3D2E",  // Deep AGC Green
          gold: "#FFD700",   // AGC Gold
          white: "#FFFFFF",  // White
          beige: "#F5F5DC",  // Light Beige
        },
      },
      fontFamily: {
        sans: ["Inter", "Helvetica", "Arial", "sans-serif"], // Body text
        heading: ["Merriweather", "serif"],                  // Headings
      },
    },
  },
  plugins: [],
};
