import * as tsup from "tsup";

export default tsup.defineConfig({
  entry: ["scripts/cli/**/*.ts"],
  format: ["cjs", "esm"],
  outDir: "shared/cli",
  platform: "node",
  minifyIdentifiers: false,
  minifyWhitespace: false,
  legacyOutput: false,
  minifySyntax: false,
  cjsInterop: true,
  sourcemap: false,
  splitting: false,
  treeshake: true,
  metafile: false,
  minify: false,
  silent: false,
  watch: false,
  bundle: true,
  shims: true,
  clean: true,
  dts: false,
});
