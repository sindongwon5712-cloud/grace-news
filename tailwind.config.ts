import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf8f0",
          100: "#f9edd9",
          200: "#f2d9ad",
          300: "#e8bd75",
          400: "#dc9d47",
          500: "#c67f2a",
          600: "#a5631f",
          700: "#824c1c",
          800: "#6b3e1c",
          900: "#59341b",
        },
        ink: "#2b2622",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
