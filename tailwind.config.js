module.exports = {
  future: {
    purgeLayersByDefault: true,
    removeDeprecatedGapUtilities: true,
  },
  purge: ["./public/index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};
