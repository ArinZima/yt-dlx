import typescript from "rollup-plugin-typescript2";
import progress from "rollup-plugin-progress";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
const banner = `/**
 * ============================================[ 📢YOUTUBE DOWNLOADER DLX <( YT-DLX )/>📹 ]====================================
 * 🚀 Unlock effortless audio/video downloads with YT-DLX—a command-line, Node.js, and streaming powerhouse.
 * 🎵 Meticulously designed for enthusiasts, YT-DLX stands out as a feature-rich package, evolving with state-of-the-art
 * 🔥 functionalities from Youtube-DL and Python yt-dlx.
 * 🚀 Elevate your media experience!
 * 🌈 Dive into the world of limitless possibilities.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 * MIT License
 * Original Library
 * - Copyright (c) Shovit Dutta <shovitdutta1@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * ============================================[ 🚨License: MIT] [ 🧙🏻Owner: ShovitDutta]====================================
 */`;

export default [
  {
    input: "base/index.ts",
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
    input: "base/index.ts",
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
