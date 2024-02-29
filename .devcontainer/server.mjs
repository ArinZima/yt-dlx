import { execSync } from "child_process";
import express from "express";
import colors from "colors";

const app = express();

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

app.get("/ip", (req, res) => {
  const ip = req.socket.remoteAddress;
  console.log("Server IP Address:", ip);
  res.send(ip);
});

(async () => {
  let counter = 1;
  while (true) {
    try {
      console.clear();
      console.log(colors.green("@info:"), "re-installing yt-dlx");
      console.log(colors.green("@info:"), `iteration ${counter}`);
      execSync("bun remove yt-dlx", { stdio: "inherit" });
      execSync("bun add yt-dlx@latest", { stdio: "inherit" });
      counter++;
      await sleep(8000);
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
