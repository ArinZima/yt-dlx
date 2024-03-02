import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

let holder: any;
const quals: (
  | "144p"
  | "240p"
  | "360p"
  | "480p"
  | "720p"
  | "1080p"
  | "1440p"
  | "2160p"
  | "2880p"
  | "4320p"
  | "5760p"
  | "8640p"
  | "12000p"
)[] = [
  "144p",
  "240p",
  "360p",
  "480p",
  "720p",
  "1080p",
  "1440p",
  "2160p",
  "2880p",
  "4320p",
  "5760p",
  "8640p",
  "12000p",
];
async.series([
  async () => {
    try {
      for (const quality of quals) {
        holder = await ytdlx.video.custom({
          folderName: ".temp/video",
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
      holder = await ytdlx.video.custom({
        folderName: ".temp/video",
        query: "sQEgklEwhSo",
        quality: "720p",
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
