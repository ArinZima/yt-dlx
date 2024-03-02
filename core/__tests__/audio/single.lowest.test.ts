import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

let holder: any;
async.series([
  async () => {
    try {
      holder = await ytdlx.audio.lowest({
        folderName: ".temp/audio",
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        outputFormat: "ogg",
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
      holder = await ytdlx.audio.lowest({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: ".temp/audio",
        outputFormat: "mp3",
        filter: "nightcore",
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
      holder = await ytdlx.audio.lowest({
        folderName: ".temp/audio",
        outputFormat: "flac",
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        stream: true,
      });
      if (holder) {
        holder.stream
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
      holder = await ytdlx.audio.lowest({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: ".temp/audio",
        outputFormat: "aiff",
        filter: "bassboost",
        stream: true,
      });
      if (holder) {
        holder.stream
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
