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
        // Cornell Lab brand palette
        "warm-black": "#2E261F",
        sand: {
          DEFAULT: "#F5F3E9",
          tint1: "#FBFAF6",
          shade: "#DAD5BC",
        },
        "sky-blue": {
          DEFAULT: "#D0DDDB",
          tint1: "#DEE7E6",
          tint2: "#F1F5F4",
          shade: "#AAC4C4",
        },
        "forest-green": {
          DEFAULT: "#296239",
          tint1: "#8DCA8B",
          tint2: "#CFEBBF",
          shade: "#284530",
        },
        chartreuse: {
          DEFAULT: "#C9E231",
          tint1: "#D9EB6F",
          shade: "#A3BC09",
        },
        "ocean-blue": {
          DEFAULT: "#457999",
          tint1: "#69A0C2",
          tint2: "#B4CFE1",
          shade: "#385B75",
        },
        gold: {
          DEFAULT: "#FFBC10",
          tint1: "#FFDD00",
          tint2: "#FFF3A5",
          shade: "#FF9417",
        },
        red: {
          DEFAULT: "#DF1E12",
          tint1: "#FF672E",
          shade: "#B31B1B",
        },
      },
      fontFamily: {
        sans: ["Gibson", "Inter", "Helvetica Neue", "Arial", "sans-serif"],
        body: ["Suisse Works", "Georgia", "serif"],
        "noto-sans": ["Noto Sans JP", "Noto Sans", "sans-serif"],
      },
      fontSize: {
        "h1": ["4.625rem", { lineHeight: "1.1", fontWeight: "300" }],
        "h2": ["2.5rem", { lineHeight: "1.2", fontWeight: "300" }],
        "h3": ["2rem", { lineHeight: "1.25", fontWeight: "400" }],
        "h4": ["1.5rem", { lineHeight: "1.3", fontWeight: "400" }],
      },
    },
  },
  plugins: [],
};

export default config;
