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
    input: "scripts/index.ts",
    output: [
      {
        file: "proto/index.esm.js",
        footer: banner,
        format: "es",
        banner,
      },
      {
        file: "proto/index.cjs.js",
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
      "crypto",
      "path",
      "util",
      "child_process",
      "readline",
      "fs",
      "async",
      "cheerio",
      "puppeteer",
      "async-retry",
      "axios",
      "body-parser",
      "colors",
      "dotenv",
      "express",
      "fluent-ffmpeg",
      "minimist",
      "package-json",
      "playwright",
      "playwright-chromium",
      "readline-sync",
      "spinnies",
      "stream",
      "yt-dlx",
      "yt-search",
      "zod",
      "@rollup/plugin-json",
      "@rollup/plugin-typescript",
      "@types/async",
      "@types/async-retry",
      "@types/chai",
      "@types/fluent-ffmpeg",
      "@types/fs-extra",
      "@types/minimist",
      "@types/node",
      "@types/readline-sync",
      "@types/rollup-plugin-progress",
      "@types/spinnies",
      "@types/yt-search",
      "chai",
      "rollup",
      "rollup-plugin-dts",
      "rollup-plugin-progress",
      "rollup-plugin-typescript2",
      "ts-node",
      "tsup",
      "typescript",
    ],
  },
  {
    plugins: [dts(), progress()],
    input: "scripts/index.ts",
    output: [
      {
        file: "proto/index.d.ts",
        footer: banner,
        format: "es",
        banner,
      },
    ],
  },
];
