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
    external: [],
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
