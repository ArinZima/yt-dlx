import * as fs from "fs";
import ytdlx from "../..";
import fsx from "fs-extra";
import colors from "colors";
import * as async from "async";

let holder: any;

async.series([
  async function () {
    try {
      holder = await ytdlx.video.single.highest({
        folderName: ".temp/video",
        query: "sQEgklEwhSo",
        outputFormat: "mp4",
        stream: false,
      });
      if (holder) {
        console.log(colors.bold.green("@pass:"), holder);
        await fsx.remove(".temp/video");
      } else {
        await fsx.remove(".temp/video");
        throw (colors.bold.red("@error:"), holder);
      }
    } catch (error: any) {
      await fsx.remove(".temp/audio");
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[BREAK-TEST]=========================
  async function () {
    try {
      holder = await ytdlx.video.single.highest({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: ".temp/video",
        outputFormat: "mov",
        filter: "grayscale",
        stream: false,
      });
      if (holder) {
        console.log(colors.bold.green("@pass:"), holder);
        await fsx.remove(".temp/video");
      } else {
        await fsx.remove(".temp/video");
        throw (colors.bold.red("@error:"), holder);
      }
    } catch (error: any) {
      await fsx.remove(".temp/audio");
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[BREAK-TEST]=========================
  async function () {
    try {
      holder = await ytdlx.video.single.highest({
        folderName: ".temp/video",
        query: "sQEgklEwhSo",
        outputFormat: "avi",
        stream: true,
      });
      if (holder.stream && holder.filename) {
        holder.stream.pipe(fs.createWriteStream(holder.filename));
        console.log(colors.bold.green("@pass:"), holder.filename);
        await fsx.remove(".temp/video");
      } else {
        await fsx.remove(".temp/video");
        throw (colors.bold.red("@error:"), holder);
      }
    } catch (error: any) {
      await fsx.remove(".temp/audio");
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
  // =========================[BREAK-TEST]=========================
  async function () {
    try {
      holder = await ytdlx.video.single.highest({
        query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
        folderName: ".temp/video",
        outputFormat: "mp4",
        filter: "invert",
        stream: true,
      });
      if (holder.stream && holder.filename) {
        holder.stream.pipe(fs.createWriteStream(holder.filename));
        console.log(colors.bold.green("@pass:"), holder.filename);
        await fsx.remove(".temp/video");
      } else {
        await fsx.remove(".temp/video");
        throw (colors.bold.red("@error:"), holder);
      }
    } catch (error: any) {
      await fsx.remove(".temp/audio");
      throw new Error(colors.bold.red("@error:"), error);
    }
  },
]);
