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
async.series([
  async () => {
    try {
      for (const quality of quals) {
        holder = await ytdlx.audio.custom({
          folderName: ".temp/audio",
          query: "sQEgklEwhSo",
          verbose: true,
          stream: false,
          quality,
        });
        console.log(colors.bold.green("@pass:"), true);
      }
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[FULL-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.audio.custom({
        folderName: ".temp/audio",
        query: "sQEgklEwhSo",
        quality: "medium",
        verbose: true,
        stream: true,
      });
      if (holder) {
        await holder.ffmpeg
          .pipe(fs.createWriteStream(holder.filename))
          .on("finish", () => {
            console.log(
              colors.bold.green("@pass:"),
              "filename",
              holder.filename
            );
          });
      } else throw new Error(colors.bold.red("@error:"), holder);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
]);
