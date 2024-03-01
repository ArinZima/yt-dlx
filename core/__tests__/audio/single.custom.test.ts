import * as fs from "fs";
import ytdlx from "../..";
import fsx from "fs-extra";
import colors from "colors";
import async from "async";

async.series(
  [
    async function (callback) {
      try {
        let holder: any;
        console.log(
          colors.bold.yellow("@test:"),
          "ytdlx.audio.single.custom()"
        );
        console.log(colors.bold.yellow("@info:"), "stream: false");
        holder = await ytdlx.audio.single.custom({
          query: "sQEgklEwhSo",
          outputFormat: "ogg",
          quality: "medium",
          folderName: "audio",
          stream: false,
        });
        if (holder) {
          console.log(colors.bold.green("@pass:"), holder);
          await fsx.remove("audio");
          callback(null, holder);
        } else {
          await fsx.remove("audio");
          callback(new Error(colors.bold.red("@error:"), holder));
        }
      } catch (error: any) {
        await fsx.remove("audio");
        callback(error);
      }
    },
    // =======================================================[BREAK-TEST]=======================================================
    async function (callback) {
      try {
        let holder: any;
        console.log(
          colors.bold.yellow("@test:"),
          "ytdlx.audio.single.custom()"
        );
        console.log(colors.bold.yellow("@info:"), "stream: false");
        holder = await ytdlx.audio.single.custom({
          query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
          outputFormat: "mp3",
          filter: "nightcore",
          quality: "medium",
          folderName: "audio",
          stream: false,
        });
        if (holder) {
          console.log(colors.bold.green("@pass:"), holder);
          await fsx.remove("audio");
          callback(null, holder);
        } else {
          await fsx.remove("audio");
          callback(new Error(colors.bold.red("@error:"), holder));
        }
      } catch (error: any) {
        await fsx.remove("audio");
        callback(error);
      }
    },
    // =======================================================[BREAK-TEST]=======================================================
    async function (callback) {
      try {
        let holder: any;
        console.log(
          colors.bold.yellow("@test:"),
          "ytdlx.audio.single.custom()"
        );
        console.log(colors.bold.yellow("@info:"), "stream: true");
        holder = await ytdlx.audio.single.custom({
          query: "sQEgklEwhSo",
          outputFormat: "flac",
          quality: "medium",
          folderName: "audio",
          stream: true,
        });
        if (holder.stream && holder.filename) {
          holder.stream.pipe(fs.createWriteStream(holder.filename));
          console.log(colors.bold.green("@pass:"), holder.filename);
          await fsx.remove("audio");
          callback(null, holder);
        } else {
          await fsx.remove("audio");
          callback(new Error(colors.bold.red("@error:"), holder));
        }
      } catch (error: any) {
        await fsx.remove("audio");
        callback(error);
      }
    },
    // =======================================================[BREAK-TEST]=======================================================
    async function (callback) {
      try {
        let holder: any;
        console.log(
          colors.bold.yellow("@test:"),
          "ytdlx.audio.single.custom()"
        );
        console.log(colors.bold.yellow("@info:"), "stream: true");
        holder = await ytdlx.audio.single.custom({
          query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
          outputFormat: "aiff",
          filter: "bassboost",
          quality: "medium",
          folderName: "audio",
          stream: true,
        });
        if (holder.stream && holder.filename) {
          holder.stream.pipe(fs.createWriteStream(holder.filename));
          console.log(colors.bold.green("@pass:"), holder.filename);
          await fsx.remove("audio");
          callback(null, holder);
        } else {
          await fsx.remove("audio");
          callback(new Error(colors.bold.red("@error:"), holder));
        }
      } catch (error: any) {
        await fsx.remove("audio");
        callback(error);
      }
    },
  ],
  function (err) {
    if (err) {
      throw new Error(colors.bold.red("@error:"), err);
    }
  }
);
