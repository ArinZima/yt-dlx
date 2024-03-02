import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

let holder: any;
async.series([
  async () => {
    try {
      holder = await ytdlx.audio_video.lowest({
        folderName: "audio_video",
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        outputFormat: "avi",
        stream: false,
      });
      console.log(colors.bold.green("@pass:"), true);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[FULL-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.audio_video.lowest({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: "audio_video",
        outputFormat: "mov",
        stream: false,
      });
      console.log(colors.bold.green("@pass:"), true);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[FULL-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.audio_video.lowest({
        folderName: "audio_video",
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        outputFormat: "webm",
        stream: true,
      });
      if (holder) {
        await holder.stream
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
  // =========================[FULL-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.audio_video.lowest({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: "audio_video",
        outputFormat: "webm",
        stream: true,
      });
      if (holder) {
        await holder.stream
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
