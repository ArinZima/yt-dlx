// import os from "os";
// import colors from "colors";
// import spinnies from "spinnies";
// import SpinClient from "spinnies";
// import puppeteer from "puppeteer";
// import ffmpeg from "fluent-ffmpeg";

// async function proTube({ videoUrl }) {
// const spinner = new SpinClient();
// const vid = new URL(videoUrl).searchParams.get("v");
// spinner.add("proTube", { text: "browser spinning for " + vid });
// try {
// const browser = await puppeteer.launch({
// ignoreHTTPSErrors: true,
// headless: false,
// args: [
// "--no-zygote",
// "--incognito",
// "--no-sandbox",
// "--lang=en-US",
// "--enable-automation",
// "--disable-dev-shm-usage",
// "--ignore-certificate-errors",
// "--allow-running-insecure-content",
// ],
// });
// const ipage = await browser.newPage();
// await ipage.goto("https://checkip.amazonaws.com");
// const ipAddress = await ipage.evaluate(() => {
// return document.body.textContent.trim();
// });
// if (ipAddress) await ipage.close();
// const page = await browser.newPage();
// await page.setUserAgent(
// "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36"
// );
// await page.goto(videoUrl);
// await page.waitForSelector("script");
// const metaTube = await page.evaluate(() => {
// const playres = window.ytInitialPlayerResponse;
// if (playres && playres.streamingData) {
// const streamingData = playres.streamingData;
// const formats = streamingData.formats || [];
// const pops = formats.concat(streamingData.adaptiveFormats || []);
// return pops.map((p) => p);
// } else return undefined;
// });
// if (metaTube) {
// spinner.update("proTube", { text: "preparing payload for " + vid });
// const AudioStore = [];
// const VideoStore = [];
// for (const T of metaTube) {
// const {
// averageBitrate,
// projectionType,
// lastModified,
// indexRange,
// colorInfo,
// initRange,
// ...nTube
// } = T;
// switch (true) {
// case nTube.mimeType && nTube.mimeType.includes("audio"):
// const audioCodec = nTube.mimeType
// ? nTube.mimeType.split(";")[1]?.trim()
// : undefined;
// AudioStore.push({
// itag: nTube.itag,
// mediaLink: nTube.url,
// bitRate: nTube.bitrate,
// channels: nTube.audioChannels,
// duration: parseInt(nTube.approxDurationMs),
// contentLength: parseInt(nTube.contentLength),
// mimeType: nTube.mimeType.split(";")[0].trim(),
// audioSampleRate: parseInt(nTube.audioSampleRate),
// approxDurationMs: parseInt(nTube.approxDurationMs),
// codec: audioCodec.split("=")[1].replace(/"/g, "").trim(),
// quality: nTube.audioQuality
// .replace("AUDIO_QUALITY_", "")
// .toLowerCase(),
// });
// break;
// case nTube.mimeType &&
// !nTube.audioQuality &&
// nTube.mimeType.includes("video"):
// const videoCodec = nTube.mimeType
// ? nTube.mimeType.split(";")[1]?.trim()
// : undefined;
// VideoStore.push({
// fps: nTube.fps,
// itag: nTube.itag,
// width: nTube.width,
// mediaLink: nTube.url,
// height: nTube.height,
// bitRate: nTube.bitrate,
// resolution: nTube.qualityLabel,
// contentLength: parseInt(nTube.contentLength),
// mimeType: nTube.mimeType.split(";")[0].trim(),
// approxDurationMs: parseInt(nTube.approxDurationMs),
// codec: videoCodec.split("=")[1].replace(/"/g, "").trim(),
// });
// break;
// default:
// break;
// }
// }
// const payLoad = { AudioStore, VideoStore, ipAddress };
// spinner.succeed("proTube", { text: "payload sent for " + vid });
// if (page) await page.close();
// if (browser) await browser.close();
// return payLoad;
// } else return undefined;
// } catch (error) {
// spinner.fail("proTube", { text: error.message });
// return undefined;
// }
// }

// (async () => {
// const spin = new spinnies();
// const metaTube = await proTube({
// videoUrl: "https://www.youtube.com/watch?v=AbFnsaDQMYQ",
// });
// if (metaTube) {
// spin.add("ffmepeg", {
// text: colors.green("@ffmepeg: ") + "starting...",
// });
// const numCores = os.cpus().length;
// const numThreads = numCores * 2;
// const fluent = ffmpeg();
// fluent.input(metaTube.VideoStore[0].mediaLink);
// fluent.input(metaTube.AudioStore[0].mediaLink);
// fluent.videoCodec("copy");
// fluent.audioCodec("copy");
// fluent.audioChannels(metaTube.AudioStore[0].channels);
// fluent.addOption("-preset", "ultrafast");
// fluent.addOption("-threads", numThreads);
// fluent.addOption("-movflags", "faststart");
// fluent.on("progress", (prog) => {
// spin.add("ffmepeg", {
// text: colors.green("@ffmepeg: ") + prog.percent.toFixed(2) + "%",
// });
// });
// fluent.on("end", () => {
// spin.succeed("ffmepeg", {
// text: colors.green("@ffmepeg: ") + "ended...",
// });
// });
// fluent.on("start", (cmd) => console.log(cmd));
// fluent.output(`${metaTube.ipAddress}.mkv`);
// fluent.run();
// } else process.exit(1);
// })();
// =============================================================================
// const manifestUrl =
// "https://manifest.googlevideo.com/api/manifest/hls_playlist/expire/1710249315/ei/AwHwZYDlGrXC4t4PuaCbwAg/ip/2409:40e1:10bf:5f32:2ee6:ee28:8f7:3341/id/01b167b1a0d03184/itag/625/source/youtube/requiressl/yes/ratebypass/yes/pfa/1/wft/1/sgovp/clen%3D361102357%3Bdur%3D298.500%3Bgir%3Dyes%3Bitag%3D313%3Blmt%3D1709442848228962/rqh/1/hls_chunk_host/rr5---sn-gwpa-niaz.googlevideo.com/xpc/EgVo2aDSNQ%3D%3D/mh/my/mm/31,29/mn/sn-gwpa-niaz,sn-qxaelnez/ms/au,rdu/mv/m/mvi/5/pcm2cms/yes/pl/48/force_finished/1/pcm2/yes/initcwndbps/477500/vprv/1/playlist_type/DVR/dover/13/txp/5532434/mt/1710227372/fvip/1/short_key/1/keepalive/yes/fexp/24007246/sparams/expire,ei,ip,id,itag,source,requiressl,ratebypass,pfa,wft,sgovp,rqh,xpc,force_finished,pcm2,vprv,playlist_type/sig/AJfQdSswRQIgYB5Qt5gxnERCJtAszT6bSkyp2Mk80MCGKJEB6IHvDH0CIQDI8oSZQ3nNy5HtofS-L3E1eizqd69pJxToNMzZP1qfLg%3D%3D/lsparams/hls_chunk_host,mh,mm,mn,ms,mv,mvi,pcm2cms,pl,initcwndbps/lsig/APTiJQcwRQIhAKEenqH6l4Q6fR88dCOo7xeT1EI-cOcfy-T-qrJ57hhnAiAjaraZoPtcQC7PRvoqnzOJ5EkNHuBA2kJbAdGMqCEFHw%3D%3D/playlist/index.m3u8";
// import ffmpeg from "fluent-ffmpeg";
// ffmpeg()
// .input(manifestUrl)
// .inputOptions(["-protocol_whitelist file,http,https,tcp,tls"])
// .videoCodec("copy")
// .output("output.mp4")
// .outputOptions(["-c copy"])
// .on("start", (start) => {
// console.log("@ffmpeg:", start);
// })
// .on("progress", (prog) => {
// console.log("@ffmpeg:", prog);
// })
// .on("end", () => {
// console.log("File has been successfully merged.");
// })
// .on("error", (err) => {
// console.error("Error occurred: ", err.message);
// })
// .run();
// =============================================================================
import * as fs from "fs";
import * as path from "path";
import { promisify } from "util";
import { exec } from "child_process";

(async () => {
  const jsonFilePath = path.join(process.cwd(), "metaTube.json");
  let metaTube;
  if (fs.existsSync(jsonFilePath)) {
    const jsonData = fs.readFileSync(jsonFilePath, "utf8");
    metaTube = JSON.parse(jsonData);
  } else {
    let maxT = 8;
    let pLoc = "";
    let dirC = process.cwd();
    while (maxT > 0) {
      const enginePath = path.join(dirC, "util", "engine");
      if (fs.existsSync(enginePath)) {
        pLoc = enginePath;
        break;
      } else {
        dirC = path.join(dirC, "..");
        maxT--;
      }
    }
    pLoc += ` --proxy socks5://127.0.0.1:9050`;
    pLoc += ` --dump-single-json "https://www.youtube.com/watch?v=AbFnsaDQMYQ"`;
    pLoc += ` --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass`;
    pLoc += ` --user-agent "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"`;
    const metaCore = await promisify(exec)(pLoc);
    metaTube = JSON.parse(metaCore.stdout.toString());
    fs.writeFileSync(jsonFilePath, JSON.stringify(metaTube, null, 2));
  }
  await metaTube.formats.forEach((io) => {
    console.info(io);
  });
})();
