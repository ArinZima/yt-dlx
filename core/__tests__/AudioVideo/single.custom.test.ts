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
        console.log(colors.blue("@test:"), "Download Single Custom AudioVideo");
        await ytdlx.AudioVideo.Single.Custom({
          resolution, // required
          stream: false, // optional
          verbose: true, // optional
          onionTor: true, // optional
          filter: "grayscale", // optional
          output: "public/AudioVideo", // optional
          query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ", // required
        });
      }
    } catch (error: any) {
      console.error(error.message);
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
          "(stream) Download Single Custom AudioVideo"
        );
        const result = await ytdlx.AudioVideo.Single.Custom({
          resolution, // required
          stream: true, // optional
          verbose: true, // optional
          onionTor: true, // optional
          filter: "grayscale", // optional
          output: "public/AudioVideo", // optional
          query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ", // required
        });
        if (result && result.filename && result.ffmpeg) {
          result.ffmpeg.pipe(fs.createWriteStream(result.filename));
        } else {
          console.error(colors.red("@error:"), "ffmpeg or filename not found!");
        }
      }
    } catch (error: any) {
      console.error(error.message);
    }
  },
]);
