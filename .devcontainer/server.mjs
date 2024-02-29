import { execSync } from "child_process";
import nfetch from "node-fetch";
import express from "express";
import colors from "colors";

const app = express();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get("/pip", async (req, res) => {
  try {
    const response = await nfetch("http://ipinfo.io/ip");
    const pip = await response.text();
    res.status(200).json({ pip });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

(async () => {
  let counter = 1;
  while (true) {
    try {
      console.clear();
      console.log(colors.green("@info:"), "re-installing yt-dlx");
      console.log(colors.green("@info:"), `iteration ${counter}`);
      execSync("bun add yt-dlx@latest", { stdio: "inherit" });
      execSync("bun remove yt-dlx", { stdio: "inherit" });
      counter++;
      await sleep(2000);
    } catch (error) {
      console.error(colors.red("@error:"), error.message);
      process.exit(1);
    }
  }
})();

const port = process.env.PORT || 8080;
app.listen(port, async () => {
  console.log(colors.bold.green("@express:"), port);
});
