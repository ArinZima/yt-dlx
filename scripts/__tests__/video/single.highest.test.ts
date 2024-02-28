import * as fs from "fs";
import ytdlx from "../..";
import fsx from "fs-extra";
import colors from "colors";
import * as bun from "bun:test";
import * as vitest from "vitest";
// =======================================================[PASS-TEST]=======================================================
bun.test(colors.blue("\n\n@tesing: ") + "AutoDownloadTest()", async () => {
  try {
    let holder: any;
    console.log(colors.bold.yellow("@test:"), "ytdlx.video.single.highest()");
    console.log(colors.bold.yellow("@info:"), "stream: false");
    holder = await ytdlx.video.single.highest({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "mp4",
      folderName: "video",
      stream: false,
    });
    switch (true) {
      case "status" in holder:
        vitest.expect(holder.status).to.equal(200);
        console.log(
          colors.bold.green("@pass:"),
          `with status ${holder.status}`
        );
        await fsx.remove("video");
        break;
      default:
        await fsx.remove("video");
        throw (colors.bold.red("@error:"), holder);
    }
    console.log(colors.bold.yellow("@test:"), "ytdlx.video.single.highest()");
    console.log(colors.bold.yellow("@info:"), "stream: false");
    holder = await ytdlx.video.single.highest({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "mov",
      filter: "grayscale",
      folderName: "video",
      stream: false,
    });
    switch (true) {
      case "status" in holder:
        vitest.expect(holder.status).to.equal(200);
        console.log(
          colors.bold.green("@pass:"),
          `with status ${holder.status}`
        );
        await fsx.remove("video");
        break;
      default:
        await fsx.remove("video");
        throw (colors.bold.red("@error:"), holder);
    }
  } catch (error) {
    await fsx.remove("video");
    throw (colors.bold.red("@error:"), error);
  }
});
// =======================================================[PASS-TEST]=======================================================
bun.test(colors.blue("\n\n@tesing: ") + "StreamingTest()", async () => {
  try {
    let holder: any;
    console.log(colors.bold.yellow("@test:"), "ytdlx.video.single.highest()");
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytdlx.video.single.highest({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "avi",
      folderName: "video",
      stream: true,
    });
    switch (true) {
      case "stream" in holder && "filename" in holder:
        vitest.expect(holder.stream && holder.filename).to.exist;
        holder.stream.pipe(fs.createWriteStream(holder.filename));
        console.log(
          colors.bold.green("@pass:"),
          `with filename ${holder.filename}`
        );
        await fsx.remove("video");
        break;
      default:
        await fsx.remove("video");
        throw (colors.bold.red("@error:"), holder);
    }

    console.log(colors.bold.yellow("@test:"), "ytdlx.video.single.highest()");
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytdlx.video.single.highest({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "mp4",
      filter: "invert",
      folderName: "video",
      stream: true,
    });
    switch (true) {
      case "stream" in holder && "filename" in holder:
        vitest.expect(holder.stream && holder.filename).to.exist;
        holder.stream.pipe(fs.createWriteStream(holder.filename));
        console.log(
          colors.bold.green("@pass:"),
          `with filename ${holder.filename}`
        );
        await fsx.remove("video");
        break;
      default:
        await fsx.remove("video");
        throw (colors.bold.red("@error:"), holder);
    }
  } catch (error) {
    await fsx.remove("video");
    throw (colors.bold.red("@error:"), error);
  }
});
