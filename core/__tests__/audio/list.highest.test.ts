// import * as fs from "fs";
import async from "async";
import ytDlp from "../..";
import colors from "colors";
import * as chai from "chai";

const playlistUrls = [
  "https://youtube.com/playlist?list=PL2vrmw2gup2Jre1MK2FL72rQkzbQzFnFM&si=RW12dM2je3XvbH2g",
];
(async () => {
  let metaTube;
  try {
    await async.auto({
      runTest: async () => {
        console.log(
          colors.bold.yellow("\n\nTEST: ") +
            "<( ytDlp.audio.playlist.highest({ " +
            colors.italic.yellow(
              "playlistUrls: [''], outputFormat: 'mp3', folderName: 'temp', stream: false"
            ) +
            " })>"
        );
        metaTube = await ytDlp.audio.playlist.highest({
          outputFormat: "mp3",
          folderName: "temp",
          stream: false,
          playlistUrls,
        });
        switch (true) {
          case "status" in metaTube:
            chai.expect(metaTube.status).to.equal(200);
            console.log(
              colors.bold.green("\nPASS: ") +
                "<( ytDlp.audio.playlist.highest({ " +
                colors.italic.green(
                  "playlistUrls: [''], outputFormat: 'mp3', folderName: 'temp', stream: false"
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
    // await async.auto({
    // runTest: async () => {
    // console.log(
    // colors.bold.yellow("\n\nTEST: ") +
    // "<( ytDlp.audio.playlist.highest({ " +
    // colors.italic.yellow(
    // "playlistUrls: [''], filter: 'superspeed', outputFormat: 'mp3', folderName: 'temp', stream: true"
    // ) +
    // " })>"
    // );
    // metaTube = await ytDlp.audio.playlist.highest({
    // filter: "superspeed",
    // outputFormat: "mp3",
    // folderName: "temp",
    // stream: true,
    // playlistUrls,
    // });
    // switch (true) {
    // case "stream" in metaTube && "filename" in metaTube:
    // chai.expect(metaTube.stream && metaTube.filename).to.exist;
    // metaTube.stream.pipe(fs.createWriteStream(metaTube.filename));
    // console.log(
    // colors.bold.green("\nPASS: ") +
    // "<( ytDlp.audio.playlist.highest({ " +
    // colors.italic.green(
    // "playlistUrls: [''], filter: 'superspeed', outputFormat: 'mp3', folderName: 'temp', stream: true"
    // ) +
    // " })>"
    // );
    // break;
    // default:
    // console.error(
    // "\n",
    // new Date().toLocaleString(),
    // colors.bold.red("ERROR:"),
    // metaTube
    // );
    // process.exit(1);
    // }
    // },
    // });
  } catch (metaError) {
    console.error(metaError);
    process.exit(1);
  }
})();
