#!/usr/bin/env node
import ytdlx from "..";
import colors from "colors";
import minimist from "minimist";
import { version } from "../../package.json";

const proTube = minimist(process.argv.slice(2), {
  string: ["query", "format"],
  alias: {
    h: "help",
    e: "extract",
    v: "version",
    s: "search-yt",
    f: "list-formats",
    vl: "video-lowest",
    al: "audio-lowest",
    vh: "video_highest",
    ah: "audio-highest",
    vi: "get-video-data",
    avl: "audio-video-lowest",
    avh: "audio-video-highest",
    aqc: "audio-quality-custom",
    vqc: "video-quality-custom",
  },
});
const program = async () => {
  const command = proTube._[0];
  switch (command) {
    case "version":
    case "v":
      console.error(colors.green("Installed Version: yt-dlx@" + version));
      break;
    case "help":
    case "h":
      ytdlx.info
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
        ytdlx.info
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
    case "search-yt":
    case "s":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors.red("error: no query"));
      } else
        ytdlx.info
          .search({
            number: 20,
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
        ytdlx.info
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
    case "get-video-data":
    case "vi":
      if (!proTube || !proTube.query || proTube.query.length === 0) {
        console.error(colors.red("error: no query"));
      } else
        ytdlx.info
          .get_video_data({
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
        ytdlx.audio.single
          .highest({
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
        ytdlx.audio.single
          .lowest({
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
        ytdlx.video.single
          .highest({
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
        ytdlx.video.single
          .lowest({
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
        ytdlx.audio_video.single
          .highest({
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
        ytdlx.audio_video.single
          .lowest({
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
      ytdlx.audio.single
        .custom({
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
      ytdlx.video.single
        .custom({
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
      ytdlx.info
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
  ytdlx.info
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
