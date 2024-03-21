const colors = require("colors");
const cron = require("node-cron");
const express = require("express");
const { spawn } = require("child_process");

const app = express();
const port = process.env.PORT || 8000;
app.use((req, res) => res.status(404).send("404!"));

app.get("/", async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  } else {
    try {
      const eproc = spawn("util/engine", ["--dump-json", `ytsearch:${query}`]);
      const ipProcess = spawn("curl", ["ipinfo.io/ip"]);
      let result = "";
      let pubip = "";
      eproc.stdout.on("data", (data) => {
        result += data.toString();
      });
      ipProcess.stdout.on("data", (data) => {
        pubip += data.toString();
      });
      eproc.stderr.on("data", (data) => {
        console.error(colors.red("@error:"), data.toString());
        res.status(500).json({ error: "Internal server error" });
      });
      ipProcess.stderr.on("data", (data) => {
        console.error(colors.red("@error:"), data.toString());
        res.status(500).json({ error: "Internal server error" });
      });
      eproc.on("close", () => {
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
  }
});

function reproc() {
  const iproc = spawn("yarn", ["global", "add", "yt-dlx"]);
  iproc.stdout.on("data", (data) => {
    console.log(colors.yellow("@debug:"), data.toString());
  });
  iproc.stderr.on("data", (data) => {
    console.error(colors.red("@error:"), data.toString());
  });
  iproc.on("close", (code) => {
    if (code !== 0) {
      console.error(colors.red("@error:"), "installation failed.");
    } else {
      const rproc = spawn("yarn", ["global", "remove", "yt-dlx"]);
      rproc.stdout.on("data", (data) => {
        console.log(colors.yellow("@debug:"), data.toString());
      });
      rproc.stderr.on("data", (data) => {
        console.error(colors.red("@error:"), data.toString());
      });
      rproc.on("close", (code) => {
        if (code !== 0) console.error(colors.red("@error:"), "removal failed.");
        else reproc();
      });
    }
  });
}

app.listen(port, () => {
  console.log(colors.green("@server:"), "started on port", port);
  cron.schedule("0 * * * *", () => reproc());
});
