import typescript from "rollup-plugin-typescript2";
import progress from "rollup-plugin-progress";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
const banner = `/**
 * ========================================[ 📢YOUTUBE DOWNLOADER YT-DLX <( YT-DLX )/>📹 ]================================
 * ===========================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]===================================
 */`;

export default [
  {
    input: "core/index.ts",
    output: [
      {
        file: "shared/index.esm.js",
        footer: banner,
        format: "es",
        banner,
      },
      {
        file: "shared/index.cjs.js",
        footer: banner,
        format: "cjs",
        banner,
      },
    ],
    plugins: [
      json(),
      progress(),
      typescript({
        tsconfig: "./tsconfig.json",
      }),
    ],
    external: [
      "os",
      "fs",
      "path",
      "util",
      "child_process",
      "axios",
      "readline",
      "async",
      "async-retry",
      "bun",
      "cheerio",
      "colors",
      "crypto",
      "dotenv",
      "express",
      "fluent-ffmpeg",
      "minimist",
      "puppeteer",
      "readline-sync",
      "spinnies",
      "stream",
      "vitest",
      "yt-dlx",
      "yt-search",
      "zod",
      "@rollup/plugin-json",
      "@rollup/plugin-typescript",
      "@types/async",
      "@types/async-retry",
      "@types/bun",
      "@types/cheerio",
      "@types/fluent-ffmpeg",
      "@types/fs-extra",
      "@types/minimist",
      "@types/node",
      "@types/readline-sync",
      "@types/rollup-plugin-progress",
      "@types/spinnies",
      "@types/yt-search",
      "rollup",
      "rollup-plugin-dts",
      "rollup-plugin-progress",
      "rollup-plugin-typescript2",
      "ts-node",
      "tsup",
      "typescript",
    ],
    onwarn: function (warning) {
      if (warning.code === "UNUSED_EXTERNAL_IMPORT") return;
      console.warn(warning.message);
    },
  },
  {
    plugins: [dts(), progress()],
    input: "core/index.ts",
    output: [
      {
        file: "shared/index.d.ts",
        footer: banner,
        format: "es",
        banner,
      },
    ],
  },
];
