import * as fs from "fs";
import ytDlp from "../..";
// import fsx from "fs-extra";
import colors from "colors";
import * as chai from "chai";

async function AutoDownloadTest() {
  try {
    let holder: any;
    console.log(
      colors.bold.yellow("@test:"),
      "ytDlp.audio_video.single.highest()"
    );
    console.log(colors.bold.yellow("@info:"), "stream: false");
    holder = await ytDlp.audio_video.single.highest({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "mp4",
      folderName: "mix",
      stream: false,
    });
    switch (true) {
      case "status" in holder:
        chai.expect(holder.status).to.equal(200);
        console.log(
          colors.bold.green("\n@pass:"),
          `with status ${holder.status}`
        );
        // await fsx.remove("mix");
        break;
      default:
        console.error("\n", colors.bold.red("\n@error:"), holder);
        // await fsx.remove("mix");
        process.exit(0);
    }
    console.log(
      colors.bold.yellow("@test:"),
      "ytDlp.audio_video.single.highest()"
    );
    console.log(colors.bold.yellow("@info:"), "stream: false");
    holder = await ytDlp.audio_video.single.highest({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "mov",
      folderName: "mix",
      stream: false,
    });
    switch (true) {
      case "status" in holder:
        chai.expect(holder.status).to.equal(200);
        console.log(
          colors.bold.green("\n@pass:"),
          `with status ${holder.status}`
        );
        // await fsx.remove("mix");
        break;
      default:
        console.error("\n", colors.bold.red("\n@error:"), holder);
        // await fsx.remove("mix");
        process.exit(0);
    }
  } catch (error) {
    console.error("\n", colors.bold.red("\n@error:"), error);
    // await fsx.remove("mix");
  }
}
async function StreamingTest() {
  try {
    let holder: any;
    console.log(
      colors.bold.yellow("@test:"),
      "ytDlp.audio_video.single.highest()"
    );
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytDlp.audio_video.single.highest({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "avi",
      folderName: "mix",
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
        // await fsx.remove("mix");
        break;
      default:
        console.error("\n", colors.bold.red("\n@error:"), holder);
        // await fsx.remove("mix");
        process.exit(0);
    }

    console.log(
      colors.bold.yellow("@test:"),
      "ytDlp.audio_video.single.highest()"
    );
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytDlp.audio_video.single.highest({
      query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
      outputFormat: "mp4",
      folderName: "mix",
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
        // await fsx.remove("mix");
        break;
      default:
        console.error("\n", colors.bold.red("\n@error:"), holder);
        // await fsx.remove("mix");
        process.exit(0);
    }
  } catch (error) {
    console.error("\n", colors.bold.red("\n@error:"), error);
    // await fsx.remove("mix");
  }
}

(async () => {
  console.log(colors.bold.blue("\n@test type:"), "AutoDownloadTest()");
  await AutoDownloadTest();
  console.log(colors.bold.blue("\n@test type:"), "StreamingTest()");
  await StreamingTest();
})();
