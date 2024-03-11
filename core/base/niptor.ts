import { spawn } from "child_process";

async function checkSudo() {
  return new Promise<boolean>((resolve) => {
    const check = spawn("sudo", ["-n", "true"]);
    check.on("close", (code) => {
      resolve(code === 0);
    });
  });
}

export default async function niptor(args: string[]) {
  const sudoAvailable = await checkSudo();
  const command = sudoAvailable ? ["sudo", ...args] : args;
  const prox = spawn("sh", ["-c", command.join(" ")]);
  const [stdoutData, stderrData] = await Promise.all([
    new Promise<string>((resolve, reject) => {
      const stdoutData: Buffer[] = [];
      prox.stdout.on("data", (data) => stdoutData.push(data));
      prox.on("close", (code) => {
        if (code === 0) resolve(Buffer.concat(stdoutData).toString());
        else reject(new Error("Try running npx yt-dlx install:socks5"));
      });
    }),
    new Promise<string>((resolve, reject) => {
      const stderrData: Buffer[] = [];
      prox.stderr.on("data", (data) => stderrData.push(data));
      prox.on("close", (code) => {
        if (code === 0) resolve(Buffer.concat(stderrData).toString());
        else reject(new Error("Try running npx yt-dlx install:socks5"));
      });
    }),
  ]);
  return { stdout: stdoutData, stderr: stderrData };
}
