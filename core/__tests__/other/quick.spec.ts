console.clear();
console.clear();
import * as fs from "fs";
import colors from "colors";
import * as path from "path";
import { promisify } from "util";
import ffmpeg from "fluent-ffmpeg";
import { exec } from "child_process";

function sizeFormat(filesize: number) {
  if (isNaN(filesize) || filesize < 0) return filesize;
  const bytesPerMegabyte = 1024 * 1024;
  const bytesPerGigabyte = bytesPerMegabyte * 1024;
  const bytesPerTerabyte = bytesPerGigabyte * 1024;
  if (filesize < bytesPerMegabyte) return filesize + " B";
  else if (filesize < bytesPerGigabyte) {
    return (filesize / bytesPerMegabyte).toFixed(2) + " MB";
  } else if (filesize < bytesPerTerabyte) {
    return (filesize / bytesPerGigabyte).toFixed(2) + " GB";
  } else return (filesize / bytesPerTerabyte).toFixed(2) + " TB";
}

async function Engine() {
  const highAudio: any = {};
  const highVideo: any = {};
  const highHLS: any = {};
  let payLoad: any = {
    manifest: [],
    audio: [],
    video: [],
  };
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
  const metaTube = JSON.parse(metaCore.stdout.toString());
  await metaTube.formats.forEach((op: any) => {
    const rm = new Set(["storyboard", "Default"]);
    if (!rm.has(op.format_note) && op.protocol === "m3u8_native" && op.vbr) {
      if (!highHLS[op.resolution] || op.vbr > highHLS[op.resolution].vbr)
        highHLS[op.resolution] = op;
    }
    if (rm.has(op.format_note) || op.filesize === undefined || null) return;
    const prevVideo = highVideo[op.format_note];
    const prevAudio = highAudio[op.format_note];
    switch (true) {
      case op.format_note.includes("p"):
        if (!prevVideo || op.filesize > prevVideo.filesize)
          highVideo[op.format_note] = op;
        break;
      default:
        if (!prevAudio || op.filesize > prevAudio.filesize)
          highAudio[op.format_note] = op;
        break;
    }
  });
  if (highAudio) {
    Object.values(highAudio).forEach((op) => {
      payLoad.audio.push(op);
    });
  }
  if (highVideo) {
    Object.values(highVideo).forEach((op) => {
      payLoad.video.push(op);
    });
  }
  if (highHLS) {
    Object.entries(highHLS).forEach(([_resolution, op]) => {
      payLoad.manifest.push(op);
    });
  }
  if (payLoad) return payLoad;
  else return null;
}

(async () => {
  const op: any = await Engine();
  if (op.audio.length > 0) {
    op.audio.forEach((audio: any) => {
      console.log(colors.magenta("@audio:"), {
        filesize: sizeFormat(audio.filesize),
        format_note: audio.format_note,
      });
    });
  }
  console.log();
  if (op.video.length > 0) {
    op.video.forEach((video: any) => {
      console.log(colors.blue("@video:"), {
        filesize: sizeFormat(video.filesize),
        format_note: video.format_note,
      });
    });
  }
  console.log();
  if (op.manifest.length > 0) {
    op.manifest.forEach((manifest: any) => {
      console.log(colors.red("@manifest:"), {
        resolution: manifest.resolution,
        vbr: manifest.vbr,
      });
    });
  }

  const ff = ffmpeg();
  ff.input(op.manifest[0].manifest_url);
  ff.inputOptions(["-protocol_whitelist file,http,https,tcp,tls"]);
  ff.output("output.mp4");
  ff.videoCodec("copy");
  ff.on("start", (start) => console.log(start));
  ff.on("progress", (prog) => console.log(prog));
  ff.on("error", (error) => console.error(error.message));
  ff.run();
})();
