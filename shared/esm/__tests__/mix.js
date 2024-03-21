console.clear();
import colors from "colors";
import { resolve, join } from "path";
import { spawnSync } from "child_process";
import { readdirSync, lstatSync } from "fs";
function runTestFiles(folderPath) {
    var files = readdirSync(folderPath);
    files.forEach(function (file) {
        var filePath = join(folderPath, file);
        if (lstatSync(filePath).isDirectory()) {
            if (file === "AudioVideo")
                runTestFiles(filePath);
        }
        else if (file.endsWith(".test.js")) {
            console.log(colors.yellow("@testing:"), filePath);
            var result = spawnSync("node", [filePath], { stdio: "inherit" });
            if (result.error)
                console.error(colors.red("@error:"), result.error);
        }
    });
}
runTestFiles(resolve(__dirname));
