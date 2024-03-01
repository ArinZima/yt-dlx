import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

let holder: any;
async.series([
  async () => {
    try {
      holder = await ytdlx.audio_video.highest({
        folderName: "audio_video",
        query: "sQEgklEwhSo",
        outputFormat: "avi",
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
      holder = await ytdlx.audio_video.highest({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: "audio_video",
        outputFormat: "mov",
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
      holder = await ytdlx.audio_video.highest({
        folderName: "audio_video",
        query: "sQEgklEwhSo",
        outputFormat: "webm",
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
      holder = await ytdlx.audio_video.highest({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: "audio_video",
        outputFormat: "webm",
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
]);
