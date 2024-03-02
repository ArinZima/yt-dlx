import * as fs from "fs";
import ytdlx from "../..";
import colors from "colors";
import * as async from "async";

let holder: any;
async.series([
  async () => {
    try {
      holder = await ytdlx.audio.custom({
        folderName: ".temp/audio",
        query: "sQEgklEwhSo",
        outputFormat: "ogg",
        quality: "medium",
        stream: false,
      });
      console.log(colors.bold.green("@pass:"), true);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[BREAK-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.audio.custom({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: ".temp/audio",
        outputFormat: "mp3",
        filter: "nightcore",
        quality: "medium",
        stream: false,
      });
      console.log(colors.bold.green("@pass:"), true);
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[BREAK-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.audio.custom({
        folderName: ".temp/audio",
        outputFormat: "flac",
        query: "sQEgklEwhSo",
        quality: "medium",
        stream: true,
      });
      await holder.stream.pipe(fs.createWriteStream(holder.filename));
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[BREAK-TEST]=========================
  async () => {
    try {
      holder = await ytdlx.audio.custom({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: ".temp/audio",
        outputFormat: "aiff",
        filter: "bassboost",
        quality: "medium",
        stream: true,
      });
      await holder.stream.pipe(fs.createWriteStream(holder.filename));
    } catch (error: any) {
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
]);
