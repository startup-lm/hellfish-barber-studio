import type { Config } from "tailwindcss";

const config: Config = {
  theme: {
    extend: {
      colors: {
        platense: {
          DEFAULT: "#000000",
          dark: "#0A0A0A",
          light: "#6B7280",
        },
      },
    },
  },
};

export default config;