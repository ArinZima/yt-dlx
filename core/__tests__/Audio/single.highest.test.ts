import * as fs from "fs";
import colors from "colors";
import { ytdlx } from "../..";

(async () => {
  try {
    console.log(colors.blue("@test:"), "Download Highest audio");
    await ytdlx.AudioOnly.Single.Highest({
      stream: false,
      verbose: true,
      onionTor: false,
      output: "public/audio",
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });

    console.log(colors.blue("@test:"), "(stream) Download Highest audio");
    const result = await ytdlx.AudioOnly.Single.Highest({
      stream: true,
      verbose: true,
      onionTor: false,
      output: "public/audio",
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });
    if (result && result.filename && result.ffmpeg) {
      result.ffmpeg.pipe(fs.createWriteStream(result.filename));
    } else {
      console.error(colors.red("@error:"), "ffmpeg or filename not found!");
    }
  } catch (error: any) {
    console.error(colors.red(error.message));
  }
})();
