import * as fs from "fs";
import ytDlp from "../..";
import fsx from "fs-extra";
import colors from "colors";
import * as chai from "chai";

async function AutoDownloadTest() {
  try {
    let holder: any;
    console.log(colors.bold.yellow("@test:"), "ytDlp.audio.single.lowest()");
    console.log(colors.bold.yellow("@info:"), "query: SuaeRys5tTc");
    console.log(colors.bold.yellow("@info:"), "outputFormat: mp3");
    console.log(colors.bold.yellow("@info:"), "folderName: temp");
    console.log(colors.bold.yellow("@info:"), "stream: false");
    holder = await ytDlp.audio.single.lowest({
      query: "SuaeRys5tTc",
      outputFormat: "mp3",
      folderName: "temp",
      stream: false,
    });
    switch (true) {
      case "status" in holder:
        chai.expect(holder.status).to.equal(200);
        console.log(
          colors.bold.green("\n@pass:"),
          `with status ${holder.status}`
        );
        await fsx.remove("temp");
        break;
      default:
        console.error("\n", colors.bold.red("\n@error:"), holder);
        await fsx.remove("temp");
        process.exit(0);
    }
    console.log(colors.bold.yellow("@test:"), "ytDlp.audio.single.lowest()");
    console.log(colors.bold.yellow("@info:"), "query: SuaeRys5tTc");
    console.log(colors.bold.yellow("@info:"), "outputFormat: mp3");
    console.log(colors.bold.yellow("@info:"), "filter: nightcore");
    console.log(colors.bold.yellow("@info:"), "folderName: temp");
    console.log(colors.bold.yellow("@info:"), "stream: false");
    holder = await ytDlp.audio.single.lowest({
      query: "SuaeRys5tTc",
      outputFormat: "mp3",
      filter: "nightcore",
      folderName: "temp",
      stream: false,
    });
    switch (true) {
      case "status" in holder:
        chai.expect(holder.status).to.equal(200);
        console.log(
          colors.bold.green("\n@pass:"),
          `with status ${holder.status}`
        );
        await fsx.remove("temp");
        break;
      default:
        console.error("\n", colors.bold.red("\n@error:"), holder);
        await fsx.remove("temp");
        process.exit(0);
    }
  } catch (error) {
    console.error("\n", colors.bold.red("\n@error:"), error);
    await fsx.remove("temp");
  }
}
async function StreamingTest() {
  try {
    let holder: any;
    console.log(colors.bold.yellow("@test:"), "ytDlp.audio.single.lowest()");
    console.log(colors.bold.yellow("@info:"), "query: SuaeRys5tTc");
    console.log(colors.bold.yellow("@info:"), "outputFormat: mp3");
    console.log(colors.bold.yellow("@info:"), "folderName: temp");
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytDlp.audio.single.lowest({
      query: "SuaeRys5tTc",
      outputFormat: "mp3",
      folderName: "temp",
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
        await fsx.remove("temp");
        break;
      default:
        console.error("\n", colors.bold.red("\n@error:"), holder);
        await fsx.remove("temp");
        process.exit(0);
    }

    console.log(colors.bold.yellow("@test:"), "ytDlp.audio.single.lowest()");
    console.log(colors.bold.yellow("@info:"), "query: SuaeRys5tTc");
    console.log(colors.bold.yellow("@info:"), "outputFormat: mp3");
    console.log(colors.bold.yellow("@info:"), "filter: bassboost");
    console.log(colors.bold.yellow("@info:"), "folderName: temp");
    console.log(colors.bold.yellow("@info:"), "stream: true");
    holder = await ytDlp.audio.single.lowest({
      query: "SuaeRys5tTc",
      outputFormat: "mp3",
      filter: "bassboost",
      folderName: "temp",
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
        await fsx.remove("temp");
        break;
      default:
        console.error("\n", colors.bold.red("\n@error:"), holder);
        await fsx.remove("temp");
        process.exit(0);
    }
  } catch (error) {
    console.error("\n", colors.bold.red("\n@error:"), error);
    await fsx.remove("temp");
  }
}
(async () => {
  console.log(colors.bold.blue("\n@test type:"), "AutoDownloadTest()");
  await AutoDownloadTest();
  console.log(colors.bold.blue("\n@test type:"), "StreamingTest()");
  await StreamingTest();
})();
