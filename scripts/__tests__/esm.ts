import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

function findTestFiles(directory: string) {
  fs.readdir(directory, (error, files) => {
    if (error) return console.error("Error reading directory:", error);
    files.forEach((file) => {
      const filePath = path.join(directory, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return console.error("Error getting file stats:", err);
        if (stats.isDirectory()) findTestFiles(filePath);
        else if (stats.isFile() && file.endsWith(".test.mjs")) {
          execSync(`node ${filePath}`, { stdio: "inherit" });
        }
      });
    });
  });
}
findTestFiles(__dirname);
