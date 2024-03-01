import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

let holder: any;

async.series([
  async () => {
    try {
      holder = await ytdlx.video.custom({
        folderName: ".temp/video",
        query: "sQEgklEwhSo",
        outputFormat: "mp4",
        quality: "720p",
        stream: false,
      });
      if (holder) console.log(colors.bold.green("@pass:"), holder);
      else throw new Error(colors.bold.red("@error:"), holder);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[BREAK-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.video.custom({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: ".temp/video",
        outputFormat: "mov",
        filter: "grayscale",
        quality: "720p",
        stream: false,
      });
      if (holder) console.log(colors.bold.green("@pass:"), holder);
      else throw new Error(colors.bold.red("@error:"), holder);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[BREAK-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.video.custom({
        folderName: ".temp/video",
        query: "sQEgklEwhSo",
        outputFormat: "avi",
        quality: "720p",
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
      holder = await ytdlx.video.custom({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: ".temp/video",
        outputFormat: "mp4",
        filter: "invert",
        quality: "720p",
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
