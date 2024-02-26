// import async from "async";
// import colors from "colors";
// import ytdlx_web from "./web/ytdlx_web";
// let metaTube: any;
// async.waterfall([
// async function runTest() {
// metaTube = await ytdlx_web.webPlaylist({
// playlistLink:
// "https://youtube.com/playlist?list=PL3oW2tjiIxvQ60uIjLdo7vrUe4ukSpbKl&si=Z6SMzOT_2xNMfGlg",
// });
// console.log(colors.magenta("@total-views:"), metaTube.views);
// console.log(colors.magenta("@count:"), metaTube.videos.length);
// return metaTube;
// },
// async function runTest(metaTube: any) {
// metaTube = await ytdlx_web.webSearch({
// query: metaTube.videos[0].title,
// });
// console.log(colors.blue("@count:"), metaTube.length);
// return metaTube;
// },
// async function runTest(metaTube: any) {
// const videoData = await ytdlx_web.webVideo({
// videoLink: metaTube[0].videoLink,
// });
// console.log(colors.green("@video:"), videoData);
// return videoData;
// },
// ]);

import colors from "colors";
import ytdlx_web from "./web/ytdlx_web";

(async () => {
  const videoData = await ytdlx_web.webVideo({
    videoLink: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
  });
  console.log(colors.green("@video:"), videoData);
})();
