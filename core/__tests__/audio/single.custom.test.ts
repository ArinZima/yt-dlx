import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

let holder: any;
const quals: ("high" | "medium" | "low" | "ultralow")[] = [
  "high",
  "medium",
  "low",
  "ultralow",
];

async.series(
  quals.map((quality) => async () => {
    try {
      holder = await ytdlx.audio.custom({
        output: "temp/audio",
        query: "sQEgklEwhSo",
        verbose: false,
        stream: false,
        quality,
      });
      console.log(colors.bold.green("@pass:"), true);
    } catch (error: any) {
      console.error(colors.red(error));
    }
  }),
  async () => {
    try {
      holder = await ytdlx.audio.custom({
        output: "temp/audio",
        query: "sQEgklEwhSo",
        quality: "medium",
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
  }
);
