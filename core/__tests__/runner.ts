import { readdirSync, lstatSync } from "fs";
import { spawnSync } from "child_process";
import { resolve, join } from "path";

function runTestFiles(folderPath: string) {
  const files = readdirSync(folderPath);
  files.forEach((file) => {
    const filePath = join(folderPath, file);
    if (lstatSync(filePath).isDirectory()) {
      runTestFiles(filePath);
    } else if (file.endsWith(".test.js")) {
      console.log(`Running test file: ${filePath}`);
      const result = spawnSync("node", [filePath], { stdio: "inherit" });
      if (result.error) {
        console.error(`Error running test file: ${filePath}`);
        console.error(result.error);
      }
    }
  });
}

const folderPath = resolve(__dirname);
runTestFiles(folderPath);
