module.exports = {
  purge: ["./public/index.html", "./src/**/*.{js,jsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        "atom-light": "#fafafa",
        "atom-dark": "#282c34",
        "atom-light-dimmed": "#f0f0f0",
        "atom-dark-dimmed": "#1d2026",
      },
    },
  },
  variants: {},
  plugins: [],
};
