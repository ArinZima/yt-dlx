// console.clear();
// import fs from "fs";
// import async from "async";
// import colors from "colors";
// import tunnel from "tunnel";
// import request from "request";
// import { promisify } from "util";
// import { exec } from "child_process";

// async function proxyIP(url, proxyHost, proxyPort, fileName) {
// const agent = tunnel.httpsOverHttp({
// proxy: {
// host: proxyHost,
// port: proxyPort,
// proxyAuth: "tkklcrpk:wxl11or1x8jq",
// },
// });
// return new Promise((resolve, reject) => {
// const writeStream = fs.createWriteStream(fileName);
// const req = request({
// url,
// agent,
// method: "GET",
// });
// req.on("response", (response) => {
// console.log("Download started:"), response.statusCode;
// });
// req.on("data", (chunk) => {
// writeStream.write(chunk);
// });
// req.on("end", () => {
// writeStream.end();
// resolve();
// });
// req.on("error", (error) => {
// console.error("Download error:", error);
// writeStream.close();
// reject(error);
// });
// });
// }

// async function metaTube(proxy, port) {
// let proLoc =
// "python -m yt_dlp" +
// ` --proxy 'http://tkklcrpk:wxl11or1x8jq@${proxy}:${port}'` +
// " --dump-single-json --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass" +
// " --user-agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'" +
// " 'https://www.youtube.com/watch?v=wWR0VD6qgt8'";
// console.log(colors.green("@cmd:"), proLoc);
// const proc = await promisify(exec)(proLoc);
// if (proc.stderr) throw new Error(proc.stderr.toString());
// const metaTube = JSON.parse(proc.stdout.toString());
// await async.forEach(metaTube.formats, async (ipop) => {
// const rmval = new Set(["storyboard", "Default"]);
// if (rmval.has(ipop.format_note) || ipop.filesize === null) return;
// const reTube = {
// meta_audio: {
// samplerate: ipop.asr,
// channels: ipop.audio_channels,
// codec: ipop.acodec,
// extension: ipop.audio_ext,
// bitrate: ipop.abr,
// },
// meta_video: {
// height: ipop.height,
// width: ipop.width,
// codec: ipop.vcodec,
// resolution: ipop.resolution,
// aspectratio: ipop.aspect_ratio,
// extension: ipop.video_ext,
// bitrate: ipop.vbr,
// },
// meta_dl: {
// formatid: ipop.format_id,
// formatnote: ipop.format_note,
// originalformat: ipop.format.replace(/[-\s]+/g, "_").replace(/_/g, "_"),
// mediaurl: ipop.url,
// },
// meta_info: {
// filesizebytes: ipop.filesize,
// framespersecond: ipop.fps,
// totalbitrate: ipop.tbr,
// qriginalextension: ipop.ext,
// dynamicrange: ipop.dynamic_range,
// extensionconatainer: ipop.container,
// },
// };
// if (
// reTube.meta_dl.formatnote &&
// reTube.meta_dl.formatnote.includes("medium") &&
// reTube.meta_video.resolution &&
// reTube.meta_video.resolution.includes("audio")
// ) {
// console.log(colors.green("@proxy:"), proxy);
// await proxyIP(reTube.meta_dl.mediaurl, proxy, port, "rproxy.mp3");
// return;
// }
// });
// }

// const proxys = [
// { ip: "38.154.227.167", port: 5868 },
// { ip: "185.199.229.156", port: 7492 },
// { ip: "185.199.228.220", port: 7300 },
// { ip: "185.199.231.45", port: 8382 },
// { ip: "188.74.210.207", port: 6286 },
// { ip: "188.74.183.10", port: 8279 },
// { ip: "188.74.210.21", port: 6100 },
// { ip: "45.155.68.129", port: 8133 },
// { ip: "154.95.36.199", port: 6893 },
// { ip: "45.94.47.66", port: 8110 },
// ];

// async function runWithRandomProxy() {
// const randomIndex = Math.floor(Math.random() * proxys.length);
// const randomProxy = proxys[randomIndex];
// try {
// await metaTube(randomProxy.ip, randomProxy.port);
// } catch (error) {
// console.error(
// "Error occurred with proxy:",
// randomProxy.ip,
// "on port:",
// randomProxy.port
// );
// console.error(error);
// }
// }

// runWithRandomProxy();
