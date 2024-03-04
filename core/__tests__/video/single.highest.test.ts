import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

let holder: any;
async.series([
  async () => {
    try {
      holder = await ytdlx().video().single().highest({
        query: "https://www.youtube.com/watch?v=EUshgvt7I8U",
        output: "temp/video",
        verbose: false,
        stream: false,
      });
      console.log(colors.bold.green("@pass:"), true);
    } catch (error: any) {
      console.error(colors.red(error));
    }
  },
  // =========================[FULL-TEST]=========================
  async () => {
    try {
      holder = await ytdlx().video().single().highest({
        query: "https://www.youtube.com/watch?v=EUshgvt7I8U",
        output: "temp/video",
        verbose: false,
        stream: true,
      });
      if (holder) {
        await holder.ffmpeg
          .pipe(fs.createWriteStream(holder.filename))
          .on("finish", () => {
            console.log(
              colors.bold.green("\n@pass:"),
              "filename",
              holder.filename
            );
          });
      } else console.error(colors.red(holder));
    } catch (error: any) {
      console.error(colors.red(error));
    }
  },
]);
