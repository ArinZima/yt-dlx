import { exec } from "child_process";
import fs from "fs";

let count = 0;

export async function createFile() {
  const content = "This is the temporary file " + count + ".\n";
  fs.writeFileSync("temporary.txt", content);
}

export async function commitAndPush(message) {
  return new Promise((resolve, reject) => {
    const cmd =
      'git add . && git commit -m "' + message + '" && git push origin main';
    exec(cmd, (error, stdout, stderr) => {
      if (error || stderr) {
        console.log("Error: " + stderr);
        reject();
      } else {
        resolve();
      }
    });
  });
}

export async function runLoop() {
  while (true) {
    try {
      await createFile();
      await commitAndPush("Add temporary.txt (" + ++count + ")");
      fs.unlinkSync("temporary.txt");
      await commitAndPush("Remove temporary.txt (" + count + ")");
      ++count;
      setTimeout(() => {}, 6000);
    } catch (e) {
      break;
    }
  }
}

runLoop();
