import ytDlp from "..";
import * as fs from "fs";
import colors from "colors";
import * as chai from "chai";

async function AutoDownload() {
  let TestTube: any;
  console.log(colors.bold.yellow("\n\n@test:"));
  TestTube = await ytDlp.audio.single.highest({
    query: "SuaeRys5tTc",
    outputFormat: "mp3",
    folderName: "temp",
    stream: false,
  });
  switch (true) {
    case "status" in TestTube:
      chai.expect(TestTube.status).to.equal(200);
      console.log(colors.bold.green("\n@pass:"));
      break;
    default:
      console.error("\n", colors.bold.red("@error:"), TestTube);
      process.exit(0);
  }
}

async function ManualDownload() {
  let TestTube: any;
  console.log(colors.bold.yellow("\n\n@test:"));
  TestTube = await ytDlp.audio.single.highest({
    query: "SuaeRys5tTc",
    outputFormat: "mp3",
    folderName: "temp",
    stream: true,
  });
  switch (true) {
    case "stream" in TestTube && "filename" in TestTube:
      chai.expect(TestTube.stream && TestTube.filename).to.exist;
      TestTube.stream.pipe(fs.createWriteStream(TestTube.filename));
      console.log(colors.bold.green("\n@pass:"));
      break;
    default:
      console.error("\n", colors.bold.red("@error:"), TestTube);
      process.exit(0);
  }
}
