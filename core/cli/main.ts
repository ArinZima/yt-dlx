#!/usr/bin/env node
import ytdlx from "..";
import colors from "colors";
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
const program = async () => {
  const command = proTube._[0];
  switch (command) {
    case "install:deps":
      const prox = spawn("yarn", ["install:deps"]);
      const [stdout, stderr] = await Promise.all([
        new Promise<string>((resolve, reject) => {
          const stdoutData: Buffer[] = [];
          prox.stdout.on("data", (data) => stdoutData.push(data));
          prox.on("close", (code) => {
            if (code === 0) resolve(Buffer.concat(stdoutData).toString());
            else reject(new Error(`@closed with code ${code}`));
          });
        }),
        new Promise<string>((resolve, reject) => {
          const stderrData: Buffer[] = [];
          prox.stderr.on("data", (data) => stderrData.push(data));
          prox.on("close", (code) => {
            if (code === 0) resolve(Buffer.concat(stderrData).toString());
            else reject(new Error(`@closed with code ${code}`));
          });
        }),
      ]);
      console.log(colors.green("@stdout:"), stdout.trim());
      console.log(colors.yellow("@stderr:"), stderr.trim());
      break;
    case "install:socks5":
      const proxi = spawn("yarn", ["install:socks5"]);
      const [stdouti, stderri] = await Promise.all([
        new Promise<string>((resolve, reject) => {
          const stdoutData: Buffer[] = [];
          proxi.stdout.on("data", (data) => stdoutData.push(data));
          proxi.on("close", (code) => {
            if (code === 0) resolve(Buffer.concat(stdoutData).toString());
            else reject(new Error(`@closed with code ${code}`));
          });
        }),
        new Promise<string>((resolve, reject) => {
          const stderrData: Buffer[] = [];
          proxi.stderr.on("data", (data) => stderrData.push(data));
          proxi.on("close", (code) => {
            if (code === 0) resolve(Buffer.concat(stderrData).toString());
            else reject(new Error(`@closed with code ${code}`));
          });
        }),
      ]);
      console.log(colors.green("@stdout:"), stdouti.trim());
      console.log(colors.yellow("@stderr:"), stderri.trim());
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
