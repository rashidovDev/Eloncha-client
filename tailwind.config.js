import defaultTheme from "tailwindcss/defaultTheme";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: false,

  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },

    extend: {

      /* ✅ YOUR OWN COLORS ONLY (NO SHADCN TOKENS) */
      colors: {
        primary: "#2F6AF3",
        secondary: "#FFF319",
        muted: "#f5f5f5",
        border: "#e5e5e5",
        input: "#f9f9f9",
        destructive: "#e11d48",
        ring: "#8336DF",
      },

      fontSize: {
        xs: "0.55rem",
        sm: "0.65rem",
        base: "0.75rem",
        lg: "0.85rem",
        xl: "1rem",
        "2xl": "1.25rem",
        "custom-size": "2rem",
      },

      borderRadius: {
        lg: "0.65rem",
        md: "0.5rem",
        sm: "0.4rem",
      },
    },
  },

  plugins: [

    // ✅ REQUIRED BY SHADCN COMPONENT BEHAVIOR (OK TO KEEP)
    require("tailwindcss-animate"),

    // ✅ RESPONSIVE HELPERS
    function ({ addUtilities }) {
      addUtilities({
        ".responsive-header": {
          "@apply text-lg md:text-xl lg:text-2xl xl:text-3xl": {},
        },
        ".responsive-text": {
          "@apply text-xs md:text-sm lg:text-base xl:text-lg": {},
        },
      });
    },

    // ✅ CUSTOM BUTTONS
    function ({ addComponents }) {
      const buttons = {
        ".btn": {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "600",
          backgroundColor: "#FFF319",
          borderRadius: "0.5rem",
          transition: "0.2s",
        },
        ".btn-sm": {
          padding: "0.25rem 0.5rem",
          fontSize: "0.75rem",
        },
        ".btn-md": {
          padding: "0.5rem 1rem",
          fontSize: "0.875rem",
        },
        ".btn-lg": {
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
        },
      };

      addComponents(buttons);
    },
  ],
};
