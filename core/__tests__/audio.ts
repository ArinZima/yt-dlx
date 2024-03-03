console.clear();
import colors from "colors";
import { resolve, join } from "path";
import { spawnSync } from "child_process";
import { readdirSync, lstatSync } from "fs";

function runTestFiles(folderPath: string) {
  const files = readdirSync(folderPath);
  files.forEach((file) => {
    const filePath = join(folderPath, file);
    if (lstatSync(filePath).isDirectory()) {
      if (file === "audio") runTestFiles(filePath);
    } else if (file.endsWith(".test.js")) {
      console.log(colors.bold.yellow("\n\n@testing:"), filePath);
      const result = spawnSync("node", [filePath], { stdio: "inherit" });
      if (result.error) console.error(colors.bold.red("@error:"), result.error);
    }
  });
}
runTestFiles(resolve(__dirname));
