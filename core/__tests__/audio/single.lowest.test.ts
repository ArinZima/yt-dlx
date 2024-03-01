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
        query: "sQEgklEwhSo",
        outputFormat: "ogg",
        stream: false,
      });
      console.log(colors.bold.green("@pass:"), holder);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[BREAK-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.audio.lowest({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: ".temp/audio",
        outputFormat: "mp3",
        filter: "nightcore",
        stream: false,
      });
      console.log(colors.bold.green("@pass:"), holder);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[BREAK-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.audio.lowest({
        folderName: ".temp/audio",
        outputFormat: "flac",
        query: "sQEgklEwhSo",
        stream: true,
      });
      if (holder.stream && holder.filename) {
        await holder.stream
          .pipe(fs.createWriteStream(holder.filename))
          .on("open", () => {
            console.log(colors.bold.green("@info:"), "writestream opened.");
          })
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
  // =========================[BREAK-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.audio.lowest({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: ".temp/audio",
        outputFormat: "aiff",
        filter: "bassboost",
        stream: true,
      });
      if (holder.stream && holder.filename) {
        await holder.stream
          .pipe(fs.createWriteStream(holder.filename))
          .on("open", () => {
            console.log(colors.bold.green("@info:"), "writestream opened.");
          })
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
