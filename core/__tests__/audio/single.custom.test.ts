import * as fs from "fs";
import ytdlx from "../..";
import fsx from "fs-extra";
import colors from "colors";
import * as async from "async";

let holder: any;
async.series([
  async function () {
    try {
      holder = await ytdlx.audio.single.custom({
        folderName: ".temp/audio",
        query: "sQEgklEwhSo",
        outputFormat: "ogg",
        quality: "medium",
        stream: false,
      });
      if (holder) {
        console.log(colors.bold.green("@pass:"), holder);
        await fsx.remove("audio");
        return holder;
      } else {
        await fsx.remove("audio");
        throw new Error(colors.bold.red("@error:"), holder);
      }
    } catch (error: any) {
      await fsx.remove("audio");
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[BREAK-TEST]=========================
  async function () {
    try {
      holder = await ytdlx.audio.single.custom({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: ".temp/audio",
        outputFormat: "mp3",
        filter: "nightcore",
        quality: "medium",
        stream: false,
      });
      if (holder) {
        console.log(colors.bold.green("@pass:"), holder);
        await fsx.remove("audio");
        return holder;
      } else {
        await fsx.remove("audio");
        throw new Error(colors.bold.red("@error:"), holder);
      }
    } catch (error: any) {
      await fsx.remove("audio");
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[BREAK-TEST]=========================
  async function () {
    try {
      holder = await ytdlx.audio.single.custom({
        folderName: ".temp/audio",
        outputFormat: "flac",
        query: "sQEgklEwhSo",
        quality: "medium",
        stream: true,
      });
      if (holder.stream && holder.filename) {
        holder.stream.pipe(fs.createWriteStream(holder.filename));
        console.log(colors.bold.green("@pass:"), holder.filename);
        await fsx.remove("audio");
        return holder;
      } else {
        await fsx.remove("audio");
        throw new Error(colors.bold.red("@error:"), holder);
      }
    } catch (error: any) {
      await fsx.remove("audio");
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[BREAK-TEST]=========================
  async function () {
    try {
      holder = await ytdlx.audio.single.custom({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: ".temp/audio",
        outputFormat: "aiff",
        filter: "bassboost",
        quality: "medium",
        stream: true,
      });
      if (holder.stream && holder.filename) {
        holder.stream.pipe(fs.createWriteStream(holder.filename));
        console.log(colors.bold.green("@pass:"), holder.filename);
        await fsx.remove("audio");
        return holder;
      } else {
        await fsx.remove("audio");
        throw new Error(colors.bold.red("@error:"), holder);
      }
    } catch (error: any) {
      await fsx.remove("audio");
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
]);
