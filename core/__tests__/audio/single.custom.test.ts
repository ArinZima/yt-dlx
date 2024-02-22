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
            "<( ytDlp.audio.single.custom({ " +
            colors.italic.yellow(
              "query: 'SuaeRys5tTc', outputFormat: 'mp3', folderName: 'temp', quality: 'medium', stream: false"
            ) +
            " })>"
        );
        metaTube = await ytDlp.audio.single.custom({
          query: "SuaeRys5tTc",
          outputFormat: "mp3",
          folderName: "temp",
          quality: "medium",
          stream: false,
        });
        switch (true) {
          case "status" in metaTube:
            chai.expect(metaTube.status).to.equal(200);
            console.log(
              colors.bold.green("\nPASS: ") +
                "<( ytDlp.audio.single.custom({ " +
                colors.italic.green(
                  "query: 'SuaeRys5tTc', outputFormat: 'mp3', folderName: 'temp', quality: 'medium', stream: false"
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
            "<( ytDlp.audio.single.custom({ " +
            colors.italic.yellow(
              "query: 'SuaeRys5tTc', filter: 'superspeed', outputFormat: 'mp3', folderName: 'temp', quality: 'medium', stream: true"
            ) +
            " })>"
        );
        metaTube = await ytDlp.audio.single.custom({
          query: "SuaeRys5tTc",
          filter: "superspeed",
          outputFormat: "mp3",
          folderName: "temp",
          quality: "medium",
          stream: true,
        });
        switch (true) {
          case "stream" in metaTube && "filename" in metaTube:
            chai.expect(metaTube.stream && metaTube.filename).to.exist;
            metaTube.stream.pipe(fs.createWriteStream(metaTube.filename));
            console.log(
              colors.bold.green("\nPASS: ") +
                "<( ytDlp.audio.single.custom({ " +
                colors.italic.green(
                  "query: 'SuaeRys5tTc', filter: 'superspeed', outputFormat: 'mp3', folderName: 'temp', quality: 'medium', stream: true"
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
