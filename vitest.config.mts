import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    watch: true,
    maxConcurrency: 1,
    testTimeout: 120000,
    exclude: ["node_modules"],
    include: ["core/__tests__/**/*.test.ts"],
  },
});
