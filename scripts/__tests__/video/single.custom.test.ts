import * as fs from "fs";
import ytdlx from "../..";
import fsx from "fs-extra";
import colors from "colors";
import * as vitest from "vitest";
// =======================================================[PASS-TEST]=======================================================
vitest.test(colors.blue("\n\n@tesing: ") + "AutoDownloadTest()", async () => {
  try {
    let holder: any;
    console.log(colors.bold.yellow("@test:"), "ytdlx.video.single.custom()");
    console.log(colors.bold.yellow("@info:"), "stream: false");
    holder = await ytdlx.video.single.custom({
      query: "sQEgklEwhSo",
      outputFormat: "mp4",
      quality: "720p",
      folderName: "video",
      stream: false,
    });
    switch (true) {
      case "status" in holder:
        vitest
          .expect(holder.status)
          .to.equal(200)
          .and.satisfy(async () => {
            console.log(
              colors.bold.green("@pass:"),
              `with status ${holder.status}`
            );
            await fsx.remove("video");
          });
        break;
      default:
        await fsx.remove("video");
        throw (colors.bold.red("@error:"), holder);
    }
    console.log(colors.bold.yellow("@test:"), "ytdlx.video.single.custom()");
    console.log(colors.bold.yellow("@info:"), "stream: false");
    holder = await ytdlx.video.single.custom({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "mov",
      filter: "grayscale",
      quality: "720p",
      folderName: "video",
      stream: false,
    });
    switch (true) {
      case "status" in holder:
        vitest
          .expect(holder.status)
          .to.equal(200)
          .and.satisfy(async () => {
            console.log(
              colors.bold.green("@pass:"),
              `with status ${holder.status}`
            );
            await fsx.remove("video");
          });
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
vitest.test(colors.blue("\n\n@tesing: ") + "StreamingTest()", async () => {
  try {
    let holder: any;
    console.log(colors.bold.yellow("@test:"), "ytdlx.video.single.custom()");
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytdlx.video.single.custom({
      query: "sQEgklEwhSo",
      outputFormat: "avi",
      quality: "720p",
      folderName: "video",
      stream: true,
    });
    switch (true) {
      case "stream" in holder && "filename" in holder:
        vitest
          .expect(holder.stream && holder.filename)
          .to.exist.and.satisfy(async () => {
            holder.stream.pipe(fs.createWriteStream(holder.filename));
            console.log(
              colors.bold.green("@pass:"),
              `with filename ${holder.filename}`
            );
            await fsx.remove("video");
          });
        break;
      default:
        await fsx.remove("video");
        throw (colors.bold.red("@error:"), holder);
    }

    console.log(colors.bold.yellow("@test:"), "ytdlx.video.single.custom()");
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytdlx.video.single.custom({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "mp4",
      filter: "invert",
      quality: "720p",
      folderName: "video",
      stream: true,
    });
    switch (true) {
      case "stream" in holder && "filename" in holder:
        vitest
          .expect(holder.stream && holder.filename)
          .to.exist.and.satisfy(async () => {
            holder.stream.pipe(fs.createWriteStream(holder.filename));
            console.log(
              colors.bold.green("@pass:"),
              `with filename ${holder.filename}`
            );
            await fsx.remove("video");
          });
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
