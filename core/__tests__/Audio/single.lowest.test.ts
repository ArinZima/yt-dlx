import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";

(async () => {
  try {
    console.log(colors.blue("@test:"), "Download Lowest audio");
    await ytdlx.AudioOnly.Single.Lowest({
      stream: false,
      verbose: true,
      onionTor: true,
      output: "public/audio",
      query: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
    });

    console.log(colors.blue("@test:"), "(stream) Download Lowest audio");
    const result = await ytdlx.AudioOnly.Single.Lowest({
      stream: true,
      verbose: true,
      onionTor: true,
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
