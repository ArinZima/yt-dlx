import fs from "fs";
import colors from "colors";
import retry from "async-retry";
import { promisify } from "util";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { exec } from "child_process";

const proxyList = [
  "http://38.62.222.219:3128",
  "http://154.6.97.227:3128",
  "http://154.6.97.129:3128",
  "http://154.6.99.45:3128",
  "http://38.62.220.3:3128",
  "http://154.6.96.253:3128",
  "http://38.62.222.236:3128",
  "http://38.62.221.46:3128",
  "http://154.6.97.24:3128",
  "http://38.62.222.102:3128",
  "http://154.6.97.130:3128",
  "http://154.6.96.148:3128",
  "http://38.62.221.70:3128",
  "http://38.62.220.225:3128",
  "http://154.6.99.166:3128",
  "http://38.62.221.105:3128",
  "http://154.6.96.102:3128",
  "http://154.6.99.255:3128",
  "http://154.6.97.235:3128",
  "http://38.62.222.180:3128",
  "http://38.62.221.173:3128",
  "http://38.62.221.240:3128",
  "http://38.62.220.123:3128",
  "http://38.62.223.208:3128",
  "http://38.62.222.52:3128",
  "http://38.62.221.58:3128",
  "http://38.62.223.233:3128",
  "http://38.62.220.67:3128",
  "http://154.6.98.95:3128",
  "http://38.62.223.113:3128",
  "http://154.6.98.172:3128",
  "http://154.6.97.170:3128",
  "http://38.62.220.21:3128",
  "http://154.6.97.177:3128",
  "http://154.6.96.214:3128",
  "http://38.62.220.81:3128",
  "http://38.62.220.218:3128",
  "http://38.62.221.237:3128",
  "http://38.62.222.172:3128",
  "http://154.6.98.60:3128",
  "http://154.6.97.43:3128",
  "http://38.62.220.51:3128",
  "http://38.62.223.72:3128",
  "http://154.6.98.151:3128",
  "http://38.62.223.133:3128",
  "http://154.6.99.141:3128",
  "http://38.62.220.244:3128",
  "http://38.62.220.222:3128",
  "http://154.6.99.24:3128",
  "http://154.6.98.45:3128",
  "http://38.62.221.226:3128",
  "http://154.6.99.42:3128",
  "http://154.6.97.184:3128",
  "http://154.6.96.228:3128",
  "http://154.6.97.107:3128",
  "http://38.62.223.74:3128",
  "http://38.62.222.63:3128",
  "http://38.62.222.33:3128",
  "http://154.6.96.75:3128",
  "http://38.62.221.28:3128",
  "http://154.6.99.95:3128",
  "http://154.6.97.152:3128",
  "http://38.62.223.185:3128",
  "http://38.62.223.102:3128",
  "http://154.6.99.214:3128",
  "http://38.62.223.119:3128",
  "http://38.62.220.240:3128",
  "http://38.62.222.238:3128",
  "http://38.62.222.36:3128",
  "http://38.62.223.215:3128",
  "http://154.6.97.39:3128",
  "http://154.6.98.66:3128",
  "http://154.6.96.183:3128",
  "http://154.6.99.169:3128",
  "http://38.62.220.22:3128",
  "http://154.6.97.178:3128",
  "http://154.6.97.48:3128",
  "http://154.6.98.185:3128",
  "http://38.62.220.87:3128",
  "http://154.6.98.253:3128",
  "http://38.62.222.43:3128",
  "http://38.62.221.76:3128",
  "http://38.62.223.57:3128",
  "http://154.6.99.53:3128",
  "http://38.62.222.154:3128",
  "http://38.62.223.159:3128",
  "http://38.62.223.43:3128",
  "http://38.62.221.248:3128",
  "http://154.6.98.67:3128",
  "http://154.6.96.83:3128",
  "http://154.6.96.22:3128",
  "http://154.6.99.75:3128",
  "http://38.62.223.187:3128",
  "http://38.62.221.113:3128",
  "http://154.6.98.191:3128",
  "http://154.6.97.100:3128",
  "http://154.6.98.146:3128",
  "http://38.62.220.5:3128",
  "http://38.62.220.226:3128",
  "http://154.6.96.26:3128",
];
const reops = {
  factor: 2,
  retries: 4,
  minTimeout: 1000,
  maxTimeout: 6000,
};

(async () => {
  try {
    const rproxy = proxyList[Math.floor(Math.random() * proxyList.length)];
    console.log(colors.blue("@info:"), "using proxy " + rproxy);
    const __filename = fileURLToPath(import.meta.url);
    let proLoc =
      join(dirname(__filename), "backend", "util", "Engine") +
      " " +
      `--proxy '${rproxy}' ` +
      "--dump-single-json --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass " +
      "--user-agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36' " +
      "'https://www.youtube.com/watch?v=wWR0VD6qgt8'";
    const result = await retry(async (bail) => {
      const proc = await promisify(exec)(proLoc);
      if (proc.stderr) bail(new Error(proc.stderr.toString()));
      return proc.stdout;
    }, reops);
    const jsonData = JSON.parse(result.toString());
    const filePath = join(dirname(__filename), "Engine.json");
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    console.info(colors.green("@info:"), "data saved in", filePath);
  } catch (error) {
    console.error(colors.red("@error:"), error.message);
    const __filename = fileURLToPath(import.meta.url);
    let proLoc =
      join(dirname(__filename), "backend", "util", "Engine") +
      " " +
      "--dump-single-json --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass " +
      "--user-agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36' " +
      "'https://www.youtube.com/watch?v=wWR0VD6qgt8'";
    const result = await retry(async (bail) => {
      const proc = await promisify(exec)(proLoc);
      if (proc.stderr) bail(new Error(proc.stderr.toString()));
      return proc.stdout;
    }, reops);
    const jsonData = JSON.parse(result.toString());
    const filePath = join(dirname(__filename), "Engine.json");
    fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
    console.info(colors.green("@info:"), "data saved in", filePath);
  }
})();
