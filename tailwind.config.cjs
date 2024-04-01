/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["JetBrains Mono", "san-serif"],
      },
      gridTemplateRows: {
        layout: "auto 1fr auto",
      },
      animation: {
        blink: "animate-blink",
      },
    },
  },
  plugins: [],
};
