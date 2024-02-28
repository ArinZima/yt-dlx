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
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "ogg",
      quality: "medium",
      folderName: "audio",
      stream: false,
    });
    switch (true) {
      case "status" in holder:
        chai.expect(holder.status).to.equal(200);
        console.log(
          colors.bold.green("@pass:"),
          `with status ${holder.status}`
        );
        await fsx.remove("audio");
        break;
      default:
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
    switch (true) {
      case "status" in holder:
        chai.expect(holder.status).to.equal(200);
        console.log(
          colors.bold.green("@pass:"),
          `with status ${holder.status}`
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
// =======================================================[PASS-TEST]=======================================================
bun.test(colors.blue("\n\n@tesing: ") + "StreamingTest()", async () => {
  try {
    let holder: any;
    console.log(colors.bold.yellow("@test:"), "ytdlx.audio.single.custom()");
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytdlx.audio.single.custom({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "flac",
      quality: "medium",
      folderName: "audio",
      stream: true,
    });
    switch (true) {
      case "stream" in holder && "filename" in holder:
        chai.expect(holder.stream && holder.filename).to.exist;
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
    switch (true) {
      case "stream" in holder && "filename" in holder:
        chai.expect(holder.stream && holder.filename).to.exist;
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
