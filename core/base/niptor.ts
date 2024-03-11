import { spawn } from "child_process";

export default async function niptor(args: string[]) {
  const prox = spawn("sh", args);
  const stdoutData: Buffer[] = [];
  prox.stdout.on("data", (data) => stdoutData.push(data));
  const [stdout, stderr] = await Promise.all([
    new Promise<string>((resolve, reject) => {
      const stdoutData: Buffer[] = [];
      prox.stdout.on("data", (data) => stdoutData.push(data));
      prox.on("close", (code) => {
        if (code === 0) resolve(Buffer.concat(stdoutData).toString());
        else reject(new Error(`@niptor closed with code ${code}`));
      });
    }),
    new Promise<string>((resolve, reject) => {
      const stderrData: Buffer[] = [];
      prox.stderr.on("data", (data) => stderrData.push(data));
      prox.on("close", (code) => {
        if (code === 0) resolve(Buffer.concat(stderrData).toString());
        else reject(new Error(`@niptor closed with code ${code}`));
      });
    }),
  ]);
  return { stdout, stderr };
}
