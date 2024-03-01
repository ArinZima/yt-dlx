console.clear();
import { resolve, join } from "path";
import { spawnSync } from "child_process";
import { readdirSync, lstatSync } from "fs";

function runTestFiles(folderPath: string) {
  const files = readdirSync(folderPath);
  files.forEach((file) => {
    const filePath = join(folderPath, file);
    if (lstatSync(filePath).isDirectory()) runTestFiles(filePath);
    else if (file.endsWith(".test.js")) {
      console.log(`Running test file: ${filePath}`);
      const result = spawnSync("node", [filePath], { stdio: "inherit" });
      if (result.error) {
        console.error(`Error running test file: ${filePath}`);
        console.error(result.error);
      }
    }
  });
}
runTestFiles(resolve(__dirname));
