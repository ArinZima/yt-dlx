import fs from "fs";
import colors from "colors";
import retry from "async-retry";
import { promisify } from "util";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { exec } from "child_process";

const reops = {
  factor: 2,
  retries: 4,
  minTimeout: 2000,
  maxTimeout: 4000,
};

const __filename = fileURLToPath(import.meta.url);
(async () => {
  try {
    const result = await retry(async (bail) => {
      let proLoc =
        join(dirname(__filename), "backend", "util", "Engine") +
        " " +
        "--dump-single-json --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass " +
        "--user-agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36' " +
        "'https://www.youtube.com/watch?v=wWR0VD6qgt8'";
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
  }
})();
