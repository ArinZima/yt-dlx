// tsup.config.ts
import * as tsup from "tsup";
var tsup_config_default = tsup.defineConfig({
  entry: ["core/cli/**/*.ts"],
  format: ["cjs", "esm"],
  outDir: "project/cli",
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
  dts: false
});
export {
  tsup_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidHN1cC5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9faW5qZWN0ZWRfZmlsZW5hbWVfXyA9IFwiL21udC9kL2dpdGh1Yi9naXRDbG9uZS95dGNvcmUvdHN1cC5jb25maWcudHNcIjtjb25zdCBfX2luamVjdGVkX2Rpcm5hbWVfXyA9IFwiL21udC9kL2dpdGh1Yi9naXRDbG9uZS95dGNvcmVcIjtjb25zdCBfX2luamVjdGVkX2ltcG9ydF9tZXRhX3VybF9fID0gXCJmaWxlOi8vL21udC9kL2dpdGh1Yi9naXRDbG9uZS95dGNvcmUvdHN1cC5jb25maWcudHNcIjtpbXBvcnQgKiBhcyB0c3VwIGZyb20gXCJ0c3VwXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB0c3VwLmRlZmluZUNvbmZpZyh7XHJcbiAgZW50cnk6IFtcImNvcmUvY2xpLyoqLyoudHNcIl0sXHJcbiAgZm9ybWF0OiBbXCJjanNcIiwgXCJlc21cIl0sXHJcbiAgb3V0RGlyOiBcInByb2plY3QvY2xpXCIsXHJcbiAgcGxhdGZvcm06IFwibm9kZVwiLFxyXG4gIG1pbmlmeUlkZW50aWZpZXJzOiBmYWxzZSxcclxuICBtaW5pZnlXaGl0ZXNwYWNlOiBmYWxzZSxcclxuICBsZWdhY3lPdXRwdXQ6IGZhbHNlLFxyXG4gIG1pbmlmeVN5bnRheDogZmFsc2UsXHJcbiAgY2pzSW50ZXJvcDogdHJ1ZSxcclxuICBzb3VyY2VtYXA6IGZhbHNlLFxyXG4gIHNwbGl0dGluZzogZmFsc2UsXHJcbiAgdHJlZXNoYWtlOiB0cnVlLFxyXG4gIG1ldGFmaWxlOiBmYWxzZSxcclxuICBtaW5pZnk6IGZhbHNlLFxyXG4gIHNpbGVudDogZmFsc2UsXHJcbiAgd2F0Y2g6IGZhbHNlLFxyXG4gIGJ1bmRsZTogdHJ1ZSxcclxuICBzaGltczogdHJ1ZSxcclxuICBjbGVhbjogdHJ1ZSxcclxuICBkdHM6IGZhbHNlLFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFxTyxZQUFZLFVBQVU7QUFFM1AsSUFBTyxzQkFBYSxrQkFBYTtBQUFBLEVBQy9CLE9BQU8sQ0FBQyxrQkFBa0I7QUFBQSxFQUMxQixRQUFRLENBQUMsT0FBTyxLQUFLO0FBQUEsRUFDckIsUUFBUTtBQUFBLEVBQ1IsVUFBVTtBQUFBLEVBQ1YsbUJBQW1CO0FBQUEsRUFDbkIsa0JBQWtCO0FBQUEsRUFDbEIsY0FBYztBQUFBLEVBQ2QsY0FBYztBQUFBLEVBQ2QsWUFBWTtBQUFBLEVBQ1osV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsV0FBVztBQUFBLEVBQ1gsVUFBVTtBQUFBLEVBQ1YsUUFBUTtBQUFBLEVBQ1IsUUFBUTtBQUFBLEVBQ1IsT0FBTztBQUFBLEVBQ1AsUUFBUTtBQUFBLEVBQ1IsT0FBTztBQUFBLEVBQ1AsT0FBTztBQUFBLEVBQ1AsS0FBSztBQUNQLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
