import { execSync } from "child_process";

async function installAndRemove() {
  while (true) {
    try {
      console.clear();
      console.log("Installing yt-dlx...");
      execSync("bun add yt-dlx", { stdio: "inherit" });
      await sleep(4000);

      console.log("Removing yt-dlx and bun.lockb...");
      execSync("bun remove yt-dlx && rm -rf bun.lockb", { stdio: "inherit" });
      await sleep(4000);
    } catch (error) {
      console.error("Error occurred:", error.message);
      process.exit(1);
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
installAndRemove();
