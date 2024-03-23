import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

async.series([
  async () => {
    try {
      const resolutions = ["high", "medium", "low", "ultralow"] as const;
      for (const resolution of resolutions) {
        console.log(colors.blue("@test:"), "Download Single Custom AudioOnly");
        await ytdlx.AudioOnly.Single.Custom({
          resolution, // required
          stream: false, // optional
          verbose: true, // optional
          onionTor: true, // optional
          filter: "bassboost", // optional
          output: "public/AudioOnly", // optional
          query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ", // required
        });
      }
    } catch (error: any) {
      console.error(error.message);
    }
  },
  async () => {
    try {
      const resolutions = ["high", "medium", "low", "ultralow"] as const;
      for (const resolution of resolutions) {
        console.log(
          colors.blue("@test:"),
          "(stream) Download Single Custom AudioOnly"
        );
        const result = await ytdlx.AudioOnly.Single.Custom({
          resolution, // required
          stream: true, // optional
          verbose: true, // optional
          onionTor: true, // optional
          filter: "bassboost", // optional
          output: "public/AudioOnly", // optional
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
