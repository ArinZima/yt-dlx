import fs from "fs";
import { promisify } from "util";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { exec } from "child_process";

try {
  const __filename = fileURLToPath(import.meta.url);
  let proLoc =
    join(dirname(__filename), "backend", "util", "Engine") +
    " " +
    "--proxy http://38.62.222.219:3128 " +
    "--dump-single-json --no-check-certificate --prefer-insecure --no-call-home --verbose --skip-download --no-warnings --geo-bypass " +
    "--user-agent Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 " +
    "'https://www.youtube.com/watch?v=wWR0VD6qgt8'";
  const result = await promisify(exec)(proLoc);
  if (result.stderr) console.error(result.stderr.toString());
  const jsonData = JSON.parse(result.stdout.toString());
  const filePath = join(dirname(__filename), "output.json");
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
  console.log("JSON data saved to:", filePath);
} catch {
  const __filename = fileURLToPath(import.meta.url);
  let proLoc =
    join(dirname(__filename), "backend", "util", "Engine") +
    " " +
    "--dump-single-json --no-check-certificate --prefer-insecure --no-call-home --verbose --skip-download --no-warnings --geo-bypass " +
    "--user-agent Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36 " +
    "'https://www.youtube.com/watch?v=wWR0VD6qgt8'";
  const result = await promisify(exec)(proLoc);
  if (result.stderr) console.error(result.stderr.toString());
  const jsonData = JSON.parse(result.stdout.toString());
  const filePath = join(dirname(__filename), "output.json");
  fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
  console.log("JSON data saved to:", filePath);
}
