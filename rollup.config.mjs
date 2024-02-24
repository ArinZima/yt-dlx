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
    input: "delta/index.ts",
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
      "@shovit/ytid",
      "axios",
      "body-parser",
      "colors",
      "readline",
      "path",
      "fs",
      "dotenv",
      "async-retry",
      "async",
      "fluent-ffmpeg",
      "minimist",
      "package-json",
      "playwright",
      "readline-sync",
      "stream",
      "yt-search",
      "ytdl-core",
      "spinnies",
      "zod",
      "@types/async-retry",
      "@rollup/plugin-json",
      "@rollup/plugin-typescript",
      "@types/async",
      "@types/chai",
      "@types/fluent-ffmpeg",
      "@types/fs-extra",
      "@types/minimist",
      "@types/spinnies",
      "@types/node",
      "@types/readline-sync",
      "@types/rollup-plugin-progress",
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
    input: "delta/index.ts",
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
