#!/usr/bin/env node
import ytdlx from "..";
import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import minimist from "minimist";
import { spawn } from "child_process";
import { version } from "../../package.json";

const proTube = minimist(process.argv.slice(2), {
  string: ["query", "format"],
  alias: {
    h: "help",
    e: "extract",
    v: "version",
    f: "list-formats",
    vl: "video-lowest",
    al: "audio-lowest",
    vh: "video_highest",
    ah: "audio-highest",
    avl: "audio-video-lowest",
    avh: "audio-video-highest",
    aqc: "audio-quality-custom",
    vqc: "video-quality-custom",
  },
});
let uLoc: string = "";
let maxTries: number = 6;
let currentDir: string = __dirname;
const program = async () => {
  const command = proTube._[0];
  switch (command) {
    case "install:deps":
      while (maxTries > 0) {
        const enginePath = path.join(currentDir, "util");
        if (fs.existsSync(enginePath)) {
          uLoc = enginePath;
          break;
        } else {
          currentDir = path.join(currentDir, "..");
          maxTries--;
        }
      }
      const rox = spawn("sh", [
        "-c",
        `chmod +x ${uLoc}/deps.sh && ${uLoc}/deps.sh`,
      ]);
      await Promise.all([
        new Promise<void>((resolve, reject) => {
          rox.stdout.on("data", (stdout) => {
            console.log(colors.green("@stdout:"), stdout.toString().trim());
          });
          rox.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`@closed with code ${code}`));
          });
        }),
        new Promise<void>((resolve, reject) => {
          rox.stderr.on("data", (stderr) => {
            console.log(colors.yellow("@stderr:"), stderr.toString().trim());
          });
          rox.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`@closed with code ${code}`));
          });
        }),
      ]);
      break;
    case "install:socks5":
      while (maxTries > 0) {
        const enginePath = path.join(currentDir, "util");
        if (fs.existsSync(enginePath)) {
          uLoc = enginePath;
          break;
        } else {
          currentDir = path.join(currentDir, "..");
          maxTries--;
        }
      }
      const xrox = spawn("sh", [
        "-c",
        `chmod +x ${uLoc}/socks5.sh && ${uLoc}/socks5.sh`,
      ]);
      await Promise.all([
        new Promise<void>((resolve, reject) => {
          xrox.stdout.on("data", (stdout) => {
            console.log(colors.green("@stdout:"), stdout.toString().trim());
          });
          xrox.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`@closed with code ${code}`));
          });
        }),
        new Promise<void>((resolve, reject) => {
          xrox.stderr.on("data", (stderr) => {
            console.log(colors.yellow("@stderr:"), stderr.toString().trim());
          });
          xrox.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`@closed with code ${code}`));
          });
        }),
      ]);
      break;
    case "version":
    case "v":
      console.error(colors.green("Installed Version: yt-dlx@" + version));
      break;
    case "help":
    case "h":
      ytdlx()
        .info()
        .help()
        .then((data: any) => {
          console.log(data);
          process.exit();
        })
        .catch((error: string) => {
          console.error(colors.red(error));
          process.exit();
        });
      break;
    case "extract":
    case "e":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors.red("error: no query"));
      } else
        ytdlx()
          .info()
          .extract({
            query: proTube.query,
          })
          .then((data: any) => {
            console.log(data);
            process.exit();
          })
          .catch((error: string) => {
            console.error(colors.red(error));
            process.exit();
          });
      break;
    case "list-formats":
    case "f":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors.red("error: no query"));
      } else
        ytdlx()
          .info()
          .list_formats({
            query: proTube.query,
          })
          .then((data: any) => {
            console.log(data);
            process.exit();
          })
          .catch((error: string) => {
            console.error(colors.red(error));
            process.exit();
          });
      break;
    case "audio-highest":
    case "ah":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors.red("error: no query"));
      } else
        ytdlx()
          .AudioOnly()
          .Single()
          .Highest({
            query: proTube.query,
          })
          .then((data: any) => {
            console.log(data);
            process.exit();
          })
          .catch((error: string) => {
            console.error(colors.red(error));
            process.exit();
          });
      break;
    case "audio-lowest":
    case "al":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors.red("error: no query"));
      } else
        ytdlx()
          .AudioOnly()
          .Single()
          .Lowest({
            query: proTube.query,
          })
          .then((data: any) => {
            console.log(data);
            process.exit();
          })
          .catch((error: string) => {
            console.error(colors.red(error));
            process.exit();
          });
      break;
    case "video_highest":
    case "vh":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors.red("error: no query"));
      } else
        ytdlx()
          .VideoOnly()
          .Single()
          .Highest({
            query: proTube.query,
          })
          .then((data: any) => {
            console.log(data);
            process.exit();
          })
          .catch((error: string) => {
            console.error(colors.red(error));
            process.exit();
          });
      break;
    case "video-lowest":
    case "vl":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors.red("error: no query"));
      } else
        ytdlx()
          .VideoOnly()
          .Single()
          .Lowest({
            query: proTube.query,
          })
          .then((data: any) => {
            console.log(data);
            process.exit();
          })
          .catch((error: string) => {
            console.error(colors.red(error));
            process.exit();
          });
      break;
    case "audio-video-highest":
    case "avh":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors.red("error: no query"));
      } else
        ytdlx()
          .AudioVideo()
          .Single()
          .Highest({
            query: proTube.query,
          })
          .then((data: any) => {
            console.log(data);
            process.exit();
          })
          .catch((error: string) => {
            console.error(colors.red(error));
            process.exit();
          });
      break;
    case "audio-video-lowest":
    case "avl":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors.red("error: no query"));
      } else
        ytdlx()
          .AudioVideo()
          .Single()
          .Lowest({
            query: proTube.query,
          })
          .then((data: any) => {
            console.log(data);
            process.exit();
          })
          .catch((error: string) => {
            console.error(colors.red(error));
            process.exit();
          });
      break;
    case "audio-quality-custom":
    case "aqc":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors.red("error: no query"));
      }
      if (!proTube || !proTube.format || proTube.format.length === 0) {
        console.error(colors.red("error: no format"));
      }
      ytdlx()
        .AudioOnly()
        .Single()
        .Custom({
          query: proTube.query,
          quality: proTube.format,
        })
        .then((data: any) => {
          console.log(data);
          process.exit();
        })
        .catch((error: string) => {
          console.error(colors.red(error));
          process.exit();
        });
      break;
    case "video-quality-custom":
    case "vqc":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors.red("error: no query"));
      }
      if (!proTube || !proTube.format || proTube.format.length === 0) {
        console.error(colors.red("error: no format"));
      }
      ytdlx()
        .VideoOnly()
        .Single()
        .Custom({
          query: proTube.query,
          quality: proTube.format,
        })
        .then((data: any) => {
          console.log(data);
          process.exit();
        })
        .catch((error: string) => {
          console.error(colors.red(error));
          process.exit();
        });
      break;
    default:
      ytdlx()
        .info()
        .help()
        .then((data: any) => {
          console.log(data);
          process.exit();
        })
        .catch((error: string) => {
          console.error(colors.red(error));
          process.exit();
        });
      break;
  }
};

if (!proTube._[0]) {
  ytdlx()
    .info()
    .help()
    .then((data: any) => {
      console.log(data);
      process.exit();
    })
    .catch((error: string) => {
      console.error(colors.red(error));
      process.exit();
    });
} else program();
