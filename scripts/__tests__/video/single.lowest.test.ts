import * as fs from "fs";
import ytdlx from "../..";
import fsx from "fs-extra";
import colors from "colors";
import * as chai from "chai";

async function AutoDownloadTest() {
  try {
    let holder: any;
    console.log(colors.bold.yellow("\n@test:"), "ytdlx.video.single.lowest()");
    console.log(colors.bold.yellow("@info:"), "stream: false");
    holder = await ytdlx.video.single.lowest({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "mp4",
      folderName: "video",
      stream: false,
    });
    switch (true) {
      case "status" in holder:
        chai.expect(holder.status).to.equal(200);
        console.log(
          colors.bold.green("@pass:"),
          `with status ${holder.status}`
        );
        await fsx.remove("video");
        break;
      default:
        console.error("\n", colors.bold.red("@error:"), holder);
        await fsx.remove("video");
        process.exit(0);
    }
    console.log(colors.bold.yellow("\n@test:"), "ytdlx.video.single.lowest()");
    console.log(colors.bold.yellow("@info:"), "stream: false");
    holder = await ytdlx.video.single.lowest({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "mov",
      filter: "grayscale",
      folderName: "video",
      stream: false,
    });
    switch (true) {
      case "status" in holder:
        chai.expect(holder.status).to.equal(200);
        console.log(
          colors.bold.green("@pass:"),
          `with status ${holder.status}`
        );
        await fsx.remove("video");
        break;
      default:
        console.error("\n", colors.bold.red("@error:"), holder);
        await fsx.remove("video");
        process.exit(0);
    }
  } catch (error) {
    console.error("\n", colors.bold.red("@error:"), error);
    await fsx.remove("video");
  }
}
async function StreamingTest() {
  try {
    let holder: any;
    console.log(colors.bold.yellow("\n@test:"), "ytdlx.video.single.lowest()");
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytdlx.video.single.lowest({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "avi",
      folderName: "video",
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
        await fsx.remove("video");
        break;
      default:
        console.error("\n", colors.bold.red("@error:"), holder);
        await fsx.remove("video");
        process.exit(0);
    }

    console.log(colors.bold.yellow("\n@test:"), "ytdlx.video.single.lowest()");
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytdlx.video.single.lowest({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "mp4",
      filter: "invert",
      folderName: "video",
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
        await fsx.remove("video");
        break;
      default:
        console.error("\n", colors.bold.red("@error:"), holder);
        await fsx.remove("video");
        process.exit(0);
    }
  } catch (error) {
    console.error("\n", colors.bold.red("@error:"), error);
    await fsx.remove("video");
  }
}
(async () => {
  console.log(colors.bold.blue("@test type:"), "AutoDownloadTest()");
  await AutoDownloadTest();
  console.log(colors.bold.blue("@test type:"), "StreamingTest()");
  await StreamingTest();
})();
