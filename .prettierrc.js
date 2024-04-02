module.exports = {
  singleQuote: false,
  semi: true,
  tabWidth: 4,
  printWidth: 100,
  useTabs: true,
  endOfLine: "lf",
  importOrder: ["^[./]"],
  importOrderSeparation: true,
  importOrderParserPlugins: ["typescript", "decorators-legacy"],
  plugins: [require.resolve("@trivago/prettier-plugin-sort-imports")],
};
