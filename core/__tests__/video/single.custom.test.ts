import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

let holder: any;

async.series([
  async () => {
    try {
      holder = await ytdlx.video.single.custom({
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
      holder = await ytdlx.video.single.custom({
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
      holder = await ytdlx.video.single.custom({
        folderName: ".temp/video",
        query: "sQEgklEwhSo",
        outputFormat: "avi",
        quality: "720p",
        stream: true,
      });
      if (holder.stream && holder.filename) {
        const writeStream = fs.createWriteStream(holder.filename);
        writeStream.on("open", () => {
          console.log(colors.bold.green("@info:"), "writestream opened.");
        });
        writeStream.on("error", (err) => {
          console.error(colors.bold.red("@error:"), "writestream", err.message);
        });
        writeStream.on("finish", () => {
          console.log(colors.bold.green("@pass:"), "filename", holder.filename);
        });
        holder.stream.pipe(writeStream);
      } else throw new Error(colors.bold.red("@error:"), holder);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[BREAK-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.video.single.custom({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: ".temp/video",
        outputFormat: "mp4",
        filter: "invert",
        quality: "720p",
        stream: true,
      });
      if (holder.stream && holder.filename) {
        const writeStream = fs.createWriteStream(holder.filename);
        writeStream.on("open", () => {
          console.log(colors.bold.green("@info:"), "writestream opened.");
        });
        writeStream.on("error", (err) => {
          console.error(colors.bold.red("@error:"), "writestream", err.message);
        });
        writeStream.on("finish", () => {
          console.log(colors.bold.green("@pass:"), "filename", holder.filename);
        });
        holder.stream.pipe(writeStream);
      } else throw new Error(colors.bold.red("@error:"), holder);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
]);
