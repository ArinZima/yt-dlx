import colors from "colors";
import * as bun from "bun";
import cron from "node-cron";

let counter = 0;

async function reproc() {
  try {
    const ipop =
      await bun.$`npm install -g yt-dlx && npm uninstall -g yt-dlx`.text();
    console.log(colors.green("@info:"), "re-installing iteration", counter);
    console.log(colors.yellow("@debug:"), ipop);
    counter++;
  } catch (error) {
    console.error(colors.red("@error:"), error.message);
    process.exit(1);
  }
}

cron.schedule("*/6 * * * *", async () => await reproc());
