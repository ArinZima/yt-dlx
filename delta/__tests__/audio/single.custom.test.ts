import * as fs from "fs";
import ytDlp from "../..";
import fsx from "fs-extra";
import colors from "colors";
import * as chai from "chai";

async function AutoDownloadTest() {
  try {
    let holder: any;
    console.log(colors.bold.yellow("@test:"), "ytDlp.audio.single.custom()");
    console.log(colors.bold.yellow("@info:"), "stream: false");
    holder = await ytDlp.audio.single.custom({
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
          colors.bold.green("\n@pass:"),
          `with status ${holder.status}`
        );
        await fsx.remove("audio");
        break;
      default:
        console.error("\n", colors.bold.red("\n@error:"), holder);
        await fsx.remove("audio");
        process.exit(0);
    }
    console.log(colors.bold.yellow("@test:"), "ytDlp.audio.single.custom()");
    console.log(colors.bold.yellow("@info:"), "stream: false");
    holder = await ytDlp.audio.single.custom({
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
          colors.bold.green("\n@pass:"),
          `with status ${holder.status}`
        );
        await fsx.remove("audio");
        break;
      default:
        console.error("\n", colors.bold.red("\n@error:"), holder);
        await fsx.remove("audio");
        process.exit(0);
    }
  } catch (error) {
    console.error("\n", colors.bold.red("\n@error:"), error);
    await fsx.remove("audio");
  }
}
async function StreamingTest() {
  try {
    let holder: any;
    console.log(colors.bold.yellow("@test:"), "ytDlp.audio.single.custom()");
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytDlp.audio.single.custom({
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
          colors.bold.green("\n@pass:"),
          `with filename ${holder.filename}`
        );
        await fsx.remove("audio");
        break;
      default:
        console.error("\n", colors.bold.red("\n@error:"), holder);
        await fsx.remove("audio");
        process.exit(0);
    }

    console.log(colors.bold.yellow("@test:"), "ytDlp.audio.single.custom()");
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytDlp.audio.single.custom({
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
          colors.bold.green("\n@pass:"),
          `with filename ${holder.filename}`
        );
        await fsx.remove("audio");
        break;
      default:
        console.error("\n", colors.bold.red("\n@error:"), holder);
        await fsx.remove("audio");
        process.exit(0);
    }
  } catch (error) {
    console.error("\n", colors.bold.red("\n@error:"), error);
    await fsx.remove("audio");
  }
}

(async () => {
  console.log(colors.bold.blue("\n@test type:"), "AutoDownloadTest()");
  await AutoDownloadTest();
  console.log(colors.bold.blue("\n@test type:"), "StreamingTest()");
  await StreamingTest();
})();
