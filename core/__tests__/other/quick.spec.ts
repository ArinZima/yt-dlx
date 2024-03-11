console.clear();
import colors from "colors";
import { spawn } from "child_process";

export async function niptor() {
  const prox = spawn("sh", [
    "-c",
    "sudo systemctl restart tor && curl --socks5-hostname 127.0.0.1:9050 https://checkip.amazonaws.com",
  ]);
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

(async () => {
  try {
    const { stdout, stderr } = await niptor();
    console.log(colors.green("@niptor:"), stdout.trim());
    console.log(colors.green("@niptor:\n"), stderr.trim());
  } catch (error: any) {
    console.error(colors.red("@error:"), error.message);
  }
})();
