import { spawn } from "child_process";

const proc = spawn("sh", [
  "-c",
  "project/cjs/core/cli/main.js audio-lowest --query 'PERSONAL BY PLAZA'",
]);
proc.stdout.on("data", (data) => {
  console.log("@stdout:", data.tostring());
});
proc.stderr.on("data", (data) => {
  console.error("@stderr:", data.tostring());
});
