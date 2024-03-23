import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

async.series([
  async () => {
    try {
      const resolutions = [
        "144p",
        "240p",
        "360p",
        "480p",
        "720p",
        "1080p",
        "1440p",
        "2160p",
        "3072p",
        "4320p",
        "6480p",
        "8640p",
        "12000p",
      ] as const;
      for (const resolution of resolutions) {
        console.log(colors.blue("@test:"), "Download Single Custom VideoOnly");
        await ytdlx.VideoOnly.Single.Custom({
          resolution, // required
          stream: false, // optional
          verbose: true, // optional
          onionTor: true, // optional
          filter: "grayscale", // optional
          output: "public/VideoOnly", // optional
          query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ", // required
        });
      }
    } catch (error: any) {
      console.error(colors.red(error.message));
    }
  },
  async () => {
    try {
      const resolutions = [
        "144p",
        "240p",
        "360p",
        "480p",
        "720p",
        "1080p",
        "1440p",
        "2160p",
        "3072p",
        "4320p",
        "6480p",
        "8640p",
        "12000p",
      ] as const;
      for (const resolution of resolutions) {
        console.log(
          colors.blue("@test:"),
          "(stream) Download Single Custom VideoOnly"
        );
        const result = await ytdlx.VideoOnly.Single.Custom({
          resolution, // required
          stream: true, // optional
          verbose: true, // optional
          onionTor: true, // optional
          filter: "grayscale", // optional
          output: "public/VideoOnly", // optional
          query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ", // required
        });
        if (result && result.filename && result.ffmpeg) {
          result.ffmpeg.pipe(fs.createWriteStream(result.filename));
        } else {
          console.error(colors.red("@error:"), "ffmpeg or filename not found!");
        }
      }
    } catch (error: any) {
      console.error(colors.red(error.message));
    }
  },
]);
