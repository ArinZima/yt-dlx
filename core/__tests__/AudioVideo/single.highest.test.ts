import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

async.series([
  async () => {
    try {
      console.log(colors.blue("@test:"), "Download Single Highest AudioVideo");
      await ytdlx.AudioVideo.Single.Highest({
        stream: false, // optional
        verbose: true, // optional
        onionTor: true, // optional
        filter: "grayscale", // optional
        output: "public/AudioVideo", // optional
        query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ", // required
      });
    } catch (error: any) {
      console.error(colors.red(error.message));
    }
  },
  async () => {
    try {
      console.log(
        colors.blue("@test:"),
        "(stream) Download Single Highest AudioVideo"
      );
      const result = await ytdlx.AudioVideo.Single.Highest({
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
    } catch (error: any) {
      console.error(colors.red(error.message));
    }
  },
]);
