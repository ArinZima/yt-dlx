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
  "http://38.62.222.219:3128",
  "http://154.6.97.227:3128",
  "http://154.6.97.129:3128",
  "http://154.6.99.45:3128",
  "http://38.62.220.3:3128",
  "http://154.6.96.253:3128",
  "http://38.62.222.236:3128",
  "http://38.62.221.46:3128",
  "http://154.6.97.24:3128",
  "http://38.62.222.102:3128",
  "http://154.6.97.130:3128",
  "http://154.6.96.148:3128",
  "http://38.62.221.70:3128",
  "http://38.62.220.225:3128",
  "http://154.6.99.166:3128",
  "http://38.62.221.105:3128",
  "http://154.6.96.102:3128",
  "http://154.6.99.255:3128",
  "http://154.6.97.235:3128",
  "http://38.62.222.180:3128",
  "http://38.62.221.173:3128",
  "http://38.62.221.240:3128",
  "http://38.62.220.123:3128",
  "http://38.62.223.208:3128",
  "http://38.62.222.52:3128",
  "http://38.62.221.58:3128",
  "http://38.62.223.233:3128",
  "http://38.62.220.67:3128",
  "http://154.6.98.95:3128",
  "http://38.62.223.113:3128",
  "http://154.6.98.172:3128",
  "http://154.6.97.170:3128",
  "http://38.62.220.21:3128",
  "http://154.6.97.177:3128",
  "http://154.6.96.214:3128",
  "http://38.62.220.81:3128",
  "http://38.62.220.218:3128",
  "http://38.62.221.237:3128",
  "http://38.62.222.172:3128",
  "http://154.6.98.60:3128",
  "http://154.6.97.43:3128",
  "http://38.62.220.51:3128",
  "http://38.62.223.72:3128",
  "http://154.6.98.151:3128",
  "http://38.62.223.133:3128",
  "http://154.6.99.141:3128",
  "http://38.62.220.244:3128",
  "http://38.62.220.222:3128",
  "http://154.6.99.24:3128",
  "http://154.6.98.45:3128",
  "http://38.62.221.226:3128",
  "http://154.6.99.42:3128",
  "http://154.6.97.184:3128",
  "http://154.6.96.228:3128",
  "http://154.6.97.107:3128",
  "http://38.62.223.74:3128",
  "http://38.62.222.63:3128",
  "http://38.62.222.33:3128",
  "http://154.6.96.75:3128",
  "http://38.62.221.28:3128",
  "http://154.6.99.95:3128",
  "http://154.6.97.152:3128",
  "http://38.62.223.185:3128",
  "http://38.62.223.102:3128",
  "http://154.6.99.214:3128",
  "http://38.62.223.119:3128",
  "http://38.62.220.240:3128",
  "http://38.62.222.238:3128",
  "http://38.62.222.36:3128",
  "http://38.62.223.215:3128",
  "http://154.6.97.39:3128",
  "http://154.6.98.66:3128",
  "http://154.6.96.183:3128",
  "http://154.6.99.169:3128",
  "http://38.62.220.22:3128",
  "http://154.6.97.178:3128",
  "http://154.6.97.48:3128",
  "http://154.6.98.185:3128",
  "http://38.62.220.87:3128",
  "http://154.6.98.253:3128",
  "http://38.62.222.43:3128",
  "http://38.62.221.76:3128",
  "http://38.62.223.57:3128",
  "http://154.6.99.53:3128",
  "http://38.62.222.154:3128",
  "http://38.62.223.159:3128",
  "http://38.62.223.43:3128",
  "http://38.62.221.248:3128",
  "http://154.6.98.67:3128",
  "http://154.6.96.83:3128",
  "http://154.6.96.22:3128",
  "http://154.6.99.75:3128",
  "http://38.62.223.187:3128",
  "http://38.62.221.113:3128",
  "http://154.6.98.191:3128",
  "http://154.6.97.100:3128",
  "http://154.6.98.146:3128",
  "http://38.62.220.5:3128",
  "http://38.62.220.226:3128",
  "http://154.6.96.26:3128",
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
    if (proc.stderr) bail(new Error(proc.stderr.toString()));
    else return proc.stdout;
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
      await proxyIP(reTube.meta_audio, proxy, port, "title.mp3");
      process.exit(0);
    }
  });
}

const rproxy = proxys[Math.floor(Math.random() * proxys.length)];
console.log(colors.green("@proxy:"), rproxy);
const parts = rproxy.split(":");
const proxyAddress = parts[0];
const proxyPort = parts[1];
metaTube(proxyAddress + proxyPort, proxyPort);
