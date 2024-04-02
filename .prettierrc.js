module.exports = {
	semi: true,
	tabWidth: 4,
	useTabs: true,
	endOfLine: "lf",
	printWidth: 100,
	singleQuote: false,
	importOrder: ["^[./]"],
	importOrderSeparation: true,
	importOrderParserPlugins: ["typescript", "decorators-legacy"],
	plugins: [require.resolve("@trivago/prettier-plugin-sort-imports")],
};
