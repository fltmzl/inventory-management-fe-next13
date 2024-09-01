/** @type {import('tailwindcss').Config} */
import { nextui } from "@nextui-org/theme";

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        print: { raw: "print" },
      },
    },
  },
  darkMode: "selector",
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: "#1BEBA6",
              50: "#ecfdf5",
              100: "#C4FAE8",
              200: "#8CF5D2",
              300: "#53F0BC",
              400: "#1BEBA6",
              500: "#10B981",
              600: "#0D9367",
              700: "#0A6E4D",
              800: "#064832",
              900: "#032318",
              foreground: "#000000",
            },
            focus: "#34d399",
          },
        },
        dark: {
          colors: {
            primary: {
              DEFAULT: "#1BEBA6",
              50: "#ecfdf5",
              100: "#C4FAE8",
              200: "#8CF5D2",
              300: "#53F0BC",
              400: "#1BEBA6",
              500: "#10B981",
              600: "#0D9367",
              700: "#0A6E4D",
              800: "#064832",
              900: "#032318",
              foreground: "#000000",
            },
            focus: "#34d399",
          },
        },
      },
    }),
  ],
}

