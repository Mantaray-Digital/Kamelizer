import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Canvas = warm cream background. Ground = deep coffee brown text.
        canvas: "rgb(var(--c-canvas) / <alpha-value>)",
        ground: "rgb(var(--c-ground) / <alpha-value>)",
        blue: "#3FA9F5",
        tan: "#C89F6B",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      letterSpacing: {
        ultra: "0.4em",
      },
      animation: {
        marquee: "marquee 35s linear infinite",
        "fade-up": "fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) both",
        "pour": "pour 2.2s ease-in-out infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pour: {
          "0%,100%": { transform: "translateY(0) rotate(0deg)" },
          "50%": { transform: "translateY(-4px) rotate(-2deg)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
