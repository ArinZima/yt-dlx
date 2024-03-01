// import * as fs from "fs";
// import ytdlx from "../..";
// import fsx from "fs-extra";
// import colors from "colors";
// import * as bun from "bun:test";
// // =======================================================[PASS-TEST]=======================================================
// bun.test(colors.blue("\n\n@tesing: ") + "AutoDownloadTest()", async () => {
// try {
// let holder: any;
// console.log(
// colors.bold.yellow("@test:"),
// "ytdlx.audio_video.single.lowest()"
// );
// console.log(colors.bold.yellow("@info:"), "stream: false");
// holder = await ytdlx.audio_video.single.lowest({
// query: "sQEgklEwhSo",
// outputFormat: "avi",
// folderName: "audio_video",
// stream: false,
// });
// if (holder) {
// console.log(colors.bold.green("@pass:"), holder);
// await fsx.remove("audio_video");
// } else {
// await fsx.remove("audio_video");
// throw (colors.bold.red("@error:"), holder);
// }
// console.log(
// colors.bold.yellow("@test:"),
// "ytdlx.audio_video.single.lowest()"
// );
// console.log(colors.bold.yellow("@info:"), "stream: false");
// holder = await ytdlx.audio_video.single.lowest({
// query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
// outputFormat: "mov",
// folderName: "audio_video",
// stream: false,
// });
// if (holder) {
// console.log(colors.bold.green("@pass:"), holder);
// await fsx.remove("audio_video");
// } else {
// await fsx.remove("audio_video");
// throw (colors.bold.red("@error:"), holder);
// }
// } catch (error) {
// await fsx.remove("audio_video");
// throw (colors.bold.red("@error:"), error);
// }
// });
// // =======================================================[PASS-TEST]=======================================================
// bun.test(colors.blue("\n\n@tesing: ") + "StreamingTest()", async () => {
// try {
// let holder: any;
// console.log(
// colors.bold.yellow("@test:"),
// "ytdlx.audio_video.single.lowest()"
// );
// console.log(colors.bold.yellow("@info:"), "stream: true");
// holder = await ytdlx.audio_video.single.lowest({
// query: "sQEgklEwhSo",
// outputFormat: "webm",
// folderName: "audio_video",
// stream: true,
// });
// if (holder.stream && holder.filename) {
// console.log(colors.bold.green("@pass:"), holder.filename);
// await fsx.remove("audio_video");
// } else {
// await fsx.remove("audio_video");
// throw (colors.bold.red("@error:"), holder);
// }
// console.log(
// colors.bold.yellow("@test:"),
// "ytdlx.audio_video.single.lowest()"
// );
// console.log(colors.bold.yellow("@info:"), "stream: true");
// holder = await ytdlx.audio_video.single.lowest({
// query: "https://youtu.be/sQEgklEwhSo?si=vuiHFaNCpYvMigWq",
// outputFormat: "webm",
// folderName: "audio_video",
// stream: true,
// });
// if (holder.stream && holder.filename) {
// holder.stream.pipe(fs.createWriteStream(holder.filename));
// console.log(colors.bold.green("@pass:"), holder.filename);
// await fsx.remove("audio_video");
// } else {
// await fsx.remove("audio_video");
// throw (colors.bold.red("@error:"), holder);
// }
// } catch (error) {
// await fsx.remove("audio_video");
// throw (colors.bold.red("@error:"), error);
// }
// });
