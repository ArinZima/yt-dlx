import * as fs from "fs";
import ytdlx from "../..";
import fsx from "fs-extra";
import colors from "colors";
import * as bun from "bun:test";
// =======================================================[PASS-TEST]=======================================================
bun.test(colors.blue("\n\n@tesing: ") + "AutoDownloadTest()", async () => {
  try {
    let holder: any;
    console.log(colors.bold.yellow("@test:"), "ytdlx.audio.single.custom()");
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
    } else {
      await fsx.remove("audio");
      throw (colors.bold.red("@error:"), holder);
    }
    console.log(colors.bold.yellow("@test:"), "ytdlx.audio.single.custom()");
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
    } else {
      await fsx.remove("audio");
      throw (colors.bold.red("@error:"), holder);
    }
  } catch (error) {
    await fsx.remove("audio");
    throw (colors.bold.red("@error:"), error);
  }
});
// =======================================================[PASS-TEST]=======================================================
bun.test(colors.blue("\n\n@tesing: ") + "StreamingTest()", async () => {
  try {
    let holder: any;
    console.log(colors.bold.yellow("@test:"), "ytdlx.audio.single.custom()");
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
    } else {
      await fsx.remove("audio");
      throw (colors.bold.red("@error:"), holder);
    }
    console.log(colors.bold.yellow("@test:"), "ytdlx.audio.single.custom()");
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
    } else {
      await fsx.remove("audio");
      throw (colors.bold.red("@error:"), holder);
    }
  } catch (error) {
    await fsx.remove("audio");
    throw (colors.bold.red("@error:"), error);
  }
});
