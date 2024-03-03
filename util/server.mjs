import colors from "colors";
import cron from "node-cron";
import express from "express";
import { spawn } from "child_process";

let counter = 0;
cron.schedule("*/20 * * * *", () => {
  const command = "yarn";
  const args = ["global", "add", "yt-dlx@latest"];
  const installProcess = spawn(command, args);
  installProcess.stdout.on("data", (data) => {
    console.log(colors.yellow("@debug:"), data.toString());
  });
  installProcess.stderr.on("data", (data) => {
    console.error(colors.red("@error:"), data.toString());
  });
  installProcess.on("close", async (code) => {
    if (code === 0) {
      try {
        const ipop = await bun.$`yarn global remove yt-dlx@latest`.text();
        console.log(colors.green("@info:"), "re-installing iteration", counter);
        console.log(colors.yellow("@debug:"), ipop);
        counter++;
      } catch (error) {
        console.error(colors.red("@error:"), error.message);
      }
    } else {
      console.error(colors.red("@error:"), "Command failed with code", code);
    }
  });
});

const app = express();
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(colors.green("@bun:"), "server started on port", port);
});

app.get("/", async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }
  try {
    const engineProcess = spawn("util/engine", [
      "--dump-json",
      `ytsearch:${query}`,
    ]);
    const ipProcess = spawn("curl", ["ipinfo.io/ip"]);
    let result = "";
    let pubip = "";
    engineProcess.stdout.on("data", (data) => {
      result += data.toString();
    });
    ipProcess.stdout.on("data", (data) => {
      pubip += data.toString();
    });
    engineProcess.stderr.on("data", (data) => {
      console.error(colors.red("@error:"), data.toString());
      res.status(500).json({ error: "Internal server error" });
    });
    ipProcess.stderr.on("data", (data) => {
      console.error(colors.red("@error:"), data.toString());
      res.status(500).json({ error: "Internal server error" });
    });
    engineProcess.on("close", () => {
      ipProcess.on("close", () => {
        const responseData = {
          result: result.trim(),
          pubip: pubip.trim(),
        };
        res.json(responseData);
      });
    });
  } catch (error) {
    console.error(colors.red("@error:"), error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.use((req, res) => {
  res.status(404).send("404!");
});
