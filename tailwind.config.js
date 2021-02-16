module.exports = {
  purge: ["./public/index.html", "./src/**/*.{js,jsx}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        "atom-light": "#fafafa",
        "atom-dark": "#282c34",
      },
    },
  },
  variants: {},
  plugins: [],
};
