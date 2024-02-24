import fs from "fs";
import async from "async";
import colors from "colors";
import tunnel from "tunnel";
import request from "request";
import retry from "async-retry";
import { promisify } from "util";
import { exec } from "child_process";

async function proxyIP(url, proxyHost, proxyPort, fileName) {
  const agent = tunnel.httpsOverHttp({
    proxy: {
      host: proxyHost,
      port: proxyPort,
    },
  });
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(fileName);
    const req = request({
      url,
      agent,
      method: "GET",
    });
    req.on("response", () => {
      console.log("Download started...");
    });
    req.on("data", (chunk) => {
      writeStream.write(chunk);
    });
    req.on("end", () => {
      writeStream.end();
      console.log("Download completed.");
      resolve();
    });
    req.on("error", (error) => {
      console.error("Download error:", error);
      writeStream.close();
      reject(error);
    });
  });
}

const proxys = [
  "http://154.6.99.45:3128",
  "http://38.62.220.3:3128",
  "http://154.6.97.24:3128",
  "http://154.6.96.253:3128",
  "http://154.6.97.129:3128",
  "http://38.62.221.46:3128",
  "http://154.6.97.227:3128",
  "http://38.62.222.219:3128",
  "http://38.62.222.236:3128",
  "http://38.62.222.102:3128",
];

const reops = {
  factor: 2,
  retries: 4,
  minTimeout: 1000,
  maxTimeout: 4000,
};

async function metaTube(proxy, port) {
  let proLoc =
    "python -m yt_dlp" +
    ` --proxy '${proxy}'` +
    " --dump-single-json --no-check-certificate --prefer-insecure --no-call-home --skip-download --no-warnings --geo-bypass" +
    " --user-agent 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36'" +
    " 'https://www.youtube.com/watch?v=wWR0VD6qgt8'";
  console.log(colors.green("@cmd:"), proLoc);
  const result = await retry(async (bail) => {
    const proc = await promisify(exec)(proLoc);
    if (proc.stderr) {
      console.error(colors.red("@error:"), proc.stderr.toString());
      bail(new Error(proc.stderr.toString()));
    }
    return proc.stdout;
  }, reops);
  const metaTube = JSON.parse(result.toString());
  await async.forEach(metaTube.formats, async (ipop) => {
    const rmval = new Set(["storyboard", "Default"]);
    if (rmval.has(ipop.format_note) || ipop.filesize === null) return;
    const reTube = {
      meta_audio: {
        samplerate: ipop.asr,
        channels: ipop.audio_channels,
        codec: ipop.acodec,
        extension: ipop.audio_ext,
        bitrate: ipop.abr,
      },
      meta_video: {
        height: ipop.height,
        width: ipop.width,
        codec: ipop.vcodec,
        resolution: ipop.resolution,
        aspectratio: ipop.aspect_ratio,
        extension: ipop.video_ext,
        bitrate: ipop.vbr,
      },
      meta_dl: {
        formatid: ipop.format_id,
        formatnote: ipop.format_note,
        originalformat: ipop.format.replace(/[-\s]+/g, "_").replace(/_/g, "_"),
        mediaurl: ipop.url,
      },
      meta_info: {
        filesizebytes: ipop.filesize,
        framespersecond: ipop.fps,
        totalbitrate: ipop.tbr,
        qriginalextension: ipop.ext,
        dynamicrange: ipop.dynamic_range,
        extensionconatainer: ipop.container,
      },
    };
    if (
      reTube.meta_dl.formatnote &&
      (reTube.meta_dl.formatnote.includes("ultralow") ||
        reTube.meta_dl.formatnote.includes("medium") ||
        reTube.meta_dl.formatnote.includes("high") ||
        reTube.meta_dl.formatnote.includes("low")) &&
      reTube.meta_video.resolution &&
      reTube.meta_video.resolution.includes("audio")
    ) {
      console.log(reTube.meta_audio);
      console.log(colors.green("@proxy:"), proxy);
      console.log(colors.green("@file:"), metaTube.title + ".mp3");
      await proxyIP(reTube.meta_audio, proxy, port, metaTube.title + ".mp3");
      process.exit(0);
    }
  });
}

const rproxy = proxys[Math.floor(Math.random() * proxys.length)];
console.log(colors.green("@proxy:"), rproxy);
metaTube(rproxy, 3128);
