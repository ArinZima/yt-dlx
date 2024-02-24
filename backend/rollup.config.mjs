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
      "@ngrok/ngrok",
      "@shovit/ytid",
      "body-parser",
      "chai",
      "colors",
      "cookie-parser",
      "child_process",
      "util",
      "cors",
      "path",
      "express",
      "helmet",
      "morgan",
      "playwright",
      "yt-dlx",
      "yt-search",
      "@types/async",
      "@types/body-parser",
      "@types/chai",
      "@types/cookie-parser",
      "@types/cors",
      "@types/express",
      "@types/morgan",
      "@types/node",
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
