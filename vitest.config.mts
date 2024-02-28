import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: true,
    maxConcurrency: 1,
    testTimeout: 60000,
    exclude: ["node_modules"],
    include: ["scripts/web/**/*.test.ts", "scripts/web/**/*.spec.ts"],
  },
});
