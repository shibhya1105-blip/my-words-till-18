/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAF6EF",
        ink: "#1F1B16",
        inksoft: "#2A2418",
        leather: "#6B4226",
        sage: "#8A9A7E",
        brick: "#B5482A",
        hairline: "#E3DBC9",
        muted: "#8A8270",
        chip: "#6B5F4D",
      },
      fontFamily: {
        serif: ["'Source Serif 4'", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
};
