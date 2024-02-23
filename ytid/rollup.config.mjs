import typescript from "rollup-plugin-typescript2";
import dts from "rollup-plugin-dts";

export default [
  {
    input: "app/index.ts",
    output: [
      {
        file: "cluster/index.esm.js",
        format: "es",
      },
      {
        file: "cluster/index.cjs.js",
        format: "cjs",
      },
    ],
    plugins: [
      typescript({
        tsconfig: "./tsconfig.json",
      }),
    ],
    external: ["colors", "yt-core"],
  },
  {
    plugins: [dts()],
    input: "app/index.ts",
    output: [
      {
        file: "cluster/index.d.ts",
        format: "es",
      },
    ],
  },
];
