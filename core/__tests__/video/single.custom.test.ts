import * as fs from "fs";
import async from "async";
import ytDlp from "../..";
import colors from "colors";
import * as chai from "chai";

(async () => {
  let metaTube;
  try {
    await async.auto({
      runTest: async () => {
        console.log(
          colors.bold.yellow("\n\nTEST: ") +
            "<( ytDlp.video.single.custom({ " +
            colors.italic.yellow(
              "query: 'SuaeRys5tTc', outputFormat: 'mp4', folderName: 'temp', quality: '720p', stream: false"
            ) +
            " })>"
        );
        metaTube = await ytDlp.video.single.custom({
          query: "SuaeRys5tTc",
          outputFormat: "mp4",
          folderName: "temp",
          quality: "720p",
          stream: false,
        });
        switch (true) {
          case "status" in metaTube:
            chai.expect(metaTube.status).to.equal(200);
            console.log(
              colors.bold.green("\nPASS: ") +
                "<( ytDlp.video.single.custom({ " +
                colors.italic.green(
                  "query: 'SuaeRys5tTc', outputFormat: 'mp4', folderName: 'temp', quality: '720p', stream: false"
                ) +
                " })>"
            );
            break;
          default:
            console.error(
              "\n",
              new Date().toLocaleString(),
              colors.bold.red("ERROR:"),
              metaTube
            );
            process.exit(1);
        }
      },
    });
    await async.auto({
      runTest: async () => {
        console.log(
          colors.bold.yellow("\n\nTEST: ") +
            "<( ytDlp.video.single.custom({ " +
            colors.italic.yellow(
              "query: 'SuaeRys5tTc', filter: 'grayscale', outputFormat: 'mp4', folderName: 'temp', quality: '720p', stream: true"
            ) +
            " })>"
        );
        metaTube = await ytDlp.video.single.custom({
          query: "SuaeRys5tTc",
          filter: "grayscale",
          outputFormat: "mp4",
          folderName: "temp",
          quality: "720p",
          stream: true,
        });
        switch (true) {
          case "stream" in metaTube && "filename" in metaTube:
            chai.expect(metaTube.stream && metaTube.filename).to.exist;
            metaTube.stream.pipe(fs.createWriteStream(metaTube.filename));
            console.log(
              colors.bold.green("\nPASS: ") +
                "<( ytDlp.video.single.custom({ " +
                colors.italic.green(
                  "query: 'SuaeRys5tTc', filter: 'grayscale', outputFormat: 'mp4', folderName: 'temp', quality: '720p', stream: true"
                ) +
                " })>"
            );
            break;
          default:
            console.error(
              "\n",
              new Date().toLocaleString(),
              colors.bold.red("ERROR:"),
              metaTube
            );
            process.exit(1);
        }
      },
    });
  } catch (metaError) {
    console.error(metaError);
    process.exit(1);
  }
})();
