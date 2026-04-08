import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2BBFE0",
        "primary-light": "#8ec1cd",
        dark: "#333",
        muted: "#666",
        light: "#f8f8f8",
      },
    },
  },
  plugins: [],
};
export default config;
