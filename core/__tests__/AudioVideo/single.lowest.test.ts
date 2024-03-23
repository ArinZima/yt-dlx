import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

async.series([
  async () => {
    try {
      console.log(colors.blue("@test:"), "Download Lowest AudioVideo");
      await ytdlx.AudioVideo.Single.Lowest({
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
      console.log(colors.blue("@test:"), "(stream) Download Lowest AudioVideo");
      const result = await ytdlx.AudioVideo.Single.Lowest({
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
