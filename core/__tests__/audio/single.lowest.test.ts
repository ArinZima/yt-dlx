import * as fs from "fs";
import ytdlx from "../..";
import fsx from "fs-extra";
import colors from "colors";
import * as bun from "bun:test";
// =======================================================[PASS-TEST]=======================================================
bun.test(colors.blue("\n\n@tesing: ") + "AutoDownloadTest()", async () => {
  try {
    let holder: any;
    console.log(colors.bold.yellow("@test:"), "ytdlx.audio.single.lowest()");
    console.log(colors.bold.yellow("@info:"), "stream: false");
    holder = await ytdlx.audio.single.lowest({
      query: "sQEgklEwhSo",
      outputFormat: "ogg",
      folderName: "audio",
      stream: false,
    });
    switch (true) {
      case holder:
        console.log(colors.bold.green("@pass"));
        await fsx.remove("audio");
        break;
      default:
        await fsx.remove("audio");
        throw (colors.bold.red("@error:"), holder);
    }
    console.log(colors.bold.yellow("@test:"), "ytdlx.audio.single.lowest()");
    console.log(colors.bold.yellow("@info:"), "stream: false");
    holder = await ytdlx.audio.single.lowest({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "mp3",
      filter: "nightcore",
      folderName: "audio",
      stream: false,
    });
    switch (true) {
      case holder:
        console.log(colors.bold.green("@pass"));
        await fsx.remove("audio");
        break;
      default:
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
    console.log(colors.bold.yellow("@test:"), "ytdlx.audio.single.lowest()");
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytdlx.audio.single.lowest({
      query: "sQEgklEwhSo",
      outputFormat: "flac",
      folderName: "audio",
      stream: true,
    });
    switch (true) {
      case "stream" in holder && "filename" in holder:
        holder.stream.pipe(fs.createWriteStream(holder.filename));
        console.log(
          colors.bold.green("@pass:"),
          `with filename ${holder.filename}`
        );
        await fsx.remove("audio");
        break;
      default:
        await fsx.remove("audio");
        throw (colors.bold.red("@error:"), holder);
    }

    console.log(colors.bold.yellow("@test:"), "ytdlx.audio.single.lowest()");
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytdlx.audio.single.lowest({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "aiff",
      filter: "bassboost",
      folderName: "audio",
      stream: true,
    });
    switch (true) {
      case "stream" in holder && "filename" in holder:
        holder.stream.pipe(fs.createWriteStream(holder.filename));
        console.log(
          colors.bold.green("@pass:"),
          `with filename ${holder.filename}`
        );
        await fsx.remove("audio");
        break;
      default:
        await fsx.remove("audio");
        throw (colors.bold.red("@error:"), holder);
    }
  } catch (error) {
    await fsx.remove("audio");
    throw (colors.bold.red("@error:"), error);
  }
});
